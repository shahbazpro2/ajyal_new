import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { client_fetchCategory } from "../../../../lib/api/client/clientCategory";
export const LOADING = "loading";
export const IDLE = "idle";
export const SUCCEEDED = "succeeded";
export const ERROR = "error";

const initialState = {
  status: IDLE,
  error: null,
  catId: null,
  category: {},
};

//// categories selectors
export const selectCatId = (state) => state.category.catId;
export const selectwebHomeModuleList = (state) =>
  state.category.category.webHomeModuleList;
export const selectSlider = (state) => state.category.category.slider;
export const selectCategoryStatus = (state) => state.category.status;
export const selectBrands = (state) =>
  state.category.category?.category?.websiteBrand;
export const selectCats = (state) => state.category.category?.category?.childs;
export const selectCatTitle = (state) =>
  state.category.category?.category?.categoryTitle;

export const setCatId = createAction("category/setCatId");

export const fetchCategory = createAsyncThunk(
  "category/fetchCategory",
  async (catId, { dispatch }) => {
    const result = await client_fetchCategory(catId);
    dispatch(setCatId(parseInt(catId)));
    return result.result;
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchCategory.pending]: (state) => {
      state.status = LOADING;
    },
    [fetchCategory.fulfilled]: (state, action) => {
      state.status = SUCCEEDED;
      state.category = action.payload;
    },
    [fetchCategory.rejected]: (state) => {
      state.status = ERROR;
    },
    [setCatId]: (state, action) => {
      state.catId = action.payload;
    },
  },
});

export default categorySlice.reducer;
