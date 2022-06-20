export const detectLang = (param) => {
    const lang = param?.split('-')[1];
    return lang
}

export const detectCurrency = (param) => {
    const currency = param?.split('-')[0];
    return currency
}