import axiosClient from "../axios";

export const client_areaCheck = async (lat, lng) => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(`UserActivity/CheckAddressArea`, {
    params: {
      lat,
      long: lng,
    },
  });
  return result.data;
};
