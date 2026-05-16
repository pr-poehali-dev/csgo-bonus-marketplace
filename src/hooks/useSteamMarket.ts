import { useState, useCallback, useEffect } from "react";

const SKINS_DB_URL = "https://functions.poehali.dev/65dc0934-ed9f-487a-bae4-17c8c8849b2c";

export interface MarketSkin {
  hash_name: string;
  name: string;
  weapon: string;
  image: string;
  price: number;
  price_text: string;
  volume: number;
  rarity: "covert" | "classified" | "restricted" | "milspec";
  wear: string;
  marketable: boolean;
}

export interface ListFilters {
  weapon?: string;
  rarity?: string;
  wear?: string;
  search?: string;
  min_price?: string;
  max_price?: string;
  sort?: "popular" | "price_asc" | "price_desc" | "volume" | "new";
  limit?: number;
  offset?: number;
}

export function useSteamMarket() {
  const [skins, setSkins] = useState<MarketSkin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);

  const fetchList = useCallback(async (filters: ListFilters = {}) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") params.set(k, String(v));
      });
      const res = await fetch(`${SKINS_DB_URL}/list?${params}`);
      const data = await res.json();
      if (data.skins) {
        setSkins(data.skins);
        setTotal(data.total || data.count || 0);
      } else {
        setError(data.error || "Ошибка загрузки");
      }
    } catch {
      setError("Не удалось загрузить базу скинов");
    } finally {
      setLoading(false);
    }
  }, []);

  return { skins, loading, error, total, fetchList };
}

export function usePopularSkins(limit = 12) {
  const [skins, setSkins] = useState<MarketSkin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${SKINS_DB_URL}/popular?limit=${limit}`)
      .then((r) => r.json())
      .then((d) => { if (d.skins) setSkins(d.skins); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [limit]);

  return { skins, loading };
}

export function useStats() {
  const [stats, setStats] = useState<{ total: number; weapons_count: number; last_update: string | null }>({
    total: 0, weapons_count: 0, last_update: null,
  });

  useEffect(() => {
    fetch(`${SKINS_DB_URL}/stats`)
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(() => {});
  }, []);

  return stats;
}
