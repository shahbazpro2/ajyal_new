import axiosClient from "../axios";

export const client_getProfileGeneralDetail = async () => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/Profile/CustomerDetailsProfile/`);
  return result.data;
};

export const client_updateProfile = async (model) => {
  const axios = axiosClient.getAxios();
  const result = await axios.put(`/Profile/EditCustomerProfile/`, model);
  return result.data;
};

export const client_changeCustomerPassword = async (model) => {
  const axios = axiosClient.getAxios();
  const result = await axios.post(`/Auth/ChangeCustomerPassword/`, model);
  return result.data;
};

export const client_getOrderList = async (model) => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(
    `/Profile/ProfileOrdersList?PageNumber=${model.pageNumber}&PageSize=${model.pageSize}`
  );
  return result.data;
};

export const client_getCreditList = async (model) => {
  let query = Object.keys(model)
    .reduce(function (a, k) {
      a.push(k + "=" + encodeURIComponent(model[k]));
      return a;
    }, [])
    .join("&");
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/Profile/ProfileAjyalCredit?${query}`);
  return result.data;
};

export const client_getOrderItems = async (id) => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/Profile/ProfileOrdersItem?orderId=${id}`);
  return result.data;
};

export const client_getReturnOrderRequests = async (model) => {
  let query = Object.keys(model)
    .reduce(function (a, k) {
      a.push(k + "=" + encodeURIComponent(model[k]));
      return a;
    }, [])
    .join("&");
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/Profile/ProfileReturnRequested?${query}`);
  return result.data;
};

export const client_getReturnOrderDelivereds = async (model) => {
  let query = Object.keys(model)
    .reduce(function (a, k) {
      a.push(k + "=" + encodeURIComponent(model[k]));
      return a;
    }, [])
    .join("&");
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/Profile/ProfileReturnDeliverd?${query}`);
  return result.data;
};

export const client_getOrderItemForReturned = async () => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/Profile/ProfileOrdersItemReturned`);
  return result.data;
};


export const client_getReturningProduct = async (itemId) => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/Profile/ProfileProductReturned/${itemId}`);
  return result.data;
};



export const client_getReturningReasonList = async () => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/Form/ReturningReason`);
  return result.data;
};

export const client_getReturningActionList = async () => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/Form/ReturningAction`);
  return result.data;
};


export const client_submitReturnRequest = async (model) => {
  const axios = axiosClient.getAxios();
  const result = await axios.put(`/UserOrder/ReturnOrder`, model);
  return result.data;
};

export const client_getUserAddresses = async () => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/Profile/Address`);
  return result.data;
};

export const client_sendVerifyEmail = async ({ email }) => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/Profile/SendEmailVerify`, {
    params: {
      email,
    },
  });
  return result.data;
};

export const client_verifyEmail = async ({ email, code }) => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/Profile/VerifyCustomerEmail`, {
    params: {
      email,
      code,
    },
  });
  return result.data;
};

export const client_getPreference = async () => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/Profile/CustomerRefundPreference`);
  return result.data;
};

export const client_setPreference = async (preferenceCode) => {
  const axios = axiosClient.getAxios();
  const result = await axios.put(
    `/Profile/SetCustomerRefundPreference/${preferenceCode}`
  );
  return result.data;
};

export const client_customerGoodsComment = async (orderItemId, goodsId) => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(
    `/UserActivity/CustomerGoodsComment/${goodsId}/${orderItemId}`
  );
  return result.data;
};

export const client_addCustomerGoodsComment = async (model) => {
  const axios = axiosClient.getAxios();
  const result = await axios.post(
    `/UserActivity/CustomerGoodsComment`
    , model);
  return result.data;
};

export const client_getCustomerBankCards = async () => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(
    `/Profile/GetCustomerBankCards`
  );
  return result.data;
};

export const client_removeCustomerBankCard = async (bankCardId) => {
  const axios = axiosClient.getAxios();
  return axios.delete(
    `/Profile/RemoveCustomerBankCard/${bankCardId}`
  );
};

// cancel list 

export const client_getCancelList = async(orderId) => {

  const axios = axiosClient.getAxios();
  return axios.get(`/Profile/ProfileOrdersItemCanceled/${orderId}`) ;
}


export const client_getCancelReasonList = async () => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/Form/ActiveCancelingReason`);
  return result.data;
};

export const client_submitCancelRequest = async (model) => {
  const axios = axiosClient.getAxios();
  const result = await axios.put(`/UserOrder/CancelOrder`, model);
  return result.data;
};
