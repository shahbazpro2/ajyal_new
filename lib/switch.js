export const switchLang = (url = "/usd-ar", reloadPage = false) => {
  debugger;
  const parts = url.split("/");
  const vari = parts[1];

  if (!vari) {
    return;
  }

  const cur_part = vari.split("-");

  if (!cur_part[1]) {
    return;
  }

  switch (cur_part[1]) {
    case "en":
      cur_part[1] = "ar";
      break;
    case "ar":
      cur_part[1] = "en";
      break;
    case "fa":
      cur_part[1] = "fa";
      break;
    default:
      cur_part[1] = "en";
      break;
  }

  parts[1] = cur_part.join("-");
  const newUrl = parts.join("/");

  if (reloadPage) {
    window.location.href = newUrl;
  }

  return newUrl;
};

export const switchCurr = (url = "/bhd-ar", reloadPage = false) => {
  const parts = url.split("/");
  const vari = parts[1];

  if (!vari) {
    return;
  }

  const cur_part = vari.split("-");

  if (!cur_part[0]) {
    return;
  }

  switch (cur_part[0]) {
    case "usd":
      cur_part[0] = "bhd";
      break;
    case "bhd":
      cur_part[0] = "usd";
      break;
    case "tmn":
      cur_part[0] = "tmn";
      break;
    default:
      cur_part[0] = "usd";
      break;
  }

  parts[1] = cur_part.join("-");
  const newUrl = parts.join("/");

  if (reloadPage) {
    window.location.href = newUrl;
  }

  return newUrl;
};

export const showNextCurr = (curr) => {
  if (curr == "bhd") return "USD";
  if (curr == "usd") return "BHD";
};

export const showNextLang = (lang) => {
  if (lang == "en") return "العربية";
  if (lang == "ar") return "English";
};
// switchLang()
