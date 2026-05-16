CREATE TABLE IF NOT EXISTS t_p50704551_csgo_bonus_marketpla.price_alerts (
    id SERIAL PRIMARY KEY,
    user_steam_id VARCHAR(20) NOT NULL,
    skin_name VARCHAR(512) NOT NULL,
    skin_weapon VARCHAR(128),
    target_price NUMERIC(10, 2) NOT NULL,
    current_price NUMERIC(10, 2),
    is_active BOOLEAN DEFAULT TRUE,
    is_triggered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    triggered_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_alerts_steam_id ON t_p50704551_csgo_bonus_marketpla.price_alerts(user_steam_id);
CREATE INDEX IF NOT EXISTS idx_alerts_active ON t_p50704551_csgo_bonus_marketpla.price_alerts(is_active);
