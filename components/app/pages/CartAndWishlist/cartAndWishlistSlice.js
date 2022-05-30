import {
  client__fetchCities,
  client__fetchCountries,
  client__fetchProvince,
} from "../../../../lib/api/client/clientCommon";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  client_fetchCart,
  client_fetchWishlist,
} from "../../../../lib/api/client/clientCart";
export const LOADING = "loading";
export const IDLE = "idle";
export const SUCCEEDED = "succeeded";
export const ERROR = "error";

//// selectors
export const selectStatus = (state) => state.cart_wishlist.status;
export const selectCart = (state) => state.cart_wishlist.cart;
export const selectWishListStatus = (state) =>
  state.cart_wishlist.wishListStatus;
export const selectWishList = (state) => state.cart_wishlist.wishList;
export const selectCountryId = (state) => state.cart_wishlist.countryId;
export const selectProvinceId = (state) => state.cart_wishlist.provinceId;
export const selectCityId = (state) => state.cart_wishlist.cityId;
export const selectCityText = (state) => state.cart_wishlist.cityText;
export const selectCanCheckout = (state) => state.cart_wishlist.canCheckout;
export const selectCoupon = (state) => state.cart_wishlist.coupon;
export const selectErrorMsg = (state) => state.cart_wishlist.error;
export const selectCartCount = (state) => state.cart_wishlist.cartCount;
export const selectWishCount = (state) => state.cart_wishlist.wishCount;

const initialState = {
  status: IDLE,
  error: null,
  cartCount: 0,
  wishCount: 0,
  cart: {},
  countryId: null,
  provinceId: null,
  cityId: null,
  cityText: null,
  coupon: null,
  wishList: [],
  wishListStatus: IDLE,
  canCheckout: true,
};

export const fetchCart = createAsyncThunk(
  "cart_wishlist/fetchCart",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const result = await client_fetchCart(data);
      dispatch(addCartCount(result.result ? result.result.items.length : 0));
      return result.result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchWishList = createAsyncThunk(
  "cart_wishlist/fetchWhishlist",
  async (data, { dispatch }) => {
    const result = await client_fetchWishlist();
    dispatch(addWishCount(result.result.length));
    return result.result;
  }
);

const cartSlice = createSlice({
  name: "cart_wishlist",
  initialState,
  reducers: {
    cityChanged(state, action) {
      state.cityId = action.payload.cityId;
      state.countryId = action.payload.countryId;
      state.provinceId = action.payload.provinceId;
      state.cityText = action.payload.cityText;
    },
    addCoupon(state, action) {
      state.coupon = action.payload;
    },
    addCartCount(state, action) {
      state.cartCount = action.payload;
    },
    addWishCount(state, action) {
      state.wishCount = action.payload;
    },
  },
  extraReducers: {
    [fetchCart.pending]: (state) => {
      state.status = LOADING;
    },
    [fetchCart.fulfilled]: (state, action) => {
      if (!action.payload) {
        state.cart = {
          items: [],
          itemsCount: 0,
        };
        state.status = SUCCEEDED;
        state.error = null;
        state.cityId = null;
        state.countryId = null;
        state.provinceId = null;
        state.cityText = null;
        state.canCheckout = false;
        return;
      }

      const cartItems = action.payload.items;
      let canCheckout = true;

      for (let item of cartItems) {
        if (!item.shippingAvailable) {
          canCheckout = false;
          break;
        }
        if (!item.exist) {
          canCheckout = false;
          break;
        }
      }

      state.status = SUCCEEDED;
      state.cart = action.payload;
      state.cityId = action.payload.cityId;
      state.countryId = action.payload.countryId;
      state.provinceId = action.payload.provinceId;
      state.cityText = action.payload.cityTitle;
      state.canCheckout = canCheckout;
      state.error = null;
    },
    [fetchCart.rejected]: (state, action) => {
      state.status = ERROR;
      state.error = action.payload.message;
      state.coupon = null;
    },
    [fetchWishList.pending]: (state) => {
      state.wishListStatus = LOADING;
    },
    [fetchWishList.fulfilled]: (state, action) => {
      state.wishListStatus = SUCCEEDED;
      state.wishList = action.payload;
    },
    [fetchWishList.rejected]: (state) => {
      state.wishListStatus = ERROR;
    },
  },
});

export const {
  cityChanged,
  addCoupon,
  addCartCount,
  addWishCount,
} = cartSlice.actions;

export default cartSlice.reducer;

//// cart deliverty api
export const fetchCountry = async () => {
  const result = await client__fetchCountries();
  return result.result;
};

export const fetchProvinces = async (countryId) => {
  const result = await client__fetchProvince(countryId);
  return result.result;
};

export const fetchCities = async (provinceId) => {
  const result = await client__fetchCities(provinceId);
  return result.result;
};
