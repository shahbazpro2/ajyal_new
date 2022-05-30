import React, { useState } from "react";
import { Translate } from "react-localize-redux";
import { BoxStyle2, FormErrorMsg, Loading } from "../../../../../common";
import { COMPLETE, VERIFY_PHONE } from "./ShippingAddressConstant";
import {
  ProtraitPhonesAndBigger,
  ProtraitPhones,
} from "../../../../../../Responsive";
import { useSelector } from "react-redux";
import { selectLang } from "../../../../../../appConfigSlice";
import { toast } from "react-toastify";
import { getErrorMsg } from "../../../../../../lib/helpers";
import { getToastConfig } from "../../../../../../lib/toast";
import { client_changeMobileNumber } from "../../../../../../lib/api/client/clientCommon";
import { validatePhoneNumber } from "../../../../../../lib/formValidator";

const ChangePhone = ({ handleSituation, currdata, setData }) => {
  const [errors, setErrors] = useState({});
  const [mobile, setMobile] = useState("");
  const lang = useSelector(sLang);
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleSubmit = async () => {
    if (submitLoading) return;

    for (let key in errors) {
      if (errors[key]) {
        toast.error(getErrorMsg(lang, "error-detected"), getToastConfig());
        return;
      }
    }

    setSubmitLoading(true);

    try {
      const result = await client_changeMobileNumber({
        mobileNumber: mobile,
        addressId: currdata.addressId,
      });

      if (result.status == "200") {
        setData({
          requestId: result.result.requestId,
          mobileNumber: mobile,
        });
        setSubmitLoading(false);
        handleSituation(VERIFY_PHONE);
      }
    } catch (err) {
      if (err.response.data.result?.errorText) {
        toast.error(err.response.data.result?.errorText, getToastConfig());
      } else toast.error(err.response.data.message, getToastConfig());
      setSubmitLoading(false);
    }
  };

  return (
    <Translate>
      {({ translate: t }) => {
        return (
          <BoxStyle2 className="orderaddress__change-phone p-5">
            <section className="add-address-step3">
              <div className="add-address-step3__col">
                <p className="add-address-step3__p1 text-align-center">
                  <Translate id="common.addressform.changephone" />
                </p>
                <p className="add-address-step3__p2 text-align-center">
                  <Translate id="common.addressform.entermobile" />
                </p>
                <div className="add-address-step3__phone-container">
                  <div className="add-address-step1__mobile-cnt">
                    <span className="add-address-step1__mobile-code">
                      {" "}
                      +{currdata.phoneCode}
                    </span>
                    <input
                      className="gray__input"
                      type="text"
                      placeholder={t(
                        "common.addressform.mobile-number-placeholder"
                      )}
                      name="phone"
                      value={mobile}
                      onChange={(e) => {
                        setMobile(e.target.value);
                        if (errors[e.target.name]) {
                          validatePhoneNumber({
                            name: e.target.name,
                            value: e.target.value,
                            handler: setErrors,
                            lang,
                            iso: currdata.iso,
                          });
                        }
                      }}
                      onBlur={(e) => {
                        validatePhoneNumber({
                          name: e.target.name,
                          value: e.target.value,
                          handler: setErrors,
                          lang,
                          iso: currdata.iso,
                        });
                      }}
                    />
                  </div>
                  <FormErrorMsg show={errors["phone"]} msg={errors["phone"]} />
                </div>
                {/* <button className="primary-btn add-address-step3__btn">
                  <Translate id="addresses.send-new-code" />
                </button> */}

                {/* display on protraitphones and bigger */}
                <ProtraitPhonesAndBigger>
                  <button
                    onClick={handleSubmit}
                    to="addresses"
                    className="primary-btn add-address-step3__btn"
                  >
                    {submitLoading ? (
                      <Loading type="white" with="20px" height="20px" />
                    ) : (
                      <Translate id="common.addressform.send-new-code" />
                    )}
                  </button>
                </ProtraitPhonesAndBigger>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    handleSituation(VERIFY_PHONE);
                  }}
                  className="add-address-step3__link mt-5 mt-md-3 d-block primary-link"
                >
                  <Translate id="common.cancel" />
                </a>

                {/* display on protraitphones and smaller */}
                <ProtraitPhones>
                  <div className="checkout-fix justify-content-center">
                    <button
                      onClick={handleSubmit}
                      to="addresses"
                      className="primary-btn returns__add-btn"
                    >
                      {submitLoading ? (
                        <Loading type="white" with="20px" height="20px" />
                      ) : (
                        <Translate id="common.addressform.send-new-code" />
                      )}
                    </button>
                  </div>
                </ProtraitPhones>
              </div>
            </section>
          </BoxStyle2>
        );
      }}
    </Translate>
  );
};

export default ChangePhone;
