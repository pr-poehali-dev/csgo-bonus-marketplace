import { useState, useEffect, useCallback } from "react";

const STEAM_AUTH_URL = "https://functions.poehali.dev/4ab187ac-632f-4bfd-84dd-a4adf9194272";
const STEAM_INVENTORY_URL = "https://functions.poehali.dev/ad0d34b6-a718-4aa8-a26b-c5e14229d5ef";
const TOKEN_KEY = "sv_session_token";

export interface SteamUser {
  steam_id: string;
  username: string;
  avatar: string;
  profile_url: string;
}

export interface SteamItem {
  asset_id: string;
  name: string;
  weapon: string;
  wear: string;
  rarity: "covert" | "classified" | "restricted" | "milspec";
  rarity_label: string;
  image: string;
  tradable: boolean;
  marketable: boolean;
}

export function useSteamAuth() {
  const [user, setUser] = useState<SteamUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState<SteamItem[]>([]);
  const [inventoryLoading, setInventoryLoading] = useState(false);

  const getToken = () => localStorage.getItem(TOKEN_KEY);

  const fetchMe = useCallback(async (token: string) => {
    try {
      const res = await fetch(`${STEAM_AUTH_URL}/me`, {
        headers: { "X-Session-Token": token },
      });
      if (!res.ok) {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
        return;
      }
      const data = await res.json();
      setUser(data);
    } catch {
      setUser(null);
    }
  }, []);

  const fetchInventory = useCallback(async (steamId: string) => {
    setInventoryLoading(true);
    try {
      const res = await fetch(`${STEAM_INVENTORY_URL}/?steam_id=${steamId}`);
      const data = await res.json();
      setInventory(data.items || []);
    } catch {
      setInventory([]);
    } finally {
      setInventoryLoading(false);
    }
  }, []);

  // При старте — проверяем токен из URL (редирект после Steam) или из localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("session_token");

    if (urlToken) {
      localStorage.setItem(TOKEN_KEY, urlToken);
      // Убираем токен из URL
      const url = new URL(window.location.href);
      url.searchParams.delete("session_token");
      window.history.replaceState({}, "", url.toString());
      fetchMe(urlToken).finally(() => setLoading(false));
    } else {
      const saved = getToken();
      if (saved) {
        fetchMe(saved).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }
  }, [fetchMe]);

  // Когда user появился — грузим инвентарь
  useEffect(() => {
    if (user?.steam_id) {
      fetchInventory(user.steam_id);
    }
  }, [user, fetchInventory]);

  const login = () => {
    window.location.href = `${STEAM_AUTH_URL}/login`;
  };

  const logout = async () => {
    const token = getToken();
    if (token) {
      await fetch(`${STEAM_AUTH_URL}/logout`, {
        method: "POST",
        headers: { "X-Session-Token": token },
      }).catch(() => {});
      localStorage.removeItem(TOKEN_KEY);
    }
    setUser(null);
    setInventory([]);
  };

  return { user, loading, inventory, inventoryLoading, login, logout };
}
