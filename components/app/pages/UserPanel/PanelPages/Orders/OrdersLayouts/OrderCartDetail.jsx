import React from "react";
import { Translate } from "react-localize-redux";
import { ReactComponent as CreditCardIcon } from "./../../../../../../../assets/icons/credit-card.svg";
import { ProtraitPhonesAndBigger } from "../../../../../../../Responsive";
import { formatMoney } from "../../../../../../../lib/helpers";
export default (props) => {
  return (
    <>
      <h2 className="order-cart__header">
        <Translate id="orders.pay-method" />
      </h2>
      <div className="order-cart__credit-cnt">
        <ProtraitPhonesAndBigger>
          <CreditCardIcon className="order-cart__credit-icon" />
        </ProtraitPhonesAndBigger>
        {/* <span className="order-cart__credit-num">376655 xxxxx 3114</span> */}
        <span className="order-cart__credit-text">Credit Card ( {props.data.payment} )</span>
      </div>
      <div className="cart-aside__top-cnt">
        <h4 className="cart-aside__header">
          <Translate id="orders.order-sum" />
        </h4>
        <div className="cart-aside__item">
          <span>
            <span className="cart-aside__item-text">
              <Translate id="orders.subtotal" />
            </span>
            <span className="cart-aside__item-text-sub">
              {props.data?.itemQuantity} <Translate id="orders.item" />
            </span>
          </span>
          <div className="goodItem-s2__price-container">
            <span className="goodItem-s2__number">
              {props.currency.toUpperCase() + " "}
              {formatMoney(
                 props.data.finalPrice - props.data.vat - props.data.shipping
                )}
            </span>
          </div>
        </div>
        <div className="cart-aside__item">
          <span>
            <span className="cart-aside__item-text">
              <Translate id="orders.shipping" />
            </span>
          </span>
          <span className="cart-aside__free">
            {props.data.shipping?.toLocaleString()}
          </span>
        </div>
        {props.data.discount !== 0 ? (
          <div className="cart-aside__item">
            <span>
              <span className="cart-aside__item-text">
                <Translate id="orders.discount" />
              </span>
            </span>
            <span className="cart-aside__discount">
              - {props.currency.toUpperCase() + " "} {props.data.discount?.toLocaleString()}
            </span>
          </div>
        ) : null}

        {props.data.vat > 0 && (
          <div className="cart-aside__item">
            <span>
              <span className="cart-aside__item-text">
                <Translate id="common.addressAside.vat" />
              </span>
            </span>
            <div className="goodItem-s2__price-container">
              <span className="goodItem-s2__number">
               {props.currency.toUpperCase()}
                  &nbsp;
                  {formatMoney(
                  props.data.vat
                )}
              </span>
            </div>
          </div>
        )}

        <div className="cart-aside__item cart-aside__item--border">
          <h4 className="cart-aside__header">
            <Translate id="orders.total" />
            <span className="cart-aside__item-text-sub cart-aside__item-text-sub--header">
              {props.data.vat != 0 && <Translate id="orders.inciusive" />}
            </span>
          </h4>
          <div className="goodItem-s2__price-container">
            {props.data.discount != 0 && (
              <span className="goodItem-s2__price-off d-block">
                {props.currency.toUpperCase() + " "} {props.data.totalWithOutDiscountCode?.toLocaleString()}
              </span>
            )}
            <span className="goodItem-s2__number">
              {props.currency.toUpperCase() + " "} 
              {formatMoney(
                 props.data.finalPrice 
                )}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
