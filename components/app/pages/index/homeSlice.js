import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client_fetchHome } from "./../../../../lib/api/client/clientHome";
export const LOADING = "loading";
export const IDLE = "idle";
export const SUCCEEDED = "succeeded";
export const ERROR = "error";

//// selectors
export const selectSlider = (state) => state.home.home.slider;
export const selectStatus = (state) => state.home.status;
export const selectHome = (state) => state.home.home;

const initialState = {
  status: IDLE,
  error: null,
  home: {},
};

export const fetchHome = createAsyncThunk("home/fetchHome", async () => {
  const result = await client_fetchHome();
  return result.result;
});

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchHome.pending]: (state) => {
      state.status = LOADING;
    },
    [fetchHome.fulfilled]: (state, action) => {
      state.status = SUCCEEDED;
      state.home = action.payload;
    },
    [fetchHome.rejected]: (state) => {
      state.status = ERROR;
    },
  },
});

export default homeSlice.reducer;
