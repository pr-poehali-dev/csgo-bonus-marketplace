"""
Управление алертами цен на скины CS2.
GET /list?session_token=... — список алертов пользователя
POST /create — создать алерт {session_token, skin_name, skin_weapon, target_price, current_price}
DELETE /delete?id=...&session_token=... — удалить алерт
PUT /toggle?id=...&session_token=... — вкл/выкл алерт
"""
import json
import os
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "public")


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def cors():
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Session-Token",
    }


def resp(data, status=200):
    return {
        "statusCode": status,
        "headers": {**cors(), "Content-Type": "application/json"},
        "body": json.dumps(data, ensure_ascii=False, default=str),
    }


def get_steam_id(token: str, conn) -> str | None:
    with conn.cursor() as cur:
        cur.execute(
            f"SELECT steam_id FROM {SCHEMA}.users WHERE session_token = %s",
            (token,),
        )
        row = cur.fetchone()
    return row[0] if row else None


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors(), "body": ""}

    path = event.get("path", "/").rstrip("/") or "/"
    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}

    token = params.get("session_token") or event.get("headers", {}).get("x-session-token", "")

    # GET /list
    if path.endswith("/list"):
        if not token:
            return resp({"error": "Требуется авторизация"}, 401)
        conn = get_db()
        try:
            steam_id = get_steam_id(token, conn)
            if not steam_id:
                return resp({"error": "Сессия не найдена"}, 401)
            with conn.cursor() as cur:
                cur.execute(
                    f"""SELECT id, skin_name, skin_weapon, target_price, current_price,
                               is_active, is_triggered, created_at, triggered_at
                        FROM {SCHEMA}.price_alerts
                        WHERE user_steam_id = %s
                        ORDER BY created_at DESC""",
                    (steam_id,),
                )
                rows = cur.fetchall()
            alerts = [
                {
                    "id": r[0], "skin_name": r[1], "skin_weapon": r[2],
                    "target_price": float(r[3]), "current_price": float(r[4]) if r[4] else None,
                    "is_active": r[5], "is_triggered": r[6],
                    "created_at": str(r[7]), "triggered_at": str(r[8]) if r[8] else None,
                }
                for r in rows
            ]
        finally:
            conn.close()
        return resp({"alerts": alerts})

    # POST /create
    if path.endswith("/create") and method == "POST":
        body = {}
        try:
            body = json.loads(event.get("body") or "{}")
        except Exception:
            pass

        t = body.get("session_token") or token
        skin_name = body.get("skin_name", "").strip()
        skin_weapon = body.get("skin_weapon", "").strip()
        target_price = body.get("target_price")
        current_price = body.get("current_price")

        if not t:
            return resp({"error": "Требуется авторизация"}, 401)
        if not skin_name or target_price is None:
            return resp({"error": "Укажи название скина и целевую цену"}, 400)
        try:
            target_price = float(target_price)
            if target_price <= 0:
                raise ValueError
        except (ValueError, TypeError):
            return resp({"error": "Цена должна быть числом > 0"}, 400)

        conn = get_db()
        try:
            steam_id = get_steam_id(t, conn)
            if not steam_id:
                return resp({"error": "Сессия не найдена"}, 401)

            # Проверяем лимит — не более 20 алертов
            with conn.cursor() as cur:
                cur.execute(
                    f"SELECT COUNT(*) FROM {SCHEMA}.price_alerts WHERE user_steam_id = %s AND is_active = TRUE",
                    (steam_id,),
                )
                count = cur.fetchone()[0]
            if count >= 20:
                return resp({"error": "Максимум 20 активных алертов"}, 400)

            with conn.cursor() as cur:
                cur.execute(
                    f"""INSERT INTO {SCHEMA}.price_alerts
                        (user_steam_id, skin_name, skin_weapon, target_price, current_price)
                        VALUES (%s, %s, %s, %s, %s)
                        RETURNING id""",
                    (steam_id, skin_name, skin_weapon, target_price, current_price),
                )
                new_id = cur.fetchone()[0]
            conn.commit()
        finally:
            conn.close()

        return resp({"ok": True, "id": new_id})

    # DELETE /delete
    if path.endswith("/delete") and method == "DELETE":
        alert_id = params.get("id")
        if not token or not alert_id:
            return resp({"error": "Передай id и session_token"}, 400)
        conn = get_db()
        try:
            steam_id = get_steam_id(token, conn)
            if not steam_id:
                return resp({"error": "Сессия не найдена"}, 401)
            with conn.cursor() as cur:
                cur.execute(
                    f"DELETE FROM {SCHEMA}.price_alerts WHERE id = %s AND user_steam_id = %s",
                    (alert_id, steam_id),
                )
            conn.commit()
        finally:
            conn.close()
        return resp({"ok": True})

    # PUT /toggle
    if path.endswith("/toggle") and method == "PUT":
        alert_id = params.get("id")
        if not token or not alert_id:
            return resp({"error": "Передай id и session_token"}, 400)
        conn = get_db()
        try:
            steam_id = get_steam_id(token, conn)
            if not steam_id:
                return resp({"error": "Сессия не найдена"}, 401)
            with conn.cursor() as cur:
                cur.execute(
                    f"""UPDATE {SCHEMA}.price_alerts
                        SET is_active = NOT is_active
                        WHERE id = %s AND user_steam_id = %s
                        RETURNING is_active""",
                    (alert_id, steam_id),
                )
                row = cur.fetchone()
            conn.commit()
        finally:
            conn.close()
        if not row:
            return resp({"error": "Алерт не найден"}, 404)
        return resp({"ok": True, "is_active": row[0]})

    return resp({"error": "Маршрут не найден"}, 404)
