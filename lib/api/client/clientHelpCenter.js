import axiosClient from "../axios";

export const client_putArticleReview = async (id, accept) => {
  const axios = axiosClient.getAxios();
  const result = await axios.put(`/Home/HelpArticle`, {
    Id: id,
    Accept: accept,
  });
  return result.data;
};

export const client_getSearchResult = async (search) => {
  const axios = axiosClient.getAxios();
  const result = await axios.get(`/Home/HelpAutoComplete/${search}`);
  return result.data;
};
