export const searchPageFiltersDefaults = {
  type: 4,
  id: 0,
  search: "",
  goodsCreatedDay: 0,
  brandId: [],
  fromPrice: 0,
  toPrice: 0,
  justExist: false,
  pageNumber: 1,
  pageSize: 50,
  orderByType: 1,
  optionIds: [],
  getBrand: true,
  getSpecs: true,
  getChild: true,
  getParent: true,
  getAllCount: true,
  getMaxPrice: true,
};

export const searchPageQueriesDefaults = {
  type: 4,
  id: 0,
  search: "",
  goodsCreatedDay: 0,
  brandId: [],
  fromPrice: 0,
  toPrice: 0,
  justExist: false,
  pageNumber: 1,
  pageSize: 50,
  orderByType: 1,
  optionIds: [],
};

////// provider
export const providerPageFiltersDefaults = {
  type: 2, //// Category
  id: 0,
  search: "",
  goodsCreatedDay: 0,
  brandId: [],
  fromPrice: 0,
  toPrice: 0,
  justExist: false,
  pageNumber: 1,
  pageSize: 50,
  orderByType: 1,
  optionIds: [],
  getBrand: true,
  getSpecs: true,
  getChild: true,
  getParent: true,
  getAllCount: true,
  getMaxPrice: true,
  shopId: 0,
};

export const ProviderPageQueriesDefaults = {
  type: providerPageFiltersDefaults.type, //// Category
  id: providerPageFiltersDefaults.id,
  search: providerPageFiltersDefaults.search,
  goodsCreatedDay: providerPageFiltersDefaults.goodsCreatedDay,
  brandId: providerPageFiltersDefaults.brandId,
  fromPrice: providerPageFiltersDefaults.fromPrice,
  toPrice: providerPageFiltersDefaults.toPrice,
  justExist: providerPageFiltersDefaults.justExist,
  pageNumber: providerPageFiltersDefaults.pageNumber,
  pageSize: providerPageFiltersDefaults.pageSize,
  orderByType: providerPageFiltersDefaults.orderByType,
  optionIds: providerPageFiltersDefaults.optionIds,
};

export const SEARCH_TYPE_SLIDER = 1;
export const SEARCH_TYPE_CATEGORY = 2;
export const SEARCH_TYPE_MODULE = 3;
export const SEARCH_TYPE_SEARCH = 4;
export const SEARCH_TYPE_DEAL = 5;
