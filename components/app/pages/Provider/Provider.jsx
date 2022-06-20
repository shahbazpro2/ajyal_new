import React from "react";
import classnames from "classnames";
import { Translate, withLocalize } from "react-localize-redux";
// import "./Provider.scss";
// import "./Provider-rtl.scss";
import {
  Dropdown,
  BoxStyle1,
  GoodItemRow,
  Pager,
  BoxStyle2,
  MobileMenu,
  GoodItemLoader,
  GoodItemRowLoader,
  StarRating,
} from "../../../common";
import CheckBoxList from "../Search/SearchLayout/CheckBoxList/CheckBoxList";
import CheckBoxList2 from "../Search/SearchLayout/CheckBoxList/CheckBoxList2";

import RangeBox from "../Search/SearchLayout/RangeBox/RangeBox";
import GoodItem from "../../../common/GoodItem";
import { connect } from "react-redux";
import { EmptySearch } from "../Search/SearchLayout";

import { ReactComponent as CalendarIcon } from "./../../../../assets/icons/calendar.svg";
import { ReactComponent as StoreIcon } from "../../../../assets/icons/store.svg";
import { ReactComponent as PhoneIcon } from "../../../../assets/icons/phone2.svg";
import { ReactComponent as MapLocationIcon } from "../../../../assets/icons/map-location.svg";
import { ReactComponent as ProviderSoldIcon } from "../../../../assets/icons/provider/sold.svg";
import { ReactComponent as TermsIcon } from "../../../../assets/icons/provider/terms.svg";
import { ReactComponent as CountryIcon } from "../../../../assets/icons/provider/country.svg";
import { ReactComponent as RateIcon } from "../../../../assets/icons/provider/rate.svg";
import { ReactComponent as BackIcon } from "../../../../assets/icons/back.svg";
import { DesktopsAndBigger, Desktops } from "../../../../Responsive";
import { selectCurr, selectLang } from "../../../../appConfigSlice";
import {
  selectShop,
  changeUrl,
  selectChangeUrl,
  selectFilters,
  selectParentCategory,
  selectChildCategory,
  selectSpecs,
  goodsCreatedDayAddedAction,
  goodsOptionsAddedAction,
  priceAddedAction,
  selectProvider,
  selectProviderStatus,
  LOADING,
  selectBrands,
  BrandAddedAction,
  pageChangedAction,
  orderByTypeAddedAction,
  mobileFilterUpdateAction,
  selectProviderName,
} from "./providerSlice";
import Pagination from "react-js-pagination";
import { providerFiltersToQuery } from "../../../../lib/QueryToFilters";
import { withRouter } from "next/router";
import FiltersData from "../../filters/filtersData";
import queryString from "query-string";
import ProviderBoxHeader from "./ProviderLayouts/ProviderBoxHeader/ProviderBoxHeader";
import ShopSlider from "../../ShopSlider/ShopSlider";
import Link from "next/link";
import HtmlRenderModal from "../../../common/HtmlRenderModal/HtmlRenderModal";

class Provider extends React.Component {
  constructor(props) {
    super(props);

    this.lang = this.props.lang;
    this.state = {
      view: true, ///// true --> Grid - false --> Row
      offsetTop: 0,
      viewTerm: false,
    };
    const filtersData = new FiltersData(this.props.translate);
    this.arrivals = filtersData.arrivals;
    //// sepecifi
    this.specSelected = {};
    this.goodsWrapperRef = React.createRef();
    this.sortedBy = filtersData.sortedBy;
  }

  viewHandler = (e) => {
    e.preventDefault();
    this.setState((state) => {
      return {
        view: !state.view,
      };
    });
  };

  state = {
    showfilterBox: false,
    filterSort: false,
  };

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

    //// set box Offset for scroll to
    this.setState({
      offsetTop: this.goodsWrapperRef.current.offsetTop,
    });
  }

  componentDidUpdate() {
    if (this.props.changeUrlBool) {
      const curr_filters = this.props.filters;
      this.props.changeUrl();
      const queryParam = providerFiltersToQuery(curr_filters);
      const result = queryString.stringify(queryParam, {
        arrayFormat: "comma",
      });
      this.props.router.push(
        `?${result}`,
        `/${this.props.router.query["lang-curr"]}/${this.props.router.query.providerName[0]}/?${result}`,
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

  handleSpecSelect = (specId, selecetdIds, dontSubmit = false) => {
    this.specSelected[specId] = selecetdIds;
    if (dontSubmit) return;
    let ids = [];
    for (let key in this.specSelected) {
      ids = [...this.specSelected[key], ...ids];
    }
    this.props.goodsOptionsAddedAction(ids);
  };

  onMobileSortClick = (sortId) => {
    this.props.orderByTypeAddedAction(sortId);
  };

  onMobileFilterClick = (arrival, brands, range) => {
    let specsIds = [];
    for (let key in this.specSelected) {
      specsIds = [...this.specSelected[key], ...specsIds];
    }

    this.props.mobileFilterUpdateAction({
      brandsId: brands,
      specsId: specsIds,
      arrival: arrival[0],
      price: {
        min: range.min,
        max: range.max,
      },
    });
  };

  printLoader() {
    const loader = [];
    for (let i = 0; i < 10; i++) {
      if (this.state.view) loader.push(<GoodItemLoader />);
      else loader.push(<GoodItemRowLoader />);
    }
    return loader;
  }

  renderBoxHeaderForTerms() {
    return (
      <header className="header-terms">
        <div
          onClick={() => {
            this.setState({
              viewTerm: false,
            });
          }}
        >
          <BackIcon className="mapAddress__back-icon" />
        </div>
      </header>
    );
  }

  render() {
    this.data = this.props.data;
    this.loading = this.props.status === LOADING;
    const headerImageUrl = this.props.shop?.isDefualtImage
      ? process.env.NEXT_PUBLIC_LOGO_PREFIX
      : process.env.NEXT_PUBLIC_Shop_PREFIX + "/" + this.props.shop?.shopId;
    return (
      <div>
        <div className="container-fluid p-0">
          <DesktopsAndBigger>
            <img
              className="provider__logo"
              src={`${headerImageUrl}/${this.props.shop?.logoImage}`}
              alt="provider header image"
              title="provider header image"
            />
          </DesktopsAndBigger>
        </div>

        <div className="container siteWidthContainer provider">
          <div className="provider-page">
            <div className="provider-page__left">
              <DesktopsAndBigger>
                {/* -------------------------- provider details START ---------------------- */}
                <BoxStyle2>
                  <div className="goodDetailAside__top-box">
                    <ul className="goodDetailAside__top-list">
                      <li className="goodDetailAside__top-item">
                        <StoreIcon className="goodDetailAside__top-icon" />
                        <span className="sky-text-link">
                          {this.props.shop?.storeName}
                        </span>
                      </li>
                      <li className="goodDetailAside__top-item">
                        <CalendarIcon className="goodDetailAside__top-icon" />
                        <span className="gray-text">
                          <Translate id="date" />
                        </span>
                        <span className="gray-darker-text">
                          {this.props.shop?.registeryDateTime}
                        </span>
                      </li>
                      <li className="goodDetailAside__top-item">
                        <PhoneIcon className="goodDetailAside__top-icon" />
                        <span className="gray-darker-text phone-number">
                          {this.props.shop?.phone}
                        </span>
                      </li>
                      {this.props.shop?.address && (
                        <li className="goodDetailAside__top-item">
                          <MapLocationIcon className="goodDetailAside__top-icon" />
                          <span className="gray-darker-text">
                            {this.props.shop?.address}
                          </span>
                        </li>
                      )}

                      <li className="goodDetailAside__top-item">
                        <ProviderSoldIcon className="goodDetailAside__top-icon" />
                        <span className="gray-darker-text">
                          {this.props.shop?.productsSold}
                        </span>
                        <span className="gray-darker-text">
                          <Translate id="productsold" />
                        </span>
                      </li>

                      {this.props.shop?.countryTitle && (
                        <li className="goodDetailAside__top-item">
                          <CountryIcon className="goodDetailAside__top-icon" />
                          <span className="gray-darker-text">
                            {this.props.shop?.countryTitle}
                          </span>
                          <span className="gray-darker-text">,</span>
                          <span className="gray-darker-text">
                            {this.props.shop?.cityTitle}
                          </span>
                        </li>
                      )}
                      {this.props.shop?.termCondition && (
                        <li className="goodDetailAside__top-item">
                          <TermsIcon className="goodDetailAside__top-icon" />
                          <span
                            style={{ cursor: "pointer" }}
                            className="sky-text-link"
                            onClick={() => {
                              this.setState({
                                viewTerm: true,
                              });
                            }}
                          >
                            <Translate id="termscondition" />
                          </span>
                        </li>
                      )}
                      <li className="goodDetailAside__top-item">
                        <div
                          className="goodDetailAside__reviews"
                          style={{ display: "flex" }}
                        >
                          <RateIcon className="goodDetailAside__top-icon" />
                          <span className="gray-text review-text">
                            <Translate id="sellerReviews" />
                          </span>
                          <StarRating
                            name="Shop rate"
                            editing={false}
                            starCount={5}
                            value={this.props.shop?.surveyScore}
                            nextText={`(${this.props.shop?.surveyScore})`}
                          />
                        </div>
                      </li>
                      <li className="">
                        <div className="how-calculate-wrapper">
                          <HtmlRenderModal
                            description={
                              this.props.data.descriptionCalculateShopRate
                            }
                          />
                        </div>
                      </li>
                    </ul>
                  </div>
                </BoxStyle2>
                {/* -------------------------- provider details END ---------------------- */}
                {/* -------------------------- good filters section START ---------------------- */}
                <aside className="search">
                  <Dropdown
                    alwaysOpen={false}
                    headerClass="search__filter-header"
                    containerClass="search__list-container"
                    text={<Translate id="searchAside.FeaturedCategories" />}
                  >
                    <ul className="search__filter-list">
                      {this.props.childCategory &&
                        this.props.childCategory.map((cat) => {
                          return (
                            <li
                              key={cat.categoryId}
                              className="search__list-item"
                            >
                              <Dropdown
                                headerClass="search__drop-header"
                                text={cat.categoryTitle}
                                haveLink
                                link={`/${this.props.curr}-${this.props.lang}/${this.props.providerName}?id=${cat.categoryId}`}
                              >
                                <ul className="search__drop-list">
                                  {cat.child &&
                                    cat.child.map((child) => {
                                      return (
                                        <li
                                          key={child.categoryId}
                                          className="search__list-item"
                                        >
                                          <Link
                                            href={`/${this.props.curr}-${this.props.lang}/${this.props.providerName}?id=${child.categoryId}`}
                                          >
                                            <a className="search__list-link">
                                              {child.categoryTitle}
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
                          <CheckBoxList2
                            search
                            placeholder={translate("searchplaceholder")}
                            data={this.props.brands}
                            dataName="brandTitle"
                            dataValue="brandId"
                            initialSelectIdArr={this.props.filters.brandId}
                            listClass="search__filter-list"
                            itemClass="search__list-item search__list-item--check"
                            textOpen={<Translate id="seemore" />}
                            textClose="close"
                            seeMore
                            maxItemShow={20}
                            onSelect={(arr) => {
                              this.props.BrandAddedAction(arr);
                            }}
                          />
                        );
                      }}
                    </Translate>
                  </Dropdown>
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
                    text={<Translate id="searchAside.Price" />}
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
            {/* -------------------------- provider page content ---------------------- */}
            {!this.state.viewTerm && (
              <div className="provider-page__right">
                <Desktops>
                  <BoxStyle1
                    headerContent={
                      <ProviderBoxHeader
                        currentView={this.state.view}
                        viewHandler={this.viewHandler}
                        showFilter={(sortvalue) => {
                          this.setState({
                            showfilterBox: true,
                            filterSort: sortvalue,
                          });
                        }}
                      />
                    }
                  />
                  {/* <Imgs height="sm" imgs={this.imgColComponent[16]} /> */}
                  <BoxStyle2>
                    <div className="goodDetailAside__top-box">
                      <ul className="goodDetailAside__top-list">
                        <li className="goodDetailAside__top-item">
                          <StoreIcon className="goodDetailAside__top-icon" />
                          <span className="sky-text-link">
                            {this.props.shop?.storeName}
                          </span>
                        </li>
                        <li className="goodDetailAside__top-item">
                          <CalendarIcon className="goodDetailAside__top-icon" />
                          <span className="gray-text">
                            <Translate id="date" />
                          </span>
                          <span className="gray-darker-text">
                            {this.props.shop?.registeryDateTime}
                          </span>
                        </li>
                        <li className="goodDetailAside__top-item">
                          <PhoneIcon className="goodDetailAside__top-icon" />
                          <span className="gray-darker-text phone-number">
                            {this.props.shop?.phone}
                          </span>
                        </li>
                        {this.props.shop?.address && (
                          <li className="goodDetailAside__top-item">
                            <MapLocationIcon className="goodDetailAside__top-icon" />
                            <span className="gray-darker-text">
                              this.props.shop?.address
                            </span>
                          </li>
                        )}

                        <li className="goodDetailAside__top-item">
                          <ProviderSoldIcon className="goodDetailAside__top-icon" />
                          <span className="gray-darker-text">
                            {this.props.shop?.productsSold}
                          </span>
                          <span className="gray-darker-text">
                            <Translate id="productsold" />
                          </span>
                        </li>

                        {this.props.shop?.countryTitle && (
                          <li className="goodDetailAside__top-item">
                            <CountryIcon className="goodDetailAside__top-icon" />
                            <span className="gray-darker-text">
                              {this.props.shop?.countryTitle}
                            </span>
                            <span className="gray-darker-text">,</span>
                            <span className="gray-darker-text">
                              {this.props.shop?.cityTitle}
                            </span>
                          </li>
                        )}
                        {this.props.shop?.termCondition && (
                          <li className="goodDetailAside__top-item">
                            <TermsIcon className="goodDetailAside__top-icon" />
                            <span
                              style={{ cursor: "pointer" }}
                              className="sky-text-link"
                              onClick={() => {
                                this.setState({
                                  viewTerm: true,
                                });
                              }}
                            >
                              <Translate id="termscondition" />
                            </span>
                          </li>
                        )}
                        <li className="goodDetailAside__top-item">
                          <div
                            className="goodDetailAside__reviews"
                            style={{ display: "flex" }}
                          >
                            <RateIcon className="goodDetailAside__top-icon" />
                            <span className="gray-text review-text">
                              <Translate id="sellerReviews" />
                            </span>
                            <StarRating
                              name="Shop rate"
                              editing={false}
                              starCount={5}
                              value={this.props.shop?.surveyScore}
                              nextText={`(${this.props.shop?.surveyScore})`}
                            />
                          </div>
                        </li>
                        <li className="">
                          <div className="how-calculate-wrapper">
                            <HtmlRenderModal
                              description={
                                this.props.data.descriptionCalculateShopRate
                              }
                            />
                          </div>
                        </li>
                      </ul>
                    </div>
                  </BoxStyle2>
                  <img
                    className="provider-page__logo"
                    src={`${process.env.NEXT_PUBLIC_Shop_PREFIX}/${this.props.shop?.shopId}/${this.props.shop?.logoImage}`}
                    alt="provider logo"
                    title="provider title"
                  />
                </Desktops>

                {this.props.shop?.shopSlider.length > 0 && (
                  <ShopSlider
                    shopId={this.props.shop.shopId}
                    slider={this.props.shop.shopSlider}
                  />
                )}
                <BoxStyle1
                  childRef={this.goodsWrapperRef}
                  headerContent={
                    <DesktopsAndBigger>
                      <ProviderBoxHeader
                        specSelected={this.specSelected}
                        handleSpecSelect={this.handleSpecSelect}
                        currentView={this.state.view}
                        viewHandler={this.viewHandler}
                      />
                    </DesktopsAndBigger>
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
                  </div>
                  {/* </Fader> */}
                  {/* <Pager
                  count={Math.ceil(
                    this.props.resultGoodsCount / this.props.perPage
                  )}
                  activeItem={this.props.pageNumber}
                  smoothScroll
                  scrollTo={this.state.offsetTop}
                  onPageClick={(pageNumber) => {
                    this.props.pageChangedAction(pageNumber);
                  }}
                /> */}
                  <Pagination
                    activePage={this.props.pageNumber}
                    itemsCountPerPage={this.props.perPage}
                    totalItemsCount={this.props.resultGoodsCount}
                    itemClass="pager__item"
                    innerClass="pager"
                    linkClass="pager__link"
                    activeLinkClass="active"
                    pageRangeDisplayed={5}
                    hideFirstLastPages
                    onChange={(pageNumber) => {
                      this.props.pageChangedAction(pageNumber);
                    }}
                  />
                </BoxStyle1>
              </div>
            )}

            {/* provider term condition */}

            {this.state.viewTerm && (
              <div className="provider-page__right">
                <BoxStyle1 headerContent={this.renderBoxHeaderForTerms()}>
                  <div
                    className="ql-editor"
                    dangerouslySetInnerHTML={{
                      __html: this.props.shop?.termCondition,
                    }}
                  ></div>
                </BoxStyle1>
              </div>
            )}
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
                data={this.props.data}
                filtersMenu
                providerMenu
                providerName={this.props.providerName}
                filters={this.props.filters}
                arrivals={this.arrivals}
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
  changeUrl,
  goodsCreatedDayAddedAction,
  goodsOptionsAddedAction,
  priceAddedAction,
  BrandAddedAction,
  pageChangedAction,
  orderByTypeAddedAction,
  mobileFilterUpdateAction,
};
const mapStateToProps = (state) => {
  const filters = selectFilters(state);
  const provider = selectProvider(state);
  return {
    lang: selectLang(state),
    curr: selectCurr(state),
    shop: selectShop(state),
    changeUrlBool: selectChangeUrl(state),
    filters: filters,
    parentCategory: selectParentCategory(state),
    childCategory: selectChildCategory(state),
    specs: selectSpecs(state),
    maxPrice: provider.maxPrice,
    resultGoodsCount: provider.goods.count,
    perPage: filters.pageSize,
    pageNumber: filters.pageNumber,
    data: provider,
    status: selectProviderStatus(state),
    brands: selectBrands(state),
    providerName: selectProviderName(state),
    descriptionCalculateShopRate: provider.descriptionCalculateShopRate,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withLocalize(Provider)));
