export const langUsdParams = [
  { params: { "lang-curr": "usd-en" } },
  { params: { "lang-curr": "usd-ar" } },
  { params: { "lang-curr": "bhd-en" } },
  { params: { "lang-curr": "bhd-ar" } },
];

export const langUsdParamsPanel = [
  { params: { "lang-curr": "usd-en", data: [] } },
  { params: { "lang-curr": "usd-ar", data: [] } },
];

export const possibleLangAndCur = {
  langs: {
    english: { code: "en", name: "En" },
    arabic: { code: "ar", name: "Ar" },
    persion: { code: "fa", name: "Fa" },
  },
  currencies: {
    dollar: { code: "usd", name: "USD" },
    arabic: { code: "bhd", name: "BHD" },
    toman: { code: "tmn", name: "TMN" },
  },
};

export const checkValidLand = (lang) => {
  if (
    lang === possibleLangAndCur.langs.english.code ||
    lang === possibleLangAndCur.langs.persion.code ||
    lang === possibleLangAndCur.langs.arabic.code
  )
    return true;
  return false;
};

export const checkValidCurr = (curr) => {
  if (
    curr === possibleLangAndCur.currencies.dollar.code ||
    curr === possibleLangAndCur.currencies.arabic.code ||
    curr === possibleLangAndCur.currencies.toman.code
  )
    return true;
  return false;
};

export const normalizeLangForHeader = (lang) => {
  switch (lang.toLowerCase()) {
    case "en":
      return possibleLangAndCur.langs.english.name;
    case "ar":
      return possibleLangAndCur.langs.arabic.name;
    case "fa":
      return possibleLangAndCur.langs.persion.name;
    default:
      return possibleLangAndCur.langs.english.name;
  }
};

export const normalizeCurrencyForHeader = (curr) => {
  switch (curr.toLowerCase()) {
    case "usd":
      return possibleLangAndCur.currencies.dollar.name;
    case "bhd":
      return possibleLangAndCur.currencies.arabic.name;
    case "tmn":
      return possibleLangAndCur.currencies.toman.name;
    default:
      return possibleLangAndCur.currencies.dollar.name;
  }
};
