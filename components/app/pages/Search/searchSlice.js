import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { client_fetchSearch } from "../../../../lib/api/client/clientSearch";
import {
  searchPageFiltersDefaults,
  SEARCH_TYPE_CATEGORY,
} from "../../../../lib/querys";

export const LOADING = "loading";
export const IDLE = "idle";
export const SUCCEEDED = "succeeded";
export const ERROR = "error";

export const initialState = {
  status: IDLE,
  error: null,
  search: {
    goods: {
      count: 0,
      data: [],
    },
  },
  changeUrl: false,
  filters: searchPageFiltersDefaults,
  brands: {
    items: [],
    selected: [],
  },
};

//// selectors
export const selectFilters = (state) => state.search.filters;
export const selectGoods = (state) => state.search.search.goods;
export const selectSearch = (state) => state.search.search;
export const selectSpecs = (state) => state.search.search.specs;
export const selectBrands = (state) => state.search.brands.items;
export const selectSelectedBrands = (state) => state.search.brands.selected;
/// server action creator
export const serverSearchUpdate = createAction("search/serverUpdate");

//// thunk actions
export const fetchSearch = createAsyncThunk(
  "search/fetchSearch",
  async (data, { dispatch }) => {
    dispatch(changeUrl());
    const result = await client_fetchSearch(data);
    return result;
  }
);

/// search slice
const searchSlice = createSlice({
  name: "search",
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
    brandsChanged(state, action) {
      const id = parseInt(action.payload.brand.id);
      if (action.payload.checked) {
        state.filters.brandId.push(id);
        state.brands.selected.push(action.payload.brand);
      } else {
        // if is remove
        const newSelected = state.brands.selected.filter((brand) => {
          return brand.id != id;
        });

        const index = state.filters.brandId.indexOf(id);
        if (index > -1) {
          state.filters.brandId.splice(index, 1);
        }
        state.brands.selected = newSelected;
      }
    },
    pageChanged(state, action) {
      state.filters.pageNumber = action.payload;
    },
    mobileFilterUpdate(state, action) {
      const specsId = action.payload.specsId;
      const arrival = action.payload.arrival;
      const priceFrom = action.payload.price.min || state.filters.fromPrice;
      const priceTo = action.payload.price.max || state.filters.toPrice;
      state.filters.brandId = action.payload.brands.ids;
      state.brands.selected = action.payload.brands.selected;
      state.filters.optionIds = specsId;
      state.filters.goodsCreatedDay = parseInt(arrival);
      state.filters.fromPrice = parseInt(priceFrom);
      state.filters.toPrice = parseInt(priceTo);
      state.filters.justExist = action.payload.justExist;
    },
    categoryClick(state, action) {
      state.filters.id = action.payload;
      state.filters.type = SEARCH_TYPE_CATEGORY;
    },
    changeJustExist(state, action) {
      state.filters.justExist = action.payload;
    },
  },
  extraReducers: {
    [fetchSearch.pending]: (state, action) => {
      state.status = LOADING;
    },
    [fetchSearch.fulfilled]: (state, action) => {
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
      state.search = result;
    },
    [fetchSearch.rejected]: (state, action) => {
      state.status = ERROR;
    },

    [serverSearchUpdate]: (state, action) => {
      const result = action.payload.search;
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
      // generate selected brands
      let selectedBrands = [];
      action.payload.brands?.forEach((brand) => {
        selectedBrands.push({ value: brand.brandTitle, id: brand.brandId });
      });

      result.brands = newBrands;
      result.specs = newSpecs;
      state.status = SUCCEEDED;
      state.search = result;
      state.filters = action.payload.filters;
      state.brands.selected = selectedBrands;
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
  brandsChanged,
  pageChanged,
  mobileFilterUpdate,
  categoryClick,
  changeJustExist,
} = searchSlice.actions;

export const orderByTypeAddedAction = (orderType) => {
  return (dispatch, getState) => {
    dispatch(orderByTypeAdded(orderType));
    dispatch(fetchSearch(selectFilters(getState())));
  };
};

export const pageSizeAddedAction = (pageSize) => {
  return (dispatch, getState) => {
    dispatch(pageSizeAdded(pageSize));
    dispatch(fetchSearch(selectFilters(getState())));
  };
};

export const priceAddedAction = (from, to) => {
  return (dispatch, getState) => {
    dispatch(priceAdded({ fromPrice: from, toPrice: to }));
    dispatch(fetchSearch(selectFilters(getState())));
  };
};

export const goodsCreatedDayAddedAction = (goodsCreatedDay) => {
  return (dispatch, getState) => {
    if (!goodsCreatedDay)
      goodsCreatedDay = initialState.filters.goodsCreatedDay;
    dispatch(goodsCreatedDayAdded(parseInt(goodsCreatedDay)));
    dispatch(fetchSearch(selectFilters(getState())));
  };
};

export const goodsOptionsAddedAction = (options) => {
  return (dispatch, getState) => {
    dispatch(goodsOptionsAdded(options));
    dispatch(fetchSearch(selectFilters(getState())));
  };
};

export const brandsChangedAction = (brand, checked) => {
  return (dispatch, getState) => {
    dispatch(brandsChanged({ brand, checked }));
    dispatch(fetchSearch(selectFilters(getState())));
  };
};

export const brandsRemovedAction = (id) => {
  return (dispatch, getState) => {
    const curr_state = getState();
    const newBrands = selectFilters(curr_state).brandId.filter((brandId) => {
      return brandId !== id;
    });

    dispatch(brandAdded(newBrands));
    dispatch(fetchSearch(selectFilters(getState())));
  };
};

export const pageChangedAction = (pageNumber) => {
  return (dispatch, getState) => {
    dispatch(pageChanged(pageNumber));
    dispatch(fetchSearch(selectFilters(getState())));
  };
};

export const mobileFilterUpdateAction = (newFilters) => {
  return (dispatch, getState) => {
    dispatch(mobileFilterUpdate(newFilters));
    dispatch(fetchSearch(selectFilters(getState())));
  };
};

export const categoryClickAction = (catId) => {
  return (dispatch, getState) => {
    dispatch(categoryClick(catId));
    // dispatch(fetchSearch(selectFilters(getState())));
  };
};

export const justExistClickAction = (exist) => {
  return (dispatch, getState) => {
    dispatch(changeJustExist(exist));
    dispatch(fetchSearch(selectFilters(getState())));
  };
};

export default searchSlice.reducer;
