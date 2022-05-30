import isEmail from "validator/lib/isEmail";
import isLength from "validator/lib/isLength";
import isCreditCard from "validator/lib/isCreditCard";
import isEmpty from "validator/lib/isEmpty";
import isPostalCode from "validator/lib/isPostalCode";

import { getErrorMsg } from "./helpers";
import { PhoneNumber, PhoneNumberUtil } from "google-libphonenumber";
export const validateEmail = ({ name, value, handler, lang }) => {
  if (handler) {
    if (isEmail(value))
      handler((state) => {
        return { ...state, [name]: false };
      });
    else
      handler((state) => {
        return { ...state, [name]: getErrorMsg(lang, "email-not-valid") };
      });
  } else {
    if (isEmail(value)) return true;
    else return false;
  }
};

export const validatePassword = ({ name, value, handler, lang }) => {
  if (handler) {
    if (isLength(value, { min: 6, max: 50 }))
      handler((state) => {
        return { ...state, [name]: false };
      });
    else
      handler((state) => {
        return { ...state, [name]: getErrorMsg(lang, "pass-not-valid") };
      });
  } else {
    if (isLength(value, { min: 6, max: 50 })) return true;
    else return false;
  }
};

export const validatePasswordCreateShop = ({ name, value, handler, lang }) => {
  if (handler) {
    if (isLength(value, { min: 8, max: 50 }))
      handler((state) => {
        return { ...state, [name]: false };
      });
    else
      handler((state) => {
        return { ...state, [name]: getErrorMsg(lang, "pass-not-valid-create-shop") };
      });
  } else {
    if (isLength(value, { min: 8, max: 50 })) return true;
    else return false;
  }
};


export const validateConfirmPassword = ({
  name,
  value1 = "",
  value2 = "",
  handler,
  lang,
}) => {
  if (handler) {
    if (value1 === value2)
      handler((state) => {
        return { ...state, [name]: false };
      });
    else
      handler((state) => {
        return { ...state, [name]: getErrorMsg(lang, "confirm-pass") };
      });
  } else {
    if (value1 === value2) return true;
    else return false;
  }
};

export const validateEmpty = ({ name, value, handler, lang }) => {
  if (handler) {
    if (!isEmpty(value))
      handler((state) => {
        return { ...state, [name]: false };
      });
    else
      handler((state) => {
        return { ...state, [name]: getErrorMsg(lang, "empty-filed") };
      });
  } else {
    if (!isEmpty(value)) return true;
    else return false;
  }
};

export const validatePhoneNumber = ({ name, value, handler, lang, iso }) => {
  const phoneUtil = PhoneNumberUtil.getInstance();

  if (!iso || isEmpty(iso)) {
    if (handler) {
      handler((state) => {
        return { ...state, [name]: getErrorMsg(lang, "select-region-first") };
      });
      return;
    } else {
      return false;
    }
  }

  try {
    const number = phoneUtil.parse(value, iso);
    phoneUtil.isValidNumber(number);

    const re = phoneUtil.isValidNumberForRegion(number, iso);
    if (handler) {
      if (re)
        handler((state) => {
          return { ...state, [name]: false };
        });
      else
        handler((state) => {
          return {
            ...state,
            [name]: getErrorMsg(lang, "phone-not-match-country"),
          };
        });
    } else {
      if (re) return true;
      else return false;
    }
  } catch (err) {
    if (handler) {
      handler((state) => {
        return { ...state, [name]: getErrorMsg(lang, "phone-not-valid") };
      });
    } else {
      return false;
    }
  }
};



export const validatePostalCode = ({ name, value, handler, lang }) => {
  if (handler) {
    if (isPostalCode(value))
      handler((state) => {
        return { ...state, [name]: false };
      });
    else
      handler((state) => {
        return { ...state, [name]: getErrorMsg(lang, "postal-code-filed") };
      });
  } else {
    if (isPostalCode(value)) return true;
    else return false;
  }
};

export const validateCreditCard = ({ name, value, handler, lang }) => {
  if (handler) {
    if (isCreditCard(value))
      handler((state) => {
        return { ...state, [name]: false };
      });
    else
      handler((state) => {
        return { ...state, [name]: getErrorMsg(lang, "credi-card-filed") };
      });
  } else {
    if (isCreditCard(value)) return true;
    else return false;
  }
};
