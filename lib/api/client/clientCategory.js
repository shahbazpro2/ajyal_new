import axiosClient from "../axios";

export const client_fetchCategory = async (CategoryId) => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/Home/Category/${CategoryId}`);
  return result.data;
};
