import React from "react";
import { Translate } from "react-localize-redux";
import { BoxStyle1, Loading } from "../../../../../common";
import { connect } from "react-redux";
import Modal from "react-modal";
import { selectLang } from "../../../../../../appConfigSlice";
import {
  validateConfirmPassword,
  validateEmpty,
} from "../../../../../../lib/formValidator";
import {
  client_updateProfile,
  client_changeCustomerPassword,
} from "../../../../../../lib/api/client/clientUserPanel";
import { FormErrorMsg } from "../../../../../common";
import { toast } from "react-toastify";
import { getToastConfig } from "../../../../../../lib/toast";
import { getErrorMsg } from "../../../../../../lib/helpers";
import { isRtl } from "../../../../../../lib/isRtl";
import DatePicker from "react-datepicker";
import Select from "react-select";
import {
  client_getActiveCities,
  client_getActiveCountries,
  client_getActiveProvince,
} from "../../../../../../lib/api/client/clientShop";

const renderBoxHeader = () => {
  return (
    <div className="profile-edit__header-container">
      <h2 className="profile-edit__box-header">
        <Translate id="profile.editprofile" />
      </h2>
      <p className="profile-edit__box-subheader">
        <Translate id="profile.manageprofile" />
      </p>
    </div>
  );
};

class ProfileEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        countries: [],
        provinces: [],
        cities: [],
      },
      nationalCode: "",
      birthdat: "",
      email: "",
      family: "",
      name: "",
      errors: "",
      currPass: "",
      pass: "",
      cPass: "",
      selectedCountry: null,
      selectedCity: null,
      selectedProvince: null,
      customerId: 0,
      componentLogged: false,
      showLoader: false,
      showPassLoader: false,
      date: null,
    };

    this.is_rtl = isRtl(this.props.lang);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleFamily = this.handleFamily.bind(this);
    this.handleChangeCurrPass = this.handleChangeCurrPass.bind(this);
    this.handleChangepass = this.handleChangepass.bind(this);
  }

  componentDidMount() {
    this.setState({ componentLogged: false });
    // get active countries
    client_getActiveCountries().then((res) => {
      let countries = [];
      res.result.forEach((item) => {
        countries.push({
          value: item.countryId,
          label: item.countryTitle,
          iso: item.iso,
          phoneCode: item.phoneCode,
        });

        this.setState((state) => {
          return {
            form: {
              ...state.form,
              countries: countries,
            },
          };
        });
      });
    });

    if (this.props.state.fkCountryId) {
      this.handleCountryChange({
        value: this.props.state.fkCountryId,
        label: this.props.state.countryName,
      });
    }

    if (this.props.state.fkProvinceId) {
      this.handleProvinceChange({
        value: this.props.state.fkProvinceId,
        label: this.props.state.provinceName,
      });
    }
  }

  componentWillUnmount() {
    this.props.getData();
  }

  componentDidUpdate() {
    if (!this.state.componentLogged && this.props.state.email != "") {
      this.setState({
        name: this.props.state.name,
        family: this.props.state.family,
        email: this.props.state.email,
        customerId: this.props.state.customerId,
        componentLogged: true,
        selectedCountry: this.props.state.fkCountryId
          ? {
              value: this.props.state.fkCountryId,
              label: this.props.state.countryName,
            }
          : null,
        selectedProvince: this.props.state.fkProvinceId
          ? {
              value: this.props.state.fkProvinceId,
              label: this.props.state.provinceName,
            }
          : null,
        selectedCity: this.props.state.fkCityId
          ? {
              value: this.props.state.fkCityId,
              label: this.props.state.cityName,
            }
          : null,
      });

      // if (this.props.state.fkCountryId) {
      //   this.handleCountryChange({ value: this.props.state.fkCountryId, label: this.props.state.countryName });
      // }
    }
  }

  renderPasswordModal = () => {
    return (
      <Translate>
        {({ translate: t }) => {
          return (
            <form className="changepass" onSubmit={this.handleSubmitChangePass}>
              <header className="changepass__header">
                <h2 className="changepass__header-text">
                  {t("profile.changepass")}
                </h2>
              </header>
              <div className="changepass__content">
                <p className="changepass__des">{t("profile.des-changepass")}</p>
                <label className="changepass__input-cnt gray__form-label">
                  <span className="gray__input-label">
                    {t("profile.cur-pass")}
                  </span>
                  <input
                    className="gray__input"
                    type="password"
                    placeholder={t("profile.cur-pass-placeholder")}
                    onBlur={(e) => {
                      validateEmpty({
                        name: "curr",
                        value: e.target.value,
                        handler: this.setErrors,
                        lang: this.lang,
                      });
                    }}
                    required
                    onChange={this.handleChangeCurrPass}
                    value={this.state.currPass}
                  />
                  <FormErrorMsg
                    show={this.state.errors["curr"]}
                    msg={this.state.errors["curr"]}
                  />
                </label>
                <label className="changepass__input-cnt gray__form-label">
                  <span className="gray__input-label">
                    {t("profile.new-pass")}
                  </span>
                  <input
                    className="gray__input"
                    type="password"
                    placeholder={t("profile.new-pass-placeholder")}
                    onBlur={(e) => {
                      validateEmpty({
                        name: "pass",
                        value: e.target.value,
                        handler: this.setErrors,
                        lang: this.lang,
                      });
                    }}
                    required
                    onChange={this.handleChangepass}
                    value={this.state.pass}
                  />
                  <FormErrorMsg
                    show={this.state.errors["pass"]}
                    msg={this.state.errors["pass"]}
                  />
                </label>
                <label className="changepass__input-cnt gray__form-label mt-5">
                  <span className="gray__input-label">
                    {t("profile.con-pass")}
                  </span>
                  <input
                    className="gray__input"
                    type="password"
                    placeholder={t("profile.con-pass-placeholder")}
                    required
                    value={this.state.cPass}
                    onBlur={(e) => {
                      validateConfirmPassword({
                        name: e.target.name,
                        value1: this.state.pass,
                        value2: e.target.value,
                        handler: this.setErrors,
                        lang: this.context.lang,
                      });
                    }}
                    onChange={(e) => {
                      this.handleConfirmPassChange(e);
                      validateConfirmPassword({
                        name: "cpassword",
                        value1: this.state.pass,
                        value2: e.target.value,
                        handler: this.setErrors,
                        lang: this.context.lang,
                      });
                    }}
                  />
                  <FormErrorMsg
                    show={this.state.errors["cpassword"]}
                    msg={this.state.errors["cpassword"]}
                  />
                </label>
              </div>
              <footer className="changepass__footer">
                <button
                  onClick={this.handleModalClose}
                  className="changepass__footer-btn"
                  type="button"
                >
                  {t("profile.cancel")}
                </button>
                <button className="changepass__footer-btn changepass__footer-btn--primary">
                  {this.state.showPassLoader ? (
                    <Loading type="gray" width="11%" height="70%" />
                  ) : (
                    t("profile.save-pass")
                  )}
                </button>
              </footer>
            </form>
          );
        }}
      </Translate>
    );
  };

  setErrors = (func) => {
    const error = func(this.state.errors);
    this.setState({
      errors: error,
    });
  };

  clickHandler = (e) => {
    e.preventDefault();
    this.setState({
      isPasswordModalOpen: true,
    });
  };

  handleModalClose = () => {
    this.setState({
      isPasswordModalOpen: false,
    });
  };

  handleChangeName = (e) => {
    this.setState({ name: e.target.value });
  };

  handleFamily = (e) => {
    this.setState({ family: e.target.value }, () => {});
  };

  handleChangeCurrPass = (e) => {
    this.setState({ currPass: e.target.value });
  };

  handleChangepass = (e) => {
    this.setState({ pass: e.target.value });
  };

  handleChangepass = (e) => {
    this.setState({ pass: e.target.value });
  };

  handleConfirmPassChange = (e) => {
    this.setState({ cPass: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    for (let key in this.state.errors) {
      if (this.state.errors[key]) {
        console.log("error");
        return;
      }
    }

    try {
      this.setState({ showLoader: true });
      let result = await client_updateProfile({
        userName: this.state.email,
        name: this.state.name,
        family: this.state.family,
        nationalCode: this.state.nationalCode,
        birthDate: this.state.date?.toLocaleDateString(),
        FkCountryId: this.state.selectedCountry?.value,
        FkCityId: this.state.selectedCity?.value,
        FkProvinceId: this.state.selectedProvince?.value,
      });

      if (result.status == 200) {
        toast.success(
          getErrorMsg(this.props.lang, "succ-update-profile"),
          getToastConfig()
        );
      }
    } catch (error) {
      toast.error(error.response?.data.message, getToastConfig());
    }
    this.setState({ showLoader: false });
  };

  handleSubmitChangePass = async (e) => {
    e.preventDefault();
    for (let key in this.state.errors) {
      if (this.state.errors[key]) {
        return;
      }
    }

    try {
      this.setState({ showPassLoader: true });

      let result = await client_changeCustomerPassword({
        oldPassword: this.state.currPass,
        newPassword: this.state.pass,
        userName: this.state.email,
      });

      if (result.status == 200) {
        toast.success(
          getErrorMsg(this.props.lang, "succ-update-password"),
          getToastConfig()
        );

        this.setState({
          isPasswordModalOpen: false,
        });
      }
    } catch (error) {
      toast.error(error.response?.data.message, getToastConfig());
    }
    this.setState({ showPassLoader: false });
  };

  compare(a, b) {
    return a.label > b.label ? 1 : b.label > a.label ? -1 : 0;
  }

  handleCountryChange = async (item) => {
    this.setState((state) => {
      return {
        ...state,
        selectedCountry: item,
        selectedCity: null,
        selectedProvince: null,
      };
    });
    const result = await client_getActiveProvince(item.value);
    let provinces = [];
    result.result.forEach((item) => {
      provinces.push({ value: item.provinceId, label: item.provinceName });
    });
    provinces.sort(this.compare);
    this.setState((state) => {
      return {
        ...state,
        form: {
          ...state.form,
          provinces: provinces,
        },
      };
    });
    // const result = await client_getActiveCities(item.value);
    // let cities = [];
    // result.result.forEach((item) => {
    //   cities.push({ value: item.cityId, label: item.cityTitle });
    // });
    // this.setState((state) => {
    //   return {
    //     ...state,
    //     form: {
    //       ...state.form,
    //       cities: cities,
    //     },
    //   };
    // });
  };

  handleProvinceChange = async (item) => {
    this.setState((state) => {
      return {
        ...state,
        selectedProvince: item,
        selectedCity: null,
      };
    });
    const result = await client_getActiveCities(item.value);
    if (item.value != this.state.selectedProvince?.value) {
      this.setState((state) => {
        return {
          ...state,
          selectedProvince: null,
        };
      });
    }
    let cities = [];
    result.result.forEach((item) => {
      cities.push({ value: item.cityId, label: item.cityTitle });
    });

    cities.sort(this.compare);
    this.setState((state) => {
      return {
        ...state,
        form: {
          ...state.form,
          cities: cities,
        },
      };
    });
    // setCityItems(cities);
    // setProvinceEmptyError(false);
  };

  render() {
    return (
      <BoxStyle1 headerContent={renderBoxHeader()}>
        <Modal
          closeTimeoutMS={200}
          className="changepass-modal"
          overlayClassName="editProfileOverly"
          onRequestClose={this.handleModalClose}
          isOpen={this.state.isPasswordModalOpen}
          ariaHideApp={false}
        >
          {this.renderPasswordModal(0)}
        </Modal>
        <section className="container-fluid profile-edit">
          <form
            className="profile-edit__form-container mt-4"
            onSubmit={this.handleSubmit}
          >
            <Translate>
              {({ translate }) => {
                return (
                  <>
                    {/* <ToastContainer rtl={this.is_rtl} {...getToastConfig()} /> */}
                    <div className="row no-gutters justify-content-between">
                      <div className="col-md-6">
                        <label className="profile-edit__form-label gray__form-label mt-3">
                          <span className="profile-edit__input-label gray__input-label">
                            <Translate id="profile.firstname" />
                            <span className="input-required">*</span>
                          </span>
                          <input
                            className="profile-edit__input gray__input"
                            type="text"
                            onBlur={(e) => {
                              validateEmpty({
                                name: "name",
                                value: e.target.value,
                                handler: this.setErrors,
                                lang: this.lang,
                              });
                            }}
                            required
                            onChange={this.handleChangeName}
                            value={this.state.name}
                          />
                          <FormErrorMsg
                            show={this.state.errors["name"]}
                            msg={this.state.errors["name"]}
                          />
                        </label>
                      </div>
                      <div className="col-md-6">
                        <label className="profile-edit__form-label gray__form-label mt-3">
                          <span className="profile-edit__input-label gray__input-label">
                            <Translate id="profile.lastname" />
                            <span className="input-required">*</span>
                          </span>
                          <input
                            className="profile-edit__input gray__input"
                            type="text"
                            onBlur={(e) => {
                              validateEmpty({
                                name: "family",
                                value: e.target.value,
                                handler: this.setErrors,
                                lang: this.lang,
                              });
                            }}
                            required
                            onChange={this.handleFamily}
                            value={this.state.family}
                          />
                          <FormErrorMsg
                            show={this.state.errors["family"]}
                            msg={this.state.errors["family"]}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="row no-gutters justify-content-between mt-4">
                      <div className="col-md-6">
                        <label className="profile-edit__form-label gray__form-label mt-3">
                          <span className="profile-edit__input-label gray__input-label">
                            <Translate id="profile.national-code" />
                            {/* <span className="input-required">*</span> */}
                          </span>
                          <input
                            className="profile-edit__input gray__input"
                            type="text"
                            // onChange={this.handleChangeName}
                            value={this.state.nationalCode}
                            placeholder={translate(
                              "profile.national-code-placeholder"
                            )}
                            onChange={(e) => {
                              this.setState({ nationalCode: e.target.value });
                            }}
                          />
                        </label>
                      </div>
                      <div className="col-md-6">
                        <label className="profile-edit__form-label gray__form-label mt-3">
                          <span className="profile-edit__input-label gray__input-label">
                            <Translate id="profile.birthday-date" />
                          </span>
                          <DatePicker
                            placeholderText="Click to select a date"
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            withPortal
                            dropdownMode="select"
                            selected={this.state.date}
                            onChange={(date) => {
                              this.setState({ date });
                            }}
                            className="profile-edit__input gray__input"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="row no-gutters justify-content-between mt-4">
                      <div className="col-md-6">
                        <label className="profile-edit__form-label gray__form-label mt-3">
                          <span className="auth__input-label">
                            <Translate id="addresses.country" />
                          </span>
                          <Select
                            className="react-select"
                            options={this.state.form.countries}
                            // isDisabled={isDisableCountry}
                            onChange={this.handleCountryChange}
                            placeholder={translate(
                              "addresses.country-placeholder"
                            )}
                            value={this.state.selectedCountry}
                            required
                          />
                        </label>
                      </div>

                      <div className="col-md-6">
                        <label className="profile-edit__form-label gray__form-label mt-3">
                          <span className="auth__input-label">
                            <Translate id="addresses.province" />
                          </span>
                          <Select
                            className="react-select"
                            options={this.state.form.provinces}
                            onChange={(item) => {
                              this.handleProvinceChange(item);
                              // setSelectedProvince(item);
                            }}
                            placeholder={translate(
                              "addresses.province-placeholder"
                            )}
                            value={this.state.selectedProvince}
                            required
                          />
                        </label>

                        {/* {provinceEmptyError && (
                          <span className="country-error">
                            <Translate id="addresses.province-placeholder" />
                          </span>
                        )} */}
                      </div>
                    </div>

                    <div className="row no-gutters justify-content-between mt-2">
                      <div className="col-md-6">
                        <label className="profile-edit__form-label gray__form-label mt-3">
                          <span className="auth__input-label">
                            <Translate id="addresses.city" />
                          </span>
                          <Select
                            className="react-select"
                            options={this.state.form.cities}
                            // isDisabled={isDisableCountry}
                            onChange={(item) => {
                              this.setState({ selectedCity: item });
                            }}
                            placeholder={translate(
                              "addresses.city-placeholder"
                            )}
                            value={this.state.selectedCity}
                            required
                          />
                        </label>
                      </div>

                      <div className="col-md-6">
                        <label className="profile-edit__form-label gray__form-label mt-3">
                          <span className="profile-edit__input-label gray__input-label">
                            <Translate id="profile.email1" />
                          </span>
                          <input
                            className="profile-edit__input gray__input"
                            type="email"
                            placeholder={translate("profile.email-placeholder")}
                            required
                            readOnly
                            value={this.state.email}
                          />
                          <span className="profile-edit__sub-label-form">
                            <Translate id="profile.cantchange" />
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="profile-edit__passchange-link-cnt">
                      <a
                        onClick={this.clickHandler}
                        className="profile-edit__passchange-link"
                      >
                        <Translate id="profile.changepass" />
                      </a>
                    </div>
                    <button
                      className="primary-btn profile-edit__save-btn"
                      type="submit"
                    >
                      {this.state.showLoader ? (
                        <Loading type="gray" width="20px" height="20px" />
                      ) : (
                        <Translate id="profile.save" />
                      )}
                    </button>
                  </>
                );
              }}
            </Translate>
          </form>
        </section>
      </BoxStyle1>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    lang: selectLang(state),
  };
};

export default connect(mapStateToProps)(ProfileEdit);
