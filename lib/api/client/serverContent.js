import axiosClient from "../axios";
import logger from "../../serverlogger";
import { debug } from "winston";

export const server_fetchContent = async (content) => {
  const axios = axiosClient.getAxios();
  const errorSchema = {
    result: "",
    status: null,
  };
  try {
    const result = await axios.get(`/Home/GetFooterContent/${content}`);
    logger.http(`succsefull result form Home/GetFooterContent/${content}`);
     
    return result.data;
  } catch (err) {
    errorSchema.status = err.response.status;
     
    logger.error(JSON.stringify(err));
    return errorSchema;
  }
};
