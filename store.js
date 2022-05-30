import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import reducer from "./reducer";
import logger from "redux-logger";
import { createWrapper } from "next-redux-wrapper";
import thunk from "redux-thunk";

const getMiddleware = () => {
  if (process.env.NODE_ENV === "production") {
    return applyMiddleware(thunk);
  } else {
    // return applyMiddleware(logger);
    return applyMiddleware(thunk);
  }
};

const initStore = () => {
  return createStore(reducer, composeWithDevTools(getMiddleware()));
};

export const wrapper = createWrapper(initStore);
