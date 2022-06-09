import React, { useRef } from "react";

import {
  BoxStyle2,
  SelectBox3 as SelectBox,
  FormErrorMsg,
  Loading,
} from "../../../../../common";
import PaymentAside from "./PaymentAside";
import { Translate } from "react-localize-redux";
import { useState } from "react";
import { selectCurr } from "../../../../../../appConfigSlice";
import ItemsBox from "../ItemsBox";
import { orderContext } from "../../OrderContext";
import {
  ProtraitPhonesAndBigger,
  ProtraitPhones,
} from "../../../../../../Responsive";
import { useEffect } from "react";
import {
  client_getActivePayment,
  client_getOrder,
  client_getPaymentPageUrl,
} from "../../../../../../lib/api/client/clientOrder";
import { toast } from "react-toastify";
import { getErrorMsg } from "../../../../../../lib/helpers";
import { getToastConfig } from "../../../../../../lib/toast";
import { selectLang } from "../../../../../../appConfigSlice";
import { useSelector } from "react-redux";
import Select from "react-select";
import Cookies from "js-cookie";
import {
  validateEmpty,
  validateCreditCard,
  validatePostalCode,
} from "../../../../../../lib/formValidator";
import Shipingprovider from "./slelectdeliver";
const Payment = () => {
  const [checked, setChecked] = useState(false);
  const [payment, setPayment] = useState(null);
  const [newShipping, setNewShipping] = useState(null)
  const [paymentType, setPaymentType] = useState(null);
  const [cartType, setCartType] = useState(null);
  const [cartTypeId, setCartTypeId] = useState(null);
  const [placeOrderLoading, setPlaceOrderLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [cardName, setCardName] = useState(null);
  const [cardNumber, setCardNumber] = useState(null);
  const [cardMonth, setCardMonth] = useState(null);
  const [cardYear, setCardYear] = useState(null);
  const [cardSecurity, setCardSecurity] = useState(null);
  const [cardZip, setCardZip] = useState(null);
  const [ppk, setppk] = useState({});
  const [diliverysettings, setdiliverysettings] = useState({})
  const [asideloading, setasideloading] = useState(false)
  const curr = useSelector(selectCurr);
  const lang = useSelector(selectLang);
  const ggk = useRef()
  const coupon = Cookies.get(
    process.env.NEXT_PUBLIC_Token_Cookie_name_coupon
  );
  const handleChange = (check) => {
    setChecked(check);
  };

  useEffect(() => {

    Promise.all([
      client_getOrder(coupon),
      client_getActivePayment()
    ]).then((res) => {
      setPayment(res[0].result);
      let cards = [];
      res[1].result.forEach((item) => {
        cards.push({
          value: item.methodId,
          label: (
            <div>
              <img
                src={`${process.env.NEXT_PUBLIC_PAYMENTLOGO_PREFIX}/${item.methodImageUrl}`}
                height="20px"
                width="20px"
              />{" "}
              {item.methodTitle}
            </div>
          ),
        });
      });
      setCartTypeId(cards.find((x) => x.value === 3));
      setCartType(cards);
    })
      .catch(ex => console.error(ex));

    // client_getOrder()
    //   .then((res) => {
    //     
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

    // client_getActivePayment()
    //   .then((res) => {



    //   })
    //   .catch((err) => {});

    return () => { };
  }, []);

  if (!payment) {
    return (
      <div className="row payment no-gutters">
        <Loading
          type="gray"
          styleSheet={{ margin: "80px auto" }}
          width="60px"
          height="60px"
        />
      </div>
    );
  }

  const onCartTypeChange = (event) => {
    setCartTypeId(event);
  };

  const handlePlaceOrderClick = async (e) => {

    e.preventDefault();

    if (!cartTypeId) {
      toast.error(getErrorMsg(lang, "select-payment"), getToastConfig());
      return;
    }


    if (placeOrderLoading) return;

    for (let key in errors) {
      if (errors[key]) {
        toast.error(getErrorMsg(lang, "error-detected"), getToastConfig());
        return;
      }
    }



    setPlaceOrderLoading(true);
    try {
      const result = await client_getPaymentPageUrl(parseInt(cartTypeId.value), cardName, cardNumber, cardMonth, cardYear, cardSecurity, cardZip, coupon)

      let rri = result.result.split('+')
      if (rri.length > 1) {
        console.log(rri)
        let ffi = JSON.parse(rri[0])
        ffi = { ...ffi, redirect: window.location.href }
        setppk(ffi)
        ggk.current.submit()
      }
      else {
        window.location.href = result.result
      }
      setPlaceOrderLoading(false);
    } catch (err) {
      console.log(err)
      if (err.response?.data.result?.errorText) {

        toast.error(err.response?.data.result?.errorText, getToastConfig());
      } else toast.error(err.response?.data.message, getToastConfig());
      setPlaceOrderLoading(false);
    }

  };

  const shippingchange = (res) => {
    console.log("changedvalue", res)
    setasideloading(false)
    setNewShipping(res?.data)
    /* if (res.data.result) setPayment(res?.data.result) */

  }
  const setasideloading1 = () => {
    setasideloading(true)
  }


  return (
    <div className="row payment no-gutters">
      {console.log(payment)}
      <section className="col-xl-9 col-lg-8 col-12 order-md-1 order-2">
        <form className="mt-4" onSubmit={handlePlaceOrderClick} >
          <BoxStyle2
            headerContent={
              <h2 className="payment__box-header">
                <Translate id="payment.payment" />
              </h2>
            }
            className="payment__payment-detail-cnt"
          >
            <div className="row mt-4">
              <Select
                className="react-select col-md-4 col-8"
                options={cartType}
                value={cartTypeId}
                onChange={onCartTypeChange}
              />
            </div>
            <Shipingprovider shippingchange={shippingchange} setasideloading={setasideloading1} prevpayment={payment} />

            {/* برای کردیمکس هست فقط */}
            {cartTypeId?.value === 2 ? (
              <div className="payment-method__container mt-4">
                <div className="payment__payment-method">
                  <Translate>
                    {({ translate }) => {
                      return (
                        <>
                          <div className="row">
                            <div className="col-12">
                              <label className="mt-3 credimax-card-name">
                                <span className="payment-method__input-label gray__input-label">
                                  <Translate id="payment-method.name-on-card" />
                                  <span className="input-required">*</span>
                                </span>
                                <input
                                  className="payment-method__input gray__input"
                                  type="text"
                                  required
                                  name="cardName"
                                  value={cardName}
                                  onChange={(e) => {
                                    setCardName(e.target.value);
                                    if (errors[e.target.name]) {
                                      validateEmpty({
                                        name: e.target.name,
                                        value: e.target.value,
                                        handler: setErrors,
                                        lang,
                                      });
                                    }
                                  }}
                                  onBlur={(e) => {
                                    validateEmpty({
                                      name: e.target.name,
                                      value: e.target.value,
                                      handler: setErrors,
                                      lang,
                                    });
                                  }}
                                />
                                <FormErrorMsg
                                  show={errors["cardName"]}
                                  msg={errors["cardName"]}
                                />
                              </label>
                            </div>
                            <div className="col-12">
                              <label className="mt-3 credimax-card-number">
                                <span className="payment-method__input-label gray__input-label">
                                  <Translate id="payment-method.card-number" />
                                  <span className="input-required">*</span>
                                </span>
                                <input
                                  className="payment-method__input gray__input"
                                  type="text"
                                  placeholder="---- ---- ---- ----"
                                  name="cardNumber"
                                  value={cardNumber}
                                  onChange={(e) => {
                                    setCardNumber(e.target.value);
                                    if (errors[e.target.name]) {
                                      validateCreditCard({
                                        name: e.target.name,
                                        value: e.target.value,
                                        handler: setErrors,
                                        lang,
                                      });
                                    }
                                  }}
                                  onBlur={(e) => {
                                    validateCreditCard({
                                      name: e.target.name,
                                      value: e.target.value,
                                      handler: setErrors,
                                      lang,
                                    });
                                  }}
                                />
                                <FormErrorMsg
                                  show={errors["cardNumber"]}
                                  msg={errors["cardNumber"]}
                                />
                              </label>
                            </div>

                            <div className="col-md-3 col-12">
                              <label className="mt-3">
                                <span className="payment-method__input-label gray__input-label">
                                  <Translate id="payment-method.expiry-date" />
                                  <span className="input-required">*</span>
                                </span>
                                <div className="d-flex">
                                  <input
                                    className="payment-method__input gray__input date-input-month"
                                    type="text"
                                    placeholder="MM"
                                    required
                                    maxLength="2"
                                    name="cardMonth"
                                    value={cardMonth}
                                    onChange={(e) => {
                                      setCardMonth(e.target.value);
                                      if (errors[e.target.name]) {
                                        validateEmpty({
                                          name: e.target.name,
                                          value: e.target.value,
                                          handler: setErrors,
                                          lang,
                                        });
                                      }
                                    }}
                                    onBlur={(e) => {
                                      validateEmpty({
                                        name: e.target.name,
                                        value: e.target.value,
                                        handler: setErrors,
                                        lang,
                                      });
                                    }}
                                  />
                                  <input
                                    className="payment-method__input gray__input date-input-year"
                                    type="text"
                                    placeholder="YY"
                                    maxLength="2"
                                    required
                                    name="cardYear"
                                    value={cardYear}
                                    onChange={(e) => {
                                      setCardYear(e.target.value);
                                      if (errors[e.target.name]) {
                                        validateEmpty({
                                          name: e.target.name,
                                          value: e.target.value,
                                          handler: setErrors,
                                          lang,
                                        });
                                      }
                                    }}
                                    onBlur={(e) => {
                                      validateEmpty({
                                        name: e.target.name,
                                        value: e.target.value,
                                        handler: setErrors,
                                        lang,
                                      });
                                    }}
                                  />
                                </div>
                              </label>
                            </div>

                            <div className="col-md-3 p-md-0 col-12">
                              <label className="mt-3 w-100">
                                <span className="payment-method__input-label gray__input-label">
                                  <Translate id="payment-method.security-code" />
                                  <span className="input-required">*</span>
                                </span>

                                <input
                                  className="payment-method__input gray__input"
                                  type="text"
                                  required
                                  name="cardSecurity"
                                  value={cardSecurity}
                                  onChange={(e) => {
                                    setCardSecurity(e.target.value);
                                    if (errors[e.target.name]) {
                                      validateEmpty({
                                        name: e.target.name,
                                        value: e.target.value,
                                        handler: setErrors,
                                        lang,
                                      });
                                    }
                                  }}
                                  onBlur={(e) => {
                                    validateEmpty({
                                      name: e.target.name,
                                      value: e.target.value,
                                      handler: setErrors,
                                      lang,
                                    });
                                  }}
                                />
                              </label>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-3 col-12">
                              <label className="mt-3 w-100">
                                <span className="payment-method__input-label gray__input-label">
                                  <Translate id="payment-method.postal-code" />
                                  <span className="input-required">*</span>
                                </span>
                                <input
                                  className="payment-method__input gray__input"
                                  type="text"
                                  name="cardZip"
                                  value={cardZip}
                                  onChange={(e) => {
                                    setCardZip(e.target.value);
                                    if (errors[e.target.name]) {
                                      validateEmpty({
                                        name: e.target.name,
                                        value: e.target.value,
                                        handler: setErrors,
                                        lang,
                                      });
                                    }
                                  }}
                                  onBlur={(e) => {
                                    validateEmpty({
                                      name: e.target.name,
                                      value: e.target.value,
                                      handler: setErrors,
                                      lang,
                                    });
                                  }}
                                />
                              </label>
                            </div>
                          </div>
                        </>
                      );
                    }}
                  </Translate>
                </div>
              </div>
            ) :
              (
                <div className="payment-method__container mt-4">
                  <div className="payment__payment-method p-4">
                    <Translate>
                      {({ translate }) => {
                        return (
                          <>
                            <div className="row">

                              <div className="col-12">
                                <Translate id="payment-method.redirectToPyamnetPage" />
                              </div>

                            </div>

                          </>
                        );
                      }}
                    </Translate>
                  </div>
                </div>
              )}

            <div className="payment-method__container mt-4">
              <div className="payment__payment-method p-4">
                <Translate>
                  {({ translate }) => {
                    return (
                      <>
                        <div className="row">

                          <div className="col-12">
                            <Translate id="payment-method.redirectToPyamnetPage" />
                          </div>

                        </div>

                      </>
                    );
                  }}
                </Translate>
              </div>
            </div>
            <form action={`https://webdemo.webtreeonline.com/ajyal-payment/`} style={{ display: 'none' }} ref={ggk} method="POST"  >

              <input name="PaymentType" value={ppk?.PaymentType} />
              <input name="PaymentId" value={ppk?.PaymentId} />
              <input name="OrderId" value={ppk?.OrderId} />
              <input name="CurrencyId" value={ppk?.CurrencyId} />
              <input name="total" value={ppk?.total} />
              <input name="userid" value={ppk?.cusomerid} />
              <input name="redirect" value={ppk?.redirect} />
              {/*<input name="FkShippingMethodId" value={diliverysettings?.id}/>
                <input name="ShippingCost"  value={diliverysettings?.totalAmount}/>*/}
            </form>
            {/* <div className="gray-box d-flex p-4 mt-4">
            <Switch
              onChange={handleChange}
              checked={checked}
              height={20}
              width={40}
              className="react-switch payment__switch"
            />
            <div className="text-align-right">
              <p className="payment__text1">
                <Translate id="payment.use-my-credits" />
              </p>
              <span className="payment__text2">
                <Translate id="payment.ava-blc" />
              </span>
              <span className="payment__text3 payment__text3--margin">
                SAR 12.00
              </span>
            </div>
          </div> */}
            {/* <SelectBox
            className="payment__select-cnt mt-5 mb-5"
            onChange={onPaymentChange}
          > */}
            {/* <SelectBox.SelectItem name="cash">
              <img src={cashIcon} className="payment__icon" alt="cash icon" />
              <span className="payment__text4 payment__text4--margin">
                <Translate id="payment.pay-with-cash" />
              </span>
              <p className="payment__text2 mt-3">
                <Translate id="payment.pay-with-cash-msg" />
              </p>
            </SelectBox.SelectItem> */}
            {/* <SelectBox.SelectItem name="credit">
              <img src={creditIcon} className="payment__icon" alt="cash icon" />
              <span className="payment__text4 payment__text4--margin">
                <Translate id="payment.pay-with-card" />
              </span>
            </SelectBox.SelectItem>
            <SlideDown>
              {paymentType === "credit" && (
                <div className="payment__cartType">
                  {!cartType ? (
                    <Loading type="gray" width="30px" height="30px" />
                  ) : (
                    <ul className="payment__cartType-list">
                      {cartType.map((item) => {
                        return (
                          <li className="payment__cartType-item">
                            <input
                              type="radio"
                              value={item.methodId}
                              checked={cartTypeId == item.methodId}
                              onChange={onCartTypeChange}
                            />
                            <span className="payment__cartType-text">
                              {item.methodTitle}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}
            </SlideDown>
          </SelectBox> */}

            <ProtraitPhonesAndBigger>
              <div className="payment__btn-cnt d-flex mt-5">
                <orderContext.Consumer>
                  {(context) => (
                    <button className="primary-btn">
                      {placeOrderLoading ? (
                        <Loading type="white" width="20px" height="20px" />
                      ) : cartTypeId?.value === 2 ? (
                        <Translate id="payment-method.complate-payment" />
                      ) : (
                        <Translate id="common.place-order" />
                      )}
                    </button>
                  )}
                </orderContext.Consumer>
              </div>
            </ProtraitPhonesAndBigger>
            <ProtraitPhones>
              <div className="checkout-fix justify-content-center">
                <orderContext.Consumer>
                  {(context) => (
                    <button className="primary-btn returns__add-btn">
                      {placeOrderLoading ? (
                        <Loading type="white" width="20px" height="20px" />
                      ) : cartTypeId?.value === 2 ? (
                        <Translate id="payment-method.complate-payment" />
                      ) : (
                        <Translate id="common.place-order" />
                      )}
                    </button>
                  )}
                </orderContext.Consumer>
              </div>
            </ProtraitPhones>
          </BoxStyle2>
          <ItemsBox count={payment.itemsCount} items={payment.items} />
        </form>
      </section>
      <aside className="col-xl-3 col-lg-4 col-12 order-md-2 order-1">
        <PaymentAside data={payment} newShipping={newShipping} loading={asideloading} />
      </aside>
    </div>
  );
};

export default Payment;
