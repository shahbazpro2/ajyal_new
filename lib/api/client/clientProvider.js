import axiosClient from "../axios";

export const client_fetchProvider = async (filters, providerName) => {
  const axios = axiosClient.getAxios();
  const result = await axios.post(`/Home/ShopGoods/${providerName}`, filters);
  return result.data;
};