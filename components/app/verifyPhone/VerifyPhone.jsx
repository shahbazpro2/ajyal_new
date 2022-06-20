import React, { useState } from "react";
import { Translate } from "react-localize-redux";
import VerificationInput from "react-verification-input";
import { Loading } from "../../common";
import {
  ProtraitPhones,
  ProtraitPhonesAndBigger,
} from "../../../Responsive";
import { useSelector } from "react-redux";
import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber";
import { toast } from "react-toastify";
import { getErrorMsg } from "../../../lib/helpers";
import { getToastConfig } from "../../../lib/toast";
import { selectCurr, selectLang } from "../../../appConfigSlice";
import {
  client_resendVerifyMobileNumber
} from "../../../lib/api/client/clientCustomer";
import Timer from "react-compound-timer/build";

const COUNT = 4;

const VerifyPhone = ({ currdata, submitRegister  , loaderSubmitButton , Backclick}) => {
  const lang = useSelector(selectLang);
  const curr = useSelector(selectCurr);
  const PNF = PhoneNumberFormat;
  const phoneUtil = PhoneNumberUtil.getInstance();
  const phone = currdata.phoneCode + currdata.mobileNumber;
  const number = phoneUtil.parseAndKeepRawInput(phone, currdata.iso);

  let can_send_new_email = false;

  const [code, setCode] = useState("");

  const handleCode = (ref) => {
    setCode(ref.target.value);
  };


  const handleSubmit = async () => {
    if (loaderSubmitButton) return;
    if (code.length < COUNT) {
      toast.error(getErrorMsg(lang, "code-is-not-valid"), getToastConfig());
      return;
    }

    submitRegister(code , currdata.requestId);
  };

  const handleResendMessage = async (resetTimer) => {
    
    try {
      const res = await client_resendVerifyMobileNumber({
        mobileNumber: '+' + currdata.phoneCode + currdata.mobileNumber
      });
        currdata.requestId= res.result.requestId,
      can_send_new_email = false;
      toast.success(res.message, getToastConfig());

      resetTimer();
    } catch (err) {
      toast.error(err.response.data.message, getToastConfig());
      can_send_new_email = true;
    }
  };

  
  const handleBackclick = () => {
    Backclick()
    };


  return (
    <Translate>
      {({ translate: t }) => {
        return (
          <div className="auth__verify-phone p-5">
            <section className="add-address-step2">
              <div className="add-address-step2__col">
                <p className="add-address-step2__p1 text-align-center">
                  <Translate id="verify-sms" />
                </p>
                <p className="add-address-step2__p2 text-align-center">
                  <Translate id="verify-sms-des" />
                </p>
                <p className="add-address-step2__phone text-align-center">
                  {phoneUtil.format(number, PNF.INTERNATIONAL)}
                </p>
                <a
                  onClick={handleBackclick}
                  className="add-address-step2__link primary-link"
                >
                  <Translate id="changeRegisterData" />
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
                    {loaderSubmitButton ? (
                      <Loading type="white" width="20px" height="20px" />
                    ) : (
                      <Translate id="changephone-btn" />
                    )}
                  </button>
                </ProtraitPhonesAndBigger>

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
                          <Translate id="dontreceive" />
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
                          <Translate id="resendnow" />
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
                    {loaderSubmitButton ? (
                      <Loading type="white" width="20px" height="20px" />
                    ) : (
                      <Translate id="changephone-btn" />
                    )}
                  </button>
                </div>
              </ProtraitPhones>
            </section>
          </div>
        );
      }}
    </Translate>
  );
};

export default VerifyPhone;
