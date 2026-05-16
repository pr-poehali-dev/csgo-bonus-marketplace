import { useState, useEffect, useCallback } from "react";

const ALERTS_URL = "https://functions.poehali.dev/05d81d29-78cb-4b98-925e-d5912930133d";
const TOKEN_KEY = "sv_session_token";

export interface PriceAlert {
  id: number;
  skin_name: string;
  skin_weapon: string;
  target_price: number;
  current_price: number | null;
  is_active: boolean;
  is_triggered: boolean;
  created_at: string;
  triggered_at: string | null;
}

export function useAlerts(loggedIn: boolean) {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(false);

  const getToken = () => localStorage.getItem(TOKEN_KEY) || "";

  const fetchAlerts = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${ALERTS_URL}/list?session_token=${token}`);
      const data = await res.json();
      if (data.alerts) setAlerts(data.alerts);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (loggedIn) fetchAlerts();
    else setAlerts([]);
  }, [loggedIn, fetchAlerts]);

  const createAlert = async (params: {
    skin_name: string;
    skin_weapon?: string;
    target_price: number;
    current_price?: number;
  }) => {
    const token = getToken();
    if (!token) return { error: "Нужна авторизация" };
    const res = await fetch(`${ALERTS_URL}/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_token: token, ...params }),
    });
    const data = await res.json();
    if (data.ok) await fetchAlerts();
    return data;
  };

  const deleteAlert = async (id: number) => {
    const token = getToken();
    if (!token) return;
    await fetch(`${ALERTS_URL}/delete?id=${id}&session_token=${token}`, {
      method: "DELETE",
    });
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const toggleAlert = async (id: number) => {
    const token = getToken();
    if (!token) return;
    await fetch(`${ALERTS_URL}/toggle?id=${id}&session_token=${token}`, {
      method: "PUT",
    });
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, is_active: !a.is_active } : a))
    );
  };

  const triggeredAlerts = alerts.filter((a) => a.is_triggered && a.is_active);

  return { alerts, loading, triggeredAlerts, createAlert, deleteAlert, toggleAlert, refresh: fetchAlerts };
}
