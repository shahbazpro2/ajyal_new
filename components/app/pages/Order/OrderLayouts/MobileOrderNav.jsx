import React from "react";
import { ReactComponent as ShippingFillIcon } from "./../../../../../assets/icons/payment/shipping-fill.svg";
import { ReactComponent as PaymentOutlineIcon } from "./../../../../../assets/icons/payment/payment-outline.svg";
import { ReactComponent as PaymentFillIcon } from "./../../../../../assets/icons/payment/payment-fill.svg";
import { Translate } from "react-localize-redux";
import classnames from "classnames";
import { orderContext } from "../OrderContext";
import { SHIPPING, PAYMENT, PREV, ORDERPLACED } from "../OrderConstants";
import { ReactComponent as BackIcon } from "./../../../../../assets/icons/back.svg";
export default class extends React.Component {
  static contextType = orderContext;
  render() {
    const needBack = this.context.step === PAYMENT ? true : false;

    let icon, text;
    switch (this.context.step) {
      case SHIPPING:
        icon = <ShippingFillIcon className="ordernav-mobile__icon" />;
        text = <Translate id="order-nav.shipping-address" />;
        break;
      case PAYMENT:
        icon = <PaymentFillIcon className="ordernav-mobile__icon" />;
        text = <Translate id="order-nav.payment" />;
        break;
      case ORDERPLACED:
        icon = <PaymentOutlineIcon className="ordernav-mobile__icon" />;
        text = <Translate id="order-nav.shipping-address" />;
        break;
      default:
        icon = <ShippingFillIcon className="ordernav-mobile__icon" />;
        text = <Translate id="order-nav.shipping-address" />;
        break;
    }
    return (
      <header className="ordernav-mobile d-flex align-items-center justify-content-center">
        {needBack && (
          <div className="createshop__prev-cnt ordernav-mobile__back-cnt">
            <div
              onClick={() => {
                this.context.handleStep(PREV);
              }}
              className="text-align-right"
              style={{ cursor: "pointer" }}
            >
              <BackIcon className="createshop__back-icon" />
            </div>
          </div>
        )}
        <div className="ordernav-mobile__item-cnt d-flex justify-content-center align-items-center">
          <i className="ordernav__icon-cnt">{icon}</i>
          <span className="ordernav__text">{text}</span>
        </div>

        <ul className="ordernav-mobile__list">
          <li
            className={classnames("ordernav-mobile__dot", {
              active:
                this.context.orderState[SHIPPING].active ||
                this.context.orderState[SHIPPING].complete,
            })}
          ></li>
          <li
            className={classnames("ordernav-mobile__dot", {
              active:
                this.context.orderState[PAYMENT].active ||
                this.context.orderState[PAYMENT].complete,
            })}
          ></li>
          <li
            className={classnames("ordernav-mobile__dot", {
              active:
                this.context.orderState[ORDERPLACED].active ||
                this.context.orderState[ORDERPLACED].complete,
            })}
          ></li>
        </ul>
      </header>
    );
  }
}
