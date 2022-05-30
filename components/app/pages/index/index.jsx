import React from "react";
import HomeSlider from "./../../HomeSlider";
import { LinearHeader, BoxStyle1, Loading } from "../../../common";
import TopCategoriesList from "./../../TopCategoriesList";
import GoodsSlider from "./../../GoodsSlider";
import SwiperSlider from "./../../SwiperSlider";
import ImgCols from "./../../ImgCols";
import { connect } from "react-redux";
import {
  CATEGOR_LIST,
  PRODUCT_LIST,
  ADV1,
  ADV2,
  ADV3,
  ADV4,
  ADV6,
  SLIDER
} from "./homeConstant";
import {
  fetchHome,
  LOADING,
  selectSlider,
  selectStatus,
  selectHome,
  IDLE,
  SUCCEEDED,
} from "./homeSlice";
import { selectLang } from "../../../../appConfigSlice";
import GoodsSliderLoader from "../../GoodsSlider/GoodsSliderLoader";
import HomeSliderLoader from "../../HomeSlider/HomeSliderLoader";
// import "./index.scss";

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.HomeModules = [];
    this.lang = this.props.lang;
  }

  componentDidMount() {
    this.props.fetchHome();
  }

  renderModules(data) {
    const HomeModules = [];

    data.webHomeModuleList?.map((module, index) => {
      switch (module.fkModuleId) {
        case CATEGOR_LIST:
          ///// TOP CATEGORY LIST
          HomeModules.push(
            <TopCategoriesList
              key={index}
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
              showViewAll={true}
              viewAllId={module.webModuleCollections[0]?.collectionId}
              key={index}
              headerContent={module.webModuleCollections[0]?.collectionTitle}
            >
              <GoodsSlider
                data={module.webModuleCollections[0]?.goods}
                count={6}
              />
            </BoxStyle1>
          );
          break;
        case ADV1:
          // Images module
          HomeModules.push(
            <React.Fragment key={index}>
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
            </React.Fragment>
          );

          break;
        case ADV2:
          // Images modules
          HomeModules.push(
            <React.Fragment key={index}>
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
            </React.Fragment>
          );
          break;
        case ADV3:
          // Images modules
          HomeModules.push(
            <React.Fragment key={index}>
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
            </React.Fragment>
          );
          break;
        case ADV4:
          // Images modules
          HomeModules.push(
            <React.Fragment key={index}>

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
            </React.Fragment>
          );
          break;
        case ADV6:
          // Images modules
          HomeModules.push(
            <React.Fragment key={index}>
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
            </React.Fragment>
          );
          break;

        case SLIDER:
          // Images modules
          HomeModules.push(
            <React.Fragment key={index}>
              <div className="imgCols_big-desktop mt-5 mb-5">
                <SwiperSlider
                  data={module.webModuleCollections}
                  iModuleId={module.iModuleId}
                  loader={this.props.isLoading}
                />
              </div>
              <div className="imgCols_mobile  mt-5 mb-5">
                <SwiperSlider
                  mobile
                  data={module.webModuleCollections}
                  iModuleId={module.iModuleId}
                  loader={this.props.isLoading}
                />
              </div>
            </React.Fragment>
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
      <div className="index-home">
        <div className="container siteWidthContainer">
          {this.props.isLoading ? (
            <>
              <HomeSliderLoader />
              <GoodsSliderLoader />
              <GoodsSliderLoader />
              <GoodsSliderLoader />
            </>
          ) : (
            <>
              {this.props.slider && (
                <>
                  <HomeSlider slider={this.props.slider} isLoading={false} />
                  <HomeSlider
                    slider={this.props.slider}
                    isLoading={false}
                    responsive
                  />
                </>
              )}

              {this.renderModules(this.props.data)}
            </>
          )}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = { fetchHome };

const mapStateToProps = (state) => {
  return {
    lang: selectLang(state),
    slider: selectSlider(state),
    isLoading: selectStatus(state) === LOADING || selectStatus(state) === IDLE,
    data: selectHome(state),
    status: selectStatus(state),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
