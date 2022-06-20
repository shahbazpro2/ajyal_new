import React, { useState } from "react";
import { Translate } from "react-localize-redux";
import VerificationInput from "react-verification-input";
import { BoxStyle2, Loading } from "../../../../../common";
import { CHANGE_PHONE, COMPLETE } from "./ShippingAddressConstant";
import {
  ProtraitPhones,
  ProtraitPhonesAndBigger,
} from "../../../../../../Responsive";
import { useSelector } from "react-redux";
import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber";
import { toast } from "react-toastify";
import { getErrorMsg } from "../../../../../../lib/helpers";
import { getToastConfig } from "../../../../../../lib/toast";
import { selectCurr, selectLang } from "../../../../../../appConfigSlice";
import {
  client_changeMobileNumber,
  client_verifyAddressPhone,
} from "../../../../../../lib/api/client/clientCommon";
import Timer from "react-compound-timer/build";

const COUNT = 4;

const VerifyPhone = ({ handleSituation, currdata, setData }) => {
  const lang = useSelector(selectLang);
  const curr = useSelector(selectCurr);
  const PNF = PhoneNumberFormat;
  const phoneUtil = PhoneNumberUtil.getInstance();

  const phone = currdata.phoneCode + currdata.mobileNumber;
  const number = phoneUtil.parseAndKeepRawInput(phone, currdata.iso);

  let can_send_new_email = false;

  const handleclick = () => {
    handleSituation(CHANGE_PHONE);
  };

  const [code, setCode] = useState("");

  const handleCode = (ref) => {
    setCode(ref.target.value);
  };

  const [submitLoading, setSubmitLoading] = useState(false);

  const handleSubmit = async () => {
    if (submitLoading) return;
    if (code.length < COUNT) {
      toast.error(getErrorMsg(lang, "code-is-not-valid"), getToastConfig());
      return;
    }

    setSubmitLoading(true);

    try {
      const result = await client_verifyAddressPhone({
        addressId: currdata.addressId,
        code,
        requestId: currdata.requestId,
      });

      if (result.status == 200) {
        // TODO
        handleSituation(COMPLETE);
      }
    } catch (err) {
      const text = err.response.data?.result?.errorText;
      toast.error(text || err.response.data.message, getToastConfig());
      setSubmitLoading(false);
    }
  };

  const handleResendMessage = async (resetTimer) => {
    try {
      const res = await client_changeMobileNumber({
        mobileNumber: currdata.mobileNumber,
        addressId: currdata.addressId,
      });

      setData({
        requestId: res.result.requestId,
      });
      can_send_new_email = false;
      resetTimer();
    } catch (err) {
      toast.error(err.response.data.message, getToastConfig());
      can_send_new_email = true;
    }
  };

  return (
    <Translate>
      {({ translate: t }) => {
        return (
          <BoxStyle2 className="orderaddress__verify-phone p-5">
            <section className="add-address-step2">
              <div className="add-address-step2__col">
                <p className="add-address-step2__p1 text-align-center">
                  <Translate id="common.addressform.verify" />
                </p>
                <p className="add-address-step2__p2 text-align-center">
                  <Translate id="common.addressform.verify-des" />
                </p>
                <p className="add-address-step2__phone text-align-center">
                  {phoneUtil.format(number, PNF.INTERNATIONAL)}
                </p>
                <a
                  onClick={handleclick}
                  className="add-address-step2__link primary-link"
                >
                  <Translate id="common.addressform.changephone" />
                </a>
                <div className="add-address-step2__verification-container">
                  <VerificationInput
                    inputField={{ onChange: handleCode }}
                    length={COUNT}
                    placeholder=""
                  />
                </div>
                <ProtraitPhonesAndBigger>
                  <button
                    onClick={handleSubmit}
                    className="primary-btn add-address-step2__btn"
                  >
                    {submitLoading ? (
                      <Loading type="white" width="20px" height="20px" />
                    ) : (
                      <Translate id="common.addressform.changephone-btn" />
                    )}
                  </button>
                </ProtraitPhonesAndBigger>
                {/* <a
                  onClick={addpage}
                  className="add-address-step2__link mt-3 d-block primary-link"
                >
                  <Translate id="common.addressform.skip" />
                </a> */}
              </div>
              <div className="add-address-step2__col mt-4">
                <Timer initialTime={300000} direction="backward">
                  {({ start, reset, getTime }) => {
                    if (getTime() <= 0) {
                      can_send_new_email = true;
                    }
                    return (
                      <>
                        <span className="add-address-step2__opt">
                          <Translate id="common.addressform.dontreceive" />
                        </span>
                        &nbsp;&nbsp;
                        <span className="timer__count ml-3 mr-3">
                          <Timer.Minutes /> : <Timer.Seconds />
                        </span>
                        <a
                          onClick={(e) => {
                            e.preventDefault();
                            if (!can_send_new_email) return;
                            handleResendMessage(() => {
                              reset();
                              start();
                            });
                          }}
                          className="add-address-step2__link primary-link"
                        >
                          <Translate id="common.addressform.resendnow" />
                        </a>
                      </>
                    );
                  }}
                </Timer>
              </div>
              <ProtraitPhones>
                <div className="checkout-fix justify-content-center">
                  <button
                    onClick={handleSubmit}
                    className="primary-btn returns__add-btn"
                  >
                    {submitLoading ? (
                      <Loading type="white" width="20px" height="20px" />
                    ) : (
                      <Translate id="common.addressform.changephone-btn" />
                    )}
                  </button>
                </div>
              </ProtraitPhones>
            </section>
          </BoxStyle2>
        );
      }}
    </Translate>
  );
};

export default VerifyPhone;
