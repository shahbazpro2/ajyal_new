import logger from "../../serverlogger";
import axiosClient from "../axios";

export const server_fetchSearch = async (filters) => {
  console.log('filters', filters)
  const axios = axiosClient.getAxios();
  try {
    const result = await axios.post(`/Home/FilterGoods`, filters);
    console.log('resultgoods', result)
    return result.data;
  } catch (err) {
    console.log('errgoods', err)
    logger.error(JSON.stringify(err));
  }
};
