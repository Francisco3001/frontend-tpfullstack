import { useEffect, useState } from "react";
import { getToken } from "../utils/auth";

export default function useSession() {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const token = getToken();
    setIsAuth(!!token);
  }, []);

  return { isAuth };
}