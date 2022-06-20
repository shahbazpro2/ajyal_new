import { isRtl } from "./isRtl";

export const getToastConfig = () => {
  return {
    position: "top-right",
    autoClose: 10000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };
};
