import axiosClient from "../axios";

export const client_fetchHome = async () => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/Home/Home`);
  return result.data;
};

export const client_getHomeSerachAutoComplete = async (filter) => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/Home/SearchAutoComplete/${filter}`);
  return result.data;
};

export const client_getMobileCategory = async () => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/Home/MobileCategory`);
  return result.data;
};