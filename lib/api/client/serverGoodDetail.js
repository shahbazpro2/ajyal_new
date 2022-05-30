import AxiosClient from "../axios";
import logger from "../../serverlogger";

export const server_fetchGoodDetail = async (goodsId, providerId) => {
  const errorSchema = {
    result: "",
    status: null,
  };

  const axios = AxiosClient.getAxios();
  try {
    const result = await axios.get(
      `/Home/GoodsDetails/${goodsId}/${providerId}`
    );
    logger.http(
      `successful result from /Home/GoodsDetails/${goodsId}/${providerId}`
    );
    return result.data;
  } catch (err) {
    if (err.response) {
      logger.http(
        `The request was made and the server responded with a status code ${err.response.status} at /Home/GoodsDetails/${goodsId}/${providerId}`
      );
      errorSchema.status = err.response.status;
      return errorSchema;
    }
    logger.error(JSON.stringify(err));
    return;
  }
};
