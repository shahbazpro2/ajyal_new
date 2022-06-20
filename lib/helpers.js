import { normalizeLangForHeader, possibleLangAndCur } from "./langRoutes";
import errors from "./../translations/errors.json";
import Cookies from "js-cookie";
import axiosClient from "./api/axios";

export const generateArrNumberRange = (from, to) => {
  const arr = [];
  from = parseInt(from);
  to = parseInt(to);

  if (to > 10) to = 10;
  for (let i = from; i <= to; i++) {
    arr.push(i);
  }
  return arr;
};

export const isAr = (code) => {
  if (code === possibleLangAndCur.langs.arabic.code) return true;
  return false;
};

export const getErrorMsg = (lang, id) => {
  let langId = 0;
  if (possibleLangAndCur.langs.arabic.code === lang) {
    langId = 1;
  }

  return errors[id][langId];
};

export const setTokenCookie = (
  token,
  name = process.env.NEXT_PUBLIC_Token_Cookie_name
) => {
  Cookies.set(name, token, {
    expires: parseInt(process.env.NEXT_PUBLIC_Cookies_expires_day),
    domain: process.env.NEXT_PUBLIC_Token_Cookie_Domain,
  });
};

export const setCartCookie = (
  id,
  name = process.env.NEXT_PUBLIC_Token_Cookie_name_cart
) => {
  Cookies.set(name, id, {
    expires: parseInt(process.env.NEXT_PUBLIC_Cookies_expires_day_cart),
    domain: process.env.NEXT_PUBLIC_Token_Cookie_Domain_cart,
  });
};

export const slugy = (str) => {
  if (str) str = str.replace(/\s+/g, "-").toLowerCase();
  return str;
};

export const removeTokenCookie = () => {
  const token = Cookies.get(process.env.NEXT_PUBLIC_Token_Cookie_name);
  if (token) {
    Cookies.remove(process.env.NEXT_PUBLIC_Token_Cookie_name);
    axiosClient.setToken(null);
  }
};

export const removeCartCookie = () => {
  const token = Cookies.get(process.env.NEXT_PUBLIC_Token_Cookie_name_cart);
  if (token) {
    Cookies.remove(process.env.NEXT_PUBLIC_Token_Cookie_name_cart);
    axiosClient.setCartId(null);
  }
};

export const setCouponCookie = (
  token,
  name = process.env.NEXT_PUBLIC_Token_Cookie_name_coupon
) => {
  Cookies.set(name, token, {
    expires: parseInt(process.env.NEXT_PUBLIC_Cookies_expires_day_coupon),
    domain: process.env.NEXT_PUBLIC_Token_Cookie_Domain_coupon,
  });
};

export const removeCouponCookie = () => {
  const token = Cookies.get(process.env.NEXT_PUBLIC_Token_Cookie_name_coupon);
  if (token) {
    Cookies.remove(process.env.NEXT_PUBLIC_Token_Cookie_name_coupon);
  }
};

export const trimText = (text, maxLenght = 55) => {
  if (!text || text.length === 0) return "";
  let newText = text;
  if (text.length > maxLenght) {
    newText = text.substring(0, maxLenght) + "...";
  }
  return newText;
};

export const roundDecimalNumber = (number) => {
  if (number == 0)
    return 0;
  if (number < 10) {
    if (number < 5) {
      return number
    } else {
      return 5;
    }
  }
  if (number < 100) {
    let tempNumber = number / 10;
    tempNumber = parseInt(tempNumber);
    tempNumber = tempNumber * 10;
    return tempNumber;
  }
  if (number < 1000) {
    let tempNumber = number / 100;
    tempNumber = parseInt(tempNumber);
    tempNumber = tempNumber * 100;
    return tempNumber;
  }
  if (number < 10000) {
    let tempNumber = number / 100;
    tempNumber = parseInt(tempNumber);
    tempNumber = tempNumber * 100;
    return tempNumber;
  }
  if (number < 100000) {
    let tempNumber = number / 100;
    tempNumber = parseInt(tempNumber);
    tempNumber = tempNumber * 100;
    return tempNumber;
  }
  if (number < 1000000) {
    let tempNumber = number / 1000;
    tempNumber = parseInt(tempNumber);
    tempNumber = tempNumber * 1000;
    return tempNumber;
  }
  if (number < 1000000) {
    let tempNumber = number / 1000;
    tempNumber = parseInt(tempNumber);
    tempNumber = tempNumber * 1000;
    return tempNumber;
  }
  return number;
};

export const trimTextLonger = (text) => {
  if (!text || text.length === 0) return "";
  let newText = text;
  if (text.length > 60) {
    newText = text.substring(0, 60) + "...";
  }
  return newText;
};

export const formatMoney = (
  amount,
  decimalCount = 2,
  decimal = ".",
  thousands = ","
) => {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(
      (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
    ).toString();
    let j = i.length > 3 ? i.length % 3 : 0;

    return (
      negativeSign +
      (j ? i.substr(0, j) + thousands : "") +
      i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
      (decimalCount
        ? decimal +
        Math.abs(amount - i)
          .toFixed(decimalCount)
          .slice(2)
        : "")
    );
  } catch (e) {
    console.log(e);
  }
};
