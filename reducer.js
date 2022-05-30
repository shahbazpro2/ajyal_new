import { combineReducers } from "redux";
// import { connectRouter } from 'connected-react-router';
import { appConfigReducer } from "./appConfigSlice";
import { HYDRATE } from "next-redux-wrapper";
import homeReducer from "./components/app/pages/index/homeSlice";
import searchReducer from "./components/app/pages/Search/searchSlice";
import goodDetailReducer from "./components/app/pages/GoodDetail/GoodDetailSlice";
import categoryReducer from "./components/app/pages/Categories/categorySlice";
import providerReducer from "./components/app/pages/Provider/providerSlice";
import cartReducer from "./components/app/pages/CartAndWishlist/cartAndWishlistSlice";

const combinedReducer = combineReducers({
  appConfig: appConfigReducer,
  home: homeReducer,
  search: searchReducer,
  goodDetail: goodDetailReducer,
  category: categoryReducer,
  provider: providerReducer,
  cart_wishlist: cartReducer,
});

const reducer = (state, action) => {
  if (action.type === HYDRATE) {
    let nextState = {
      ...state,
      ...action.payload,
    };

    if (state.home) nextState.home = state.home;
    if (state.appConfig.login.isLogin)
      nextState.appConfig.login = state.appConfig.login;

    if (state.appConfig.login.prevLink) {
      nextState.appConfig.login.prevLink = state.appConfig.login.prevLink;
    }

   // nextState.cart_wishlist.cartCount = state.cart_wishlist.cartCount;
    //nextState.cart_wishlist.wishCount = state.cart_wishlist.wishCount;

    return nextState;
  } else {
    return combinedReducer(state, action);
  }
};

export default reducer;
