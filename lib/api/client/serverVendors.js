import logger from "../../serverlogger";
import axiosClient from "../axios";

export const server_vendorCategoies = async () => {
  const axios = axiosClient.getAxios();
  try {
    const result = await axios.get(`/Form/ParentAcitveCategory`);
    logger.http("successful result from /Form/ParentAcitveCategory ");
    return result.data;
  } catch (err) {
    logger.error(JSON.stringify(err));
  }
};