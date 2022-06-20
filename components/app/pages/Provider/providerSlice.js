import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { client_fetchProvider } from "../../../../lib/api/client/clientProvider";
import { providerPageFiltersDefaults } from "../../../../lib/querys";

export const LOADING = "loading";
export const IDLE = "idle";
export const SUCCEEDED = "succeeded";
export const ERROR = "error";

export const initialState = {
  status: IDLE,
  error: null,
  provider: {
    goods: {
      count: 0,
      data: [],
    },
  },
  providerName: "",
  changeUrl: false,
  filters: providerPageFiltersDefaults,
};

//// selectors
export const selectFilters = (state) => state.provider.filters;
export const selectGoods = (state) => state.provider.provider.goods || {};
export const selectProvider = (state) => state.provider.provider;
// export const selectSearch = (state) => state.provider.provider;
export const selectSpecs = (state) => state.provider.provider.specs;
export const selectBrands = (state) => state.provider.provider.brands;
export const selectShop = (state) => state.provider.provider.shop;
export const selectShopSlider = (state) =>
  state.provider.provider.shop.shopSlider;
export const selectChangeUrl = (state) => state.provider.changeUrl;
export const selectParentCategory = (state) =>
  state.provider.provider.parentCategory;
export const selectChildCategory = (state) =>
  state.provider.provider.childCategory;
export const selectProviderName = (state) => state.provider.providerName;
export const selectProviderStatus = (state) => state.provider.status;

/// server action creator
export const serverProviderUpdate = createAction("provider/serverUpdate");

//// thunk actions
export const fetchProvider = createAsyncThunk(
  "provider/fetchProvider",
  async (data, { dispatch, getState }) => {
    dispatch(changeUrl());
    const result = await client_fetchProvider(
      data,
      selectProviderName(getState())
    );
    return result;
  }
);

/// search slice
const providerSlice = createSlice({
  name: "provider",
  initialState,
  reducers: {
    changeUrl(state) {
      state.changeUrl = !state.changeUrl;
    },
    orderByTypeAdded(state, action) {
      state.filters.orderByType = action.payload;
    },
    pageSizeAdded(state, action) {
      state.filters.pageSize = action.payload;
    },
    priceAdded(state, action) {
      state.filters.fromPrice = action.payload.fromPrice;
      state.filters.toPrice = action.payload.toPrice;
    },
    goodsCreatedDayAdded(state, action) {
      state.filters.goodsCreatedDay = action.payload;
    },
    goodsOptionsAdded(state, action) {
      state.filters.optionIds = action.payload;
    },
    brandAdded(state, action) {
      state.filters.brandId = action.payload;
    },
    pageChanged(state, action) {
      state.filters.pageNumber = action.payload;
    },
    mobileFilterUpdate(state, action) {
      const brandsId = action.payload.brandsId;
      const specsId = action.payload.specsId;
      const arrival = action.payload.arrival;
      const priceFrom = action.payload.price.min || state.filters.fromPrice;
      const priceTo = action.payload.price.max || state.filters.toPrice;
      state.filters.brandId = brandsId;
      state.filters.optionIds = specsId;
      state.filters.goodsCreatedDay = parseInt(arrival);
      state.filters.fromPrice = parseInt(priceFrom);
      state.filters.toPrice = parseInt(priceTo);
    },
  },
  extraReducers: {
    [fetchProvider.pending]: (state, action) => {
      state.status = LOADING;
    },
    [fetchProvider.fulfilled]: (state, action) => {
      state.status = SUCCEEDED;
      const result = action.payload.result;
      //// generate optimize specs
      const newSpecs = {};
      result.specs?.forEach((spec) => {
        const newOptions = {};
        spec.options?.forEach((option) => {
          newOptions[option.optionId] = option;
        });

        newSpecs[spec.specId] = { ...spec, options: newOptions };
      });
      //// generate optimized brands
      const newBrands = {};
      result.brands?.forEach((brand) => {
        newBrands[brand.brandId] = brand;
      });

      result.specs = newSpecs;
      result.brands = newBrands;
      state.provider = result;
    },
    [fetchProvider.rejected]: (state, action) => {
      state.status = ERROR;
    },
    [serverProviderUpdate]: (state, action) => {
      const result = action.payload.provider;
      const newSpecs = {};
      result.specs?.forEach((spec) => {
        const newOptions = {};
        spec.options?.forEach((option) => {
          newOptions[option.optionId] = option;
        });

        newSpecs[spec.specId] = { ...spec, options: newOptions };
      });

      //// generate optimized brands
      const newBrands = {};
      result.brands?.forEach((brand) => {
        newBrands[brand.brandId] = brand;
      });

      result.brands = newBrands;
      result.specs = newSpecs;
      state.status = SUCCEEDED;
      state.provider = result;
      state.filters = action.payload.filters;
      state.providerName = action.payload.providerName;
    },
  },
});

export const {
  orderByTypeAdded,
  pageSizeAdded,
  priceAdded,
  goodsCreatedDayAdded,
  changeUrl,
  goodsOptionsAdded,
  brandAdded,
  mobileFilterUpdate,
  pageChanged,
} = providerSlice.actions;

export const orderByTypeAddedAction = (orderType) => {
  return (dispatch, getState) => {
    dispatch(orderByTypeAdded(orderType));
    dispatch(fetchProvider(selectFilters(getState())));
  };
};

export const pageSizeAddedAction = (pageSize) => {
  return (dispatch, getState) => {
    dispatch(pageSizeAdded(pageSize));
    dispatch(fetchProvider(selectFilters(getState())));
  };
};

export const priceAddedAction = (from, to) => {
  return (dispatch, getState) => {
    dispatch(priceAdded({ fromPrice: from, toPrice: to }));
    dispatch(fetchProvider(selectFilters(getState())));
  };
};

export const goodsCreatedDayAddedAction = (goodsCreatedDay) => {
  return (dispatch, getState) => {
    if (!goodsCreatedDay)
      goodsCreatedDay = initialState.filters.goodsCreatedDay;
    dispatch(goodsCreatedDayAdded(parseInt(goodsCreatedDay)));
    dispatch(fetchProvider(selectFilters(getState())));
  };
};

export const goodsOptionsAddedAction = (options) => {
  return (dispatch, getState) => {
    dispatch(goodsOptionsAdded(options));
    dispatch(fetchProvider(selectFilters(getState())));
  };
};

export const BrandAddedAction = (brands) => {
  return (dispatch, getState) => {
    dispatch(brandAdded(brands));
    dispatch(fetchProvider(selectFilters(getState())));
  };
};

export const brandsRemovedAction = (id) => {
  return (dispatch, getState) => {
    const curr_state = getState();
    const newBrands = selectFilters(curr_state).brandId.filter((brandId) => {
      return brandId !== id;
    });

    dispatch(brandAdded(newBrands));
    dispatch(fetchProvider(selectFilters(getState())));
  };
};

export const pageChangedAction = (pageNumber) => {
  return (dispatch, getState) => {
    dispatch(pageChanged(pageNumber));
    dispatch(fetchProvider(selectFilters(getState())));
  };
};

export const mobileFilterUpdateAction = (newFilters) => {
  return (dispatch, getState) => {
    dispatch(mobileFilterUpdate(newFilters));
    dispatch(fetchProvider(selectFilters(getState())));
  };
};

export default providerSlice.reducer;
