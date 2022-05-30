import axiosClient from "../axios";

export const client_fetchSearch = async (json) => {
  const axios = axiosClient.getAxios();
  const result = await axios.post(`/Home/FilterGoods`, json);
  return result.data;
};