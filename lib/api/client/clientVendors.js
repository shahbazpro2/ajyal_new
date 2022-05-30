import axiosClient from "../axios";

export const client_fetchVendors = async ({
  StoreName,
  Sort,
  CategoryId,
  PageNumber,
  PageSize,
  CountryId,
  CityId,
  ProvinceId
}) => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/Home/GetShopList`, {
    params: {
      StoreName,
      Sort,
      CategoryId,
      PageNumber,
      PageSize,
      CountryId,
      CityId,
      ProvinceId
    },
  });
  return result.data;
};
