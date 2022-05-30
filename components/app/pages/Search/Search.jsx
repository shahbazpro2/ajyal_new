import React from "react";
import classnames from "classnames";
import { Translate, withLocalize } from "react-localize-redux";
import Switch from "react-switch";
// import "./Search.scss";
// import "./Search-rtl.scss";
import {
  Dropdown,
  BoxStyle1,
  GoodItemRow,
  Pager,
  MobileMenu,
  BreadCrump,
  GoodItemLoader,
  GoodItemRowLoader,
} from "../../../common";
import CheckBoxList from "./SearchLayout/CheckBoxList/CheckBoxList";
import exp from "./../../../../assets/icons/express.png";
import expAr from "./../../../../assets/icons/express-ar.png";
// import SeeMore from "./SearchLayout/SeeMore/SeeMore";
import RangeBox from "./SearchLayout/RangeBox/RangeBox";
import GoodItem from "../../../common/GoodItem";
import { connect } from "react-redux";
import { SearchBoxHeader, EmptySearch } from "./SearchLayout";
// import Fader from "react-fader";
import Pagination from "react-js-pagination";
import { DesktopsAndBigger, Desktops } from "../../../../Responsive";
import {
  fetchSearch,
  LOADING,
  selectSearch,
  priceAddedAction,
  selectFilters,
  selectGoods,
  goodsCreatedDayAddedAction,
  selectSpecs,
  changeUrl,
  brandsChangedAction,
  pageChangedAction,
  mobileFilterUpdateAction,
  goodsOptionsAddedAction,
  orderByTypeAddedAction,
  justExistClickAction,
  categoryClickAction,
  selectSelectedBrands,
} from "./searchSlice";
import { selectCurr, selectLang } from "../../../../appConfigSlice";
import { withRouter } from "next/router";
import queryString from "query-string";
import FiltersData from "../../filters/filtersData";
import CheckBoxList2 from "./SearchLayout/CheckBoxList/CheckBoxList2";
import { searchFiltersToQuery } from "../../../../lib/QueryToFilters";
import Link from "next/link";
import BrandsCheckList from "./SearchLayout/CheckBoxList/BrandsCheckList";

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.lang = this.props.lang;
    this.currency = this.props.curr;
    this.state = {
      view: true, ///// true --> Grid - false --> Row
      isServer: true,
    };

    const filtersData = new FiltersData(this.props.translate);
    this.arrivals = filtersData.arrivals;
    this.sortedBy = filtersData.sortedBy;
    this.specSelected = {};
    this.goodsWrapperRef = React.createRef();
  }

  componentDidMount() {
    const selectedOptions = this.props.filters.optionIds;
    const specs = this.props.specs;

    for (let id of selectedOptions) {
      for (let key in specs) {
        if (specs[key].options[id]) {
          this.specSelected[specs[key].specId] =
            this.specSelected[specs[key].specId] || [];
          this.specSelected[specs[key].specId].push(
            specs[key].options[id].optionId
          );
        }
      }
    }
  }

  componentDidUpdate() {
    if (this.props.changeUrlBool) {
      const filters = this.props.filters;
      this.props.changeUrl();
      const queryParam = searchFiltersToQuery(filters);
      const result = queryString.stringify(queryParam, {
        arrayFormat: "comma",
      });
      this.props.router.push(
        `?${result}`,
        `/${this.props.curr}-${this.props.lang}/search/?${result}`,
        {
          shallow: true,
        }
      );

      window.scrollTo({
        top: this.goodsWrapperRef.current.offsetTop,
        behavior: "smooth",
      });
    }
  }

  onMobileFilterClick = (arrival, brands, range, justExist) => {
    let specsIds = [];
    for (let key in this.specSelected) {
      specsIds = [...this.specSelected[key], ...specsIds];
    }

    this.props.mobileFilterUpdateAction({
      brands: brands,
      specsId: specsIds,
      arrival: arrival[0],
      price: {
        min: range.min,
        max: range.max,
      },
      justExist,
    });
  };

  onMobileSortClick = (sortId) => {
    this.props.orderByTypeAddedAction(sortId);
  };

  handleSpecSelect = (specId, selecetdIds, dontSubmit = false) => {
    this.specSelected[specId] = selecetdIds;
    if (dontSubmit) return;
    let ids = [];
    for (let key in this.specSelected) {
      ids = [...this.specSelected[key], ...ids];
    }
    this.props.goodsOptionsAddedAction(ids);
  };

  state = {
    showfilterBox: false,
    filterSort: false,
  };

  viewHandler = (e) => {
    e.preventDefault();
    this.setState((state) => {
      return {
        view: !state.view,
      };
    });
  };

  printLoader() {
    const loader = [];
    for (let i = 0; i < 10; i++) {
      if (this.state.view) loader.push(<GoodItemLoader />);
      else loader.push(<GoodItemRowLoader />);
      // loader.push(<GoodItemLoader />);
    }
    return loader;
  }

  render() {
    this.data = this.props.search.search;
    this.loading = this.props.status === LOADING;

    return (
      <div>
        <div className="container siteWidthContainer">
          <div className="search-page flex-wrap">
            <DesktopsAndBigger className="w-100">
              {this.props.parentCategory?.length > 0 ? (
                <BreadCrump
                  className="col-12 p-0 mt-2"
                  data={this.props.parentCategory}
                />
              ) : (
                <div style={{ height: "10px", width: "100%" }}></div>
              )}
            </DesktopsAndBigger>
            <div className="search-page__left">
              <DesktopsAndBigger>
                {/* -------------------------- good filters section START ---------------------- */}
                <aside className="search">
                  {this.props.childCategory && (
                    <Dropdown
                      alwaysOpen={false}
                      headerClass="search__filter-header"
                      containerClass="search__list-container"
                      text={this.props.childCategory.categoryTitle}
                    >
                      <ul className="search__filter-list">
                        {this.props.childCategory.child?.map((cat) => {
                          return (
                            <li
                              key={cat.categoryId}
                              className="search__list-item"
                            >
                              <Dropdown
                                headerClass="search__drop-header"
                                text={cat.categoryTitle}
                                haveLink
                                link={`/${this.props.curr}-${this.props.lang}/search?type=2&id=${cat.categoryId}`}
                              >
                                <ul className="search__drop-list">
                                  {cat.child &&
                                    cat.child.map((child2) => {
                                      return (
                                        <li
                                          key={child2.categoryId}
                                          className="search__list-item"
                                        >
                                          <Link
                                            href={`/${this.props.curr}-${this.props.lang}/search?type=2&id=${child2.categoryId}`}
                                          >
                                            <a className="search__list-link">
                                              {child2.categoryTitle}
                                            </a>
                                          </Link>
                                        </li>
                                      );
                                    })}
                                </ul>
                              </Dropdown>
                            </li>
                          );
                        })}
                      </ul>
                    </Dropdown>
                  )}

                  {/*  Brand */}
                  <Dropdown
                    alwaysOpen={false}
                    headerClass="search__filter-header"
                    containerClass="search__list-container"
                    text={<Translate id="searchAside.Brand" />}
                  >
                    <Translate>
                      {({ translate }) => {
                        return (
                          <BrandsCheckList
                            catId={this.props.filters.id}
                            itemClass="search__list-item search__list-item--check"
                            listClass="search__filter-list"
                            placeholder={translate("searchplaceholder")}
                            selecteIds={this.props.filters.brandId}
                            onSelect={(brand, checked) => {
                              this.props.brandsChangedAction(brand, checked);
                            }}
                          />
                          // <CheckBoxList2
                          //   search
                          //   textOpen={<Translate id="seemore" />}
                          //   textClose="close"
                          //   seeMore
                          //   maxItemShow={20}
                          //   placeholder={translate("searchplaceholder")}
                          //   data={this.props.brands}
                          //   dataName="brandTitle"
                          //   dataValue="brandId"
                          //   initialSelectIdArr={this.props.filters.brandId}
                          //   listClass="search__filter-list"
                          //   itemClass="search__list-item search__list-item--check"
                          //   onSelect={(arr) => {
                          //     this.props.BrandAddedAction(arr);
                          //   }}
                          // />
                        );
                      }}
                    </Translate>
                  </Dropdown>
                  {/* just exist */}
                  <div className={`dropdown search__list-container`}>
                    <div
                      href="#"
                      className={`dropdown__link search__filter-header single-lined`}
                    >
                      <span>
                        <Translate id="just-exist" />
                      </span>
                      <Switch
                        onChange={(checked) => {
                          this.props.justExistClickAction(checked);
                        }}
                        width={46}
                        height={22}
                        uncheckedIcon=""
                        checkedIcon=""
                        checked={this.props.filters.justExist}
                      />
                    </div>
                  </div>
                  {/* fullfilment */}
                  {/* <Dropdown
                    alwaysOpen={true}
                    headerClass="search__filter-header"
                    containerClass="search__list-container"
                    text={<Translate id="searchAside.Fulfillment" />}
                  >
                    <ul className="search__filter-list">
                      <li className="search__list-item">
                        <CheckBoxList
                          data={[
                            <img
                              alt=""
                              className="search__checkList-img"
                              src={this.is_rtl ? expAr : exp}
                            />,
                          ]}
                        />
                      </li>
                    </ul>
                  </Dropdown> */}
                  {/* NewArrivals */}
                  <Dropdown
                    alwaysOpen={false}
                    headerClass="search__filter-header"
                    containerClass="search__list-container"
                    text={<Translate id="searchAside.NewArrivals" />}
                  >
                    <CheckBoxList
                      listClass="search__filter-list"
                      itemClass="search__list-item search__list-item--check"
                      data={this.arrivals}
                      dataName="title"
                      dataValue="value"
                      initialSelectIdArr={[this.props.filters.goodsCreatedDay]}
                      singleSelect
                      onSelect={(arr) => {
                        this.props.goodsCreatedDayAddedAction(arr[0]);
                      }}
                    />
                  </Dropdown>
                  {/* Specs */}
                  {Object.keys(this.props.specs || {})?.map((key) => {
                    return (
                      <Dropdown
                        key={this.props.specs[key].specId}
                        alwaysOpen={false}
                        headerClass="search__filter-header"
                        containerClass="search__list-container"
                        text={this.props.specs[key].specTitle}
                      >
                        <CheckBoxList2
                          listClass="search__filter-list"
                          itemClass="search__list-item search__list-item--check"
                          data={this.props.specs[key].options}
                          dataName="optionTitle"
                          dataValue="optionId"
                          initialSelectIdArr={this.props.filters.optionIds}
                          singleSelect={
                            !this.props.specs[key].isMultiSelectInFilter
                          }
                          onSelect={(arr) => {
                            this.handleSpecSelect(
                              this.props.specs[key].specId,
                              arr
                            );
                          }}
                        />
                      </Dropdown>
                    );
                  })}
                  {/* Price */}
                  <Dropdown
                    alwaysOpen={false}
                    headerClass="search__filter-header"
                    containerClass="search__list-container"
                    text={<Translate id={"searchAside.Price-"+this.currency} />}
                  >
                    {this.props.maxPrice > 0 && (
                      <RangeBox
                        show="true"
                        min={0}
                        max={this.props.maxPrice}
                        onSet={(values) => {
                          this.props.priceAddedAction(values.min, values.max);
                        }}
                        setText={<Translate id="setPrice" />}
                      />
                    )}
                  </Dropdown>
                </aside>
                {/* -------------------------- good filters section END ---------------------- */}
              </DesktopsAndBigger>
            </div>
            <div className="search-page__right">
              <BoxStyle1
                childRef={this.goodsWrapperRef}
                headerContent={
                  <SearchBoxHeader
                    newArrivals={this.arrivals}
                    currentView={this.state.view}
                    specSelected={this.specSelected}
                    handleSpecSelect={this.handleSpecSelect}
                    viewHandler={this.viewHandler}
                    showFilter={(sortvalue) => {
                      this.setState({
                        showfilterBox: true,
                        filterSort: sortvalue,
                      });
                    }}
                  />
                }
              >
                {/* <div className="search__item-container">
                  {this.content2.map((item) => {
                    return <GoodItem {...item} hover />;
                  })}
                </div> */}

                {/* <Fader
                  fadeOutTransitionDuration={100}
                  fadeInTransitionDuration={100}
                > */}
                  <div
                    className={classnames("search__item-container", {
                      "search__item-container--row": !this.state.view,
                    })}
                  >
                    {this.loading ? (
                      this.printLoader()
                    ) : this.data?.goods?.data.length === 0 ? (
                      <EmptySearch />
                    ) : (
                      this.data?.goods?.data.map((item) => {
                        return this.state.view ? (
                          <GoodItem {...item} hover />
                        ) : (
                          <GoodItemRow {...item} hover />
                        );
                      })
                    )}
                    {/* {this.data.goods.data.map((item) => {
                      return this.state.view ? (
                        // <GoodItem {...item} hover />
                        <GoodItemLoader />
                      ) : (
                        // <></>
                        // <GoodItemLoader />
                        <GoodItemRow {...item} hover />
                        // <></>
                      );
                    })} */}
                  </div>
                {/* </Fader> */}
                {/* <Pager
                  count={Math.ceil(
                    this.props.resultGoodsCount / this.props.perPage
                  )}
                  activeItem={this.props.pageNumber}
                  smoothScroll
                  onPageClick={(pageNumber) => {
                    this.props.pageChangedAction(pageNumber);
                  }}
                /> */}
                <div>
                  <Pagination
                    activePage={this.props.pageNumber}
                    itemsCountPerPage={this.props.perPage}
                    totalItemsCount={this.props.resultGoodsCount}
                    itemClass="pager__item"
                    hideFirstLastPages
                    innerClass="pager"
                    linkClass="pager__link"
                    activeLinkClass="active"
                    pageRangeDisplayed={5}
                    onChange={(pageNumber) => {
                      this.props.pageChangedAction(pageNumber);
                    }}
                  />
                </div>
              </BoxStyle1>
            </div>
          </div>
        </div>

        <Desktops>
          <section className="search-page-mobile-filter">
            {this.state.showfilterBox ? (
              <MobileMenu
                filterSort={this.state.filterSort}
                rtl={this.is_rtl}
                isMainMenu={false}
                closeMenu={() => {
                  this.setState({
                    showfilterBox: false,
                    filterSort: false,
                  });
                }}
                selectedBrands={this.props.selectedBrands}
                data={this.props.search.search}
                filtersMenu
                filters={this.props.filters}
                arrivals={this.arrivals}
                searchMenu
                handleSpecSelect={this.handleSpecSelect}
                specSelected={this.specSelected}
                mobileFilterClick={this.onMobileFilterClick}
                sortedBy={this.sortedBy}
                mobileSortClick={this.onMobileSortClick}
              />
            ) : null}
          </section>
        </Desktops>
      </div>
    );
  }
}

const mapDispatchToProps = {
  fetchSearch,
  priceAddedAction,
  goodsCreatedDayAddedAction,
  goodsOptionsAddedAction,
  brandsChangedAction,
  pageChangedAction,
  changeUrl,
  mobileFilterUpdateAction,
  orderByTypeAddedAction,
  categoryClickAction,
  justExistClickAction,
};

const mapStateToProps = (state) => {
  const filters = selectFilters(state);
  const search = selectSearch(state);
  return {
    lang: selectLang(state),
    curr: selectCurr(state),
    search: state.search,
    status: state.search.status,
    childCategory: search.childCategory,
    maxPrice: search.maxPrice,
    pageNumber: filters.pageNumber,
    perPage: filters.pageSize,
    resultGoodsCount: selectGoods(state)?.count,
    goodsCreatedDay: filters.goodsCreatedDay,
    specs: selectSpecs(state),
    filters: filters,
    selectedBrands: selectSelectedBrands(state),
    changeUrlBool: state.search.changeUrl,
    parentCategory: search.parentCategory,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withLocalize(withRouter(Search)));
