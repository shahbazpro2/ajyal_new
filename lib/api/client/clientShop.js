import axiosClient from "../axios";

export const client_getShopActiveDocumentById = async (groupId) => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/Form/ActiveShopDocumentsType/${groupId}`);
  return result.data;
};

export const client_getActiveCountries = async () => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/Form/ActiveCountry`);
  return result.data;
};

export const client_getActiveCities = async (provinceId) => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/Form/ActiveCity/${provinceId}`);
  return result.data;
};

// export const client_getActiveProvinces = async (countryId) => {
//   const axios = axiosClient.getAxios();
//   const result = await axios.get(`/Form/Province/${countryId}`);
//   return result.data;
// };

export const client_getActiveProvince = async (countryId) => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/Form/ActiveProvince/${countryId}`);
  return result.data;
};

export const client_getParentCategory = async () => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/Form/ParentAcitveCategory`);
  return result.data;
};

export const client_submitShop = async (formData) => {
  const axios = axiosClient.getAxios();
  const result = await axios.post(`/UserActivity/RegisterProvider`, formData);
  return result.data;
};

export const client_addAddress = async (model) => {
  const axios = axiosClient.getAxios();
  const result = await axios.post(`/Profile/AddCustomerAddress`, model);
  return result.data;
};

export const client_editAddAddress = async (model) => {
  const axios = axiosClient.getAxios();
  const result = await axios.put(`/UserActivity/Address`, model);
  return result.data;
};

export const client_checkShopEmail = async (mobileNumber, email, checkMobileNumber,captchaToken) => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/UserActivity/CheckShopEmail`, {
    params: { MobileNumber: mobileNumber, Email: email, CheckMobileNumber: checkMobileNumber , captchaToken: captchaToken}
  });
  return result.data;
};

export const client_VerifyProviderMobileNumber = async (mobileNumber, code, requestId) => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/UserActivity/VerifyProviderMobileNumber`, {
    params: { MobileNumber: mobileNumber, Code: code, RequestId: requestId }
  });
  return result.data;
};

export const client_getShopEndMsg = async () => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/Form/RegistrationFinalMessage`);
  return result.data;
};
