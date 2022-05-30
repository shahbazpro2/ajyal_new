import React from "react";
import { BoxStyle2 } from "../../../../common";
import { ReactComponent as ShippingFillIcon } from "./../../../../../assets/icons/payment/shipping-fill.svg";
import { ReactComponent as PaymentOutlineIcon } from "./../../../../../assets/icons/payment/payment-outline.svg";
import { ReactComponent as PaymentFillIcon } from "./../../../../../assets/icons/payment/payment-fill.svg";
import { ReactComponent as OrderPlacedOutlineIcon } from "./../../../../../assets/icons/payment/order-placed-outline.svg";
import { Translate } from "react-localize-redux";
import classnames from "classnames";
import { orderContext } from "../OrderContext";
import { SHIPPING, PAYMENT, PREV, ORDERPLACED } from "../OrderConstants";
import { ReactComponent as BackIcon } from "./../../../../../assets/icons/back.svg";
export default class extends React.Component {
  static contextType = orderContext;
  render() {
    const needBack = this.context.step === PAYMENT ? true : false;

    return (
      <header className="ordernav">
        <BoxStyle2 className="ordernav__state-box">
          {needBack && (
            <div className="createshop__prev-cnt ordernav__back-cnt">
              <div
                onClick={() => {
                  this.context.handleStep(PREV);
                }}
                className="text-align-right"
                style={{ cursor: "pointer" }}
              >
                <BackIcon className="createshop__back-icon" />
                <Translate id="common.back" />
              </div>
            </div>
          )}
          <div className="d-flex flex-row justify-content-center align-items-center">
            <div
              className={classnames(
                "ordernav__item-cnt",
                "d-flex",
                "align-items-center",
                "justify-content-center",
                {
                  active:
                    this.context.orderState[SHIPPING].active ||
                    this.context.orderState[SHIPPING].complete,
                }
              )}
            >
              <i className="ordernav__icon-cnt">
                <ShippingFillIcon className="ordernav__icon" />
              </i>
              <span className="ordernav__text">
                <Translate id="order-nav.shipping-address" />
              </span>
            </div>
            <div
              className={classnames(
                "ordernav__item-cnt",
                "d-flex",
                "align-items-center",
                "justify-content-center",
                "ordernav__item-cnt--have-line",
                {
                  active:
                    this.context.orderState[PAYMENT].active ||
                    this.context.orderState[PAYMENT].complete,
                }
              )}
            >
              <i className="ordernav__icon-cnt">
                {this.context.orderState[ORDERPLACED].active ||
                this.context.orderState[ORDERPLACED].complete ? (
                  <PaymentFillIcon className="ordernav__icon" />
                ) : (
                  <PaymentOutlineIcon className="ordernav__icon" />
                )}
              </i>
              <span className="ordernav__text">
                <Translate id="order-nav.payment" />
              </span>
            </div>
            <div className="ordernav__item-cnt d-flex align-items-center justify-content-center ordernav__item-cnt--have-line">
              <i className="ordernav__icon-cnt">
                <OrderPlacedOutlineIcon className="ordernav__icon" />
              </i>
              <span className="ordernav__text">
                <Translate id="order-nav.order-placed" />
              </span>
            </div>
          </div>
        </BoxStyle2>
      </header>
    );
  }
}
