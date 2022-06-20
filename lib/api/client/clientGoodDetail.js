import axiosClient from "../axios";

export const client_fetchComment = async (pageSize, pageNumber, id) => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/Home/CustomerComment`, {
    params: {
      PageSize: pageSize,
      PageNumber: pageNumber,
      Id: id,
    },
  });
  return result.data;
};

export const client_fetchSpecefi = async (goodsId) => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/Home/Specifications/${goodsId}`);
  return result.data;
};

export const client__getPostMethod = async (shopId, countryId, cityId , provinceId) => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(
    `/Home/PostMethod/${shopId}/${countryId}/${cityId}/${provinceId}`
  );
  return result.data;
};

export const client__getProviderInfo = async (goodsId, providerId) => {
  const axios = axiosClient.getAxios();
  const result = await axios.post(
    `/UserActivity/CallRequestGoods/${goodsId}/${providerId}`
  );
  return result.data;
};
