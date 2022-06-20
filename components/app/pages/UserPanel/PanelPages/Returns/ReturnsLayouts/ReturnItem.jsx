import React from "react";
import { Translate } from "react-localize-redux";
import { Link } from "react-router-dom";
import arrowIcon from "../../../../../../../assets/icons/img-down-arrow-white.svg";
import { GoodSituation } from "../../../../../../common";

import {
  LandScapePhonesAndBigger,
  LandScapePhones,
} from "../../../../../../../Responsive";
import {
  formatMoney
} from "../../../../../../../lib/helpers";
export default class extends React.Component {
  constructor(props) {
    super(props);
    this.goods_Pre = process.env.NEXT_PUBLIC_Goods_PREFIX;
  }

  clickSelectItem = (item) => {
    if (this.props.selectedItem) {
      this.props.selectedItem(this.props.data);
    }
  };

  render() {
    return (
      <article className="goodItem-s2 cart-item order-item return-item">
        {!this.props.withoutRightBox && (
          <LandScapePhones className="order-item__detail-cnt order-item__detail-cnt-mobile p-0 col-12">
            <div className="d-flex">
              {this.props.data.statusId == 100 ? (
                <GoodSituation
                  id={this.props.data.statusId}
                  title={this.props.data.statusTitle}
                />
              ) : (
                <>
                  <GoodSituation
                    id={this.props.data.statusId}
                    title={this.props.data.statusTitle}
                  />
                  <span className="order-item__detail-text order-item__detail-text--margin">
                    <Translate id="orders.on" />
                    {
                      this.props.data.orderStatusPlacedDateTime
                    }
                  </span>
                </>
              )}
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
              {!this.props.withoutModelNumber && (
                <div className="cart-item__model-container">
                  <span className="order-item__small-text">
                    <Translate id="orders.model-num" />
                  </span>
                  <span className="order-item__small-value">
                    {this.props.data.goodsCode}
                  </span>
                </div>
              )}
              <div className="cart-item__model-container">
                <span className="order-item__small-text">
                  <Translate id="orders.sold-by" />
                </span>
                <span className="sky-text-link">
                  {this.props.data.shopName}
                </span>
              </div>
            </div>
            <div className="goodItem-s2__right-ft-con">
              <div className="goodItem-s2__right-ft">
                  <span className="goodItem-s2__currency">
                   <Translate id={this.props.currency} />
                  </span>
                <div className="goodItem-s2__price-container">
                  <span className="goodItem-s2__number">
                    {this.props.data.totalPrice}
                  </span>
                </div>

                {/* {this.props.off ? (
                  <div className="goodItem-s2__off-percentage-container">
                    <span className="goodItem-s2__off-percentage">
                      {this.props.off}
                    </span>
                    <span className="goodItem-s2__off-text">% OFF</span>
                  </div>
                ) : undefined}
                {this.is_rtl ? (
                  <span className="goodItem-s2__currency">د.إ.‏</span>
                ) : undefined}
                <span className="goodItem-s2__price-off">
                  {this.props.priceAfterOff}
                </span> */}
              </div>

              {/* {this.props.express ? (
                <img
                  alt=""
                  className="goodItem-s2__exp"
                  src={this.is_rtl ? expressArIcon : expressIcon}
                />
              ) : undefined} */}
            </div>
            {/* good return reason */}
            {!this.props.withoutReason && (
              <div className="cart-item__model-container">
                <span className="order-item__small-text">
                  <Translate id="returns.reason" />
                </span>
                <span className="order-item__small-value">
                  {this.props.data.returnReason}
                </span>
              </div>
            )}
          </div>
        </div>

        {!this.props.withoutRightBox && (
          <div className="goodItem-s2__right-container cart-item__right">
            <div className="orders__right-items">
              {this.props.data.statusId == 100 ? (
                <LandScapePhonesAndBigger>
                  <GoodSituation
                    id={this.props.data.statusId}
                    title={this.props.data.statusTitle}
                  />
                </LandScapePhonesAndBigger>
              ) : (
                <>
                  <LandScapePhonesAndBigger>
                    <div className="order-item__detail-cnt">
                      <GoodSituation
                        id={this.props.data.statusId}
                        title={this.props.data.statusTitle}
                      />
                      <span className="order-item__detail-text order-item__detail-text--margin">
                        <Translate id="orders.on" />
                      </span>
                      <span className="order-item__detail-text order-item__detail-text--margin">
                        {
                          this.props.data.orderStatusPlacedDateTime
                        }
                      </span>
                    </div>
                  </LandScapePhonesAndBigger>
                  {/* <LandScapePhonesAndBigger>
                    {this.props.processing ? (
                      <DeliveryProgress
                        processing
                        fillItemCount={2}
                        stepCount={4}
                      />
                    ) : (
                      <DeliveryProgress
                        delivered
                        fillItemCount={4}
                        stepCount={4}
                      />
                    )}
                  </LandScapePhonesAndBigger> */}
                  <span className="orders__text-bold d-block">
                  <span className="goodItem-s2__currency  mr-2 ml-2">
                   <Translate id={this.props.currency} />
                  </span>
                    {formatMoney(
                    this.props.data.totalPrice 
                     )}
                    <span className="orders__text-small">
                      {this.props.data.quantity}
                      <Translate id="orders.items" />
                    </span>
                  </span>
                  <Link
                    to={this.props.btnLink}
                    className="primary-btn orders__btn"
                    onClick={this.clickSelectItem}
                  >
                    {this.props.btnText}
                    <img
                      className="orders__btn-arrow-icon"
                      src={arrowIcon}
                      alt="arrow icon"
                    />
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </article>
    );
  }
}
