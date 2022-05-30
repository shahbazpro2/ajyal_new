import logger from "../../serverlogger";
import axiosClient from "../axios";

export const server_fetchProvider = async (filters, providerName) => {
  const axios = axiosClient.getAxios();
  const errorSchema = {
    result: "",
    status: null,
  };
  try {
    const result = await axios.post(`/Home/ShopGoods/${providerName}`, filters);
    logger.http(
      "successful result from /Home/ShopGoods/ with: " + JSON.stringify(filters)
    );

    return result.data;
  } catch (err) {
    errorSchema.status = err.response.status;
    logger.error(JSON.stringify(err));
    return errorSchema;
  }
};
