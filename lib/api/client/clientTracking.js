import axiosClient from "../axios";

export const client_fetchTrackingDetail = async (code) => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/Home/GetOrderWithCode`, {
    params: { trackingCode: code },
  });
  return result.data;
};