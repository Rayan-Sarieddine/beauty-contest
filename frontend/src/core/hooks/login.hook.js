import { local } from "../helpers/localstorage";
import { useEffect, useState } from "react";

export const useLogin = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const localToken = local("token");

    setToken(localToken);
  }, []);

  return [token !== null && token !== undefined && token !== "", token];
};
