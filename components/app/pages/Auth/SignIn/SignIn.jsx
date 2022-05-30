import React from "react";
import { Translate } from "react-localize-redux";
import { switchLang } from "../../../../../lib/switch";
import { Button, FormErrorMsg, Loading } from "../../../../common";
import { useState } from "react";
import {
  validateEmail,
  validatePassword,
} from "../../../../../lib/formValidator";
import { useSelector, useDispatch } from "react-redux";
import {
  selectLang,
  selectCurr,
  selectLogin,
  LOADING,
  LOGIN_CUSTOMER_LOADING,
  SUCCE_LOGIN,
  ERROR_LOGIN,
  selectPrevLink,
  PREVLINK_CHANGE,
} from "../../../../../appConfigSlice";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { getToastConfig } from "../../../../../lib/toast";
import {
  client_loginCustomer,
  client_loginWithSocial,
} from "../../../../../lib/api/client/clientCustomer";
import {
  getErrorMsg,
  removeCartCookie,
  setTokenCookie,
} from "../../../../../lib/helpers";
import axiosClient from "../../../../../lib/api/axios";
import GoogleLogin from "react-google-login";
// import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import FacebookLogin from "react-facebook-login";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { useReducer } from "react";
import EnterEmail from "../ForgetPassword/EnterEmail";
import VerifyPhone from "../../Order/OrderLayouts/ShippingAddress/VerifyPhone";
import VerifyEmail from "../ForgetPassword/VerifyEmail";
import EnterNewPassWord from "../ForgetPassword/EnterNewPassWord";
import ReCAPTCHA from "react-google-recaptcha";
import Logo from "./../../../../../assets/images/logo-2.png";

export const SIGNIN = 1;
export const ENTER_EMAIL = 2;
export const VERIFY_EMAIL = 3;
export const ENTER_NEW_PASSWORD = 4;

export default (props) => {
  const [email, setEmail] = useState("");
  const [forgotEmail, setForgotEmail] = useState(null);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [captchaErrors, setcaptchaErrors] = useState(false);
  const [captchaToken, setcaptchaToken] = useState("");
  const [captchaRef, setcaptchaRef] = useState({});

  const reducer = (state, action) => {
    return action.type;
  };
  const [situ, dispatch] = useReducer(reducer, SIGNIN);

  const lang = useSelector(selectLang);
  const curr = useSelector(selectCurr);
  const LoginStatus = useSelector(selectLogin).status === LOADING;
  const prevLink = useSelector(selectPrevLink);
  const dis = useDispatch();
  const router = useRouter();

  const FACEBOOK = 2;
  const GOOGLE = 1;

  const handleSubmit = (e) => {
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

    let result;
    dis(async (dispatch, getState) => {
      dispatch({ type: LOGIN_CUSTOMER_LOADING });
      try {
        //f
        result = await client_loginCustomer({
          email,
          pass: password,
          captchaToken,
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
          toast.success(getErrorMsg(lang, "succ-login"), getToastConfig());

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
        captchaRef.reset();
        toast.error(err.response.data.message, getToastConfig());
        dispatch({
          type: ERROR_LOGIN,
          payload: {
            error: err.response.data.message,
          },
        });

        setPassword("");
      }
    });
  };

  const onResponse = (response, type) => {
    let token;
    if (type === GOOGLE) {
      const { tokenId } = response;
      token = tokenId;
    }

    if (type === FACEBOOK) {
      token = response.accessToken;
    }

    if (LoginStatus) return;

    let result;
    dis(async (dispatch) => {
      dispatch({ type: LOGIN_CUSTOMER_LOADING });
      try {
        //f
        result = await client_loginWithSocial({
          accessToken: token,
          socialType: type,
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
          toast.success(getErrorMsg(lang, "succ-login"), getToastConfig());

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
        toast.error(err.response.data.message, getToastConfig());
        dispatch({
          type: ERROR_LOGIN,
          payload: {
            error: err.response.data.message,
          },
        });

        setPassword("");
      }
    });
  };

  const renderSwitch = () => {
    switch (situ) {
      case ENTER_EMAIL:
        return <EnterEmail dis={dispatch} setForgotEmail={setForgotEmail} />;
      case VERIFY_EMAIL:
        return <VerifyEmail dis={dispatch} forgotEmail={forgotEmail} />;
      case ENTER_NEW_PASSWORD:
        return <EnterNewPassWord dis={dispatch} forgotEmail={forgotEmail} />;
    }
  };

  return (
    <div className="form sign-in">
      {situ != SIGNIN ? (
        <SwitchTransition className="user-panel__container">
          <CSSTransition
            key={situ}
            classNames="user-panel__routes"
            timeout={200}
          >
            {renderSwitch()}
          </CSSTransition>
        </SwitchTransition>
      ) : (
        <>
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
                      <h4 className="auth__header">
                        <Translate id="welcome" />
                      </h4>
                      <h4 className="auth__header-sub">
                        <Translate id="signIn" />
                      </h4>
                    </>
                  ) : (
                    <h4 className="auth__header-sub-mobile">
                      <Translate id="signIn-mobile" />
                    </h4>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="auth__form auth__form--login">
                      <label className="auth__form-label">
                        <span className="auth__input-label">
                          <Translate id="email" />
                        </span>
                        <input
                          className="auth__input"
                          type="email"
                          placeholder={translate("email-placeholder")}
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
                          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                        />
                        <FormErrorMsg
                          show={errors["email"]}
                          msg={errors["email"]}
                        />
                      </label>
                      <label className="auth__form-label">
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
                    <div className="auth__btn">
                      <Button
                        radius="true"
                        value={
                          LoginStatus ? (
                            <Loading type="white" width="20px" height="20px" />
                          ) : (
                            <Translate id="login" />
                          )
                        }
                      />
                    </div>
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch({ type: ENTER_EMAIL });
                      }}
                      href="#"
                      className="auth__forget"
                    >
                      <Translate id="forget" />
                    </a>

                    <div className="auth__footer-mobile">
                      <h4 className="auth__header-sub mt-5">
                        <Translate id="new" />
                      </h4>
                      <h4 className="auth__header mt-3">
                        <Translate id="sign-dis" />
                      </h4>
                      <a onClick={props.clickSignUp} className="auth__forget">
                        <Translate id="signUp3" />
                      </a>
                    </div>
                  </form>
                  {/* <div class="g-signin2" data-onsuccess="onSignIn"></div> */}
                  <div className="auth__google-btn">
                    <GoogleLogin
                      disabled={LoginStatus}
                      clientId={process.env.NEXT_PUBLIC_GOOGLE_LOGIN_CLIENT_ID}
                      onSuccess={(res) => {
                        onResponse(res, GOOGLE);
                      }}
                    ></GoogleLogin>
                  </div>
                  <div className="auth__facebook-btn">
                    <FacebookLogin
                      appId={process.env.NEXT_PUBLIC_FACEBOOK_LOGIN_APP_ID}
                      fields="name,email,picture"
                      // onClick={componentClicked}
                      // cssClass="my-facebook-button-class"
                      icon="fa-facebook"
                      size="small"
                      isDisabled={LoginStatus}
                      callback={(res) => {
                        onResponse(res, FACEBOOK);
                      }}
                      textButton="Sign in with Facebook"
                    />
                  </div>
                </>
              );
            }}
          </Translate>
        </>
      )}
    </div>
  );
};
