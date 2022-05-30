import React from "react";
import { BoxStyle2 } from "../../../../../common";
import { Translate } from "react-localize-redux";
import ShipTo from "../ShipTo";
import { useSelector } from "react-redux";
import { selectCurr } from "../../../../../../appConfigSlice";
import { formatMoney } from "../../../../../../lib/helpers";
import {Loading} from '../../../../../common'
const PaymentAside = ({ data,loading }) => {
  const curr = useSelector(selectCurr);
  if(loading){
   return ( <div className="row payment no-gutters">
             <Loading
        type="gray"
        styleSheet={{ margin: "80px auto" }}
        width="60px"
        height="60px"
      />
    </div>)
    
  }
 
  return (
   <div className="payment__order-sum pl-3 rtl-pl-0 rtl-pr-3">
      <BoxStyle2 className="payment__aside ">
        <div className="cart-aside__cnt">
          <div className="cart-aside__top-cnt">
            <h4 className="cart-aside__header">
              <Translate id="common.addressAside.order-sum" />
            </h4>
            <div className="cart-aside__item">
              <span>
                <span className="cart-aside__item-text">
                  <Translate id="common.addressAside.subtotal" />
                </span>
                <span className="cart-aside__item-text-sub">
                  {data.itemsCount}&nbsp;
                  {data.itemsCount > 1 ? (
                    <Translate id="common.items" />
                  ) : (
                      <Translate id="common.item" />
                    )}
                </span>
              </span>
              <div className="goodItem-s2__price-container">
                <span className="goodItem-s2__number">
                  <Translate id={curr} />
                  &nbsp;
                  {formatMoney(
                    data.totalWithOutDiscountCode - data.vat - data.shipping
                  )}
                </span>
              </div>
            </div>
            <div className="cart-aside__item">
              <span>
                <span className="cart-aside__item-text">
                  <Translate id="common.addressAside.shipping" />
                </span>
              </span>
              <span className="cart-aside__free">
                {data.shipping === 0 ? (
                  <Translate id="common.addressAside.free" />
                ) : (
                    formatMoney(data.shipping)
                  )}
              </span>
            </div>

            {data.discount > 0 && (
              <div className="cart-aside__item">
                <span>
                  <span className="cart-aside__item-text">
                    <Translate id="common.addressAside.discount" />
                  </span>
                </span>
                <span className="cart-aside__discount">
                  -<Translate id={curr} />
                  &nbsp; {formatMoney(data.discount)}
                </span>
              </div>
            )}

            {data.vat > 0 && (
              <div className="cart-aside__item">
                <span>
                  <span className="cart-aside__item-text">
                    <Translate id="common.addressAside.vat" />
                  </span>
                </span>
                <div className="goodItem-s2__price-container">
                  <span className="goodItem-s2__number">
                    <Translate id={curr} />
                  &nbsp;
                  {formatMoney(
                      data.vat
                    )}
                  </span>
                </div>
              </div>
            )}
            <div className="cart-aside__item cart-aside__item--border">
              <h4 className="cart-aside__header">
                <Translate id="common.addressAside.total" />
                {data.vat > 0 && (
                  <span className="cart-aside__item-text-sub cart-aside__item-text-sub--header">
                    <Translate id="common.addressAside.inciusive" />
                  </span>
                )}
              </h4>
              <div className="goodItem-s2__price-container">
                {data.discount > 0 && (
                  <span className="goodItem-s2__price-off d-block">
                    <Translate id={curr} />
                    &nbsp; {formatMoney(data.totalWithOutDiscountCode)}
                  </span>
                )}
                <span className="goodItem-s2__number">
                  <Translate id={curr} />
                  &nbsp; {formatMoney(data.total)}
                </span>
              </div>
            </div>
          </div>
          <ShipTo withoutEdit data={data} />
        </div>
      </BoxStyle2>
    </div>
  );
};

export default PaymentAside;
