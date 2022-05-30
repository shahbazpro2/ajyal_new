import axios from "axios";
import {
  normalizeLangForHeader,
  normalizeCurrencyForHeader,
} from "../langRoutes";
import { setCookies, getCookie } from 'cookies-next';

const axiosClient = new (class axiosClient {
  static lang = "En";
  static curr = "Dollar";
  static token = null;
  static cartId = null;

  setLangAndCurrency(lang, curr) {
    axiosClient.lang = lang;
    axiosClient.curr = curr;
  }

  setToken(token) {
    if (token) setCookies(process.env.NEXT_PUBLIC_Token_Cookie_name, token);
    axiosClient.token = token;
  }

  setCartId(id) {
    axiosClient.cartId = id;
  }

  getAxios() {
    const headers = axiosClient.token
      ? {
        Language: normalizeLangForHeader(axiosClient.lang),
        Currency: normalizeCurrencyForHeader(axiosClient.curr),
        Authorization: `Bearer ${axiosClient.token}`,
      }
      : {
        Language: normalizeLangForHeader(axiosClient.lang),
        Currency: normalizeCurrencyForHeader(axiosClient.curr),
      };

    if (axiosClient.cartId) {
      headers.CookieId = axiosClient.cartId;
    }

    return axios.create({
      baseURL: process.env.NEXT_PUBLIC_API,
      headers,
    });
  }

})();



export default axiosClient;
