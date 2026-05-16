CREATE TABLE IF NOT EXISTS t_p50704551_csgo_bonus_marketpla.users (
    id SERIAL PRIMARY KEY,
    steam_id VARCHAR(20) UNIQUE NOT NULL,
    username VARCHAR(255),
    avatar VARCHAR(512),
    profile_url VARCHAR(512),
    session_token VARCHAR(64) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_steam_id ON t_p50704551_csgo_bonus_marketpla.users(steam_id);
CREATE INDEX IF NOT EXISTS idx_users_session_token ON t_p50704551_csgo_bonus_marketpla.users(session_token);
