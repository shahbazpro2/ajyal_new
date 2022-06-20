import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber";
import React, { useState } from "react";
import { Translate } from "react-localize-redux";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import VerificationInput from "react-verification-input";
import { selectCurr, selectLang } from "../../../../../../../appConfigSlice";
import {
  client_changeMobileNumber,
  client_verifyAddressPhone,
} from "../../../../../../../lib/api/client/clientCommon";
import { getErrorMsg } from "../../../../../../../lib/helpers";
import { getToastConfig } from "../../../../../../../lib/toast";
import { Loading } from "../../../../../../common";
import { useHistory } from "react-router-dom";
import Timer from "react-compound-timer/build";
const COUNT = 4;

export default ({ handleSituation, addpage, data, setData }) => {
  const lang = useSelector(selectLang);
  const curr = useSelector(selectCurr);
  const PNF = PhoneNumberFormat;
  const phoneUtil = PhoneNumberUtil.getInstance();
  const history = useHistory();
  const phone = data.phoneCode + data.phoneNumber;
  const number = phoneUtil.parseAndKeepRawInput(phone, data.phoneIso);

  let can_send_new_email = false;

  const handleclick = () => {
    handleSituation({ type: "next" });
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
        addressId: data.addressId,
        code,
        requestId: data.requestId,
      });

      if (result.status == 200) {
     // handleSituation({ type: "addresses" });
     history.push("/" + curr + "-" + lang + "/panel/addresses");
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
        mobileNumber: data.phoneNumber,
        addressId: data.addressId,
      });

      setData({
        phoneNumberVeri: {
          ...data,
          requestId: res.result.requestId,
        },
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
          <>
            <section className="add-address-step2">
              <div className="add-address-step2__col">
                <p className="add-address-step2__p1">
                  <Translate id="addresses.verify" />
                </p>
                <p className="add-address-step2__p2">
                  <Translate id="addresses.verify-des" />
                </p>
                <p className="add-address-step2__phone">
                  {phoneUtil.format(number, PNF.INTERNATIONAL)}
                </p>
                <a
                  onClick={handleclick}
                  className="add-address-step2__link primary-link"
                >
                  <Translate id="addresses.changephone" />
                </a>
                <div className="add-address-step2__verification-container">
                  <VerificationInput
                    placeholder=""
                    inputField={{ onChange: handleCode }}
                    length={COUNT}
                    // getInputRef={handleCode}
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  className="primary-btn add-address-step2__btn"
                >
                  {submitLoading ? (
                    <Loading type="white" width="20px" height="20px" />
                  ) : (
                    <Translate id="addresses.changephone-btn" />
                  )}
                </button>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    history.push("/" + curr + "-" + lang + "/panel/addresses");
                  }}
                  className="add-address-step2__link mt-3 d-block primary-link"
                >
                  <Translate id="addresses.skip" />
                </a>
              </div>
              <div className="add-address-step2__col">
                <Timer initialTime={300000} direction="backward">
                  {({ start, reset, getTime }) => {
                    if (getTime() <= 0) {
                      can_send_new_email = true;
                    }
                    return (
                      <>
                        <span className="add-address-step2__opt">
                          <Translate id="addresses.dontreceive" />
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
                          <Translate id="addresses.resendnow" />
                        </a>
                      </>
                    );
                  }}
                </Timer>
              </div>
            </section>
          </>
        );
      }}
    </Translate>
  );
};
