import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function useSession() {
  const [isAuth, setIsAuth] = useState(null); 

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          credentials: "include",
        });

        setIsAuth(res.ok);
      } catch {
        setIsAuth(false);
      }
    };

    checkAuth();
  }, []);

  return { isAuth };
}