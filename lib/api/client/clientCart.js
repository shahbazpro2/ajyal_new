import axiosClient from "../axios";

export const client_fetchCart = async ({ code, country, city,province }) => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/UserOrder/CartDetail`, {
    params: {
      code: code,
      cityId: city,
      countryId: country,
      provinceId: province
    },
  });
  return result.data;
};

export const client_addToCart = async ({
  goodId,
  providerId,
  count,
  countryId,
  cityId,
  provinceId,
  oneClick = false,
}) => {
  const axios = axiosClient.getAxios();
  const result = await axios.post("/UserOrder/Order", {
    goodsId: goodId,
    providerId: providerId,
    number: count,
    countryId: countryId,
    cityId: cityId,
    provinceId: provinceId,
    oneClick,
  });

  return result.data;
};

export const client_fetchWishlist = async () => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/Home/CustomerLikes`);
  return result.data;
};

export const client_likeGood = async (goodsId) => {
  const axios = axiosClient.getAxios();
  const result = await axios.post(`/UserActivity/LikeGoods/${goodsId}`);
  return result.data;
};

export const client_removeFromCart = async (orderItemId) => {
  const axios = axiosClient.getAxios();
  const result = await axios.delete(`/UserOrder/OrderItem/${orderItemId}`);
  return result.data;
};

export const client_addItemCount = async ({
  goodsId,
  providerId,
  number,
  countryId,
  cityId,
  provinceId
}) => {
  const axios = axiosClient.getAxios();
  const result = await axios.put(`/UserOrder/IncreaseOrderItem`, {
    goodsId,
    providerId,
    number,
    countryId,
    cityId,
    provinceId
  });
  return result.data;
};
