"""
База данных скинов CS2 — кэш из Steam Market.
GET /list?weapon=AK-47&rarity=covert&min_price=0&max_price=100&search=asiimov&limit=50&offset=0
GET /popular?limit=12
GET /stats — статистика по БД
POST /import — импорт пачки скинов из Steam Market (админский эндпоинт)
"""
import json
import os
import urllib.request
import urllib.parse
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "public")
CS2_APP_ID = 730


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def cors():
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }


def resp(data, status=200):
    return {
        "statusCode": status,
        "headers": {**cors(), "Content-Type": "application/json"},
        "body": json.dumps(data, ensure_ascii=False, default=str),
    }


def steam_image(icon_url: str) -> str:
    if not icon_url:
        return ""
    return f"https://community.cloudflare.steamstatic.com/economy/image/{icon_url}/360fx360f"


def parse_price(text: str) -> float:
    if not text:
        return 0.0
    cleaned = text.replace("$", "").replace(",", "").replace(" ", "").strip()
    try:
        return float(cleaned)
    except (ValueError, TypeError):
        return 0.0


def rarity_from_tags(tags: list) -> str:
    mapping = {
        "Covert": "covert",
        "Contraband": "covert",
        "Classified": "classified",
        "Restricted": "restricted",
        "Mil-Spec": "milspec",
        "Industrial": "milspec",
        "Consumer": "milspec",
    }
    for tag in tags:
        if tag.get("category") == "Rarity":
            name = tag.get("localized_tag_name", tag.get("internal_name", ""))
            for k, v in mapping.items():
                if k.lower() in name.lower():
                    return v
    return "milspec"


def wear_from_tags(tags: list) -> str:
    for tag in tags:
        if tag.get("category") == "Exterior":
            return tag.get("localized_tag_name", "")
    return ""


def weapon_from_name(hash_name: str) -> str:
    if " | " in hash_name:
        return hash_name.split(" | ")[0].strip()
    return hash_name


def skin_name_from_hash(hash_name: str) -> str:
    if " | " in hash_name:
        skin = hash_name.split(" | ", 1)[1]
        if " (" in skin:
            skin = skin[:skin.rfind(" (")]
        return skin.strip()
    return hash_name


def fetch_steam_search(query: str, start: int, count: int) -> list:
    """Запрос к Steam Market search render API"""
    params = urllib.parse.urlencode({
        "appid": CS2_APP_ID,
        "query": query,
        "search_descriptions": 0,
        "start": start,
        "count": count,
        "norender": 1,
        "currency": 1,
    })
    url = f"https://steamcommunity.com/market/search/render/?{params}"
    req = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 (compatible; SkinVault/1.0)",
        "Accept": "application/json",
    })
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            data = json.loads(r.read().decode("utf-8"))
    except BaseException:
        return []

    if not data.get("success"):
        return []

    items = []
    for item in data.get("results", []):
        asset = item.get("asset_description", {})
        tags = asset.get("tags", [])
        hash_name = item.get("hash_name", "")
        price = item.get("sell_price", 0) / 100.0 if item.get("sell_price") else parse_price(item.get("sell_price_text", ""))

        items.append({
            "hash_name": hash_name,
            "name": skin_name_from_hash(hash_name),
            "weapon": weapon_from_name(hash_name),
            "wear": wear_from_tags(tags),
            "rarity": rarity_from_tags(tags),
            "image": steam_image(asset.get("icon_url", "")),
            "price": price,
            "price_text": item.get("sell_price_text", ""),
            "volume": item.get("sell_listings", 0),
        })
    return items


def upsert_skins(skins: list, mark_popular: bool = False) -> int:
    """Сохраняем пачку скинов в БД"""
    if not skins:
        return 0
    conn = get_db()
    saved = 0
    try:
        with conn.cursor() as cur:
            for s in skins:
                if not s["hash_name"]:
                    continue
                cur.execute(
                    f"""
                    INSERT INTO {SCHEMA}.skins_cache
                    (hash_name, name, weapon, wear, rarity, image, price, price_text, volume, is_popular, updated_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
                    ON CONFLICT (hash_name) DO UPDATE SET
                        price = EXCLUDED.price,
                        price_text = EXCLUDED.price_text,
                        volume = EXCLUDED.volume,
                        image = EXCLUDED.image,
                        is_popular = {SCHEMA}.skins_cache.is_popular OR EXCLUDED.is_popular,
                        updated_at = NOW()
                    """,
                    (s["hash_name"], s["name"], s["weapon"], s["wear"], s["rarity"],
                     s["image"], s["price"], s["price_text"], s["volume"], mark_popular),
                )
                saved += 1
        conn.commit()
    finally:
        conn.close()
    return saved


# Запросы для импорта — топ-категории CS2
IMPORT_QUERIES = [
    ("AK-47", True), ("AWP", True), ("M4A4", True), ("M4A1-S", True),
    ("Karambit", True), ("Butterfly Knife", True), ("Bayonet", True), ("Huntsman Knife", True),
    ("Desert Eagle", False), ("USP-S", False), ("Glock-18", False),
    ("P250", False), ("Tec-9", False), ("Five-SeveN", False),
    ("MP9", False), ("UMP-45", False), ("MAC-10", False),
    ("FAMAS", False), ("Galil AR", False), ("SG 553", False),
    ("Sticker", False), ("Gloves", True),
]


def handler(event: dict, context) -> dict:
    """Управление кэшем базы скинов CS2 в нашей БД."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors(), "body": ""}

    path = event.get("path", "/").rstrip("/") or "/"
    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}

    # GET /stats
    if path.endswith("/stats"):
        conn = get_db()
        try:
            with conn.cursor() as cur:
                cur.execute(f"SELECT COUNT(*), COUNT(DISTINCT weapon), MAX(updated_at) FROM {SCHEMA}.skins_cache")
                row = cur.fetchone()
                cur.execute(f"SELECT weapon, COUNT(*) FROM {SCHEMA}.skins_cache GROUP BY weapon ORDER BY COUNT(*) DESC LIMIT 15")
                weapons = [{"weapon": r[0], "count": r[1]} for r in cur.fetchall()]
        finally:
            conn.close()
        return resp({
            "total": row[0],
            "weapons_count": row[1],
            "last_update": str(row[2]) if row[2] else None,
            "top_weapons": weapons,
        })

    # GET /popular
    if path.endswith("/popular"):
        limit = min(int(params.get("limit", 12)), 50)
        conn = get_db()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    f"""SELECT hash_name, name, weapon, wear, rarity, image, price, price_text, volume
                        FROM {SCHEMA}.skins_cache
                        WHERE is_popular = TRUE AND price > 0
                        ORDER BY volume DESC NULLS LAST, price DESC
                        LIMIT %s""",
                    (limit,),
                )
                rows = cur.fetchall()
        finally:
            conn.close()
        skins = [
            {"hash_name": r[0], "name": r[1], "weapon": r[2], "wear": r[3],
             "rarity": r[4], "image": r[5], "price": float(r[6]) if r[6] else 0.0,
             "price_text": r[7], "volume": r[8] or 0, "marketable": True}
            for r in rows
        ]
        return resp({"skins": skins, "count": len(skins)})

    # GET /list
    if path.endswith("/list"):
        weapon = params.get("weapon", "").strip()
        rarity = params.get("rarity", "").strip()
        wear = params.get("wear", "").strip()
        search = params.get("search", "").strip()
        min_price = params.get("min_price")
        max_price = params.get("max_price")
        sort = params.get("sort", "popular")
        limit = min(int(params.get("limit", 50)), 100)
        offset = int(params.get("offset", 0))

        clauses = ["price > 0"]
        args = []

        if weapon and weapon.lower() != "все":
            clauses.append("LOWER(weapon) = LOWER(%s)")
            args.append(weapon)
        if rarity and rarity.lower() != "все":
            clauses.append("rarity = %s")
            args.append(rarity)
        if wear and wear.lower() != "все":
            clauses.append("wear = %s")
            args.append(wear)
        if search:
            clauses.append("LOWER(hash_name) LIKE LOWER(%s)")
            args.append(f"%{search}%")
        if min_price:
            try:
                clauses.append("price >= %s")
                args.append(float(min_price))
            except ValueError:
                pass
        if max_price:
            try:
                clauses.append("price <= %s")
                args.append(float(max_price))
            except ValueError:
                pass

        where = " AND ".join(clauses)
        order_map = {
            "price_asc": "price ASC",
            "price_desc": "price DESC",
            "volume": "volume DESC NULLS LAST",
            "popular": "is_popular DESC, volume DESC NULLS LAST",
            "new": "created_at DESC",
        }
        order_by = order_map.get(sort, "is_popular DESC, volume DESC NULLS LAST")

        conn = get_db()
        try:
            with conn.cursor() as cur:
                cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.skins_cache WHERE {where}", args)
                total = cur.fetchone()[0]
                cur.execute(
                    f"""SELECT hash_name, name, weapon, wear, rarity, image, price, price_text, volume
                        FROM {SCHEMA}.skins_cache
                        WHERE {where}
                        ORDER BY {order_by}
                        LIMIT %s OFFSET %s""",
                    args + [limit, offset],
                )
                rows = cur.fetchall()
        finally:
            conn.close()

        skins = [
            {"hash_name": r[0], "name": r[1], "weapon": r[2], "wear": r[3],
             "rarity": r[4], "image": r[5], "price": float(r[6]) if r[6] else 0.0,
             "price_text": r[7], "volume": r[8] or 0, "marketable": True}
            for r in rows
        ]
        return resp({"skins": skins, "total": total, "count": len(skins), "offset": offset})

    # POST — массовый импорт из Steam
    if method == "POST":
        body = {}
        try:
            body = json.loads(event.get("body") or "{}")
        except BaseException:
            pass

        queries = body.get("queries") or IMPORT_QUERIES
        # Допускаем строку или кортежи
        normalized = []
        for q in queries:
            if isinstance(q, str):
                normalized.append((q, False))
            elif isinstance(q, (list, tuple)) and len(q) >= 1:
                normalized.append((q[0], bool(q[1]) if len(q) > 1 else False))

        per_query = min(int(body.get("per_query", 30)), 100)
        total_saved = 0
        errors = []

        for query, is_popular in normalized:
            try:
                skins = fetch_steam_search(query, 0, per_query)
                saved = upsert_skins(skins, mark_popular=is_popular)
                total_saved += saved
            except BaseException as e:
                errors.append(f"{query}: {str(e)}")

        return resp({
            "ok": True,
            "imported": total_saved,
            "queries_processed": len(normalized),
            "errors": errors,
        })

    return resp({"error": "Маршрут не найден"}, 404)