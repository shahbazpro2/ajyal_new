import React from "react";
// import "./GoodDetailAside.scss";
// import "./GoodDetailAside-rtl.scss";
import { ReactComponent as ArrowIcon } from "./../../../../../../assets/icons/linear-arrow-sky.svg";
import { ReactComponent as StoreIcon } from "./../../../../../../assets/icons/store.svg";
import { ReactComponent as ComponentIcon } from "./../../../../../../assets/icons/Component88.svg";
import { ReactComponent as ReturnsIcon } from "./../../../../../../assets/icons/Returns.svg";
import { ReactComponent as CancelReturn } from "./../../../../../../assets/icons/cancel.svg";

import { Translate } from "react-localize-redux";
import {
  SelectBox3 as SelectBox,
  Loading,
  StarRating,
} from "../../../../../common";
import classnames from "classnames";
import DropDown from "react-dropdown";
import expressIcon from "./../../../../../../assets/icons/express.png";
import expressArIcon from "./../../../../../../assets/icons/express-ar.png";

import { ReactComponent as CartIconWhite } from "./../../../../../../assets/icons/addtocard-white.svg";
import { ReactComponent as BuyNowIcon } from "./../../../../../../assets/icons/buy-now.svg";
import { ReactComponent as HeartCircleIcon } from "./../../../../../../assets/icons/heart-circle.svg";
import { ReactComponent as HeartCircleIconFill } from "./../../../../../../assets/icons/heart-circle-fill.svg";
import { ReactComponent as SecureIcon } from "./../../../../../../assets/icons/secure.svg";
import { ReactComponent as TrustIcon } from "./../../../../../../assets/icons/trust.svg";

import SlideDown from "react-slidedown";
import { GoodDetailContext } from "../../GoodDetailContext";
import { generateArrNumberRange, isAr } from "./../../../../../../lib/helpers";
import { connect } from "react-redux";
import {
  selectCurr,
  selectLang,
  PREVLINK_CHANGE,
  selectLogin,
} from "../../../../../../appConfigSlice";
import { withRouter } from "next/router";
import Link from "next/link";
import StoreBtn from "./../../../../../../assets/icons/store-btn.svg";
import { client__getProviderInfo } from "../../../../../../lib/api/client/clientGoodDetail";
import HtmlRenderModal from "../../../../../common/HtmlRenderModal/HtmlRenderModal";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";

const NOT_POSSIBLE = 7;

class GoodDetailAside extends React.Component {
  static contextType = GoodDetailContext;
  constructor(props) {
    super(props);
    this.state = {
      slideDown: true,
      goodCount: 1,
      addToCardLoading: false,
      providerChangeLoading: false,
      buyNowLoading: false,
      providerInfoLoading: false,
      providerHaveContent: this.props.shopDetailAccess ? true : false,
    };

    // surveyCount;
    // surveyScore;
  }
  handleSlide = () => {
    this.setState((state) => {
      return {
        slideDown: !state.slideDown,
      };
    });
  };

  goodCountHandler = (selected) => {
    // console.log(value)
    // this.setState({
    //   goodCount: selected.value,
    // });
    this.context.changeSelectedItemCount(selected.value);
  };

  handleAddToCart = async (e) => {
    e.preventDefault();
    if (
      this.state.addToCardLoading ||
      !this.providerData.hasInventory ||
      this.context.providerCityDeliveryType === NOT_POSSIBLE ||
      this.state.buyNowLoading
    )
      return;

    this.setState({
      addToCardLoading: true,
    });

    // let count = parseInt(this.context.selectedItemCount);
    // if (!count) count = 1;

    const result = this.props.addToCart();
  };

  handleProviderChange = (selected) => {
    this.setState({
      providerChangeLoading: true,
    });

    const [goodId, providerId, slug] = this.props.router.query.good;
    window.location.href = `/${this.props.curr}-${this.props.lang}/product/${goodId}/${selected[0].name}/${slug}`;
  };

  handleClickBuyNow = (e) => {
    e.preventDefault();
    if (
      this.state.addToCardLoading ||
      !this.providerData.hasInventory ||
      this.context.providerCityDeliveryType === NOT_POSSIBLE
    )
      return;
    if (this.state.buyNowLoading) return;
    this.setState({ buyNowLoading: true });
    this.props.handleBuyNow();
  };

  handleProviderInfo = async (e) => {
    e.preventDefault();
    if (this.state.providerInfoLoading) return;
    this.setState({ providerInfoLoading: true });

    if (!this.props.isLogin) {
      this.props.saveLink(this.props.router.asPath);
      this.props.router.push(`/${this.props.curr}-${this.props.lang}/Auth`);
      return;
    }

    try {
      const res = await client__getProviderInfo(
        this.props.goodId,
        this.props.providerId
      );
      if (res.status == 200) {
        this.setState({
          providerInfo: res.result,
          providerInfoLoading: false,
          providerHaveContent: true,
        });
      }
    } catch (err) {
      console.log(err);
      this.setState({ providerInfoLoading: false });
    }
  };

  render() {
    this.providerData = this.props.data?.goodsProviderVarity[
      this.context.SelectedProviderIndex
    ];
    this.otherProvider = this.props.data?.otherProvider;
    return (
      <aside className="goodDetailAside">
        <div className="goodDetailAside__top-box">
          <ul className="goodDetailAside__top-list">
            <li className="goodDetailAside__top-item">
              <StoreIcon className="goodDetailAside__top-icon" />
              <span className="gray-text">
                <Translate id="aside.soldby" />
              </span>
              {this.providerData?.microstore ? (
                <span className="sky-text-link">
                  <Link
                    href={`/${this.props.curr}-${this.props.lang}/${this.providerData?.vendorUrl}`}
                  >
                    <a>{this.providerData?.shopTitle}</a>
                  </Link>
                </span>
              ) : (
                <span className="sky-text-link">
                  {this.providerData?.shopTitle}
                </span>
              )}
            </li>
            {this.providerData?.haveGuarantee && (
              <li className="goodDetailAside__top-item">
                <ComponentIcon className="goodDetailAside__top-icon" />
                <span className="gray-darker-text">
                  {this.providerData?.guaranteeMonthDuration}&nbsp;
                  <Translate id="aside.month-war" />
                </span>
              </li>
            )}
            {this.providerData?.returningAllowed ? (
              <li className="goodDetailAside__top-item">
                <ReturnsIcon className="goodDetailAside__top-icon" />
                <span className="gray-darker-text">
                  <Translate id="aside.free-return" />
                </span>
              </li>
            ) : (
              <li className="goodDetailAside__top-item">
                <CancelReturn className="goodDetailAside__top-icon" />
                <span className="gray-darker-text">
                  <Translate id="aside.dont-return" />
                </span>
              </li>
            )}
          </ul>
          {/* shop score */}
          {/* <ul className="goodDetailAside__top-list">
            <li className="goodDetailAside__pro-item">
              <span className="goodDetailAside__pro-text d-block">
                <Translate id="aside.always-stock" />
              </span>
              <ColorFullProgressBar
                // number={2}
                percent={40}
                colorfullnumber
                strokeWidth={3}
                trailWidth={3}
              />
            </li>
            <li className="goodDetailAside__pro-item">
              <span className="goodDetailAside__pro-text d-block">
                <Translate id="aside.ship-on" />
              </span>
              <ColorFullProgressBar
                // number={2}
                percent={60}
                colorfullnumber
                strokeWidth={3}
                trailWidth={3}
              />
            </li>
          </ul> */}
        </div>
        {this.props.data.goodsProviderVarity[0]?.shopSurveyCount ? (
          <div className="goodDetailAside__shopscore-cnt d-flex align-items-center mt-3">
            <span className="goodDetailAside__sellerscore-text">
              <Translate id="aside.seller-reviews" />
            </span>
            <StarRating
              name="Shop rate"
              editing={false}
              starCount={5}
              value={this.props.data.goodsProviderVarity[0]?.shopSurvey}
              nextText={`(${this.props.data.goodsProviderVarity[0]?.shopSurvey})`}
            />
            <span className="bold mt-1">
              {this.props.data.goodsProviderVarity[0]?.shopSurveyCount}
            </span>
          </div>
        ) : undefined}
        <div className="how-cal">
          <HtmlRenderModal
            description={this.props.data?.descriptionCalculateShopRate}
          />
        </div>
        <div className="goodDetailAside__btm-box">
          {this.otherProvider?.length > 0 && (
            <SlideDown className="goodDetailAside__slide-down">
              {this.state.slideDown &&
                (this.state.providerChangeLoading ? (
                  <Loading
                    type="gray"
                    width="40px"
                    height="40px"
                    styleSheet={{ margin: "30px auto" }}
                  />
                ) : (
                  <SelectBox onChange={this.handleProviderChange}>
                    {this.otherProvider.map((provider, index) => {
                      return (
                        <SelectBox.SelectItem
                          key={index}
                          name={provider.providerId}
                          value={provider.shopTitle}
                        >
                          <ul className="goodDetailAside__select-list">
                            <li className="goodDetailAside__select-row">
                              <span className="gray-text">
                                <Translate id="aside.soldby" />
                              </span>
                              <span className="sky-text-link">
                                {provider.shopTitle}
                              </span>
                            </li>
                            {provider.haveGuarantee && (
                              <li className="goodDetailAside__select-row">
                                <span className="gray-darker-text">
                                  {provider.guaranteeMonthDuration}&nbsp;
                                  <Translate id="aside.month-war" />
                                </span>
                              </li>
                            )}
                            {!provider.shippingPossibilities && (
                              <li className="goodDetailAside__select-row">
                                <img
                                  className="goodDetailAside__selectIcon"
                                  src={
                                    isAr(this.props.lang)
                                      ? expressArIcon
                                      : expressIcon
                                  }
                                  alt="express"
                                />
                              </li>
                            )}
                            <li className="goodDetailAside__select-row">
                              <span className="gray-darker-text-small">
                                <Translate id={this.props.curr} />
                                &nbsp;{provider.finalPrice}
                              </span>
                            </li>
                          </ul>
                        </SelectBox.SelectItem>
                      );
                    })}
                  </SelectBox>
                ))}
            </SlideDown>
          )}
          {this.otherProvider?.length > 0 && (
            <div className="goodDetailAside__offer-text-cnt">
              {this.otherProvider?.length} <Translate id="aside.other-offer" />
              <span
                onClick={this.handleSlide}
                className="sky-text-link goodDetailAside__offer-text"
              >
                {this.state.slideDown ? (
                  <Translate id="aside.less" />
                ) : (
                  <Translate id="aside.view-offer" />
                )}
                <ArrowIcon
                  className={classnames("goodDetailAside__offer-arrow", {
                    "goodDetailAside__offer-arrow--close": !this.state
                      .slideDown,
                    "goodDetailAside__offer-arrow--open": this.state.slideDown,
                  })}
                />
              </span>
            </div>
          )}
          {!this.context.saleWithCall ? (
            <>
              <div className="goodDetailAside__btn-cnt flex-nowrap flex-md-wrap">
                {this.providerData?.hasInventory &&
                  (this.props.data?.isDownloadable != true ? (
                    <>
                      <div className="cart-item__quantity">
                        <span className="cart-item__qut-text">
                          <Translate id="aside.quantity" />
                        </span>
                        <DropDown
                          value={this.context.selectedItemCount.toString()}
                          className="gray__dropDown cart-item__dropdown"
                          options={generateArrNumberRange(
                            1,
                            this.providerData.inventoryCount
                          )}
                          onChange={this.goodCountHandler}
                        />
                      </div>
                      <div className="cart-item__quantity-mobile">
                        <div className="d-flex flex-column align-items-center"
                          onClick={() => {
                            document
                              .getElementById("quantityMobile")
                              .classList.toggle("quantity-mobile-slide-active");
                          }}
                        >
                          <span className="Qty-mobile">Qty</span>
                          <span className="count-mobile">
                            {this.context.selectedItemCount}
                          </span>
                        </div>
                        <div
                          className="quantity-mobile-slide"
                          id="quantityMobile"
                        >
                          <div className="quantity-mobile-select">
                            <header>
                              <span><Translate id="aside.quantity" /></span>
                              <button
                                type="button"
                                onClick={() => {
                                  document
                                    .getElementById("quantityMobile")
                                    .classList.remove(
                                      "quantity-mobile-slide-active"
                                    );
                                }}
                              >
                                <svg
                                  width="23"
                                  height="23"
                                  viewBox="0 0 23 23"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  class="cross"
                                >
                                  <path
                                    d="M0.324008 1.909C-0.104992 1.48 -0.104992 0.766002 0.324008 0.322002C0.768008 -0.106998 1.46701 -0.106998 1.91101 0.322002L11.434 9.861L20.973 0.322002C21.402 -0.106998 22.116 -0.106998 22.544 0.322002C22.988 0.766002 22.988 1.481 22.544 1.909L13.021 11.433L22.544 20.972C22.988 21.401 22.988 22.115 22.544 22.559C22.115 22.988 21.401 22.988 20.973 22.559L11.434 13.02L1.91101 22.559C1.46701 22.988 0.768008 22.988 0.324008 22.559C-0.104992 22.115 -0.104992 21.4 0.324008 20.972L9.84701 11.433L0.324008 1.909Z"
                                    fill="#1E201D"
                                  ></path>
                                </svg>
                              </button>
                            </header>
                            <div>
                              <Swiper spaceBetween={10} slidesPerView={6}>
                                {[
                                  ...Array(
                                    this.providerData.inventoryCount > 10
                                      ? 10
                                      : this.providerData.inventoryCount
                                  ),
                                ].map((x, i) => (
                                  <SwiperSlide
                                    onClick={() => {
                                      let n = i + 1;
                                      if (!n) n = "";
                                      if (n <= 10) {
                                        this.context.changeSelectedItemCount(n);
                                        document
                                          .getElementById("quantityMobile")
                                          .classList.remove(
                                            "quantity-mobile-slide-active"
                                          );
                                      }
                                    }}
                                  >
                                    <div
                                      className={
                                        "swiper-slide-content " +
                                        (this.context.selectedItemCount == i + 1
                                          ? "swiper-slide-content-active"
                                          : "")
                                      }
                                    >
                                      {i + 1}
                                    </div>
                                  </SwiperSlide>
                                ))}
                              </Swiper>
                            </div>
                          </div>
                        </div>
                        {/* <input
                          type="number"
                          value={this.context.selectedItemCount}
                          onChange={(e) => {
                            let n = parseInt(e.target.value);
                            if (!n) n = "";
                            if (n <= 10) {
                              this.context.changeSelectedItemCount(n);
                            }
                          }}
                        /> */}
                      </div>
                    </>
                  ) : null)}

                <a
                  className={classnames(
                    "primary-btn mt-0 mt-md-3",
                    "goodDetailAside__btn",
                    {
                      disabled:
                        !this.providerData.hasInventory ||
                        this.context.providerCityDeliveryType === NOT_POSSIBLE,
                      "goodDetailAside__btn--margin":
                        !this.providerData.hasInventory ||
                        this.context.providerCityDeliveryType === NOT_POSSIBLE,
                    }
                  )}
                  href=""
                  onClick={this.handleAddToCart}
                >
                  {!this.providerData.hasInventory ? (
                    <Translate id="common.unavailable" />
                  ) : this.state.addToCardLoading ? (
                    <Loading type="white" width="25px" height="25px" />
                  ) : (
                    <>
                      <CartIconWhite className="goodDetailAside__text-icon" />
                      <Translate id="aside.add-cart" />
                    </>
                  )}
                </a>
              </div>
              {this.providerData?.hasInventory && (
                <a
                  className={classnames(
                    "primary-btn mt-3 ml-0 mr-0",
                    "goodDetailAside__btn goodDetailAside__btn--bordered",
                    {
                      disabled:
                        // !this.providerData.hasInventory ||
                        this.context.providerCityDeliveryType === NOT_POSSIBLE,
                    }
                  )}
                  href=""
                  onClick={this.handleClickBuyNow}
                >
                  {this.state.buyNowLoading ? (
                    <Loading type="gray" width="25px" height="25px" />
                  ) : (
                    <>
                      <BuyNowIcon className="goodDetailAside__text-icon" />
                      <Translate id="aside.buy-now" />
                    </>
                  )}
                </a>
              )}
            </>
          ) : (
            <div
              className={classnames("goodDetailAside__sellWithCall-cnt", {
                "itemDetail__sellWithCall-cnt--styled": this.state
                  .providerHaveContent,
              })}
            >
              <p className="goodDetailAside__sellWithCall-text">
                <Translate id="detail.provider-msg1" />
              </p>
              {!this.state.providerHaveContent ? (
                <>
                  <a
                    className={classnames(
                      "primary-btn",
                      "goodDetailAside__sellWithCall-btn"
                    )}
                    href=""
                    onClick={this.handleProviderInfo}
                  >
                    {this.state.providerInfoLoading ? (
                      <Loading type="white" width="20px" height="20px" />
                    ) : (
                      <>
                        <StoreBtn className="goodDetailAside__text-icon" />
                        <Translate id="detail.provider-info" />
                      </>
                    )}
                  </a>
                </>
              ) : (
                <div className="mt-2">
                  <div
                    className={classnames(
                      "goodDetailAside__sellWithCall-btn-active"
                    )}
                  >
                    <>
                      <StoreBtn className="goodDetailAside__text-icon" />
                      <Translate id="detail.provider-info-click" />
                    </>
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="goodDetailAside__wish-cnt">
            <a
              onClick={this.props.handleLikeClick}
              href=""
              className="goodItem-s2__wishlist-cnt"
            >
              {this.context.itemLiked ? (
                <>
                  <HeartCircleIconFill className="goodItem-s2__wishlist-icon" />
                  <span className="goodItem-s2__wishlist-text">
                    <Translate id="aside.remove-wish" />
                  </span>
                </>
              ) : (
                <>
                  <HeartCircleIcon className="goodItem-s2__wishlist-icon" />
                  <span className="goodItem-s2__wishlist-text">
                    <Translate id="aside.add-wish" />
                  </span>
                </>
              )}
            </a>
          </div>
          <div className="goodDetailAside__bottom-data">
            <div className="goodDetailAside__bottom-data__item">
              <div className="goodDetailAside__bottom-data__item__left">
                <SecureIcon className="goodDetailAside__bottom-data__item__icon" />
              </div>
              <div className="goodDetailAside__bottom-data__item__right">
                <p className="goodDetailAside__bottom-data__item__title">
                  <Translate id="aside.bottomData.secure-shopping" />
                </p>
                <p className="goodDetailAside__bottom-data__item__desc">
                  <Translate id="aside.bottomData.your-data-protected" />
                </p>
              </div>
            </div>

            <div className="goodDetailAside__bottom-data__item">
              <div className="goodDetailAside__bottom-data__item__left">
                <TrustIcon className="goodDetailAside__bottom-data__item__icon" />
              </div>
              <div className="goodDetailAside__bottom-data__item__right">
                <p className="goodDetailAside__bottom-data__item__title">
                  <Translate id="aside.bottomData.trusted-shipping" />
                </p>
                <p className="goodDetailAside__bottom-data__item__desc">
                  <Translate id="aside.bottomData.free-shipping-desc" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
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
};

const mapStateToProps = (state) => {
  return {
    lang: selectLang(state),
    curr: selectCurr(state),
    isLogin: selectLogin(state).isLogin,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(GoodDetailAside));
