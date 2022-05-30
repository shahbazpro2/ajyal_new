export const ADD_CURRENCY = "ADD_CURRENCY";
export const ADD_LANG = "ADD_LANG";
export const LOGIN_CUSTOMER_LOADING = "LOGIN_CUSTOMER_LOADING";
export const SUCCE_LOGIN = "SUCCE_LOGIN";
export const ERROR_LOGIN = "ERROR_LOGIN";

export const LOADING = "loading";
export const IDLE = "idle";
export const SUCCEEDED = "succeeded";
export const ERROR = "error";
export const LOGOUT = "logout";
export const PREVLINK_CHANGE = "PEREVLINK_CHANGE";

const initalState = {
  currency: {},
  lang: {},
  login: {
    status: IDLE,
    isLogin: false,
    token: null,
    error: null,
    prevLink: null,
  },
  register: {
    status: IDLE,
  },
};

export const selectLang = (state) => state.appConfig.lang.code;
export const selectCurr = (state) => state.appConfig.currency.code;
export const selectLogin = (state) => state.appConfig.login;
export const selectPrevLink = (state) => state.appConfig.login.prevLink;

export const appConfigReducer = (state = initalState, action) => {
  switch (action.type) {
    case ADD_CURRENCY:
      return {
        ...state,
        currency: {
          ...state.currency,
          name: action.payload.currentCurrencyName,
          code: action.payload.currentCurrencyCode,
        },
      };
    case ADD_LANG:
      return {
        ...state,
        lang: {
          ...state.lang,
          name: action.payload.languageName,
          code: action.payload.lang,
        },
      };
    case LOGIN_CUSTOMER_LOADING:
      return {
        ...state,
        login: {
          ...state.login,
          status: LOADING,
        },
      };
    case SUCCE_LOGIN:
      return {
        ...state,
        login: {
          ...state.login,
          status: SUCCEEDED,
          isLogin: true,
          token: action.payload.token,
        },
      };
    case ERROR_LOGIN:
      return {
        ...state,
        login: {
          ...state.login,
          status: ERROR,
          isLogin: false,
          token: null,
          error: action.payload.error,
        },
      };
    case LOGOUT:
      return {
        ...state,
        login: {
          ...state.login,
          status: IDLE,
          isLogin: false,
          token: null,
        },
      };
    case PREVLINK_CHANGE:
      return {
        ...state,
        login: {
          ...state.login,
          prevLink: action.payload.link,
        },
      };
    default:
      return state;
  }
};

export const updateCurrency = (code) => {
  let name;
  switch (code) {
    case "usd":
      name = "USD";
      break;
    case "bhd":
      name = "BHD";
      break;
    case "tmn":
      name = "TMN";
      break;
    default:
      break;
  }
  return {
    type: ADD_CURRENCY,
    payload: {
      currentCurrencyName: name,
      currentCurrencyCode: code,
    },
  };
};

export const updateLang = (code) => {
  let name;
  switch (code) {
    case "en":
      name = "English";
      break;
    case "ar":
      name = "Arabic";
      break;
    case "fa":
      name = "Persion";
      break;
    default:
      break;
  }
  return {
    type: ADD_LANG,
    payload: {
      languageName: name,
      lang: code,
    },
  };
};
