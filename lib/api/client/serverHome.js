import logger from "../../serverlogger";
import axiosClient from "../axios";

export const server_fetchHome = async () => {
  const axios = axiosClient.getAxios();
  try {
    const result = await axios.get(`/Home/Home`);
    logger.http("successful result from /Home/Home");
    return result.data;
  } catch (err) {
    logger.error('errorrrrrrrrrrr', JSON.stringify(err));
  }
};

export const server_fetchGetMobileDescriptionPageData = async (model) => {
  const axios = axiosClient.getAxios();
  try {
    const result = await axios.get(`/Home/GetMobileDescriptionPageData`, { params: model });
    logger.http("successful result from /Home/GoodsDescription/");
    return result.data;
  } catch (err) {
    logger.error(err);
  }
};