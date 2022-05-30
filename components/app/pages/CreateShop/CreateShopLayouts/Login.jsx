import React from "react";

import { CreateShopContext } from "../CreateShopContext";
import { Translate } from "react-localize-redux";
import { toast } from "react-toastify";
import { Button, FormErrorMsg, Loading } from "../../../../common";
import { getErrorMsg } from "../../../../../lib/helpers";
import { getToastConfig } from "../../../../../lib/toast";
import {
  validateEmail,
  validatePasswordCreateShop,
  validateConfirmPassword,
  validatePhoneNumber,
} from "../../../../../lib/formValidator";
import { COMPLETE_AND_NEXT } from "../CreateShopConstant";
import {
  client_getActiveCountries,
  client_checkShopEmail,
  client_VerifyProviderMobileNumber,
} from "./../../../../../lib/api/client/clientShop";
import VerifyPhone from "../../../verifyPhone/VerifyPhone";
import Select from "react-select";
import ReCAPTCHA from "react-google-recaptcha";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countryItems: [],
      email: "",
      pass: "",
      cPass: "",
      mobileNumber: "",
      oldMobileNumber: "",
      countryId: 0,
      selectedCountry: null,
      countryName: "",
      iso: "",
      phoneCode: "",
      requestId: "",
      errors: {},
      showLoader: false,
      loaderFinalSubmitButton: false,
      currentSituation: 1,
      captchaErrors:false , 
      captchaToken:"",
      captchaRef:{}
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePassChange = this.handlePassChange.bind(this);
    this.handleConfirmPassChange = this.handleConfirmPassChange.bind(this);
  }
  static contextType = CreateShopContext;

  async componentDidMount() {
    const result = await client_getActiveCountries();
    let countries = [];
    result.result.forEach((item) => {
      countries.push({
        value: item.countryId,
        label: (
          <div>
            <img
              src={`/assets/flags/${item.flagUrl}`}
              height="15px"
              width="15px"
            />{" "}
            + {item.phoneCode}
          </div>
        ),
        iso: item.iso,
        phoneCode: item.phoneCode,
        countryName: item.countryTitle,
      });
    });
    this.setState({
      email: this.context.formData.email,
      mobileNumber: "",
      oldMobileNumber: this.context.formData.phone,
      pass: this.context.formData.password,
      cPass: this.context.formData.password,
      phoneCode: this.context.formData.phoneCode,
      iso: this.context.formData.iso,
      countryId: this.context.formData.fkCountryId,
      countryName: this.context.formData.countryName,
      countryItems: countries,
    });
  }

  setErrors = (func) => {
    const error = func(this.state.errors);
    this.setState({
      errors: error,
    });
  };

  handleEmailChange = (event) => {
    this.setState({ email: event.target.value });
  };

  handlePassChange = (event) => {
    this.setState({ pass: event.target.value });
  };

  handleConfirmPassChange = (event) => {
    this.setState({ cPass: event.target.value });
  };

  handleClick = () => {};


  
  handleChangeToken = (token) => {
    this.setState({ captchaToken: token });
  }
  handleChangeRef = (e) => {
    this.setState({ captchaRef: e })  
  }



  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ showLoader: true });

    for (let key in this.state.errors) {
      if (this.state.errors[key]) {
        toast.error(
          getErrorMsg(this.state.lang, "error-detected"),
          getToastConfig()
        );
        this.setState({ showLoader: false });
        return;
      }
    }

    if (this.state.captchaToken === "") {
      this.setState({ captchaErrors: true });
      return;
    } else {
      this.setState({ captchaErrors: false });
    }



    let checkMobileNumber = false;
    if (this.state.oldMobileNumber !== this.state.mobileNumber) {
      checkMobileNumber = true;
    }
    const data = await client_checkShopEmail(
      "+" + this.state.phoneCode + this.state.mobileNumber,
      this.state.email,
      checkMobileNumber,
      this.state.captchaToken
    );
    if (data.status !== 200) {
      toast.error(data.message, getToastConfig());
      this.setState({ showLoader: false });
      return;
    }
    else if (data.result == null) {
      toast.error(data.message, getToastConfig());
      this.setState({ showLoader: false });
      this.state.captchaRef.reset();

      return;  
    }
    else {
      if (checkMobileNumber) {
        this.setState({
          showLoader: false,
          currentSituation: 2,
          requestId: data.result.requestId,
        });
      } else {
        this.nextSection();
      }
    }
  };

  handlerVerifySms = async (smsCode, requestSmsId) => {
    try {
      this.setState({ loaderFinalSubmitButton: true });

      const data = await client_VerifyProviderMobileNumber(
        "+" + this.state.phoneCode + this.state.mobileNumber,
        smsCode,
        requestSmsId
      );
      if (data.status === 200) {

        this.nextSection();

      } else {
      }
    } catch (err) {
      this.setState({ showLoader: false, loaderFinalSubmitButton: false });
      toast.error(err.response?.data.message, getToastConfig());
    }
  };

  handleBackclick = () => {
    this.setState({
      currentSituation: 1,
      pass: "",
      cPass: "",
      showLoader: false,
    });
  };


  nextSection = () => {
    this.context.handleLogin(
      this.state.email,
      this.state.pass,
      this.state.mobileNumber,
      this.state.countryId,
      this.state.iso,
      this.state.phoneCode,
      this.state.countryName
    );
    this.context.handleStep(COMPLETE_AND_NEXT);
    this.setState({ showLoader: false, loaderFinalSubmitButton: false });
  }

  render() {
    return (
      <div style={{ height: "100%", width: "100%" }}>
        {this.state.currentSituation === 1 ? (
          <div className="createshop__transition-cnt">
            <div className="mt-5">
              <h3 className="createshop__header-text">
                <Translate id="login.signIn-msg1" />
              </h3>
              <form
                onSubmit={this.handleSubmit}
                className="auth__form auth__form--login createshop__login createshop__form--login"
              >
                <Translate>
                  {({ translate: t }) => {
                    return (
                      <>
                        <label className="auth__form-label">
                          <span className="auth__input-label">
                            <Translate id="login.mobileNumber" />
                          </span>
                          <div className="auth__mobile-number">
                            <Select
                              className="react-select"
                              options={this.state.countryItems}
                              value={this.state.selectedCountry}
                              placeholder="code"
                              onChange={(event) => {
                                this.setState({
                                  selectedCountry: event,
                                  iso: event.iso,
                                  countryId: event.value,
                                  phoneCode: event.phoneCode,
                                  countryName: event.countryName,
                                });
                              }}
                              onBlur={(e) => {
                                validatePhoneNumber({
                                  name: "mobileNumber",
                                  value: this.state.mobileNumber,
                                  handler: this.setErrors,
                                  lang: this.context.lang,
                                  iso: this.state.iso,
                                });
                              }}                            />
                            <input
                              className="auth__input auth__input-mobile"
                              type="text"
                              onChange={(event) => {
                                this.setState({
                                  mobileNumber: event.target.value,
                                });
                              }}
                              value={this.state.mobileNumber}
                              name="mobileNumber"
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
                              placeholder={t("login.mobile-placeholder")}
                            />
                          </div>
                          <FormErrorMsg
                            show={this.state.errors["mobileNumber"]}
                            msg={this.state.errors["mobileNumber"]}
                          />
                        </label>
                        <label className="auth__form-label">
                          <span className="auth__input-label">
                            <Translate id="login.email" />
                          </span>
                          <input
                            className="gray__input"
                            type="email"
                            onChange={this.handleEmailChange}
                            placeholder={t("login.email-placeholder")}
                            required
                            value={this.state.email}
                            onBlur={(e) => {
                              validateEmail({
                                name: "email",
                                value: e.target.value,
                                handler: this.setErrors,
                                lang: this.context.lang,
                              });
                            }}
                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                          />
                          <FormErrorMsg
                            show={this.state.errors["email"]}
                            msg={this.state.errors["email"]}
                          />
                        </label>
                        <label className="auth__form-label">
                          <span className="auth__input-label">
                            <Translate id="login.pass" />
                          </span>
                          <input
                            className="gray__input"
                            type="password"
                            placeholder={t("login.pass-placeholder")}
                            onChange={this.handlePassChange}
                            value={this.state.pass}
                            required
                            onBlur={(e) => {
                              validatePasswordCreateShop({
                                name: "password",
                                value: e.target.value,
                                handler: this.setErrors,
                                lang: this.context.lang,
                              });
                            }}
                          />
                          <FormErrorMsg
                            show={this.state.errors["password"]}
                            msg={this.state.errors["password"]}
                          />
                        </label>
                        <label className="auth__form-label">
                          <span className="auth__input-label">
                            <Translate id="login.confirm-Pass" />
                          </span>
                          <input
                            className="gray__input"
                            type="password"
                            placeholder={t("login.confirm-pass-placeholder")}
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
                      </>
                    );
                  }}
                </Translate>


                <div className="auth__captcha-cnt">
                      <ReCAPTCHA
                        // size="compact"
                        //sitekey="6Lfh-usZAAAAAP3ZYWqEZ4hmjWOi_GA606Ho19aW"
                        //sitekey="6LfLzngbAAAAAGvjtg1UxexBo4_ackScEycgp9Py"
                        sitekey="6LdygaAbAAAAALNz6ISBIREkVHadOEIakxzAPgSD"
                        onChange={this.handleChangeToken}
                        ref={this.handleChangeRef}
                      />
                      {this.state.captchaErrors ? (
                        <FormErrorMsg show={true} msg="please set captcha" />
                      ) : null}
                    </div>
                
                <div className="auth__btn">
                  <Button
                    radius="true"
                    type="submit"
                    value={
                      this.state.showLoader ? (
                        <Loading type="white" width="20px" height="20px" />
                      ) : (
                        <Translate id="login.signup" />
                      )
                    }
                  />
                </div>
                {/* <a href="#" className="auth__forget">
            <Translate id="login.forget-pass" />
          </a> */}
              </form>
            </div>
            <div className="createshop__btm text-align-center-ltr mb-5">
              <p className="createshop__text1">
                <Translate id="login.dont-acc" />
              </p>
              <a
                href="https://panel.ajyal.bh"
                className="createshop__text-sky"
              >
                <Translate id="login.signup-msg1" />
              </a>
            </div>
          </div>
        ) : (
          <div className="createshop__transition-cnt mt-5">
            <VerifyPhone
              Backclick={this.handleBackclick}
              loaderSubmitButton={this.state.loaderFinalSubmitButton}
              currdata={{
                phoneCode: this.state.phoneCode,
                mobileNumber: this.state.mobileNumber,
                iso: this.state.iso,
                requestId: this.state.requestId,
              }}
              submitRegister={this.handlerVerifySms}
            />
          </div>
        )}
      </div>
    );
  }
}

export default Login;
