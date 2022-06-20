import {
  searchPageFiltersDefaults,
  providerPageFiltersDefaults,
  ProviderPageQueriesDefaults,
  searchPageQueriesDefaults,
} from "./querys";
const queryString = require("query-string");

export const parseQueryArray = (query) => {
  const arr = queryString.parse(`test=${query}`, {
    arrayFormat: "comma",
    parseNumbers: true,
  });
  if (!Array.isArray(arr.test)) {
    return [arr.test];
  }
  return arr.test;
};

export const searchQueryToFilters = (query) => {
  let newFilters = {};
  if (query["type"]) newFilters["type"] = parseInt(query["type"]);
  if (query["id"]) newFilters["id"] = parseInt(query["id"]);
  if (query["search"]) newFilters["search"] = query["search"];
  if (query["goodsCreatedDay"])
    newFilters["goodsCreatedDay"] = parseInt(query["goodsCreatedDay"]);
  if (query["brandId"])
    newFilters["brandId"] = parseQueryArray(query["brandId"]);
  if (query["fromPrice"])
    newFilters["fromPrice"] = parseInt(query["fromPrice"]);
  if (query["toPrice"]) newFilters["toPrice"] = parseInt(query["toPrice"]);
  if (query["justExist"]) newFilters["justExist"] = query["justExist"];
  if (query["pageNumber"])
    newFilters["pageNumber"] = parseInt(query["pageNumber"]);
  if (query["pageSize"]) {
    newFilters["pageSize"] = parseInt(query["pageSize"]);
    if (newFilters["pageSize"] > 70) {
      newFilters["pageSize"] = 70;
    }
  }
  if (query["orderByType"])
    newFilters["orderByType"] = parseInt(query["orderByType"]);
  if (query["optionIds"])
    newFilters["optionIds"] = parseQueryArray(query["optionIds"]);

  return {
    ...searchPageFiltersDefaults,
    ...newFilters,
  };
};

export const searchFiltersToQuery = (filters) => {
  const queryParam = {
    type:
      filters.type !== searchPageQueriesDefaults.type
        ? filters.type
        : undefined,
    id: filters.id !== searchPageQueriesDefaults.id ? filters.id : undefined,
    search:
      filters.search !== searchPageQueriesDefaults.search
        ? filters.search
        : undefined,
    goodsCreatedDay:
      filters.goodsCreatedDay !== searchPageQueriesDefaults.goodsCreatedDay
        ? filters.goodsCreatedDay
        : undefined,
    brandId: filters.brandId.length !== 0 ? filters.brandId : undefined,
    fromPrice:
      filters.fromPrice !== searchPageQueriesDefaults.fromPrice
        ? filters.fromPrice
        : undefined,
    toPrice:
      filters.toPrice !== searchPageQueriesDefaults.toPrice
        ? filters.toPrice
        : undefined,
    justExist:
      filters.justExist !== searchPageQueriesDefaults.justExist
        ? filters.justExist
        : undefined,
    pageNumber:
      filters.pageNumber !== searchPageQueriesDefaults.pageNumber
        ? filters.pageNumber
        : undefined,
    pageSize:
      filters.pageSize !== searchPageQueriesDefaults.pageSize
        ? filters.pageSize
        : undefined,
    orderByType:
      filters.orderByType !== searchPageQueriesDefaults.orderByType
        ? filters.orderByType
        : undefined,
    optionIds:
      filters.optionIds !== searchPageQueriesDefaults.optionIds
        ? filters.optionIds
        : undefined,
  };

  return queryParam;
};

export const providerQueryToFilters = (query) => {
  let newFilters = {};
  // if (query["type"]) newFilters["type"] = parseInt(query["type"]);
  if (query["id"]) newFilters["id"] = parseInt(query["id"]);
  // if (query["search"]) newFilters["search"] = (query["search"]);
  if (query["goodsCreatedDay"])
    newFilters["goodsCreatedDay"] = parseInt(query["goodsCreatedDay"]);
  if (query["brandId"])
    newFilters["brandId"] = parseQueryArray(query["brandId"]);
  if (query["fromPrice"])
    newFilters["fromPrice"] = parseInt(query["fromPrice"]);
  if (query["toPrice"]) newFilters["toPrice"] = parseInt(query["toPrice"]);
  if (query["justExist"]) newFilters["justExist"] = query["justExist"];
  if (query["pageNumber"])
    newFilters["pageNumber"] = parseInt(query["pageNumber"]);
  if (query["pageSize"]) {
    newFilters["pageSize"] = parseInt(query["pageSize"]);
    if (newFilters["pageSize"] > 70) {
      newFilters["pageSize"] = 70;
    }
  }
  if (query["orderByType"])
    newFilters["orderByType"] = parseInt(query["orderByType"]);
  if (query["optionIds"])
    newFilters["optionIds"] = parseQueryArray(query["optionIds"]);

  return {
    ...providerPageFiltersDefaults,
    ...newFilters,
  };
};

export const providerFiltersToQuery = (filters) => {
  let newQuery = {};
  //////////////////////
  if (filters["id"] !== ProviderPageQueriesDefaults["id"])
    newQuery["id"] = parseInt(filters["id"]);
  //////////////////////
  if (
    filters["goodsCreatedDay"] !==
    ProviderPageQueriesDefaults["goodsCreatedDay"]
  )
    newQuery["goodsCreatedDay"] = parseInt(filters["goodsCreatedDay"]);
  //////////////////////
  if (filters["brandId"].length !== 0) newQuery["brandId"] = filters["brandId"];
  //////////////////////
  if (filters["fromPrice"] !== ProviderPageQueriesDefaults["fromPrice"])
    newQuery["fromPrice"] = parseInt(filters["fromPrice"]);
  //////////////////////
  if (filters["toPrice"] !== ProviderPageQueriesDefaults["toPrice"])
    newQuery["toPrice"] = parseInt(filters["toPrice"]);
  /////////////////////
  // if (query["justExist"]) newFilters["justExist"] = query["justExist"];
  /////////////////////
  if (filters["pageNumber"] !== ProviderPageQueriesDefaults["pageNumber"])
    newQuery["pageNumber"] = parseInt(filters["pageNumber"]);
  /////////////////////
  if (filters["pageSize"] !== ProviderPageQueriesDefaults["pageSize"])
    newQuery["pageSize"] = parseInt(filters["pageSize"]);
  //////////////////////
  if (filters["orderByType"] !== ProviderPageQueriesDefaults["orderByType"])
    newQuery["orderByType"] = parseInt(filters["orderByType"]);
  ///////////////////////////
  if (filters["optionIds"].length !== 0)
    newQuery["optionIds"] = filters["optionIds"];

  return newQuery;
};
