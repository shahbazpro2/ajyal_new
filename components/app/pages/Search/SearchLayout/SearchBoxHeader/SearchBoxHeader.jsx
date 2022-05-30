import React from "react";
import Dropdown from "react-dropdown";
import { Translate, withLocalize } from "react-localize-redux";
import { Desktops, DesktopsAndBigger } from "../../../../../../Responsive";
// import "./SearchBoxHeader.scss";
// import "./SearchBoxHeader-rtl.scss";
import { Filter } from "..";
import { ReactComponent as RowItemIcon } from "./../../../../../../assets/icons/menu.svg";
import { ReactComponent as GridItemIcon } from "./../../../../../../assets/icons/cols-view.svg";
import { ReactComponent as FilterIcon } from "./../../../../../../assets/icons/mobile/filter.svg";
import { ReactComponent as Popularity } from "./../../../../../../assets/icons/mobile/Popularity.svg";
import {
  initialState,
  orderByTypeAddedAction,
  pageSizeAddedAction,
  selectFilters,
  selectGoods,
  priceAddedAction,
  goodsCreatedDayAddedAction,
  selectSpecs,
  brandsRemovedAction,
  brandsChangedAction,
  selectSelectedBrands,
  justExistClickAction,
} from "../../searchSlice";
import { connect } from "react-redux";
import { selectLang } from "../../../../../../appConfigSlice";
import FiltersData from "../../../../filters/filtersData";
import {
  searchPageQueriesDefaults,
  SEARCH_TYPE_DEAL,
  SEARCH_TYPE_SEARCH,
} from "../../../../../../lib/querys";
import classnames from "classnames";

class SearchBoxHeader extends React.Component {
  constructor(props) {
    super(props);
    const filtersData = new FiltersData(this.props.translate);
    this.sortedBy = filtersData.sortedBy;
    this.perPage = filtersData.perPage;
    this.newArrivals = filtersData.arrivals;
  }

  renderFilters = () => {
    const filtersItem = [];
    const filters = this.props.filters;
    const initialFilter = searchPageQueriesDefaults;

    /// from price - to price filter
    if (
      filters["fromPrice"] !== initialFilter["fromPrice"] ||
      filters["toPrice"] !== initialFilter["toPrice"]
    ) {
      filtersItem.push(
        <Filter
          key={filtersItem.length + 1}
          name={this.props.translate("searchAside.Price")}
          value={`${filters.fromPrice} - ${filters.toPrice}`}
          onClose={() => {
            this.props.priceAddedAction(
              initialFilter["fromPrice"],
              initialFilter["toPrice"]
            );
          }}
        />
      );
    }

    //// goods created day filter
    if (filters["goodsCreatedDay"] !== initialFilter["goodsCreatedDay"]) {
      let currGoodsCreatedDay;
      for (let key in this.newArrivals) {
        if (this.newArrivals[key].value === filters["goodsCreatedDay"]) {
          currGoodsCreatedDay = this.newArrivals[key];
          break;
        }
      }

      filtersItem.push(
        <Filter
          key={filtersItem.length + 1}
          name={this.props.translate("searchAside.NewArrivals")}
          value={currGoodsCreatedDay.title}
          onClose={() => {
            this.props.goodsCreatedDayAddedAction(
              initialFilter["goodsCreatedDay"]
            );
          }}
        />
      );
    }

    //// options filter
    if (filters["optionIds"].length > 0) {
      const specs = this.props.specs;
      const optionsId = filters["optionIds"];
      for (let id of optionsId) {
        for (let key in specs) {
          if (specs[key].options[id]) {
            filtersItem.push(
              <Filter
                key={filtersItem.length + 1}
                name={specs[key].specTitle}
                value={specs[key].options[id].optionTitle}
                onClose={() => {
                  let selectedIds = this.props.specSelected[specs[key].specId];
                  selectedIds = selectedIds.filter((optionId) => {
                    return optionId !== specs[key].options[id].optionId;
                  });
                  this.props.handleSpecSelect(specs[key].specId, selectedIds);
                }}
              />
            );
          }
        }
      }
    }

    /// brands filter
    if (this.props.brands.length > 0) {
      const brands = this.props.brands;
      for (let brand of brands) {
        filtersItem.push(
          <Filter
            key={filtersItem.length + 1}
            name={<Translate id="searchAside.Brand" />}
            value={brand.value}
            onClose={() => {
              this.props.brandsChangedAction(brand, false);
            }}
          />
        );
      }
    }

    // just exists
    if (filters["justExist"]) {
      filtersItem.push(
        <Filter
          key={filtersItem.length + 1}
          name={<Translate id="just-exist" />}
          value={""}
          onClose={() => {
            this.props.justExistClickAction(false);
          }}
        />
      );
    }

    return filtersItem;
  };

  render() {
    const filters = this.renderFilters();
    return (
      <div>
        <section className="searchBoxHeader">
          <div className="searchBoxHeader__left-container">
            {this.props.filters.search &&
              this.props.filters.type === SEARCH_TYPE_SEARCH && (
                <>
                  <span className="searchBoxHeader__header-text d-none rtl-d-inline">
                    <Translate id="found" />
                  </span>
                  <span className="searchBoxHeader__header-text searchBoxHeader__header-text--bold">
                    {this.props.resultCount}
                  </span>
                  <span className="searchBoxHeader__header-text">
                    <Translate id="resualtfound" />
                  </span>
                  <span className="searchBoxHeader__header-text searchBoxHeader__header-text--bold">
                    {this.props.filters.search}
                  </span>
                </>
              )}
          </div>
          <div className="searchBoxHeader__right-container">
            {/* {this.props.filters.type != SEARCH_TYPE_DEAL && ( */}
            <>
              <span className="searchBoxHeader__header-text align-center">
                <Translate id="sortby" />
              </span>
              <Dropdown
                onChange={(data) => {
                  this.props.orderByTypeAddedAction(data.value);
                }}
                placeholder={<Translate id="sortbySelect" />}
                options={this.sortedBy}
                value={this.sortedBy[this.props.orderByType + 1]}
              />
            </>
            {/* )} */}
            <span className="searchBoxHeader__header-text align-center">
              <Translate id="display" />
            </span>
            <Dropdown
              onChange={(data) => {
                this.props.pageSizeAddedAction(data.value);
              }}
              options={this.perPage}
              value={this.perPage[0]}
            />
            <span className="searchBoxHeader__header-text align-center">
              {this.props.currentView ? (
                <Translate id="row" />
              ) : (
                  <Translate id="grid" />
                )}
            </span>
            <a
              onClick={this.props.viewHandler}
              href="/#"
              className="searchBoxHeader__row-icon-con"
            >
              {this.props.currentView ? (
                <RowItemIcon className="searchBoxHeader__row-icon" />
              ) : (
                  <GridItemIcon className="searchBoxHeader__row-icon" />
                )}
            </a>
          </div>
          <div className="searchBoxHeader__btm-container">
            {filters.length > 0 && (
              <span className="searchBoxHeader__header-text align-center">
                <Translate id="filter" />
              </span>
            )}
            {filters}
          </div>
          <Desktops className="w-100">
            <section
              className={classnames("searchBoxHeader-mobile mt-4", {
                "searchBoxHeader-mobile--deal":
                  this.props.filters.type == SEARCH_TYPE_DEAL,
              })}
            >
              <div
                onClick={() => this.props.showFilter(false)}
                className="searchBoxHeader-mobile__items searchBoxHeader-mobile-filter"
              >
                <FilterIcon />
                <span>
                  <Translate id="filter2" />
                </span>
              </div>
              {this.props.filters.type != SEARCH_TYPE_DEAL && (
                <div
                  onClick={() => this.props.showFilter(true)}
                  className="searchBoxHeader-mobile__items searchBoxHeader-mobile-popularity"
                >
                  <Popularity />
                  <span>
                    <Translate id="popularity" />
                  </span>
                </div>
              )}
              <div
                onClick={this.props.viewHandler}
                className="searchBoxHeader-mobile__items searchBoxHeader-mobile-row"
              >
                <span>
                  {this.props.currentView ? (
                    <RowItemIcon className="searchBoxHeader__row-icon" />
                  ) : (
                      <GridItemIcon className="searchBoxHeader__row-icon" />
                    )}
                </span>

                <span>
                  {this.props.currentView ? (
                    <Translate id="row" />
                  ) : (
                      <Translate id="grid" />
                    )}
                </span>
              </div>
            </section>
          </Desktops>
        </section>
        <Desktops className="w-100">
          <div className="searchBoxHeader__mobile-filter-box mb-3 p-1">
            {filters}
          </div>
        </Desktops>
      </div>
    );
  }
}

const mapDispatchToProps = {
  orderByTypeAddedAction,
  pageSizeAddedAction,
  priceAddedAction,
  goodsCreatedDayAddedAction,
  brandsChangedAction,
  justExistClickAction,
};

const mapStateToProps = (state) => {
  return {
    lang: selectLang(state),
    resultCount: selectGoods(state)?.count,
    filters: selectFilters(state),
    orderByTypeId: selectFilters(state).orderByType,
    specs: selectSpecs(state),
    brands: selectSelectedBrands(state),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withLocalize(SearchBoxHeader));
