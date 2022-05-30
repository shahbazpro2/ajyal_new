import React from "react";
// import "./OrderPlaced.scss";
import {
  BoxStyle2,
  SelectBox2,
  Alert,
  GoodSituation,
  DeliveryProgress,
  Loading,
} from "../../../../../common";
import { Translate } from "react-localize-redux";
import ItemsBox from "../ItemsBox";
import ShipTo from "../ShipTo";
import cashIcon from "./../../../../../../assets/icons/cash.png";
import creditIcon from "./../../../../../../assets/icons/img-credit-card.svg";
import { useEffect } from "react";
import { useState } from "react";
import { client_getPaymentResult } from "../../../../../../lib/api/client/clientOrder";
import { useRouter } from "next/router";
import { selectCurr, selectLang } from "../../../../../../appConfigSlice";
import { formatMoney,removeCouponCookie } from "../../../../../../lib/helpers";
import { useSelector } from "react-redux";

const OrderPlaced = ({ content2 }) => {
  const router = useRouter();

  const curr = useSelector(selectCurr);
  const lang = useSelector(selectLang);

  const { token, paymentId, PayerID } = router.query;

  const [paymentLoading, setPaymentLoading] = useState(true);
  const [paymentResult, setPaymentResult] = useState({ error: null, res: {} });

  useEffect(() => {
    setPaymentLoading(true);
    removeCouponCookie();
    client_getPaymentResult({ token, paymentId, PayerID })
      .then((res) => {
        setPaymentResult({
          error: false,
          res: res.result,
        });
        setPaymentLoading(false);
      })
      .catch((err) => {
        if (!err.response.data.result || err.response.data.status != "400") {
          router.push(`/${curr}-${lang}`);
          return;
        }

        if (err.response.data.status == "400") {
          setPaymentResult({
            error: true,
            res: err.response.data.result,
          });
          setPaymentLoading(false);
        }
      });

    return () => {};
  }, []);

  if (paymentLoading) {
    return (
      <Loading
        type="gray"
        styleSheet={{ margin: "80px auto" }}
        width="60px"
        height="60px"
      />
    );
  }

  return (
    <>
      {paymentResult.error ? (
        <Alert
          faild
          btmText="Purchase Failed"
          btnText={<Translate id="common.continue-shopping" />}
          topText="Looks like we encountered an error, Please try again "
        />
      ) : (
        <Alert
          btmText={`You'll receive an email at ${paymentResult.res.transfereeEmail} once your order is confirmed.`}
          btnText={<Translate id="common.continue-shopping" />}
          topText={`Thank you for your order ${paymentResult.res.transfereeName} ${paymentResult.res.transfereeFamily}!`}
        />
      )}
      <BoxStyle2 className="payment__payment-detail-cnt">
        <div className="row justify-content-between no-gutters">
          <div className="mb-5 mb-md-0 col-12 col-md-6 col-lg-7">
            <h2 className="payment__box-header">
              <Translate id="common.order" /> &nbsp; {paymentResult.res.trackingCode}
            </h2>

            <div className="orderplaced__process-cnt">
              <GoodSituation
                title={
                  paymentResult.error ? (
                    <Translate id="common.good-process.cancelled" />
                  ) : (
                    <Translate id="common.good-process.processing" />
                  )
                }
                id={paymentResult.error ? 100 : 3}
                processing
              />
            </div>
            {!paymentResult.error && (
              <div className="orderplaced__deliveryprogress-cnt">
                <DeliveryProgress processing fillItemCount={2} stepCount={4} />
              </div>
            )}
            <div className="mt-4">
              <div className="cart-aside__item">
                <span>
                  <span className="cart-aside__item-text">
                    <Translate id="common.addressAside.subtotal" />
                  </span>
                  <span className="cart-aside__item-text-sub">
                    {paymentResult.res.itemsCount}&nbsp;
                    {paymentResult.res.itemsCount > 1 ? (
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
                      paymentResult.res.totalWithOutDiscountCode -
                        paymentResult.res.vat -
                        paymentResult.res.shipping
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
                  {paymentResult.res.shipping === 0 ? (
                    <Translate id="common.addressAside.free" />
                  ) : (
                    formatMoney(paymentResult.res.shipping)
                  )}
                </span>
              </div>
              {paymentResult.res.vat > 0 && (
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
                    paymentResult.res.vat
                  )}
                </span>
              </div>
            </div>
           )} 
              {paymentResult.res.discount > 0 && (
                <div className="cart-aside__item">
                  <span>
                    <span className="cart-aside__item-text">
                      <Translate id="common.addressAside.discount" />
                    </span>
                  </span>
                  <span className="cart-aside__discount">
                    -<Translate id={curr} />
                    &nbsp; {formatMoney(paymentResult.res.discount)}
                  </span>
                </div>
              )}
              <div className="cart-aside__item cart-aside__item--border">
                <div className="d-flex align-items-center">
                  <h4 className="mb-0 cart-aside__header">
                    <Translate id="common.addressAside.total" />
                  </h4>
                  {paymentResult.res.vat > 0 && (
                    <span className="ml-3 rtl-ml-0 rtl-mr-3 cart-aside__item-text-sub">
                      <Translate id="common.addressAside.inciusive" />
                    </span>
                  )}
                </div>
                <div className="goodItem-s2__price-container">
                  {paymentResult.res.discount > 0 && (
                    <span className="goodItem-s2__price-off d-block">
                      <Translate id={curr} />
                      &nbsp;
                      {formatMoney(paymentResult.res.totalWithOutDiscountCode)}
                    </span>
                  )}
                </div>
              </div>
              <div className="cart-aside__item">
                <div className="d-flex align-items-center">
                  <img
                    src={creditIcon}
                    className="payment__icon"
                    alt="credit icon"
                  />
                  <span className="payment__text4 payment__text4--margin">
                    <Translate id="payment.pay-with-card" />
                  </span>
                </div>
                <div className="goodItem-s2__price-container">
                  <span className="goodItem-s2__number">
                    <Translate id={curr} />
                    &nbsp; {formatMoney(paymentResult.res.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 mt-md-0 col-12 col-lg-4 col-md-5 d-flex flex-column justify-content-between">
            <ShipTo withoutEdit data={paymentResult.res} />
            <a
              href=""
              className="mt-0 mt-5 orderplaced__ship-link text-align-right"
            >
              <Translate id="orderplaced.go-to-order-detail" />
            </a>
          </div>
        </div>
      </BoxStyle2>
      <ItemsBox
        count={paymentResult.res.items.length}
        items={paymentResult.res.items}
      />
    </>
  );
};

export default OrderPlaced;
