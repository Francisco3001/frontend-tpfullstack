import { useEffect, useState } from "react";
import { getToken } from "../utils/auth";

export default function useSession() {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const token = getToken();
    setIsAuth(!!token);
  }, []); // ejecutar cuando se monta el componente

  return { isAuth };
}