import axiosClient from "../axios";
import Axios from "axios";

export const client__fetchCountries = async () => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/Form/ActiveCountry`);
  return result.data;
};

export const client__fetchCities = async (provinceId) => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/Form/ActiveCity/${provinceId}`);
  return result.data;
};

export const client__fetchProvince = async (countryId) => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/Form/ActiveProvince/${countryId}`);
  return result.data;
};

export const client_viewGood = async (goodId) => {
  const axios = axiosClient.getAxios();
  const result = await axios.post(`/UserActivity/ViewGoods/${goodId}`);
  return result.data;
};

export const client_verifyAddressPhone = async ({
  addressId,
  code,
  requestId,
}) => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/Profile/VerifyMobileNumberAddress`, {
    params: {
      addressId: addressId,
      code,
      requestId,
    },
  });
  return result.data;
};

export const client_changeMobileNumber = async ({
  addressId,
  mobileNumber,
}) => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/Profile/ChangeMobileNumberAddress`, {
    params: {
      addressId: addressId,
      mobileNumber,
    },
  });
  return result.data;
};

export const client_setDefaultAddress = async ({ addressId }) => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/Profile/SetDefualtAddress`, {
    params: {
      addressId: addressId,
    },
  });
  return result.data;
};

export const client_categoryBrands = async ({
  pageSize,
  pageNumber,
  catId,
  search,
  BrandIds = [],
}) => {
  const axios = axiosClient.getAxios();
  const result = await axios.post(`/Form/BrandForWebsiteWithFillter`, {
    PageSize: pageSize,
    PageNumber: pageNumber,
    Id: parseInt(catId),
    Filter: search,
    BrandIds
  });
  return result.data;
};

export const client_updateUserNotificationKey = async (notificationKey, type = 1) => { // for web type is 1
  const axios = axiosClient.getAxios();
  const model = { notificationKey: notificationKey, type: type };

  const result = await axios.put(`/Auth/UpdateUserNotificationKey`, model);
  return result.data;
};