import React from "react";
import Dropdown from "react-dropdown";
import { Translate, withLocalize } from "react-localize-redux";
import { Desktops } from "../../../../../../Responsive";
// import "./SearchBoxHeader.scss";
// import "./SearchBoxHeader-rtl.scss";
import { ReactComponent as RowItemIcon } from "./../../../../../../assets/icons/menu.svg";
import { ReactComponent as GridItemIcon } from "./../../../../../../assets/icons/cols-view.svg";
import { ReactComponent as FilterIcon } from "./../../../../../../assets/icons/mobile/filter.svg";
import { ReactComponent as Popularity } from "./../../../../../../assets/icons/mobile/Popularity.svg";
import {
  orderByTypeAddedAction,
  pageSizeAddedAction,
  selectFilters,
  selectGoods,
  priceAddedAction,
  goodsCreatedDayAddedAction,
  selectSpecs,
  brandsRemovedAction,
  selectBrands,
} from "../../providerSlice";
import { connect } from "react-redux";
import { selectLang } from "../../../../../../appConfigSlice";
import FiltersData from "../../../../filters/filtersData";
import { ProviderPageQueriesDefaults } from "../../../../../../lib/querys";
import { Filter } from "../../../Search/SearchLayout";

class ProviderBoxHeader extends React.Component {
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
    const initialFilter = ProviderPageQueriesDefaults;

    /// from price - to price filter
    if (
      filters["fromPrice"] !== initialFilter["fromPrice"] ||
      filters["toPrice"] !== initialFilter["toPrice"]
    ) {
      filtersItem.push(
        <Filter
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
    if (filters["brandId"].length > 0) {
      const brands = this.props.brands;
      const brandsId = filters["brandId"];
      for (let id of brandsId) {
        if (brands[id])
          filtersItem.push(
            <Filter
              name={<Translate id="searchAside.Brand" />}
              value={brands[id].brandTitle}
              onClose={() => {
                this.props.brandsRemovedAction(brands[id].brandId);
              }}
            />
          );
      }
    }

    return filtersItem;
  };

  render() {
    const filters = this.renderFilters();
    return (
      <div>
        <section className="searchBoxHeader">
          <div className="searchBoxHeader__left-container"></div>
          <div className="searchBoxHeader__right-container">
            <span className="searchBoxHeader__header-text align-center">
              <Translate id="sortby" />
            </span>
            <Dropdown
              onChange={(data) => {
                this.props.orderByTypeAddedAction(data.value);
              }}
              options={this.sortedBy}
              value={this.sortedBy[this.props.orderByType + 1]}
              placeholder={<Translate id="sortbySelect" />}
            />
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
            <section className="searchBoxHeader-mobile mt-4">
              <div
                onClick={() => this.props.showFilter(false)}
                className="searchBoxHeader-mobile__items searchBoxHeader-mobile-filter"
              >
                <FilterIcon />
                <span>
                  <Translate id="filter" />
                </span>
              </div>
              <div
                onClick={() => this.props.showFilter(true)}
                className="searchBoxHeader-mobile__items searchBoxHeader-mobile-popularity"
              >
                <Popularity />
                <span>
                  <Translate id="popularity" />
                </span>
              </div>
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
  brandsRemovedAction,
};

const mapStateToProps = (state) => {
  return {
    lang: selectLang(state),
    resultCount: selectGoods(state).count,
    filters: selectFilters(state),
    specs: selectSpecs(state),
    orderByTypeId: selectFilters(state).orderByType,
    brands: selectBrands(state),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withLocalize(ProviderBoxHeader));
