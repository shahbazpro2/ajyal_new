import React from "react";
import { Translate } from "react-localize-redux";
import { ReactComponent as EditIcon } from "./../../../../../../assets/icons/edit.svg";
import { ReactComponent as BackIcon } from "./../../../../../../assets/icons/back.svg";

import { BoxStyle2, FormErrorMsg, Loading } from "../../../../../common";
import {
  COMPLETE,
  SELECT_ADDRESS,
  VERIFY_PHONE,
} from "./ShippingAddressConstant";
import { useState } from "react";
import {
  validateEmpty,
  validatePhoneNumber,
} from "../../../../../../lib/formValidator";
import { useSelector } from "react-redux";
import { selectLang } from "../../../../../../appConfigSlice";
import { getErrorMsg } from "../../../../../../lib/helpers";
import { getToastConfig } from "../../../../../../lib/toast";
import { toast } from "react-toastify";

export default ({ handleSituation, setData, currdata, addAddress }) => {
  const [firstname, setFirstname] = useState(currdata.firstname);
  const [lastname, setLanstname] = useState(currdata.lastname);
  const [mobile, setMobile] = useState(currdata.mobileNumber);
  const [postalCode, setPostalCode] = useState(currdata.postalCode);
  const [errors, setErrors] = useState({});
  const lang = useSelector(selectLang);
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleBackClick = () => {
    handleSituation(COMPLETE);
  };

  const updateAddressClick = () => {
    handleSituation(SELECT_ADDRESS);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (submitLoading) return;

    for (let key in errors) {
      if (errors[key]) {
        toast.error(getErrorMsg(lang, "error-detected"), getToastConfig());
        return;
      }
    }

    setSubmitLoading(true);

    setData(
      {
        firstname: firstname,
        lastname: lastname,
        postalCode: postalCode,
        mobileNumber: mobile,
      },
      () => {
        addAddress(() => {
          if (currdata.isUpdate) {
            handleSituation(COMPLETE);
          } else {
            handleSituation(VERIFY_PHONE);
          }
          setSubmitLoading(false);
        });
      }
    );
  };

  return (
    <Translate>
      {({ translate: t }) => {
        return (
          <>
            <BoxStyle2 className="orderaddress__change-phone p-5">
              <form onSubmit={handleSubmit}>
                <section className="add-address-step1 no-gutters">
                  <header className="mapAddress__header mapAddress__header--order">
                    <a onClick={handleBackClick}>
                      <BackIcon className="mapAddress__back-icon" />
                      <span className="mapAddress__header-text">
                        <Translate id="addresses.addresses" />
                      </span>
                    </a>
                  </header>

                  <div className="row no-gutters justify-content-between">
                    <div className="col-md-6">
                      <label className="gray__form-label add-address-step1__item">
                        <div className="d-flex justify-content-between add-address-step1__mapinput gray__input clearfix">
                          <div className="col">
                            <span className="add-address-step1__mapinput-text">
                              <Translate id="addresses.setmap" />
                            </span>
                            <span className="add-address-step1__mapinput-value">
                              {currdata.address}
                            </span>
                          </div>
                          <a
                            onClick={updateAddressClick}
                            className="add-address-step1__mapinput-btn"
                          >
                            <EditIcon />
                          </a>
                        </div>
                      </label>
                    </div>
                    <div className="col-md-6">
                      <label className="gray__form-label add-address-step1__item">
                        <span className="gray__input-label">
                          {t("addresses.mobile-number")}
                          <span className="input-required">*</span>
                        </span>
                        <div className="add-address-step1__mobile-cnt">
                          <span className="add-address-step1__mobile-code mr-0">
                            +
                          </span>
                          <span className="add-address-step1__mobile-code">
                            {currdata.phoneCode}
                          </span>
                          <input
                            className="gray__input"
                            type="tel"
                            required
                            name="phone"
                            maxLength="15"
                            placeholder={t(
                              "addresses.mobile-number-placeholder"
                            )}
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
                        <FormErrorMsg
                          show={errors["phone"]}
                          msg={errors["phone"]}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="row no-gutters justify-content-between">
                    <div className="col-md-6">
                      <label className="gray__form-label add-address-step1__item">
                        <span className="gray__input-label">
                          {t("addresses.firstname")}
                          <span className="input-required">*</span>
                        </span>
                        <input
                          className="gray__input"
                          type="text"
                          name="firstname"
                          placeholder={t("addresses.firstname-placeholder")}
                          onChange={(e) => {
                            setFirstname(e.target.value);
                            if (errors[e.target.name]) {
                              validateEmpty({
                                name: e.target.name,
                                value: e.target.value,
                                handler: setErrors,
                                lang,
                              });
                            }
                          }}
                          value={firstname}
                          required
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
                          show={errors["firstname"]}
                          msg={errors["firstname"]}
                        />
                      </label>
                    </div>
                    <div className="col-md-6">
                      <label className="gray__form-label add-address-step1__item">
                        <span className="gray__input-label">
                          {t("addresses.lastname")}
                          <span className="input-required">*</span>
                        </span>
                        <input
                          className="gray__input"
                          type="text"
                          name="lastname"
                          placeholder={t("addresses.lastname-placeholder")}
                          onChange={(e) => {
                            setLanstname(e.target.value);
                            if (errors[e.target.name]) {
                              validateEmpty({
                                name: e.target.name,
                                value: e.target.value,
                                handler: setErrors,
                                lang,
                              });
                            }
                          }}
                          required
                          value={lastname}
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
                          show={errors["lastname"]}
                          msg={errors["lastname"]}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="row no-gutters justify-content-between">
                    <div className="col-md-6">
                      <label className="gray__form-label add-address-step1__item">
                        <span className="gray__input-label">
                          {t("addresses.postal-code")}
                        </span>
                        <input
                          className="gray__input"
                          name="postalCode"
                          placeholder={t("addresses.postal-code-placeholder")}
                          type="text"
                          pattern="[0-9]*"
                          value={postalCode}
                          onChange={(e) => {
                            setPostalCode(e.target.value);
                          }}
                        />
                      </label>
                    </div>
                    {/* <div className="col-md-6">
                    <label className="gray__form-label add-address-step1__item">
                      <span className="gray__input-label">
                        {t("addresses.add-label")}
                      </span>
                      <Dropdown
                        className="gray__dropDown"
                        options={options2}
                        value={options2[0]}
                      />
                    </label>
                  </div> */}
                  </div>
                </section>
                <div className="add-address-step1__btn-cnt">
                  <button
                    className="primary-btn add-address-step1__btn"
                    type="submit"
                  >
                    {submitLoading ? (
                      <Loading type="white" width="20px" height="20px" />
                    ) : (
                      t("addresses.save")
                    )}
                  </button>
                </div>
              </form>
            </BoxStyle2>
            {/* <LandScapePhones className="add-address-step1__check">
              <input
                type="checkbox"
                id="setDefault"
                name="setDefault"
                value="Bike"
              />
              <label for="setDefault">{t("addresses.set-default-add")}</label>
            </LandScapePhones> */}
          </>
        );
      }}
    </Translate>
  );
};
