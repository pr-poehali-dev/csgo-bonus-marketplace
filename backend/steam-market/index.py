"""
Прокси к Steam Market API для получения скинов CS2 с ценами и изображениями.
GET /search?query=ak-47&start=0&count=20  — поиск скинов по названию
GET /popular?count=20                      — популярные скины CS2
GET /price?name=AK-47%20%7C%20Asiimov     — цена конкретного скина
"""
import json
import os
import urllib.request
import urllib.parse
import time

CS2_APP_ID = 730
STEAM_CURRENCY = 1  # USD


def cors():
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }


def resp(data, status=200):
    return {
        "statusCode": status,
        "headers": {**cors(), "Content-Type": "application/json"},
        "body": json.dumps(data, ensure_ascii=False),
    }


def steam_image_url(icon_url: str) -> str:
    if not icon_url:
        return ""
    return f"https://community.cloudflare.steamstatic.com/economy/image/{icon_url}/360fx360f"


def parse_price(price_str: str) -> float:
    """Парсим цену из строки Steam типа '$12.34' или '12,34 USD'"""
    if not price_str:
        return 0.0
    cleaned = price_str.replace("$", "").replace(",", "").replace(" ", "").strip()
    try:
        return float(cleaned)
    except ValueError:
        return 0.0


def rarity_from_tags(tags: list) -> str:
    rarity_map = {
        "Contraband": "covert",
        "Covert": "covert",
        "Classified": "classified",
        "Restricted": "restricted",
        "Mil-Spec Grade": "milspec",
        "Industrial Grade": "milspec",
        "Consumer Grade": "milspec",
    }
    for tag in tags:
        if tag.get("category") == "Rarity":
            name = tag.get("localized_tag_name", tag.get("internal_name", ""))
            for k, v in rarity_map.items():
                if k.lower() in name.lower():
                    return v
    return "milspec"


def wear_from_tags(tags: list) -> str:
    for tag in tags:
        if tag.get("category") == "Exterior":
            return tag.get("localized_tag_name", "")
    return ""


def weapon_from_name(name: str) -> str:
    """Извлекаем название оружия из market_hash_name"""
    if " | " in name:
        return name.split(" | ")[0].strip()
    return name


def skin_name_from_hash(name: str) -> str:
    """Извлекаем название скина (без оружия и износа)"""
    if " | " in name:
        parts = name.split(" | ", 1)
        skin = parts[1]
        # Убираем износ в скобках
        if " (" in skin:
            skin = skin[:skin.rfind(" (")]
        return skin.strip()
    return name


def fetch_url(url: str, timeout: int = 10) -> dict | None:
    headers = {
        "User-Agent": "Mozilla/5.0 (compatible; SkinVault/1.0)",
        "Accept": "application/json",
        "Accept-Language": "en-US,en;q=0.9",
    }
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return json.loads(r.read().decode("utf-8"))
    except BaseException:
        return None


def search_skins(query: str, start: int = 0, count: int = 20) -> list:
    """Поиск через Steam Market search API"""
    params = urllib.parse.urlencode({
        "appid": CS2_APP_ID,
        "query": query,
        "search_descriptions": 0,
        "start": start,
        "count": count,
        "norender": 1,
        "currency": STEAM_CURRENCY,
    })
    url = f"https://steamcommunity.com/market/search/render/?{params}"
    data = fetch_url(url)
    if not data or not data.get("success"):
        return []

    results = []
    for item in data.get("results", []):
        asset = item.get("asset_description", {})
        icon_url = asset.get("icon_url", "")
        hash_name = item.get("hash_name", "")
        tags = asset.get("tags", [])

        sell_price = item.get("sell_price", 0) / 100.0
        sell_price_text = item.get("sell_price_text", "")

        results.append({
            "hash_name": hash_name,
            "name": skin_name_from_hash(hash_name),
            "weapon": weapon_from_name(hash_name),
            "image": steam_image_url(icon_url),
            "price": sell_price if sell_price > 0 else parse_price(sell_price_text),
            "price_text": sell_price_text,
            "volume": item.get("sell_listings", 0),
            "rarity": rarity_from_tags(tags),
            "wear": wear_from_tags(tags),
            "marketable": asset.get("marketable", 0) == 1,
        })
    return results


# Предопределённый список популярных скинов CS2 с реальными Steam hash names
POPULAR_SKINS = [
    "AK-47 | Asiimov (Field-Tested)",
    "AK-47 | Redline (Field-Tested)",
    "AK-47 | Vulcan (Factory New)",
    "AK-47 | Fire Serpent (Field-Tested)",
    "AWP | Asiimov (Field-Tested)",
    "AWP | Dragon Lore (Field-Tested)",
    "AWP | Medusa (Field-Tested)",
    "AWP | Hyper Beast (Factory New)",
    "M4A4 | Howl (Field-Tested)",
    "M4A1-S | Hyper Beast (Factory New)",
    "M4A1-S | Printstream (Factory New)",
    "Karambit | Doppler (Factory New)",
    "Karambit | Fade (Factory New)",
    "M9 Bayonet | Doppler (Factory New)",
    "Butterfly Knife | Fade (Factory New)",
    "Desert Eagle | Blaze (Factory New)",
    "Glock-18 | Fade (Factory New)",
    "USP-S | Kill Confirmed (Factory New)",
]


def get_price(hash_name: str) -> dict:
    """Получаем цену конкретного скина"""
    params = urllib.parse.urlencode({
        "appid": CS2_APP_ID,
        "market_hash_name": hash_name,
        "currency": STEAM_CURRENCY,
    })
    url = f"https://steamcommunity.com/market/priceoverview/?{params}"
    data = fetch_url(url)
    if not data or not data.get("success"):
        return {"price": 0.0, "price_text": "N/A", "volume": "0"}

    return {
        "price": parse_price(data.get("lowest_price", "0")),
        "price_text": data.get("lowest_price", "N/A"),
        "median_price": parse_price(data.get("median_price", "0")),
        "volume": data.get("volume", "0"),
    }


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors(), "body": ""}

    path = event.get("path", "/").rstrip("/") or "/"
    params = event.get("queryStringParameters") or {}

    # GET /search
    if path.endswith("/search"):
        query = params.get("query", "").strip()
        if not query:
            return resp({"error": "Передай параметр query"}, 400)
        start = int(params.get("start", 0))
        count = min(int(params.get("count", 20)), 50)
        skins = search_skins(query, start, count)
        return resp({"skins": skins, "query": query, "count": len(skins)})

    # GET /popular — возвращаем список топ скинов через поиск
    if path.endswith("/popular"):
        count = min(int(params.get("count", 18)), 30)
        skins = search_skins("", 0, count)
        if not skins:
            # Fallback — ищем по конкретным именам
            skins = search_skins("AK-47", 0, 6)
        return resp({"skins": skins[:count], "count": len(skins)})

    # GET /price?name=...
    if path.endswith("/price"):
        name = params.get("name", "").strip()
        if not name:
            return resp({"error": "Передай параметр name"}, 400)
        price_data = get_price(name)
        return resp(price_data)

    return resp({"error": "Маршрут не найден"}, 404)
