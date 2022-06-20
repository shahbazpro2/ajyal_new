import React, { useState } from "react";
import { BoxStyle1, Button } from "../../../../../common";
// import "./CartAndWishlistAside.scss";
// import "./CartAndWishlistAside-rtl.scss";
import { Translate } from "react-localize-redux";
import { ReactComponent as CloseIcon } from "./../../../../../../assets/icons/close.svg";
import { ReactComponent as ShoppingIcon } from "./../../../../../../assets/icons/addtocard.svg";
import { useDispatch, useSelector } from "react-redux";
import { selectLang, selectCurr } from "../../../../../../appConfigSlice";
import { selectCanCheckout, selectCoupon } from "../../cartAndWishlistSlice";
import { formatMoney } from "../../../../../../lib/helpers";
import { isRtl } from "../../../../../../lib/isRtl";
export default ({ data, addCoupon, checkOut }) => {
  const lang = useSelector(selectLang);
  const curr = useSelector(selectCurr);
  const canCheckout = useSelector(selectCanCheckout);
  const curr_coupon = useSelector(selectCoupon);
  const [coupon, setCoupon] = useState("");
  const handleCouponClick = () => {
    addCoupon(coupon);
    setCoupon("");
  };
  const handleDeleteCoupon = () => {
    addCoupon(null);
    setCoupon("");
  };

  const handleCheckOut = () => {
    if (!canCheckout) return;
    checkOut();
  };

  return (
    <aside className="cart-aside">
      <BoxStyle1>
        <div className="cart-aside__cnt">
          <div className="cart-aside__top-cnt">
            <h4 className="cart-aside__header">
              <Translate id="aside.order-sum" />
            </h4>
            <div className="cart-aside__item">
              <span>
                <span className="cart-aside__item-text">
                  <Translate id="aside.subtotal" />
                </span>
                <span className="cart-aside__item-text-sub">
                  {data.itemsCount}&nbsp;
                  {data.itemsCount > 1 ? (
                    <Translate id="cart-cart.items" />
                  ) : (
                    <Translate id="cart-cart.item" />
                  )}
                </span>
              </span>
              <div className="goodItem-s2__price-container d-flex">
                {!isRtl(lang) && (
                  <span className="goodItem-s2__number">
                    <Translate id={curr} />
                    &nbsp;
                  </span>
                )}
                <span className="goodItem-s2__number">
                  {formatMoney(
                    data.totalWithOutDiscountCode - data.vat - data.shipping
                  )}
                </span>
                {isRtl(lang) && (
                  <span className="goodItem-s2__number">
                    &nbsp;
                    <Translate id={curr} />
                  </span>
                )}
              </div>
            </div>
            <div className="cart-aside__item">
              <span>
                <span className="cart-aside__item-text">
                  <Translate id="aside.shipping" />
                </span>
              </span>
              <span className="cart-aside__free">
                {data.shipping === 0 ? (
                  <Translate id="aside.free" />
                ) : (
                  formatMoney(data.shipping)
                )}
              </span>
            </div>

            {data.discount > 0 && (
              <div className="cart-aside__item">
                <span>
                  <span className="cart-aside__item-text">
                    <Translate id="aside.discount" />
                  </span>
                </span>
                <div className="d-flex">
                  {!isRtl(lang) && (
                    <span className="cart-aside__discount">
                      <Translate id={curr} />
                      &nbsp;
                    </span>
                  )}
                  <span className="cart-aside__discount">
                    -{formatMoney(data.discount)}
                  </span>
                  {isRtl(lang) && (
                    <span className="cart-aside__discount">
                      &nbsp;
                      <Translate id={curr} />
                    </span>
                  )}
                </div>
              </div>
            )}

            {data.vat > 0 && (
              <div className="cart-aside__item">
                <span>
                  <span className="cart-aside__item-text">
                    <Translate id="aside.vat" />
                  </span>
                </span>
                <div className="goodItem-s2__price-container d-flex">
                  {!isRtl(lang) && (
                    <span className="goodItem-s2__number">
                      <Translate id={curr} />
                      &nbsp;
                    </span>
                  )}
                  <span className="goodItem-s2__number">
                    {formatMoney(data.vat)}
                  </span>
                  {isRtl(lang) && (
                    <span className="goodItem-s2__number">
                      &nbsp;
                      <Translate id={curr} />
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="cart-aside__item cart-aside__item--border">
              <h4 className="cart-aside__header">
                <Translate id="aside.total" />
                {data.vat > 0 && (
                  <span className="cart-aside__item-text-sub cart-aside__item-text-sub--header">
                    <Translate id="aside.inciusive" />
                  </span>
                )}
              </h4>
              <div className="goodItem-s2__price-container">
                {data.discount > 0 && (
                  <div className="d-flex">
                    {!isRtl(lang) && (
                      <span className="goodItem-s2__price-off">
                        <Translate id={curr} />
                        &nbsp;
                      </span>
                    )}
                    <span className="goodItem-s2__price-off d-block">
                      {formatMoney(data.totalWithOutDiscountCode)}
                    </span>
                    {isRtl(lang) && (
                      <span className="goodItem-s2__price-off">
                        &nbsp;
                        <Translate id={curr} />
                      </span>
                    )}
                  </div>
                )}
                <div>
                  {!isRtl(lang) && (
                    <span className="goodItem-s2__number">
                      <Translate id={curr} />
                      &nbsp;
                    </span>
                  )}
                  <span className="goodItem-s2__number">
                    {formatMoney(data.total)}
                  </span>
                  {isRtl(lang) && (
                    <span className="goodItem-s2__number">
                      &nbsp;
                      <Translate id={curr} />
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="cart-aside__btm-cnt">
            <Translate>
              {({ translate: t }) => {
                return (
                  <>
                    <div className="cart-aside__input-cnt">
                      <input
                        className="gray__input cart-aside__input"
                        type="text"
                        placeholder={t("aside.coupon")}
                        value={coupon}
                        onChange={(e) => {
                          setCoupon(e.target.value);
                        }}
                      />
                      <Button
                        radius={true}
                        size="xsm"
                        onClick={handleCouponClick}
                        value={<Translate id="aside.apply" />}
                      />
                    </div>
                    {curr_coupon && (
                      <div className="cart-aside__coupon-cnt">
                        <span className="cart-aside__coupon-text">
                          <Translate id="aside.coupon2" />
                        </span>
                        <span className="cart-aside__coupon-value">
                          {curr_coupon}
                        </span>
                        <CloseIcon
                          className="cart-aside__coupon-icon"
                          onClick={handleDeleteCoupon}
                        />
                      </div>
                    )}
                    <div className="cart-aside__btn-cnt">
                      <Button
                        disable={!canCheckout}
                        radius={true}
                        value={<Translate id="aside.checkout" />}
                        onClick={handleCheckOut}
                      />
                    </div>
                  </>
                );
              }}
            </Translate>
          </div>
        </div>
      </BoxStyle1>
    </aside>
  );
};
