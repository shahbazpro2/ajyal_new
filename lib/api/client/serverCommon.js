import AxiosClient from "../axios";
import logger from "../../serverlogger";

export const server_fetchHeader = async (isDesktop) => {
  const axios = AxiosClient.getAxios();
  try {
    const result = await axios.get(`/Home/Header?isDesktop=${isDesktop}`);
    logger.http("successful result from /Home/Header");
    return result.data;
  } catch (err) {
    logger.error(JSON.stringify(err));
  }
};

export const server_fetchFooter = async () => {
  const axios = AxiosClient.getAxios();
  try {
    const result = await axios.get(`/Home/Footer`);
    logger.http("successful result from /Home/Footer");
    return result.data;
  } catch (err) {
    logger.error(JSON.stringify(err));
  }
};

export const server_categoryBrands = async ({
  pageSize,
  pageNumber,
  catId,
  search,
  BrandIds = [],
}) => {
  const axios = AxiosClient.getAxios();
  try {
    const result = await axios.post(`/Form/BrandForWebsiteWithFillter`, {
      PageSize: pageSize,
      PageNumber: pageNumber,
      Id: parseInt(catId),
      Filter: search,
      BrandIds,
    });
    logger.http("successful result from Form/BrandForWebsiteWithFillter");
    return result.data;
  } catch (err) {
    logger.error(JSON.stringify(err));
  }
};
