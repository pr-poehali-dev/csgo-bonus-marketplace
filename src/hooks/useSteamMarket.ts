import { useState, useCallback, useEffect } from "react";

const MARKET_URL = "https://functions.poehali.dev/19475082-2d91-4297-af08-f035cc6f2002";

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

export function useSteamMarket() {
  const [skins, setSkins] = useState<MarketSkin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);

  const fetchPopular = useCallback(async (count = 20) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${MARKET_URL}/popular?count=${count}`);
      const data = await res.json();
      if (data.skins) {
        setSkins(data.skins);
        setTotal(data.count || data.skins.length);
      }
    } catch {
      setError("Не удалось загрузить данные Steam");
    } finally {
      setLoading(false);
    }
  }, []);

  const search = useCallback(async (query: string, start = 0, count = 20) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ query, start: String(start), count: String(count) });
      const res = await fetch(`${MARKET_URL}/search?${params}`);
      const data = await res.json();
      if (data.skins) {
        setSkins(data.skins);
        setTotal(data.count || data.skins.length);
      } else {
        setError(data.error || "Ошибка поиска");
      }
    } catch {
      setError("Не удалось выполнить поиск");
    } finally {
      setLoading(false);
    }
  }, []);

  return { skins, loading, error, total, fetchPopular, search };
}

export function usePopularSkins(count = 6) {
  const [skins, setSkins] = useState<MarketSkin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${MARKET_URL}/popular?count=${count}`)
      .then((r) => r.json())
      .then((d) => { if (d.skins) setSkins(d.skins); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [count]);

  return { skins, loading };
}
