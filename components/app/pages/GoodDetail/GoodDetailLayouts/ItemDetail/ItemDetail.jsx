import React from "react";
import ImageGallery from "../../../../ImageGallery";
import { Translate } from "react-localize-redux";
import heartOutlineIcon from "./../../../../../../assets/icons/img-heart-outline.svg";
import heartOutlineIconFill from "./../../../../../../assets/icons/img-heart-fill.svg";
import { LandScapePhones } from "../../../../../../Responsive";
import VariSelect from "../VariSelect/VariSelect";
import { GoodDetailContext } from "../../GoodDetailContext";
import Link from "next/link";

import { connect } from "react-redux";
import {
  PREVLINK_CHANGE,
  selectCurr,
  selectLang,
  selectLogin,
} from "../../../../../../appConfigSlice";
import { formatMoney } from "../../../../../../lib/helpers";
import { Loading } from "../../../../../common";
import { isRtl } from "../../../../../../lib/isRtl";
import { withRouter } from "next/router";
import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber";
import { SEARCH_TYPE_CATEGORY } from "../../../../../../lib/querys";
import HtmlRenderModal from "../../../../../common/HtmlRenderModal/HtmlRenderModal";

const MARKET = 1;
const AJYAL = 2;
const UBEX = 3;
const DHL = 4;
const ARAMEX = 5;
const EXPRESS = 6;
const NOT_POSSIBLE = 7;

class ItemDetail extends React.Component {
  static contextType = GoodDetailContext;
  constructor(props) {
    super(props);
    this.goodData = this.props.data;
    this.is_rtl = isRtl(this.props.lang);
    this.PNF = PhoneNumberFormat;
    this.phoneUtil = PhoneNumberUtil.getInstance();
    this.phonenumber = null;
  }

  printVariSelect = () => {
    const variSelect = [];
    const {
      variPrintStructure,
      variSelected,
      VarietyExistencePossibility,
      handleVariSelect,
      handleNonMatchedVariSelect,
    } = this.context;

    for (let key in variPrintStructure) {
      variSelect.push(
        <VariSelect
          type={key}
          data={variPrintStructure[key]}
          variSelected={variSelected}
          varietyExistencePossibility={VarietyExistencePossibility}
          handleVariSelect={handleVariSelect}
          handleNonMatchedVariSelect={handleNonMatchedVariSelect}
        />
      );
    }

    return variSelect;
  };

  renderDeliverType = () => {
    let content = null;
    switch (this.context.providerCityDeliveryType) {
      case MARKET:
        content = (
          <>
            <img
              src={`${process.env.NEXT_PUBLIC_SHIPPINGMETHODIMAGE_PREFIX}/${
                MARKET + "." + this.props.lang + ".png"
              }`}
              alt="marketpalce"
              className="itemDetail__deli-img"
            />
          </>
        );
        break;
      case EXPRESS:
        content = (
          <img
            src={`${process.env.NEXT_PUBLIC_SHIPPINGMETHODIMAGE_PREFIX}/${
              EXPRESS + "." + this.props.lang + ".png"
            }`}
            alt="EXPRESS"
            className="itemDetail__deli-img"
          />
        );
        break;
      case AJYAL:
        content = (
          <img
            src={`${process.env.NEXT_PUBLIC_SHIPPINGMETHODIMAGE_PREFIX}/${
              AJYAL + "." + this.props.lang + ".png"
            }`}
            alt="AJYAL"
            className="itemDetail__deli-img"
          />
        );
        break;
      case UBEX:
        content = (
          <img
            src={`${process.env.NEXT_PUBLIC_SHIPPINGMETHODIMAGE_PREFIX}/${
              UBEX + "." + this.props.lang + ".png"
            }`}
            alt="UBEX"
            className="itemDetail__deli-img"
          />
        );
        break;
      case ARAMEX:
        content = (
          <img
            src={`${process.env.NEXT_PUBLIC_SHIPPINGMETHODIMAGE_PREFIX}/${
              ARAMEX + "." + this.props.lang + ".png"
            }`}
            alt="ARAMEX"
            className="itemDetail__deli-img"
          />
        );
        break;
      case DHL:
        content = (
          <img
            src={`${process.env.NEXT_PUBLIC_SHIPPINGMETHODIMAGE_PREFIX}/${
              DHL + "." + this.props.lang + ".png"
            }`}
            alt="DHL"
            className="itemDetail__deli-img"
          />
        );
        break;

      case NOT_POSSIBLE:
        content = (
          <p class="itemDetail__cityError">
            <Translate id="detail.city-not" />
          </p>
        );
        break;
    }
    return content;
  };

  printPhone = (phone, iso) => {
    try {
      const number = this.phoneUtil.parseAndKeepRawInput(phone, iso);
      return this.phoneUtil.format(number, this.PNF.INTERNATIONAL);
    } catch (err) {
      return phone;
    }
  };

  handleLikeClick = (e) => {
    this.props.handleLikeClick(e);
  };

  render() {
    const providerData = this.props.data?.goodsProviderVarity[
      this.context.SelectedProviderIndex
    ];
    return (
      <div className="row no-gutters">
        <div className="col-md-5 col-12">
          <LandScapePhones>
            <div onClick={this.handleLikeClick} className="item-detials-like">
              <img
                src={
                  this.context.itemLiked
                    ? heartOutlineIconFill
                    : heartOutlineIcon
                }
                alt="heartOutlineIcon"
              />
            </div>
          </LandScapePhones>

          <ImageGallery
            data={this.goodData?.goodsDocument}
            firstImg={this.goodData?.image}
            id={this.goodData.goodsId}
          />
        </div>

        <div className="col-md-6 col-12 imageGalley-portal-magnifier__container ">
          <div id="imageGalley-portal-magnifier" className="imageGalley-portal-magnifier"></div>
          <div className="itemDetail">
            <Link
              href={`/${this.props.curr}-${this.props.lang}/search?id=${this.goodData.fkCategoryId}&?type=${SEARCH_TYPE_CATEGORY}&brandId=${this.goodData?.brandId}`}
            >
              <a>
                <span className="cart-item__model itemDetail__small-text d-block brand">
                  {this.goodData?.brand}
                </span>
              </a>
            </Link>
            <a className="goodItem-s2__name">{this.goodData?.title}</a>
            <a className="itemDetail__cat-name itemDetail__link">
              {this.goodDeta?.category}
            </a>
            {/* {this.goodData?.surveyCount ? (
              <div className="goodItem-s1__star-container">
                <StarRatingComponent
                  name="Good Rate"
                  editing={false}
                  renderStarIcon={(index, value) => {
                    return (
                      <img
                        alt="star"
                        className="goodItem-s1__star"
                        src={index <= value ? startIcon : startGrayIcon}
                      />
                    );
                  }}
                  starCount={5}
                  value={this.goodData?.surveyScore}
                />
                <span className="goodItem-s2__start-count">
                  ( {this.goodData?.surveyCount}&nbsp;
                  <Translate id="detail.review" /> )
                </span>
              </div>
            ) : undefined} */}

            <div className="cart-item__model-container itemDetail__model-container d-flex">
              {this.goodData?.modelNumber && (
                <>
                  <span className="cart-item__model itemDetail__small-text">
                    <Translate id="detail.model-num" />
                  </span>
                  <span className="cart-item__model-num-value itemDetail__small-value">
                    {this.goodData.modelNumber}
                  </span>
                </>
              )}

              <div className="d-flex">
                <div className="itemDetail__survey-score">
                  {this.goodData?.surveyScore}
                </div>
                <a className="itemDetail__survey-count">
                 
                  {this.goodData?.surveyCount}
                  &nbsp;
                  <Translate id="sellerReviews" />‏
                 
                </a>
              </div>
            </div>

            {!this.context.saleWithCall && (
              <div>
                {providerData?.discountAmount > 0 && (
                  <div className="cart-item__model-container itemDetail__model-container itemDetail__model-container--margin d-flex">
                    <span className="itemDetail__small-text">
                      <Translate id="detail.was" />
                    </span>
                    <div className="d-flex">
                      {!isRtl(this.props.lang) && (
                        <span className="goodItem-s2__price-off">
                          <Translate id={this.props.curr} />
                          &nbsp;
                        </span>
                      )}
                      <span className="goodItem-s2__price-off ">
                        {formatMoney(
                          providerData.price + providerData.vatamount
                        )}
                      </span>
                      {isRtl(this.props.lang) && (
                        <span className="goodItem-s2__price-off">
                          &nbsp;
                          <Translate id={this.props.curr} />
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="goodItem-s2__right-ft itemDetail__right-ft">
                  <span className="itemDetail__small-text">
                    <Translate id="detail.now" />
                  </span>
                  <div className="itemDetail__final-price">
                    <div className="goodItem-s2__price-container">
                      {!isRtl(this.props.lang) && (
                        <span className="goodItem-s2__number">
                          <Translate id={this.props.curr} />
                          &nbsp;
                        </span>
                      )}
                      <span className="goodItem-s2__number">
                        {formatMoney(providerData?.finalPrice)}
                      </span>
                      {isRtl(this.props.lang) && (
                        <span className="goodItem-s2__number">
                          &nbsp;
                          <Translate id={this.props.curr} />
                        </span>
                      )}
                    </div>
                    {!providerData?.vatfree && (
                      <span className="itemDetail__small-value itemDetail__small-value--vat d-block">
                        <Translate id="detail.Inclusive" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {providerData?.discountAmount > 0 && (
              <div className="cart-item__model-container itemDetail__model-container itemDetail__model-container--margin d-flex">
                <span className="itemDetail__small-text">
                  <Translate id="detail.saving" />
                </span>
                <span className="itemDetail__small-value">
                  <Translate id={this.props.curr} />
                  &nbsp;
                  {formatMoney(providerData.discountAmount)}
                </span>
                <div className="goodItem-s2__off-percentage-container">
                  <span className="goodItem-s2__off-percentage">
                    {providerData.discountPercentage}
                  </span>
                  <span className="goodItem-s2__off-text">% OFF</span>
                </div>
              </div>
            )}
            {!this.context.saleWithCall && !this.context.isDownloadable && (
              <div className="itemDetail__delivery">
                <div className="itemDetail__deli-cnt">
                  {this.context.deliveryBoxLoading ? (
                    <Loading type="gray" width="70px" />
                  ) : (
                    <>
                      <div className="itemDetail__item">
                        <span className="itemDetail__item-small-text d-flex">
                          <Translate id="detail.deliverTo" />
                          <span className="itemDetail__item-small-text itemDetail__item-small-text--bold">
                            {this.context.providerCityText}
                          </span>
                        </span>
                        <span
                          className="itemDetail__link"
                          onClick={this.props.openPanel}
                        >
                          <Translate id="detail.changeAre" />
                        </span>
                      </div>
                      <div className="estimatore-container">
                        <div className="estimator_first">
                          <div className="estimator_left">
                            { (this.context.providerCityDeliveryType == MARKET || this.context.providerCityDeliveryType == AJYAL ) ? (
                              <div>
                                <p className="deliver-by d-flex">
                                  <Translate id="DeliveredBy" />‏
                                  <span className="on-date">
                                    {
                                      this.context
                                        .providerCityDeliveryPostTimeoutDay
                                    }
                                  </span>
                                </p>
                              </div>
                            ) : null}
                          </div>

                          <div className="estimator_right">
                            <div className="estimator-right-wrapper">
                              {this.renderDeliverType()}
                              <div className="help-icon-container">
                                {this.context.providerCityDeliveryType !==
                                NOT_POSSIBLE ? (
                                  <button
                                    type="button"
                                    className="tooltipTrigger"
                                    aria-label="Help Center"
                                  >
                                    {/* <HelpIcon className="help-icon" /> */}
                                    <HtmlRenderModal
                                      description={
                                        this.context
                                          .providerCityDeliveryTypeDesc
                                      }
                                      showText={false}
                                    />
                                  </button>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* {this.renderDeliverType()} */}
                    </>
                  )}
                </div>
              </div>
            )}

            {(providerData.tGoodsVariety.length > 0 ||
              this.context.saleWithCall) && (
              <div className="itemDetail__deli-sep"></div>
            )}

            {this.printVariSelect()}
          </div>
        </div>
      </div>
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
    curr: selectCurr(state),
    lang: selectLang(state),
    isLogin: selectLogin(state).isLogin,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ItemDetail));
