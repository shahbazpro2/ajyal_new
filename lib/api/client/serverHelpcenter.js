import logger from "../../serverlogger";
import axiosClient from "../axios";

export const server_fetchHelp = async () => {
  const errorSchema = {
    result: "",
    status: null,
  };

  const axios = axiosClient.getAxios();
  try {
    const result = await axios.get(`/Home/Help`);
    logger.http("successful result from /Home/Help");
    return result.data;
  } catch (err) {
    errorSchema.status = parseInt(err.response.status);
    logger.error(JSON.stringify(err));
    return errorSchema;
  }
};

export const server_fetchParentTopic = async (topicId) => {
  const errorSchema = {
    result: "",
    status: null,
  };

  const axios = axiosClient.getAxios();
  try {
    const result = await axios.get(`/Home/HelpParentTopic/${topicId}`);
    logger.http(`successful result from /Home/HelpParentTopic/${topicId}`);
    return result.data;
  } catch (err) {
    errorSchema.status = parseInt(err.response.status);
    logger.error(JSON.stringify(err));
    return errorSchema;
  }
};

export const server_fetchTopic = async (topicId) => {
  const errorSchema = {
    result: "",
    status: null,
  };

  const axios = axiosClient.getAxios();
  try {
    const result = await axios.get(`/Home/HelpTopic/${topicId}`);
    logger.http(`successful result from /Home/HelpTopic/${topicId}`);
    return result.data;
  } catch (err) {
    errorSchema.status = parseInt(err.response.status);
    logger.error(JSON.stringify(err));
    return errorSchema;
  }
};

export const server_fetchArticle = async (articleId) => {
  const errorSchema = {
    result: "",
    status: null,
  };

  const axios = axiosClient.getAxios();
  try {
    const result = await axios.get(`/Home/HelpArticle/${articleId}`);
    logger.http(`successful result from /Home/HelpArticle/${articleId}`);
    return result.data;
  } catch (err) {
    errorSchema.status = parseInt(err.response.status);
  
    logger.error(JSON.stringify(err));
    return errorSchema;
  }
};

export const server_fetchImage = async () => {
  const errorSchema = {
    result: "",
    status: null,
  };

  const axios = axiosClient.getAxios();
  try {
    const result = await axios.get(`/Home/GetHelpImage`);
    logger.http(`successful result from /Home/GetHelpImage`);
    return result.data;
  } catch (err) {
    errorSchema.status = parseInt(err.response?.status);
    logger.error(JSON.stringify(err));
    return errorSchema;
  }
};
