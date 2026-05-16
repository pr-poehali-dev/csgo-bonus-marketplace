"""
Steam OpenID авторизация.
GET /login — редирект на страницу входа Steam
GET /callback — обработка ответа от Steam, создание сессии
GET /me — получение данных текущего пользователя по токену
POST /logout — выход из аккаунта
"""
import json
import os
import secrets
import urllib.parse
import urllib.request
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "public")
STEAM_OPENID_URL = "https://steamcommunity.com/openid/login"
STEAM_API_KEY = os.environ.get("STEAM_API_KEY", "")


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def cors_headers():
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Session-Token",
    }


def json_response(data, status=200):
    return {
        "statusCode": status,
        "headers": {**cors_headers(), "Content-Type": "application/json"},
        "body": json.dumps(data, ensure_ascii=False),
    }


def get_site_url(event):
    host = event.get("headers", {}).get("host", "localhost")
    proto = "https" if "poehali" in host else "http"
    return f"{proto}://{host}"


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers(), "body": ""}

    path = event.get("path", "/").rstrip("/") or "/"
    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}

    # GET /login — строим URL редиректа на Steam
    if path.endswith("/login"):
        site_url = get_site_url(event)
        callback_url = f"{site_url}/api/steam-auth/callback"
        openid_params = {
            "openid.ns": "http://specs.openid.net/auth/2.0",
            "openid.mode": "checkid_setup",
            "openid.return_to": callback_url,
            "openid.realm": site_url,
            "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
            "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
        }
        steam_url = STEAM_OPENID_URL + "?" + urllib.parse.urlencode(openid_params)
        return {
            "statusCode": 302,
            "headers": {**cors_headers(), "Location": steam_url},
            "body": "",
        }

    # GET /callback — верификация OpenID и создание сессии
    if path.endswith("/callback"):
        if params.get("openid.mode") != "id_res":
            return json_response({"error": "Авторизация отменена"}, 400)

        # Верифицируем у Steam
        verify_params = dict(params)
        verify_params["openid.mode"] = "check_authentication"
        verify_data = urllib.parse.urlencode(verify_params).encode()
        req = urllib.request.Request(
            STEAM_OPENID_URL,
            data=verify_data,
            method="POST",
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        with urllib.request.urlopen(req) as resp:
            verify_text = resp.read().decode()

        if "is_valid:true" not in verify_text:
            return json_response({"error": "Верификация Steam не прошла"}, 401)

        # Извлекаем Steam ID из claimed_id
        claimed_id = params.get("openid.claimed_id", "")
        steam_id = claimed_id.split("/")[-1]
        if not steam_id.isdigit():
            return json_response({"error": "Не удалось получить Steam ID"}, 400)

        # Получаем профиль через Steam API
        username, avatar, profile_url = steam_id, "", ""
        if STEAM_API_KEY:
            api_url = (
                f"https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/"
                f"?key={STEAM_API_KEY}&steamids={steam_id}"
            )
            try:
                with urllib.request.urlopen(api_url) as resp:
                    data = json.loads(resp.read().decode())
                players = data.get("response", {}).get("players", [])
                if players:
                    p = players[0]
                    username = p.get("personaname", steam_id)
                    avatar = p.get("avatarfull", "")
                    profile_url = p.get("profileurl", "")
            except Exception:
                pass

        # Создаём/обновляем пользователя в БД и генерируем токен сессии
        session_token = secrets.token_hex(32)
        conn = get_db()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    f"""
                    INSERT INTO {SCHEMA}.users (steam_id, username, avatar, profile_url, session_token, updated_at)
                    VALUES (%s, %s, %s, %s, %s, NOW())
                    ON CONFLICT (steam_id) DO UPDATE
                    SET username=EXCLUDED.username, avatar=EXCLUDED.avatar,
                        profile_url=EXCLUDED.profile_url, session_token=EXCLUDED.session_token,
                        updated_at=NOW()
                    """,
                    (steam_id, username, avatar, profile_url, session_token),
                )
            conn.commit()
        finally:
            conn.close()

        # Редирект на фронт с токеном в query
        site_url = get_site_url(event)
        redirect_url = f"{site_url}/?session_token={session_token}"
        return {
            "statusCode": 302,
            "headers": {**cors_headers(), "Location": redirect_url},
            "body": "",
        }

    # GET /me — данные текущего пользователя
    if path.endswith("/me"):
        token = (
            params.get("session_token")
            or event.get("headers", {}).get("x-session-token")
        )
        if not token:
            return json_response({"error": "Токен не передан"}, 401)

        conn = get_db()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    f"SELECT steam_id, username, avatar, profile_url, created_at FROM {SCHEMA}.users WHERE session_token = %s",
                    (token,),
                )
                row = cur.fetchone()
        finally:
            conn.close()

        if not row:
            return json_response({"error": "Сессия не найдена"}, 401)

        return json_response({
            "steam_id": row[0],
            "username": row[1],
            "avatar": row[2],
            "profile_url": row[3],
            "created_at": str(row[4]),
        })

    # POST /logout
    if path.endswith("/logout") and method == "POST":
        token = (
            params.get("session_token")
            or event.get("headers", {}).get("x-session-token")
        )
        if token:
            conn = get_db()
            try:
                with conn.cursor() as cur:
                    cur.execute(
                        f"UPDATE {SCHEMA}.users SET session_token = NULL WHERE session_token = %s",
                        (token,),
                    )
                conn.commit()
            finally:
                conn.close()

        return json_response({"ok": True})

    return json_response({"error": "Маршрут не найден"}, 404)
