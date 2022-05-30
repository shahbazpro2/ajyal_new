import React, { useState } from "react";
import { Translate } from "react-localize-redux";
import { Link } from "react-router-dom";
import { validatePhoneNumber } from "../../../../../../../lib/formValidator";
import { useSelector } from "react-redux";
import { selectLang } from "../../../../../../../appConfigSlice";
import { FormErrorMsg, Loading } from "../../../../../../common";
import { client_changeMobileNumber } from "../../../../../../../lib/api/client/clientCommon";
import { toast } from "react-toastify";
import { getErrorMsg } from "../../../../../../../lib/helpers";
import { getToastConfig } from "../../../../../../../lib/toast";

export default ({ handleSituation, data, setData }) => {
  const [errors, setErrors] = useState({});
  const [mobile, setMobile] = useState("");
  const lang = useSelector(selectLang);
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
        addressId: data.addressId,
      });

      if (result.status == "200") {
        setData({
          phoneNumberVeri: {
            ...data,
            requestId: result.result.requestId,
            phoneNumber: mobile,
          },
        });
        setSubmitLoading(false);
        handleSituation({ type: "phoneveri" });
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
          <>
            <section className="add-address-step3">
              <div className="add-address-step3__col">
                <p className="add-address-step3__p1">
                  <Translate id="addresses.changephone" />
                </p>
                <p className="add-address-step3__p2">
                  <Translate id="addresses.entermobile" />
                </p>
                <div className="add-address-step3__phone-container">
                  <div className="add-address-step1__mobile-cnt">
                    <span className="add-address-step1__mobile-code">
                      +{data.phoneCode}
                    </span>
                    <input
                      className="gray__input"
                      type="text"
                      placeholder={t("addresses.mobile-number-placeholder")}
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
                            iso: data.phoneIso,
                          });
                        }
                      }}
                      onBlur={(e) => {
                        validatePhoneNumber({
                          name: e.target.name,
                          value: e.target.value,
                          handler: setErrors,
                          lang,
                          iso: data.phoneIso,
                        });
                      }}
                    />
                  </div>
                  <FormErrorMsg show={errors["phone"]} msg={errors["phone"]} />
                </div>
                <button
                  className="primary-btn add-address-step3__btn"
                  onClick={handleSubmit}
                >
                  {submitLoading ? (
                    <Loading type="white" with="20px" height="20px" />
                  ) : (
                    <Translate id="addresses.send-new-code" />
                  )}
                </button>
                {/* <Link
                  to="addresses"
                  className="primary-btn add-address-step3__btn"
                >
                  <Translate id="addresses.send-new-code" />
                </Link> */}
                <a
                  className="add-address-step3__link mt-5 mt-md-3 d-block primary-link"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSituation({ type: "phoneveri" });
                  }}
                >
                  <Translate id="addresses.cancel" />
                </a>
              </div>
            </section>
          </>
        );
      }}
    </Translate>
  );
};
