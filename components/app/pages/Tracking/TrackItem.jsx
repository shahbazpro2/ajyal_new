import React from "react";
import { Translate } from "react-localize-redux";

import {
  LandScapePhones,
  LandScapePhonesAndBigger,
} from "../../../../Responsive";
import { DeliveryProgress, GoodSituation } from "../../../common";
import { formatMoney } from "../../../../lib/helpers";

const MARKET = 1;
const AJYAL = 2;
const UBEX = 3 ;
const DHL = 4 ;
const ARAMEX = 5 ;
const EXPRESS = 6 ;
const NOT_POSSIBLE = 7;

export default class TrackItem extends React.Component {
  constructor(props) {
    super(props);
    this.goods_Pre = process.env.NEXT_PUBLIC_Goods_PREFIX;
  }

      
  renderDeliverType = () => {
    let content = null;
    switch (this.props.data.shippingMethod) {
      case MARKET:
        content = (
          <>
            <img
              src= {`${process.env.NEXT_PUBLIC_SHIPPINGMETHODIMAGE_PREFIX}/${MARKET+"."+this.props.lang+".png"}` }
              alt="marketpalce"
              className="goodItem-s2__exp"
            />

          </>
        );
        break;
      case EXPRESS:
        content = (
          <img
          src= {`${process.env.NEXT_PUBLIC_SHIPPINGMETHODIMAGE_PREFIX}/${EXPRESS+"."+this.props.lang+".png"}` }
            alt="EXPRESS"
            className="goodItem-s2__exp"
          />
        );
        break;
        case AJYAL:
          content = (
            <img
            src= {`${process.env.NEXT_PUBLIC_SHIPPINGMETHODIMAGE_PREFIX}/${AJYAL+"."+this.props.lang+".png"}` }
              alt="AJYAL"
              className="goodItem-s2__exp"
            />
          );
          break;
        case UBEX:
          content = (
            <img
            src= {`${process.env.NEXT_PUBLIC_SHIPPINGMETHODIMAGE_PREFIX}/${UBEX+"."+this.props.lang+".png"}` }
              alt="UBEX"
              className="goodItem-s2__exp"
            />
          );
          break;
        case ARAMEX:
          content = (
            <img
            src= {`${process.env.NEXT_PUBLIC_SHIPPINGMETHODIMAGE_PREFIX}/${ARAMEX+"."+this.props.lang+".png"}` }
              alt="ARAMEX"
              className="goodItem-s2__exp"
            />
          );
          break;
        case DHL:
          content = (
            <img
            src= {`${process.env.NEXT_PUBLIC_SHIPPINGMETHODIMAGE_PREFIX}/${DHL+"."+this.props.lang+".png"}` }
              alt="DHL"
              className="goodItem-s2__exp"
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


  render() {
    return (
      <article className="goodItem-s2 cart-item order-item">
        {!this.props.withoutRightBox && (
          <LandScapePhones className="order-item__detail-cnt order-item__detail-cnt-mobile p-0 col-12">
            <div className="d-flex">
              <GoodSituation
                id={this.props.data.statusId}
                title={this.props.data.statusTitle}
              />
              {this.props.data.statusId == 3 ||
                (this.props.data.statusId == 6 && (
                  <span className="order-item__detail-text order-item__detail-text--margin">
                    <Translate id="orders.on" />&nbsp;
                    {this.props.data.orderStatusPlacedDateTime}
                  </span>
                ))}
            </div>
          </LandScapePhones>
        )}
        <div className="goodItem-s2__left-container">
          <figure className="goodItem-s2__fig">
            <img
              alt=""
              className="goodItem-s2__img"
              src={`${this.goods_Pre}/${this.props.data.goodsId}/${this.props.data.goodsImage}`}
            />
          </figure>

          <div className="goodItem-s2__left-right">
            <div className="goodItem-s2__ns-con">
              <a className="goodItem-s2__name">{this.props.data.title}</a>
              <div className="cart-item__model-container">
                <span className="order-item__small-text">
                  <Translate id="orders.model-num" />
                </span>
                <span className="order-item__small-value">
                  {this.props.data.modelNumber}
                </span>
              </div>
              <div className="cart-item__model-container">
                <span className="order-item__small-text">
                  <Translate id="orders.sold-by" />
                </span>
                <span className="sky-text-link">
                  {this.props.data.shopName}
                </span>
              </div>
              <p className="order-item__detail-text order-item__detail-text--good">
                {this.props.data.returningAllowed ? (
                  <Translate id="orders.msg1" />
                ) : null}
              </p>
            </div>
            <div className="goodItem-s2__right-ft-con">
              <div className="goodItem-s2__right-ft">
                <span className="goodItem-s2__currency">
                  {this.props.currency.toUpperCase()}
                </span>
                <div className="goodItem-s2__price-container">
                  <span className="goodItem-s2__number">
                    {formatMoney(this.props.data.priceWithDiscount)}
                  </span>
                </div>

                {this.props.data.discountAmount != 0 ? (
                      <div className="goodItem-s2__off-percentage-container">
                        <span className="goodItem-s2__off-percentage">
                          {this.props.data.discountPercent}
                        </span>
                        <span className="goodItem-s2__off-text">% OFF</span>
                      </div>
                    ) : undefined}
                
                    {this.props.data.discountAmount != 0 ? (
                    <span className="goodItem-s2__price-off">
                    {formatMoney(
                    this.props.data.unitPrice
                  )}
                  </span>
                    ) : null}
                    

              </div>
              {!this.props.data.isDownloadable && (
                <div>
                  {this.renderDeliverType()}
                </div>
              )}
            </div>
          </div>
        </div>

        {!this.props.withoutRightBox && (
          <div className="goodItem-s2__right-container cart-item__right orders__right-container">
            <div className="orders__right-items">
              {this.props.data.statusId != 100 ? (
                <LandScapePhonesAndBigger>
                  <GoodSituation
                    id={this.props.data.statusId}
                    title={this.props.data.statusTitle}
                  />
                </LandScapePhonesAndBigger>
              ) : (
                <LandScapePhonesAndBigger>
                  <GoodSituation
                    id={this.props.data.statusId}
                    title={this.props.data.statusTitle}
                  />
                  <Translate id="orders.on" />
                  {this.props.data.orderStatusPlacedDateTime}
                  {this.props.data.statusId == 3 ? (
                    <DeliveryProgress
                      processing
                      fillItemCount={2}
                      stepCount={4}
                    />
                  ) : this.props.data.statusId == 6 ? (
                    <DeliveryProgress
                      delivered
                      fillItemCount={4}
                      stepCount={4}
                    />
                  ) : undefined}
                </LandScapePhonesAndBigger>
              )}
              {this.props.data.statusId == 100 ? undefined : (
                <>
                  <span className="orders__text-bold d-block">
                    {this.props.currency.toUpperCase() + " "}
                    {formatMoney(this.props.data.totalPrice)}
                    <span className="orders__text-small">
                      {this.props.data.quantity + " "}
                      <Translate id="orders.items" />
                    </span>
                  </span>
                  {/* <a
                    to={this.props.reviewLink}
                    className="primary-btn orders__btn orders__btn--mobile"
                  >
                    <Translate id="orders.review" />
                    <img
                      className="d-none d-md-inline orders__btn-arrow-icon"
                      src={arrowIcon}
                      alt="arrow icon"
                    />
                  </a> */}
                </>
              )}
            </div>
          </div>
        )}
      </article>
    );
  }
}
