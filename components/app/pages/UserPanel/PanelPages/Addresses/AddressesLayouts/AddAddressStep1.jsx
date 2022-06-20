import React, { useState } from "react";
import { Translate } from "react-localize-redux";
import { ReactComponent as EditIcon } from "../../../../../../../assets/icons/edit.svg";
import { LandScapePhones } from "../../../../../../../Responsive";
import {
  validateEmpty,
  validatePhoneNumber,
} from "../../../../../../../lib/formValidator";
import { FormErrorMsg, Loading } from "./../../../../../../common";
import { useSelector } from "react-redux";
import { selectLang, selectCurr } from "../../../../../../../appConfigSlice";
import {
  client_getActiveCountries,
  client_getActiveCities,
  client_editAddAddress,
  client_getActiveProvince,
} from "../../../../../../../lib/api/client/clientShop";
import { client_addAddress } from "../../../../../../../lib/api/client/clientShop";
import { ToastContainer, toast } from "react-toastify";
import { getToastConfig } from "../../../../../../../lib/toast";
import { getErrorMsg } from "./../../../../../../../lib/helpers";
import { useEffect } from "react";
import Select from "react-select";
import { isRtl } from "./../../../../../../../lib/isRtl";
import { useHistory } from "react-router-dom";

export default ({ handleSituation, data, editItem, setData }) => {
  const [mobile, setMobile] = useState("");
  const [errors, setErrors] = useState({});
  const lang = useSelector(selectLang);
  const curr = useSelector(selectCurr);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLanstname] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [addressId, setAddressId] = useState(0);
  const [addressTitle, setAddressTitle] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(0);
  const [isDisableCountry, setDisableCountry] = useState(false);
  const [selectedCity, setSelectedCity] = useState(0);
  const [selectedProvince, setSelectedProvince] = useState(0);

  const [countryItems, setCountryItems] = useState([]);
  const [cityItems, setCityItems] = useState([]);
  const [provinceItems, setProvinceItems] = useState([]);

  const [addressEmptyError, setAddressEmptyError] = useState(false);
  const [countryEmptyError, setCountryEmptyError] = useState(false);
  const [cityEmptyError, setcityEmptyError] = useState(false);
  const [provinceEmptyError, setProvinceEmptyError] = useState(false);
  const [isEditState, setIsEditState] = useState(false);

  const [submitLoading, setSubmitLoading] = useState(false);

  const history = useHistory();

  useEffect(() => {
    if (editItem != null) {
      setIsEditState(true);
      setEditData();
    } else {
      getCountris();
    }

    return () => {
      editItem = null;
    };
  }, []);

  function compare(a, b) {
    return a.label > b.label ? 1 : b.label > a.label ? -1 : 0;
  }

  const setEditData = async () => {
    if (data.address == undefined) {
      setAddressTitle(editItem.address);
      data.address = editItem.address;
      data.Location = {
        lat: editItem.locationX,
        lng: editItem.locationY,
      };
    }

    setAddressId(editItem.addressId);
    setPostalCode(editItem.postalCode);
    setLanstname(editItem.transfereeFamily);
    setFirstname(editItem.transfereeName);
    setMobile(editItem.transfereeMobile);
    let city = {
      value: editItem.fkCityId,
      label: editItem.cityName,
    };
    let province = {
      value: editItem.fkProvinceId,
      label: editItem.provinceName,
    };
    let country = {
      value: editItem.fkCountryId,
      label: editItem.countryName,
      phoneCode: editItem.phoneCode,
    };
    await getCountris();
    if (data.iso === undefined) {
      await handleCountryChange(country);
      setSelectedCountry(country);
      setSelectedCity(city);
      setSelectedProvince(province);
      setDisableCountry(true);
    }
  };

  const getAddressHandler = () => {
    handleSituation({ type: "showMap" });
  };

  const getCountris = async () => {
    const result = await client_getActiveCountries();
    let countries = [];
    result.result.forEach((item) => {
      countries.push({
        value: item.countryId,
        label: item.countryTitle,
        iso: item.iso,
        phoneCode: item.phoneCode,
      });
    });
    countries.sort(compare);
    setCountryItems(countries);
    if (data.iso !== undefined) {
      let currentCountry = countries.filter((x) => x.iso === data.iso);
      if (currentCountry.length > 0) {
        setSelectedCountry(currentCountry[0]);
        setAddressTitle(data.address);
        setDisableCountry(true);
        handleCountryChange(currentCountry[0]);
      } else {
        toast.error(getErrorMsg(lang, "country-add-address"), getToastConfig());
        setDisableCountry(false);
        setSelectedCountry(0);
        setSelectedCity(0);
        setPhoneCode("");
        return;
      }
    }
  };

  const handleCountryChange = async (item) => {
    setPhoneCode(item.phoneCode);
    if (item.value != selectedCountry?.value) {
      setSelectedProvince(0);
      setSelectedCity(0);
    }
    const result = await client_getActiveProvince(item.value);
    let provinces = [];

    result.result.forEach((item) => {
      provinces.push({ value: item.provinceId, label: item.provinceName });
    });
    provinces.sort(compare);
    setProvinceItems(provinces);
  };

  const handleProvinceChange = async (item) => {
    const result = await client_getActiveCities(item.value);
    if (item.value != selectedProvince?.value) {
      setSelectedCity(0);
    }
    let cities = [];
    result.result.forEach((item) => {
      cities.push({ value: item.cityId, label: item.cityTitle });
    });
    cities.sort(compare);
    setCityItems(cities);
    setProvinceEmptyError(false);

  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitLoading) return;

    if (data.address == undefined) {
      setAddressEmptyError(true);
      return;
    }

    if (selectedCountry == 0) {
      setCountryItems(true);
      return;
    }

    if (selectedProvince == 0) {
      setProvinceEmptyError(true);
      return;
    }

    if (selectedCity == 0) {
      setcityEmptyError(true);
      return;
    }

    for (let key in errors) {
      if (errors[key]) {
        toast.error(getErrorMsg(lang, "error-detected"), getToastConfig());
        return;
      }
    }

    setSubmitLoading(true);

    if (!isEditState) {
      const result = await client_addAddress({
        transfereeMobile: mobile,
        postalCode: postalCode,
        address: data.address,
        locationX: data.Location.lat,
        locationY: data.Location.lng,
        transfereeName: firstname,
        transfereeFamily: lastname,
        fkCountryId: selectedCountry.value,
        fkCityId: selectedCity.value,
        fkProvinceId: selectedProvince.value,
        isDefualt: data.isDefault,
      });

      if (result.status == 200) {
        toast.success(
          getErrorMsg(lang, "success-add-address"),
          getToastConfig()
        );
        setcityEmptyError(false);
        setProvinceEmptyError(false);
        setAddressEmptyError(false);
        setCountryEmptyError(false);
        setSubmitLoading(false);

        setData({
          phoneNumberVeri: {
            requestId: result.result.requestId,
            addressId: result.result.addressId,
            phoneNumber: mobile,
            phoneIso: selectedCountry.iso,
            phoneCode: phoneCode,
          },
        });
        handleSituation({ type: "phoneveri" });
        // history.push("/" + curr + "-" + lang + "/panel/addresses");
      }
    } else {
      const result = await client_editAddAddress({
        transfereeMobile: mobile,
        postalCode: postalCode,
        address: data.address,
        locationX: data.Location.lat,
        locationY: data.Location.lng,
        transfereeName: firstname,
        transfereeFamily: lastname,
        fkCountryId: selectedCountry.value,
        fkCityId: selectedCity.value,
        fkProvinceId: selectedProvince.value,
        addressId: addressId,
        cityName: selectedCity.label,
        countryName: selectedCountry.label,
      });

      if (result.status == 200) {
        toast.success(
          getErrorMsg(lang, "success-update-address"),
          getToastConfig()
        );
        editItem = null;
        setcityEmptyError(false);
        setProvinceEmptyError(false);
        setAddressEmptyError(false);
        setCountryEmptyError(false);
        setSubmitLoading(false);
        setIsEditState(true);
        history.push("/" + curr + "-" + lang + "/panel/addresses");
      }
    }
  };

  return (
    <Translate>
      {({ translate: t }) => {
        return (
          <form
            onSubmit={($event) => {
              handleSubmit($event);
            }}
          >
            <section className="add-address-step1 no-gutters">
              <ToastContainer rtl={isRtl(lang)} {...getToastConfig()} />
              <div className="row no-gutters justify-content-between">
                <div className="col-md-6">
                  <label className="gray__form-label add-address-step1__item">
                    <div className="d-flex justify-content-between add-address-step1__mapinput gray__input clearfix">
                      <div className="col">
                        <span className="add-address-step1__mapinput-text">
                          <Translate id="addresses.setmap" />
                        </span>
                        <span className="add-address-step1__mapinput-value">
                          {addressTitle}
                        </span>
                      </div>
                      <button
                        onClick={getAddressHandler}
                        className="add-address-step1__mapinput-btn"
                      >
                        <EditIcon />
                      </button>
                    </div>
                  </label>
                  {addressEmptyError && (
                    <span className="custom-error">
                      <Translate id="addresses.empty-address-error" />
                    </span>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="gray__form-label add-address-step1__item">
                    <span className="auth__input-label">
                      <Translate id="addresses.country" />
                      <span className="input-required">*</span>
                    </span>
                    <Select
                      className="react-select"
                      options={countryItems}
                      isDisabled={isDisableCountry}
                      onChange={(item) => {
                        handleCountryChange(item);
                        setSelectedCountry(item);
                      }}
                      placeholder={t("addresses.country-placeholder")}
                      value={selectedCountry}
                      required
                    />
                  </label>

                  {countryEmptyError && (
                    <span className="country-error">
                      <Translate id="addresses.country-placeholder" />
                    </span>
                  )}
                </div>
              </div>
              <div className="row no-gutters justify-content-between">
                <div className="col-md-6">
                  <label className="gray__form-label add-address-step1__item">
                    <span className="auth__input-label">
                      <Translate id="addresses.province" />
                      <span className="input-required">*</span>
                    </span>
                    <Select
                      className="react-select"
                      options={provinceItems}
                      onChange={setSelectedProvince}
                      onChange={(item) => {
                        handleProvinceChange(item);
                        setSelectedProvince(item);
                      }}
                      placeholder={t("addresses.province-placeholder")}
                      value={selectedProvince}
                      required
                    />
                  </label>

                  {provinceEmptyError && (
                    <span className="country-error">
                      <Translate id="addresses.province-placeholder" />
                    </span>
                  )}
                </div>


                <div className="col-md-6">
                  <label className="gray__form-label add-address-step1__item">
                    <span className="auth__input-label">
                      <Translate id="addresses.city" />
                      <span className="input-required">*</span>
                    </span>
                    <Select
                      className="react-select"
                      options={cityItems}
                      onChange={(item) => {
                        setSelectedCity(item);
                        setcityEmptyError(false);
                      }}
                      placeholder={t("addresses.city-placeholder")}
                      value={selectedCity}
                      required
                    />
                  </label>

                  {cityEmptyError && (
                    <span className="country-error">
                      <Translate id="addresses.city-placeholder" />
                    </span>
                  )}
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
                      {t("addresses.mobile-number")}
                      <span className="input-required">*</span>
                    </span>
                    <div className="add-address-step1__mobile-cnt">
                      <span className="add-address-step1__mobile-code">
                        +{phoneCode}
                      </span>
                      {/* <Dropdown
                        className="gray__dropDown"
                        options={options}
                        value={options[0]}
                      /> */}
                      <input
                        className="gray__input"
                        type="tel"
                        required
                        name="phone"
                        maxLength="15"
                        placeholder={t("addresses.mobile-number-placeholder")}
                        value={mobile}
                        onChange={(e) => {
                          setMobile(e.target.value);
                          if (errors[e.target.name]) {
                            validatePhoneNumber({
                              name: e.target.name,
                              value: e.target.value,
                              handler: setErrors,
                              lang,
                              iso: selectedCountry.iso,
                            });
                          }
                        }}
                        onBlur={(e) => {
                          validatePhoneNumber({
                            name: e.target.name,
                            value: e.target.value,
                            handler: setErrors,
                            lang,
                            iso: selectedCountry.iso,
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
              </div>
            </section>
            <LandScapePhones className="add-address-step1__check">
              <input
                type="checkbox"
                id="setDefault"
                name="setDefault"
                value="Bike"
              />
              <label htmlFor="setDefault">
                {t("addresses.set-default-add")}
              </label>
            </LandScapePhones>
            <div className="add-address-step1__btn-cnt">
              <button
                className="primary-btn add-address-step1__btn"
                type="submit"
              >
                {submitLoading ? (
                  <Loading type="white" width="20px" height="20px" />
                ) : isEditState ? (
                  t("addresses.edit")
                ) : (
                      t("addresses.save")
                    )}
              </button>
            </div>
          </form>
        );
      }}
    </Translate>
  );
};
