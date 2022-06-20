import React from "react";
// import "./GoodDetail.scss";
// import "./GoodDetail-rtl.scss";
import { connect } from "react-redux";
import { BoxStyle1, BoxStyle2, BreadCrump } from "../../../common";
import { Translate } from "react-localize-redux";
import Cookies from "js-cookie";
import {
  ItemDetail,
  DeliveryPanel,
  GoodDetailAside,
  GoodDetailTabs,
} from "./GoodDetailLayouts";
import { CSSTransition } from "react-transition-group";
import {
  selectLang,
  selectCurr,
  selectLogin,
  PREVLINK_CHANGE,
} from "../../../../appConfigSlice";
import { generatetGoodsVarietyExistencePossibilityAndPrintStructure } from "./GoodDetailAlgo";
import { GoodDetailContext } from "./GoodDetailContext";
import {
  client_addToCart,
  client_likeGood,
} from "../../../../lib/api/client/clientCart";
import { setCartCookie } from "../../../../lib/helpers";
import axiosClient from "../../../../lib/api/axios";
import { withRouter } from "next/router";
import { client_viewGood } from "../../../../lib/api/client/clientCommon";
import {
  selectWishCount,
  addWishCount,
} from "../CartAndWishlist/cartAndWishlistSlice";
import GoodsSlider from "../../GoodsSlider";
import { DesktopsAndBigger } from "../../../../Responsive";

class GoodDetail extends React.Component {
  constructor(props) {
    super(props);

    this.lang = this.props.lang;

    this.panelRef = React.createRef();
    this.goodData = this.props.data;
    this.providerId =
      this.goodData.goodsProviderVarity[0] &&
      this.goodData.goodsProviderVarity[0].providerId;
    this.goodId = this.goodData.goodsId;

    const [
      printStructure,
      VarietyExistencePossibility,
    ] = generatetGoodsVarietyExistencePossibilityAndPrintStructure(
      this.goodData.goodsProviderVarity
    );

    this.VariSelected = {};
    this.goodData.goodsProviderVarity[0].tGoodsVariety.forEach((vari) => {
      this.VariSelected[vari.parameterTitle] = vari.fkVariationParameterValueId;
    });

    this.state = {
      descriptionCalculateShopRate: this.goodData?.descriptionCalculateShopRate,
      saleWithCall: this.goodData?.saleWithCall,
      isDownloadable: this.goodData?.isDownloadable,
      inProp: false,
      variSelected: this.VariSelected,
      selectedItemCount: 1,
      changeSelectedItemCount: this.handleSelectedItemCount,
      variPrintStructure: printStructure,
      VarietyExistencePossibility: VarietyExistencePossibility,
      handleVariSelect: this.handleVariSelect,
      handleNonMatchedVariSelect: this.handleNonMatchedVariSelect,
      SelectedProviderIndex: 0,
      selectedProviderId: this.goodData?.goodsProviderVarity[0].providerId,
      providerShopId: this.goodData?.goodsProviderVarity[0].fkShopId,
      providerCityId: this.goodData?.shopCityId,
      selectedCityId: this.goodData?.shopCityId,
      selectedCountryId: this.goodData?.shopCountryId,
      providerCountryId: this.goodData?.shopCountryId,
      selectedProvinceId: this.goodData?.shopProvinceId,
      providerProvinceId: this.goodData?.shopProvinceId,
      providerCityText: this.goodData?.shopCityTitle,
      providerCityDeliveryType: this.goodData?.goodsProviderVarity[0]
        .shippingPossibilities,      
    providerCityDeliveryTypeImage: this.goodData?.goodsProviderVarity[0]
        .shippingImage,        
    providerCityDeliveryTypeDesc: this.goodData?.goodsProviderVarity[0]
        .shippingDesc,        
    providerCityDeliveryPostTimeoutDay: this.goodData?.goodsProviderVarity[0]
        .postTimeoutDay,
      deliveryBoxLoading: false,
      handleCityClick: this.handleCityClick,
      handleDeliveryBoxLoading: this.handleDeliveryBoxLoading,
      itemLiked: this.goodData.like,
    };
  }

  handleCityClick = (
    providerCityDeliveryType,
    shippingImage,
    shippingDesc,
    providerCityDeliveryPostTimeoutDay,
    providerCityText,
    selectedCountryId,
    selectedCityId,
    selectedProvinceId
  ) => {
    this.setState((state) => {
      return {
        ...state,
        providerCityText,
        selectedCityId,
        selectedCountryId,
        selectedProvinceId,
        providerCityDeliveryType,
        shippingImage,
        shippingDesc,
        providerCityDeliveryPostTimeoutDay,
        deliveryBoxLoading: false,
      };
    });
  };

  handleSelectedItemCount = (count) => {
    this.setState({
      selectedItemCount: count,
    });
  };

  addToCart = async () => {
    let count = this.state.selectedItemCount;
    if (!count) count = 1;
    try {
      const result = await client_addToCart({
        goodId: this.goodId,
        providerId: this.state.selectedProviderId,
        cityId: this.state.selectedCityId,
        count: count,
        countryId: this.state.selectedCountryId,
        provinceId: this.state.selectedProvinceId,
      });
      if (result.status === 200) {
        const id = result.result.cookieId;
        const cartId = Cookies.get(
          process.env.NEXT_PUBLIC_Token_Cookie_name_cart
        );
        if (!cartId && id) {
          setCartCookie(id);
          axiosClient.setCartId(id);
        }
        this.props.router.push(`/${this.props.curr}-${this.props.lang}/cart`);
      }
    } catch (err) {
      // return false;
    }
  };

  handleDeliveryBoxLoading = (show) => {
    this.setState({
      deliveryBoxLoading: show,
    });
  };

  handleVariSelect = (newVariSelected, providerIndex) => {
    // this.setState({ variSelected: newVariSelected });
    this.setState((state) => {
      return {
        ...state,
        selectedItemCount: 1,
        variSelected: newVariSelected,
        SelectedProviderIndex: providerIndex,
        selectedProviderId: this.goodData.goodsProviderVarity[providerIndex]
          .providerId,
      };
    });
  };

  handleNonMatchedVariSelect = (providerIndex) => {
    const newVariSelect = {};
    this.goodData.goodsProviderVarity[providerIndex].tGoodsVariety.forEach(
      (vari) => {
        newVariSelect[vari.parameterTitle] = vari.fkVariationParameterValueId;
      }
    );
    this.setState((state) => {
      return {
        ...state,
        selectedItemCount: 1,
        variSelected: newVariSelect,
        SelectedProviderIndex: providerIndex,
        selectedProviderId: this.goodData.goodsProviderVarity[providerIndex]
          .providerId,
      };
    });
  };

  openPanel = () => {
    this.setState({
      inProp: true,
    });
  };

  closePanel = () => {
    this.setState({
      inProp: false,
    });
  };

  componentDidMount() {
    client_viewGood(this.goodId)
      .then(() => { })
      .catch((err) => {
        console.log(err);
      });
  }

  handleLikeClick = (e) => {
    e.preventDefault();
    if (!this.props.isLogin) {
      this.props.saveLink(this.props.router.asPath);
      this.props.router.push(`/${this.props.curr}-${this.props.lang}/Auth`);
      return;
    }
    const result = client_likeGood(this.goodId);

    this.setState({
      itemLiked: !this.state.itemLiked,
    });

    const wishCount = this.state.itemLiked
      ? this.props.wishCount - 1
      : this.props.wishCount + 1;
    this.props.addWishCount(wishCount);
  };

  handleBuyNow = async () => {
    if (!this.props.isLogin) {
      this.props.saveLink(this.props.router.asPath);
      this.props.router.push(`/${this.props.curr}-${this.props.lang}/Auth`);
      return;
    }

    let count = this.state.selectedItemCount;
    if (!count) count = 1;
    try {
      const result = await client_addToCart({
        goodId: this.goodId,
        providerId: this.state.selectedProviderId,
        cityId: this.state.selectedCityId,
        count: count,
        countryId: this.state.selectedCountryId,
        provinceId: this.state.selectedProvinceId,
        oneClick: true,
      });

      if (result.status === 200) {
        if (result.result.setOneClick) {
          this.props.router.push(
            `/${this.props.curr}-${this.props.lang}/order?to=pay`
          );
        } else {
          this.props.router.push(`/${this.props.curr}-${this.props.lang}/cart`);
        }
      }
    } catch (err) {
      // return false;
    }
  };

  render() {
    return (



      <GoodDetailContext.Provider value={this.state}>

        <div className="container siteWidthContainer">
          <DesktopsAndBigger className="w-100">
            {this.goodData.parentCategory?.length > 0 ? (
              <BreadCrump
                className="col-12 goods-details-Bread-crump"
                data={this.goodData.parentCategory}
                isGoodsDetails={true}
                goodsName={this.goodData?.title}
              />
            ) : (
                <div style={{ height: "10px", width: "100%" }}></div>
              )}
          </DesktopsAndBigger>
          <div className="goodDetail">
            <CSSTransition
              unmountOnExit
              in={this.state.inProp}
              timeout={300}
              classNames="goodDetail__panel--anim"
              nodeRef={this.panelRef}
            >
              <DeliveryPanel
                panelRef={this.panelRef}
                closePanel={this.closePanel}
              />
            </CSSTransition>

            <div className="row goodDetail__row">
              <section className="col-lg-9 col-12 goodDetail__row-p-0">
                <article className="goodDetail__left-top-cnt">
                  <BoxStyle2>
                    <ItemDetail
                      handleLikeClick={this.handleLikeClick}
                      openPanel={this.openPanel}
                      data={this.goodData}
                    />
                  </BoxStyle2>
                </article>
                <article className="goodDetail__left-bottom-cnt">
                  <BoxStyle2>
                    <GoodDetailTabs description={this.goodData?.description} />
                  </BoxStyle2>
                </article>
              </section>
              <aside className="col-lg-3 col-12 goodDetail__aside">
                <BoxStyle2>
                  <GoodDetailAside
                    data={this.goodData}
                    handleLikeClick={this.handleLikeClick}
                    addToCart={this.addToCart}
                    handleBuyNow={this.handleBuyNow}
                    providerId={this.providerId}
                    goodId={this.goodId}
                    shopDetailAccess={this.goodData.shopDetailAccess}
                  />
                </BoxStyle2>
              </aside>
            </div>
            <section className="goodDetail__recommend">
              {this.goodData.recommendation && (
                <Translate>
                  {({ translate }) => {
                    return (
                      <BoxStyle1
                        headerContent={translate("common.recommended")}
                      >
                        <GoodsSlider
                          reloadOnClick
                          data={this.goodData.recommendation}
                          count={6}
                        />
                      </BoxStyle1>
                    );
                  }}
                </Translate>
              )}
            </section>
          </div>
        </div>
      </GoodDetailContext.Provider>
    );
  }
}

const mapDispatchToProps = {
  saveLink: (link) => {
    return {
      type: PREVLINK_CHANGE,
      payload: {
        link,
      },
    };
  },
  addWishCount,
};

const mapStateToProps = (state) => {
  return {
    lang: selectLang(state),
    curr: selectCurr(state),
    isLogin: selectLogin(state).isLogin,
    wishCount: selectWishCount(state),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(GoodDetail));
