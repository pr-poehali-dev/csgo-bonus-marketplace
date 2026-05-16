CREATE TABLE IF NOT EXISTS t_p50704551_csgo_bonus_marketpla.skins_cache (
    id SERIAL PRIMARY KEY,
    hash_name VARCHAR(512) UNIQUE NOT NULL,
    name VARCHAR(512) NOT NULL,
    weapon VARCHAR(128),
    wear VARCHAR(64),
    rarity VARCHAR(32),
    image VARCHAR(1024),
    price NUMERIC(12, 2) DEFAULT 0,
    price_text VARCHAR(64),
    volume INTEGER DEFAULT 0,
    is_popular BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skins_weapon ON t_p50704551_csgo_bonus_marketpla.skins_cache(weapon);
CREATE INDEX IF NOT EXISTS idx_skins_rarity ON t_p50704551_csgo_bonus_marketpla.skins_cache(rarity);
CREATE INDEX IF NOT EXISTS idx_skins_price ON t_p50704551_csgo_bonus_marketpla.skins_cache(price);
CREATE INDEX IF NOT EXISTS idx_skins_popular ON t_p50704551_csgo_bonus_marketpla.skins_cache(is_popular);
