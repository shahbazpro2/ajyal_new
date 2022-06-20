export const isRtl = (lang) => {
  switch (lang) {
    case "en":
      return false;
      break;
    case "ar":
      return true;
      break;
    case "fa":
      return true;
      break;
    default:
      break;
  }
};
