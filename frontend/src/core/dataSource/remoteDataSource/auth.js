import { sendRequest } from "../../helpers/request";

export const authDataSource = {
  login: async (data) => {
    const response = await sendRequest({
      body: data,
      route: "/auth/login",
      method: "POST",
    });

    return response;
  },
  register: async (data) => {
    const response = await sendRequest({
      body: data,
      route: "/auth/register",
      method: "POST",
    });

    return response;
  },
  googleAuth: async (data) => {
    const response = await sendRequest({
      body: data,
      route: "/auth/google",
      method: "POST",
    });

    return response;
  },
};
