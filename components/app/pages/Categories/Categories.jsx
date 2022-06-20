import React from "react";
// import "./Categories.scss";
// import "./Categories-rtl.scss";
import GoodsSlider from "../../GoodsSlider";
import { BoxStyle1, Loading } from "../../../common";
import ImgCols from "../../ImgCols";
import { Translate } from "react-localize-redux";
import {
  fetchCategory,
  selectBrands,
  selectCategoryStatus,
  selectCats,
  selectSlider,
  selectCatTitle,
  LOADING,
  selectwebHomeModuleList,
  IDLE,
  selectCatId,
} from "./categorySlice";
/// for UI development
import Dropdown from "../../../common/Dropdown/Dropdown";
import { connect } from "react-redux";
import { selectCurr, selectLang } from "../../../../appConfigSlice";
import { withRouter } from "next/router";
import {
  ADV1,
  ADV2,
  ADV3,
  ADV4,
  ADV6,
  CATEGOR_LIST,
  PRODUCT_LIST,
} from "../index/homeConstant";
import HomeSliderLoader from "../../HomeSlider/HomeSliderLoader";
import GoodsSliderLoader from "../../GoodsSlider/GoodsSliderLoader";
import { SEARCH_TYPE_CATEGORY } from "../../../../lib/querys";
import Link from "next/link";
import Brands from "./categoryLayouts/Brands";
import { client_categoryBrands } from "../../../../lib/api/client/clientCommon";
import { forceCheck } from "react-lazyload";
// import categoryIcon from "./../../../../assets/icons/cate.svg";

export const brandsPageSize = 10;

class Categories extends React.Component {
  constructor(props) {
    super(props);
    this.lang = this.props.lang;
    this.state = {
      brands: [],
    };

    this.check = false;
  }

  componentDidMount() {
    // const { id } = this.props.router.query;
    this.props.fetchCategory(this.props.catId2);

    this.check = true;
    client_categoryBrands({
      pageSize: brandsPageSize,
      pageNumber: 1,
      catId: this.props.catId2,
    })
      .then((res) => {
        this.setState({ brands: res.result });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.check = false;
      });
  }

  componentDidUpdate(prevProps) {
    // force to visiable image in the viewport after 3 sec in each render
    setTimeout(() => {
      forceCheck();
      console.log("check ...");
    }, 5000);

    //////////
    if (this.props.isIDLE && !this.check) {
      const { id } = this.props.router.query;
      this.props.fetchCategory(id[0]);
      // get new brands
      client_categoryBrands({
        pageSize: brandsPageSize,
        pageNumber: 1,
        catId: this.props.catId2,
        search: "",
      })
        .then((res) => {
          this.setState({ brands: res.result });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  renderModules(data = []) {
    const HomeModules = [];
    data.map((module) => {
      switch (module.fkModuleId) {
        case CATEGOR_LIST:
          ///// TOP CATEGORY LIST
          HomeModules.push(
            <TopCategoriesList
              headerTitleComponent={
                <LinearHeader headerText={module.iModuleTitle} />
              }
              data={module.webModuleCollections}
              iModuleId={module.iModuleId}
            />
          );
          break;
        case PRODUCT_LIST:
          /// Products Slider
          HomeModules.push(
            <BoxStyle1
              headerContent={module.webModuleCollections[0].collectionTitle}
            >
              <GoodsSlider
                data={module.webModuleCollections[0]?.goods}
                count={5}
              />
            </BoxStyle1>
          );
          break;
        case ADV1:
          // Images module
          HomeModules.push(
            <>
              <div className="imgCols_big-desktop">
                <ImgCols
                  data={module.webModuleCollections}
                  iModuleId={module.iModuleId}
                  selectedHeight={module.selectedHeight}
                />
              </div>
              <div className="imgCols_mobile">
                <ImgCols
                  mobile
                  data={module.webModuleCollections}
                  iModuleId={module.iModuleId}
                  selectedHeight={module.selectedHeight}
                />
              </div>
            </>
          );

          break;
        case ADV2:
          // Images modules
          HomeModules.push(
            <>
              <div className="imgCols_big-desktop">
                <ImgCols
                  data={module.webModuleCollections}
                  iModuleId={module.iModuleId}
                  selectedHeight={module.selectedHeight}
                />
              </div>
              <div className="imgCols_mobile">
                <ImgCols
                  mobile
                  data={module.webModuleCollections}
                  iModuleId={module.iModuleId}
                  selectedHeight={module.selectedHeight}
                />
              </div>
            </>
          );
          break;
        case ADV3:
          // Images modules
          HomeModules.push(
            <>
              <div className="imgCols_big-desktop">
                <ImgCols
                  data={module.webModuleCollections}
                  iModuleId={module.iModuleId}
                  selectedHeight={module.selectedHeight}
                />
              </div>
              <div className="imgCols_mobile">
                <ImgCols
                  mobile
                  data={module.webModuleCollections}
                  iModuleId={module.iModuleId}
                  selectedHeight={module.selectedHeight}
                />
              </div>
            </>
          );
          break;
        case ADV4:
          // Images modules
          HomeModules.push(
            <>
              <div className="imgCols_big-desktop">
                <ImgCols
                  data={module.webModuleCollections}
                  iModuleId={module.iModuleId}
                  selectedHeight={module.selectedHeight}
                />
              </div>
              <div className="imgCols_mobile">
                <ImgCols
                  mobile
                  hieght={"sm"}
                  data={module.webModuleCollections}
                  iModuleId={module.iModuleId}
                  selectedHeight={module.selectedHeight}
                />
              </div>
            </>
          );
          break;
        case ADV6:
          // Images modules
          HomeModules.push(
            <>
              <div className="imgCols_big-desktop">
                <ImgCols
                  data={module.webModuleCollections}
                  iModuleId={module.iModuleId}
                  selectedHeight={module.selectedHeight}
                />
              </div>
              <div className="imgCols_mobile">
                <ImgCols
                  mobile
                  data={module.webModuleCollections}
                  iModuleId={module.iModuleId}
                  selectedHeight={module.selectedHeight}
                />
              </div>
            </>
          );
          break;
        default:
          break;
      }
    });

    return HomeModules;
  }

  render() {
    return (
      <div>
        <div className="container siteWidthContainer">
          <div className="category-page">
            {this.props.isLoading ? (
              <>
                <div className="category-page__left">
                  <aside className="categories">
                    <Loading
                      type="gray"
                      width="50px"
                      height="50px"
                      styleSheet={{ margin: "100px auto" }}
                    />
                  </aside>
                </div>
                <div className="category-page__right">
                  <HomeSliderLoader />
                  <GoodsSliderLoader />
                  <GoodsSliderLoader />
                </div>
              </>
            ) : (
              <>
                <div className="category-page__left">
                  <aside className="categories">
                    <Dropdown
                      headerClass="categories__top-link"
                      containerClass="categories__list-container"
                      alwaysOpen
                      noDropIcon
                      text={this.props.catTitle}
                    >
                      <ul className="categories__list">
                        {this.props.cats?.map((cat) => {
                          let allLink;
                          if (cat.haveWebPage) {
                            allLink = `/${this.props.curr}-${this.props.lang}/category/${cat.categoryId}`;
                          } else {
                            allLink = `/${this.props.curr}-${this.props.lang}/search?id=${cat.categoryId}&type=${SEARCH_TYPE_CATEGORY}`;
                          }
                          return (
                            <li
                              key={cat.categoryId}
                              className="categories__list-item"
                            >
                              <Link href={allLink}>
                                <a className="categories__list-link">
                                  {cat.categoryTitle}
                                </a>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </Dropdown>
                    <Dropdown
                      headerClass="categories__top-link"
                      containerClass="categories__list-container"
                      alwaysOpen
                      noDropIcon
                      text={<Translate id="brands" />}
                    >
                      <Brands
                        brands={this.state.brands}
                        catId={this.props.catId2}
                      />
                      {/* <ul className="categories__list">
                        {this.props.brands?.map((brand) => {
                          return (
                            <li
                              key={brand.brandId}
                              className="categories__list-item"
                            >
                              <Link
                                href={`/${this.props.curr}-${this.props.lang}/search?brandId=${brand.brandId}&type=${SEARCH_TYPE_SEARCH}`}
                              >
                                <a className="categories__list-link">
                                  {brand.brandTitle}
                                </a>
                              </Link>
                            </li>
                          );
                        })}
                      </ul> */}
                    </Dropdown>
                  </aside>
                </div>
                <div className="category-page__right">
                  {/* <HomeSlider /> */}
                  {this.renderModules(this.props.modules)}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  fetchCategory,
};

const mapStateToProps = (state) => {
  return {
    lang: selectLang(state),
    curr: selectCurr(state),
    cats: selectCats(state),
    brands: selectBrands(state),
    slider: selectSlider(state),
    catId: selectCatId(state),
    isIDLE: selectCategoryStatus(state) === IDLE,
    isLoading:
      selectCategoryStatus(state) === LOADING ||
      selectCategoryStatus(state) === IDLE,
    catTitle: selectCatTitle(state),
    modules: selectwebHomeModuleList(state),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Categories));
