import { renderToStaticMarkup } from "react-dom/server";

export const translationsPayload = (translations, lang) => {
  return {
    languages: [
      { name: "English", code: "en" },
      { name: "Arabic", code: "ar" },
      { name: "Persion", code: "fa" },
    ],
    translation: translations,
    options: {
      renderToStaticMarkup,
      defaultLanguage: lang,
    },
  };
};

export const mergeTranslations = (t1, t2) => {
  return { ...t1, ...t2 };
};
