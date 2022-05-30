import React from "react";
import { Translate } from "react-localize-redux";
import { switchLang } from "../../../../../lib/switch";
import { Button, FormErrorMsg, Loading } from "../../../../common";
import { useState } from "react";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateEmpty,
  validatePhoneNumber,
} from "../../../../../lib/formValidator";
import { useSelector, useDispatch } from "react-redux";
import {
  selectLang,
  selectLogin,
  LOGIN_CUSTOMER_LOADING,
  LOADING,
  SUCCE_LOGIN,
  selectCurr,
  ERROR_LOGIN,
  selectPrevLink,
  PREVLINK_CHANGE,
} from "../../../../../appConfigSlice";
import {
  client_registerCustomer,
  client_verifyCustomerMobileNumber,
} from "../../../../../lib/api/client/clientCustomer";
import { toast } from "react-toastify";
import { getToastConfig } from "../../../../../lib/toast";
import {
  getErrorMsg,
  removeCartCookie,
  setTokenCookie,
} from "../../../../../lib/helpers";
import { useRouter } from "next/router";
import axiosClient from "../../../../../lib/api/axios";
import ReCAPTCHA from "react-google-recaptcha";
import Select from "react-select";
import { client_getActiveCountries } from "../../../../../lib/api/client/clientShop";
import { useEffect } from "react";
import VerifyPhone from "../../../verifyPhone/VerifyPhone";
import Logo from "./../../../../../assets/images/logo-2.png";

export default (props) => {
  const [email, setEmail] = useState("");
  let [mobileNumber, setMobileNumber] = useState("");
  let [phoneCode, setPhoneCode] = useState("");
  const [countryId, setCountryId] = useState(null);
  const [countryItems, setCountryItems] = useState([]);
  const [password, setPassword] = useState("");
  let [iso, setIso] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [name, setName] = useState("");
  const [family, setFamily] = useState("");
  const [captchaRef, setcaptchaRef] = useState({});
  const [errors, setErrors] = useState({});
  const [captchaErrors, setcaptchaErrors] = useState(false);
  const [LoginStatus, setLoginStatus] = useState(false);
  const [captchaToken, setcaptchaToken] = useState("");
  const [currentSituation, setCurrentSituation] = useState(1);
  const [loaderFinalSubmitButton, setLoaderFinalSubmitButton] = useState(false);
  let [requestId, setrequestId] = useState("");
  const lang = useSelector(selectLang);
  const curr = useSelector(selectCurr);
  const prevLink = useSelector(selectPrevLink);
  const dis = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (LoginStatus) return;
    if (captchaToken === "") {
      setcaptchaErrors(true);
      return;
    } else {
      setcaptchaErrors(false);
    }
    for (let key in errors) {
      if (errors[key]) {
        toast.error(getErrorMsg(lang, "error-detected"), getToastConfig());
        return;
      }
    }
    dis(async (dispatch, getState) => {
      dispatch({ type: LOGIN_CUSTOMER_LOADING });
      try {
        setLoginStatus(true);
        const result = await client_verifyCustomerMobileNumber({
          captchaToken,
          mobileNumber: "+" + phoneCode + mobileNumber,
          email,
        });

        if (result.status === 200) {
          setrequestId(result.result.requestId);
          setCurrentSituation(2);
        }
      } catch (err) {
        if (captchaRef !== null) {
          captchaRef.reset();
        }
        toast.error(err.response?.data.message, getToastConfig());
        setPassword("");
        setCpassword("");
        setLoginStatus(false);
      }
    });
  };

  useEffect(() => {
    getCountris();
    return () => {};
  }, []);

  const getCountris = async () => {
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
      });
    });
    setCountryItems(countries);
  };

  const submitRegister = (smsCode, requestSmsId) => {
    dis(async (dispatch, getState) => {
      dispatch({ type: LOGIN_CUSTOMER_LOADING });
      try {
        setLoaderFinalSubmitButton(true);
        const result = await client_registerCustomer({
          email,
          pass: password,
          name,
          family,
          captchaToken,
          mobileNumber,
          countryId,
          phoneCode,
          smsCode,
          requestId: requestSmsId,
        });

        if (result.status === 200) {
          dispatch({
            type: SUCCE_LOGIN,
            payload: {
              token: result.result.token,
            },
          });
          setTokenCookie(result.result.token);
          axiosClient.setToken(result.result.token);
          toast.success(getErrorMsg(lang, "succ-regitered"), getToastConfig());
          if (prevLink) {
            dispatch({
              type: PREVLINK_CHANGE,
              payload: {
                link: null,
              },
            });
            router.push(prevLink);
          } else {
            router.push(`/${curr}-${lang}`);
          }
          removeCartCookie();
        }
      } catch (err) {
        setLoaderFinalSubmitButton(false);

        toast.error(err.response?.data.message, getToastConfig());
        dispatch({
          type: ERROR_LOGIN,
          payload: {
            error: err.response?.data.message,
          },
        });
      }
    });
  };

  const handleBackclick = () => {
    setCurrentSituation(1);
    setPassword("");
    setCpassword("");
    setMobileNumber("");
    setLoginStatus(false);
  };

  return (
    <div style={{ height: "100%" }}>
      {currentSituation === 1 ? (
        <div className="form sign-up">
          <Translate>
            {({ translate }) => {
              return (
                <>
                   {!props.isDesktop && (
                    <a
                    href="/"
                      className="auth-mobile-logo"
                    >
                      <img src={Logo} />
                    </a>
                  )}
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      switchLang(props.loc, true);
                    }}
                    className="auth__lang-slt"
                    href="#"
                  >
                    <Translate id="lang" />
                  </a>
                  {props.isDesktop ? (
                    <>
                      <h4 className="auth__header auth__header--signup">
                        <Translate id="hi" />
                      </h4>
                      <h4 className="auth__header-sub">
                        <Translate id="acc-create" />
                      </h4>
                    </>
                  ) : (
                    <h4 className="auth__header-sub-mobile">
                      <Translate id="acc-create" />
                    </h4>
                  )}

                  <form action="" onSubmit={handleSubmit}>
                    <div className="auth__form auth__form--login">
                      <label className="auth__form-label auth__form-label--signup">
                        <span className="auth__input-label">
                          <Translate id="mobileNumber" />
                        </span>
                        <div className="auth__mobile-number">
                          <Select
                            className="react-select"
                            options={countryItems}
                            placeholder="code"
                            onChange={(event) => {
                              setIso(event.iso);
                              setCountryId(event.value);
                              setPhoneCode(event.phoneCode);
                            }}
                            onBlur={(e) => {
                              validatePhoneNumber({
                                name: "mobileNumber",
                                value: mobileNumber,
                                handler: setErrors,
                                lang,
                                iso: iso,
                              });
                            }}
                          />
                          <input
                            className="auth__input auth__input-mobile"
                            type="text"
                            onChange={(event) => {
                              setMobileNumber(event.target.value);
                            }}
                            value={mobileNumber}
                            name="mobileNumber"
                            onBlur={(e) => {
                              validatePhoneNumber({
                                name: e.target.name,
                                value: e.target.value,
                                handler: setErrors,
                                lang,
                                iso: iso,
                              });
                            }}
                            required
                            placeholder={translate("mobile-placeholder")}
                          />
                        </div>
                        <FormErrorMsg
                          show={errors["mobileNumber"]}
                          msg={errors["mobileNumber"]}
                        />
                      </label>

                      <label className="auth__form-label auth__form-label--signup">
                        <span className="auth__input-label">
                          <Translate id="email" />
                        </span>
                        <input
                          className="auth__input"
                          type="email"
                          onChange={(event) => {
                            setEmail(event.target.value);
                          }}
                          value={email}
                          name="email"
                          required
                          onBlur={(e) => {
                            validateEmail({
                              name: "email",
                              value: e.target.value,
                              handler: setErrors,
                              lang,
                            });
                          }}
                          placeholder={translate("email-placeholder")}
                          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                        />
                        <FormErrorMsg
                          show={errors["email"]}
                          msg={errors["email"]}
                        />
                      </label>
                      <label className="auth__form-label auth__form-label--signup">
                        <span className="auth__input-label">
                          <Translate id="Password" />
                        </span>
                        <input
                          className="auth__input"
                          type="password"
                          placeholder={translate("pass-placeholder")}
                          onBlur={(e) => {
                            validatePassword({
                              name: "password",
                              value: e.target.value,
                              handler: setErrors,
                              lang,
                            });
                          }}
                          onChange={(event) => {
                            setPassword(event.target.value);
                          }}
                          value={password}
                          name="password"
                          required
                        />
                        <FormErrorMsg
                          show={errors["password"]}
                          msg={errors["password"]}
                        />
                      </label>
                      <label className="auth__form-label auth__form-label--signup">
                        <span className="auth__input-label">
                          <Translate id="pas-confirm" />
                        </span>
                        <input
                          required
                          className="auth__input"
                          type="password"
                          onBlur={(e) => {
                            validateConfirmPassword({
                              name: e.target.name,
                              value1: password,
                              value2: e.target.value,
                              handler: setErrors,
                              lang,
                            });
                          }}
                          onChange={(event) => {
                            setCpassword(event.target.value);
                            validateConfirmPassword({
                              name: event.target.name,
                              value1: password,
                              value2: event.target.value,
                              handler: setErrors,
                              lang,
                            });
                          }}
                          value={cpassword}
                          name="cpassword"
                          placeholder={translate("cpass-placeholder")}
                        />
                        <FormErrorMsg
                          show={errors["cpassword"]}
                          msg={errors["cpassword"]}
                        />
                      </label>
                      <label className="auth__form-label auth__form-label--signup">
                        <span className="auth__input-label">
                          <Translate id="name" />
                        </span>
                        <input
                          required
                          className="auth__input"
                          type="text"
                          placeholder={translate("name-placeholder")}
                          onBlur={(e) => {
                            validateEmpty({
                              name: e.target.name,
                              value: e.target.value,
                              handler: setErrors,
                              lang,
                            });
                          }}
                          onChange={(event) => {
                            setName(event.target.value);
                          }}
                          value={name}
                          name="name"
                        />
                        <FormErrorMsg
                          show={errors["name"]}
                          msg={errors["name"]}
                        />
                      </label>
                      <label className="auth__form-label auth__form-label--signup">
                        <span className="auth__input-label">
                          <Translate id="family" />
                        </span>
                        <input
                          required
                          className="auth__input"
                          type="text"
                          placeholder={translate("family-placeholder")}
                          onBlur={(e) => {
                            validateEmpty({
                              name: e.target.name,
                              value: e.target.value,
                              handler: setErrors,
                              lang,
                            });
                          }}
                          onChange={(event) => {
                            setFamily(event.target.value);
                          }}
                          value={family}
                          name="family"
                        />
                        <FormErrorMsg
                          show={errors["family"]}
                          msg={errors["family"]}
                        />
                      </label>
                    </div>
                    <div className="auth__captcha-cnt">
                      <ReCAPTCHA
                        // size="compact"
                        //sitekey="6Lfh-usZAAAAAP3ZYWqEZ4hmjWOi_GA606Ho19aW"
                        // sitekey="6LfLzngbAAAAAGvjtg1UxexBo4_ackScEycgp9Py"
                        sitekey="6LdygaAbAAAAALNz6ISBIREkVHadOEIakxzAPgSD"
                        onChange={(token) => {
                          setcaptchaToken(token);
                        }}
                        ref={(e) => setcaptchaRef(e)}
                      />
                      {captchaErrors ? (
                        <FormErrorMsg show={true} msg="please set captcha" />
                      ) : null}
                    </div>
                    <div className="auth__btn" style={{ marginTop: "30px" }}>
                      <Button
                        radius="true"
                        value={
                          LoginStatus ? (
                            <Loading type="white" width="20px" height="20px" />
                          ) : (
                            <Translate id="acc-create2" />
                          )
                        }
                      />
                    </div>
                  </form>

                  <div className="auth__footer-mobile">
                    <h4 className="auth__header-sub mt-5">
                      <Translate id="acc-have" />
                    </h4>
                    <a
                      onClick={props.clickSignUp}
                      className="auth__forget mt-3"
                    >
                      <Translate id="signIn3" />
                    </a>
                  </div>
                </>
              );
            }}
          </Translate>
        </div>
      ) : (
        <div className="form ">
          <VerifyPhone
            Backclick={handleBackclick}
            loaderSubmitButton={loaderFinalSubmitButton}
            currdata={{
              phoneCode: phoneCode,
              mobileNumber: mobileNumber,
              iso: iso,
              requestId: requestId,
            }}
            submitRegister={submitRegister}
          />
        </div>
      )}
    </div>
  );
};
