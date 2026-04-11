import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api.js";
import { AuthContext } from "./auth-context.js";

const storageKey = "bondly-token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(storageKey) || "");
  const [user, setUser] = useState(null);
  const [isBooting, setIsBooting] = useState(() => Boolean(localStorage.getItem(storageKey)));

  useEffect(() => {
    if (token) {
      localStorage.setItem(storageKey, token);
    } else {
      localStorage.removeItem(storageKey);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      return;
    }

    let isMounted = true;

    api
      .me(token)
      .then((response) => {
        if (isMounted) {
          setUser(response.user);
        }
      })
      .catch(() => {
        if (isMounted) {
          setToken("");
          setUser(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsBooting(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      isBooting,
      isAuthenticated: Boolean(token && user),
      async login(payload) {
        const response = await api.login(payload);
        setToken(response.token);
        setUser(response.user);
        return response.user;
      },
      async signup(payload) {
        const response = await api.signup(payload);
        setToken(response.token);
        setUser(response.user);
        return response.user;
      },
      async logout() {
        if (token) {
          await api.logout(token).catch(() => null);
        }
        setToken("");
        setUser(null);
      },
      async refreshUser() {
        if (!token) {
          return null;
        }
        const response = await api.me(token);
        setUser(response.user);
        return response.user;
      },
      async saveProfile(payload) {
        const response = await api.updateProfile(token, payload);
        setUser(response.user);
        return response.user;
      },
    }),
    [isBooting, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
