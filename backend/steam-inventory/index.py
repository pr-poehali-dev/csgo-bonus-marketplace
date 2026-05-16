"""
Получение инвентаря CS2 пользователя через Steam API.
GET /?steam_id=... — возвращает список скинов из инвентаря CS2
"""
import json
import os
import urllib.request
import urllib.error

STEAM_API_KEY = os.environ.get("STEAM_API_KEY", "")
CS2_APP_ID = 730


def cors_headers():
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Session-Token",
    }


def json_response(data, status=200):
    return {
        "statusCode": status,
        "headers": {**cors_headers(), "Content-Type": "application/json"},
        "body": json.dumps(data, ensure_ascii=False),
    }


def handler(event: dict, context) -> dict:
    """Возвращает инвентарь CS2 по steam_id пользователя."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers(), "body": ""}

    params = event.get("queryStringParameters") or {}
    steam_id = params.get("steam_id", "")

    if not steam_id or not steam_id.isdigit():
        return json_response({"error": "Передай steam_id"}, 400)

    # Получаем инвентарь через Steam Community API (публичный)
    inv_url = (
        f"https://steamcommunity.com/inventory/{steam_id}/{CS2_APP_ID}/2"
        f"?l=russian&count=100"
    )

    try:
        req = urllib.request.Request(inv_url, headers={"User-Agent": "SkinVault/1.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            raw = json.loads(resp.read().decode())
    except OSError as e:
        err_str = str(e)
        if "403" in err_str:
            return json_response({"error": "Инвентарь закрыт настройками приватности", "items": []})
        return json_response({"error": f"Ошибка Steam API: {err_str}", "items": []})
    except BaseException as e:
        return json_response({"error": f"Не удалось получить инвентарь: {str(e)}", "items": []})

    assets = {a["assetid"]: a for a in raw.get("assets", [])}
    descriptions = {
        (d["classid"], d.get("instanceid", "0")): d
        for d in raw.get("descriptions", [])
    }

    items = []
    for asset_id, asset in assets.items():
        key = (asset["classid"], asset.get("instanceid", "0"))
        desc = descriptions.get(key, {})
        if not desc:
            continue

        name = desc.get("market_hash_name", desc.get("name", "Unknown"))
        icon_url = desc.get("icon_url", "")
        image = f"https://community.cloudflare.steamstatic.com/economy/image/{icon_url}" if icon_url else ""

        # Парсим теги
        tags = {t["category"]: t["localized_tag_name"] for t in desc.get("tags", [])}
        rarity_raw = tags.get("Rarity", "").lower()

        rarity_map = {
            "запрещённое": "restricted",
            "армейское": "milspec",
            "засекреченное": "classified",
            "тайное": "covert",
            "промышленное": "milspec",
            "ширпотреб": "milspec",
        }
        rarity = "milspec"
        for k, v in rarity_map.items():
            if k in rarity_raw:
                rarity = v
                break

        items.append({
            "asset_id": asset_id,
            "name": name,
            "weapon": tags.get("Weapon", tags.get("Type", "")),
            "wear": tags.get("Exterior", ""),
            "rarity": rarity,
            "rarity_label": tags.get("Rarity", ""),
            "image": image,
            "tradable": desc.get("tradable", 0) == 1,
            "marketable": desc.get("marketable", 0) == 1,
        })

    return json_response({
        "steam_id": steam_id,
        "total": len(items),
        "items": items[:50],
    })