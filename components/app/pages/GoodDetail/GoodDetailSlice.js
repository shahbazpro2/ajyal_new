import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client__fetchCities, client__fetchCountries , client__fetchProvince } from "../../../../lib/api/client/clientCommon";
import {
  client_fetchComment,
  client_fetchSpecefi,
  client__getPostMethod,
} from "../../../../lib/api/client/clientGoodDetail";

export const LOADING = "loading";
export const IDLE = "idle";
export const SUCCEEDED = "succeeded";
export const ERROR = "error";

export const initialState = {
  status: IDLE,
  error: null,
  comment: {
    status: IDLE,
    error: null,
  },
  specifi: {
    status: IDLE,
    error: null,
  },
};

//// selectors
export const selectCommnetStatus = (state) => state.goodDetail.comment.status;
export const selectSpecifiStatus = (state) => state.goodDetail.specifi.status;
//// thunk actions
export const fetchComment = createAsyncThunk(
  "goodDetail/fetchComment",
  async (params) => {
    const result = await client_fetchComment(
      params.pageSize,
      params.pageNumber,
      params.id
    );
    return result;
  }
);

export const fetchSpecifi = createAsyncThunk(
  "goodDetail/fetchSpecifi",
  async (goodId) => {
    const result = await client_fetchSpecefi(goodId);
    return result;
  }
);

/// goodDetailSlice slice
const goodDetailSlice = createSlice({
  name: "goodDetail",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchComment.pending]: (state) => {
      state.comment.status = LOADING;
    },
    [fetchComment.fulfilled]: (state) => {
      state.comment.status = SUCCEEDED;
    },
    [fetchComment.rejected]: (state, action) => {
      state.comment.status = ERROR;
      state.comment.error = action.payload;
    },
    /// specification thunk
    [fetchSpecifi.pending]: (state) => {
      state.specifi.status = LOADING;
    },
    [fetchSpecifi.fulfilled]: (state) => {
      state.specifi.status = SUCCEEDED;
    },
    [fetchSpecifi.rejected]: (state, action) => {
      state.specifi.status = ERROR;
      state.specifi.error = action.payload;
    },
  },
});

//// goodDetial aside api
export const fetchCountry = async () => {
  const result = await client__fetchCountries();
  return result.result;
};

export const fetchCities = async (provinceId) => {
  const result = await client__fetchCities(provinceId);
  return result.result;
};

export const fetchProvinces = async (countryId) => {
  const result = await client__fetchProvince(countryId);
  return result.result;
};

export const getPostMethod = async ({ shopId, countryId, cityId , provinceId}) => {
  const result = await client__getPostMethod(shopId, countryId, cityId , provinceId);
  return result.result;
};
export default goodDetailSlice.reducer;
