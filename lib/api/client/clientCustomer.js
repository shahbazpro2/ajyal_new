import axiosClient from "../axios";

export const client_registerCustomer = async ({
  email,
  pass,
  name,
  family,
  captchaToken,
  mobileNumber ,
  countryId,
  phoneCode,
  smsCode,
  requestId
}) => {
  const axios = axiosClient.getAxios();
  const result = await axios.post(`/Auth/CustomerRegister`, {
    userName: email,
    password: pass,
    name: name,
    family: family,
    captchaToken: captchaToken,
    mobileNumber:mobileNumber ,
    countryId:countryId,
    phoneCode:phoneCode,
    VerfiyCode:smsCode,
    RequestId:requestId
  });
  return result.data;
};

export const client_verifyCustomerMobileNumber = async ({
  captchaToken,
  mobileNumber ,
  email
}) => {
  const axios = axiosClient.getAxios();
  const result = await axios.post(`/Auth/SendVerifyMobileNumberCustomer`, {
    captchaToken: captchaToken,
    mobileNumber:mobileNumber ,
    email:email 
  });
  return result.data;
};

export const client_resendVerifyMobileNumber = async ({
  mobileNumber 
}) => {
  const axios = axiosClient.getAxios();
  const result = await axios.post(`/Auth/ResendVerifyMobileNumber`, {
    mobileNumber:mobileNumber 
  });
  return result.data;
};


export const client_loginCustomer = async ({ email, pass,captchaToken }) => {
  const axios = axiosClient.getAxios();
  const result = await axios.post(`/Auth/CustomerLogin`, {
    userName: email,
    password: pass,
    captchaToken:captchaToken
  });
  return result.data;
};

export const client_authDetials = async () => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/Auth/GetWebSiteAuthDetials`);
  return result.data;
};

export const client_loginWithSocial = async ({ accessToken, socialType }) => {
  const axios = axiosClient.getAxios();
  const result = await axios.post(`/Auth/CustomerRegisterGoogleFacebook`, {
    AccessToken: accessToken,
    SocialType: socialType,
  });
  return result.data;
};

export const client_sendForgetEmail = async ({ email }) => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/Auth/SendEmailForgetPassword`, {
    params: {
      email,
    },
  });
  return result.data;
};

export const client_verifyForgetEmail = async ({ email, code }) => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/Auth/VerifyCodeEmail`, {
    params: {
      email,
      code,
    },
  });
  return result.data;
};

export const client_changeForgetPass = async ({ pass, email }) => {
  const axios = axiosClient.getAxios();
  const result = await axios.put(`/Auth/ChangeCustomerEmailForgetPass`, {
    newPassword: pass,
    userName: email,
  });
  return result.data;
};
