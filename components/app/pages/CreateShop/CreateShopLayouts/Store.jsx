import React from "react";
import { Translate } from "react-localize-redux";
import { CreateShopContext } from "../CreateShopContext";
import SelectAddress from "./../../UserPanel/PanelPages/Addresses/AddressesLayouts/SelectAddress";
import { BoxStyle3 } from "./../../../../common";
import { CSSTransition } from "react-transition-group";
import { COMPLETE_AND_NEXT } from "../CreateShopConstant";
import { FormErrorMsg } from "../../../../common";
import Select from "react-select";
import { client_getParentCategory } from "./../../../../../lib/api/client/clientShop";
import Geocode from "react-geocode";

import {
  validateEmpty,
  validatePhoneNumber,
} from "../../../../../lib/formValidator";

class Store extends React.Component {
  static contextType = CreateShopContext;

  constructor(props) {
    super(props);

    this.state = {
      showSelectAddress: false,
      data: {},
      personId: 1,
      errors: {},
      name: "",
      shopName: "",
      fullAddress: "",
      phone: "",
      lat: 0,
      lang: 0,
      dontSetLocation: true,
      selectedCategory: null,
      categoryOptions: [],
      categoryEmptyError: false,
      cityName: "",
      countryName: "",
      phoneCode: "",
      iso: "",
      optopns: [
        { value: 1, label: "Legal" },
        { value: 2, label: "Natural" },
      ],
    };
    this.API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;

    this.handleSituation = this.handleSituation.bind(this);
    this.handlePersonChange = this.handlePersonChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleShopNameChange = this.handleShopNameChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
  }

  async componentDidMount() {
    const result = await client_getParentCategory();
    let items = [];
    result.result.forEach((item) => {
      items.push({ value: item.categoryId, label: item.categoryTitle });
    });
    this.state.categoryOptions = items;
    // let phoneNumber = "";
    // if (this.context.formData.phone === "") {
    //   phoneNumber = "+" + this.context.formData.phoneCode;
    // } else {
    //   phoneNumber = this.context.formData.phone;
    // }
    this.setState({
      personId: this.context.formData.fkPersonId == 2 ? 2 : 1,
      name:
        this.context.formData.fkPersonId == 2
          ? this.context.formData.fullName
          : this.context.formData.companyName,
      shopName: this.context.formData.storeName,
      fullAddress: this.context.formData.address,
      selectedCategory: this.context.filesData.selectedCategory,
      phone: this.context.formData.phone,
      cityName: this.context.formData.cityName,
      countryName: this.context.formData.countryName,
      iso: this.context.formData.iso,
      lat: this.context.formData.locationX,
      lang: this.context.formData.locationY,
    });
    Geocode.setApiKey(this.API_KEY);

    if(this.state.lat == 0 && this.state.lang == 0) {
      Geocode.fromAddress(this.state.cityName, null, this.props.lang).then(
        (response) => {
          const address = response.results[0].geometry;
          this.setState({
            lat: address.location.lat,
            lang: address.location.lng,
          });
        },
        (error) => {}
      );
    }
    else {
      this.setState({
        dontSetLocation: false,
      });
    }


  }

  setErrors = (func) => {
    const error = func(this.state.errors);
    this.setState({
      errors: error,
    });
  };

  setData = (data) => {
    const newData = { ...this.state.data };
    for (let key in data) {
      newData[key] = data[key];
    }

    this.setState({
      fullAddress: newData.address,
      lat: newData.Location.lat,
      lang: newData.Location.lng,
      dontSetLocation: false,
    });
  };

  handleSituation({ type }) {
    switch (type) {
      case "showMap":
        this.setState({
          showSelectAddress: true,
        });
        break;
      case "hideMap":
        this.setState({
          showSelectAddress: false,
        });
        break;
      default:
        break;
    }
  }

  handlePersonChange = (event) => {

    this.setState({
      ...this.state,
      personId: event.value,
    });
  };

  handleNameChange = (event) => {
    this.setState({ name: event.target.value });
  };

  handleShopNameChange = (event) => {
    this.setState({ shopName: event.target.value });
  };

  handleAddressChange = (event) => {
    this.setState({ fullAddress: event.target.value });
  };

  handlePhoneChange = (event) => {
    this.setState({ phone: event.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    debugger;
    if (this.state.selectedCategory == null) {
      this.setState({ categoryEmptyError: true });
      return;
    }

    for (let key in this.state.errors) {
      if (this.state.errors[key]) {
        return;
      }
    }

    this.context.handleStore(
      this.state.personId,
      this.state.name,
      this.state.shopName,
      this.state.fullAddress,
      this.state.selectedCategory,
      this.state.phone,
      this.state.lat,
      this.state.lang
    );
    this.context.handleStep(COMPLETE_AND_NEXT);

    this.setState({ categoryEmptyError: false });
  };

  handleCategoryChange = (item) => {
    
    this.setState({
      ...this.state,
      selectedCategory: item,
    });
  };

  render() {
    return (
      <form className="createshop__transition-cnt" onSubmit={this.handleSubmit}>
        <div className="mt-5">
          <h3 className="createshop__header-text">
            <Translate id="store.store-msg1" />
          </h3>
          <div className="createshop__form createshop__form--store">
            <Translate>
              {({ translate: t }) => {
                if (this.state.showSelectAddress) {
                  return (
                    <CSSTransition
                      appear
                      in={true}
                      classNames="user-panel__routes"
                      timeout={400}
                    >
                      <BoxStyle3>
                        <SelectAddress
                          setData={this.setData}
                          handleSituation={this.handleSituation}
                          lat={this.state.lat}
                          lng={this.state.lang}
                          dontSetLocation={this.state.dontSetLocation}
                          selectedCountry={this.state.countryName}
                        />
                      </BoxStyle3>
                    </CSSTransition>
                  );
                } else {
                  return (
                    <>
                      <div className="createshop__form-cnt row justify-content-between">
                        <div className="col-12 col-sm-6">
                          <label className="auth__form-label">
                            <span className="auth__input-label">
                              <Translate id="store.person" />
                            </span>
                            <Select
                              className="react-select"
                              options={this.state.optopns}
                              onChange={this.handlePersonChange}
                              placeholder={t("store.person-placeholder")}
                              value={
                                this.state.personId == 1
                                  ? this.state.optopns[0]
                                  : this.state.optopns[1]
                              }
                              required
                            />
                          </label>
                        </div>
                        <div className="col-12 col-sm-6">
                          <label className="auth__form-label">
                            <span className="auth__input-label">
                              {this.state.personId != 2 && (
                                <Translate id="store.company-name" />
                              )}
                              {this.state.personId == 2 && (
                                <Translate id="store.fullname" />
                              )}
                            </span>
                            <input
                              className="gray__input"
                              type="string"
                              placeholder={
                                this.state.personId == 2
                                  ? t("store.full-name-placeholder")
                                  : t("store.company-name-placeholder")
                              }
                              onBlur={(e) => {
                                validateEmpty({
                                  name: "name",
                                  value: e.target.value,
                                  handler: this.setErrors,
                                  lang: this.context.lang,
                                });
                              }}
                              required
                              onChange={this.handleNameChange}
                              value={this.state.name}
                            />
                            <FormErrorMsg
                              show={this.state.errors["name"]}
                              msg={this.state.errors["name"]}
                            />
                          </label>
                        </div>
                        <div className="col-12 col-sm-6">
                          <label className="auth__form-label">
                            <span className="auth__input-label">
                              <Translate id="store.store-name" />
                            </span>
                            <input
                              className="gray__input"
                              type="string"
                              placeholder={t("store.store-name-placeholder")}
                              onBlur={(e) => {
                                validateEmpty({
                                  name: "Companyname",
                                  value: e.target.value,
                                  handler: this.setErrors,
                                  lang: this.context.lang,
                                });
                              }}
                              required
                              onChange={this.handleShopNameChange}
                              value={this.state.shopName}
                            />
                            <FormErrorMsg
                              show={this.state.errors["Companyname"]}
                              msg={this.state.errors["Companyname"]}
                            />
                          </label>
                        </div>
                        {/* <div className="col-12 col-sm-6">
                          <label className="auth__form-label">
                            <span className="auth__input-label">
                              {this.state.personId == 1 && (
                                <Translate id="store.company-phone" />
                              )}
                              {this.state.personId == 2 && (
                                <Translate id="store.phone" />
                              )}
                            </span>
                            <div className="d-flex store-phone-number" style={{fontSize:'15px',alignItems:'center'}}>
                              <span>+</span>
                              <span className="mr-3">{this.state.phoneCode}</span>
                              <input
                                className="gray__input"
                                type="string"
                                name="phone"
                                placeholder={
                                  this.state.personId == 1
                                    ? t("store.company-phone-placeholder")
                                    : t("store.phone-placeholder")
                                }
                                onBlur={(e) => {
                                  validatePhoneNumber({
                                    name: e.target.name,
                                    value: e.target.value,
                                    handler: this.setErrors,
                                    lang: this.context.lang,
                                    iso: this.state.iso,
                                  });
                                }}
                                required
                                onChange={this.handlePhoneChange}
                                value={this.state.phone}
                              />
                            </div>

                            <FormErrorMsg
                              show={this.state.errors["phone"]}
                              msg={this.state.errors["phone"]}
                            />
                          </label>
                        </div> */}
                        <div className="col-12">
                          <label className="auth__form-label">
                            <span className="auth__input-label">
                              <Translate id="store.kind-pro" />
                            </span>
                            <Select
                              className="react-select"
                              options={this.state.categoryOptions}
                              onChange={this.handleCategoryChange}
                              placeholder={t("store.kind-pro-placeholder")}
                              value={this.state.selectedCategory}
                              required
                            />
                          </label>

                          {this.state.categoryEmptyError && (
                            <span className="country-error">
                              <Translate id="store.select-category-error" />
                            </span>
                          )}
                        </div>

                        <div className="col-12">
                          <label className="auth__form-label">
                            <span
                              className="select-address-wrapper"
                              onClick={() =>
                                this.handleSituation({ type: "showMap" })
                              }
                            >
                              <Translate id="addresses.select-map" />
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                id="placeholder"
                                width="21.225"
                                height="33.106"
                                viewBox="0 0 21.225 33.106"
                              >
                                <path
                                  id="Subtraction_7"
                                  fill="#acb1b8"
                                  d="M10.613 33.106L6.25 20.286a10.612 10.612 0 1 1 8.727 0L10.614 33.1zm0-30a7.5 7.5 0 1 0 7.5 7.5 7.513 7.513 0 0 0-7.5-7.497z"
                                  data-name="Subtraction 7"
                                />
                              </svg>
                            </span>
                          </label>
                        </div>

                        <div className="col-12">
                          <label className="auth__form-label">
                            <span className="auth__input-label">
                              <Translate id="store.address" />
                            </span>
                            <textarea
                              placeholder={t("store.address-placeholder")}
                              className="gray__input"
                              rows="5"
                              value={this.state.fullAddress}
                              onChange={this.handleAddressChange}
                            ></textarea>
                            <FormErrorMsg
                              show={this.state.errors["Address"]}
                              msg={this.state.errors["Address"]}
                            />
                          </label>
                        </div>
                      </div>
                    </>
                  );
                }
              }}
            </Translate>
          </div>
        </div>
        <div className="createshop__btm text-align-center-ltr mb-5">
          {!this.state.showSelectAddress ? (
            <div className="auth__btn">
              <button
                type="submit"
                className="createshop__primary-btn primary-btn"
              >
                <Translate id="country.next" />
              </button>
            </div>
          ) : null}
        </div>
      </form>
    );
  }
}

export default Store;
