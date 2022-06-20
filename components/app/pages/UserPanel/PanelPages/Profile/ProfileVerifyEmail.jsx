import React, { useEffect, useState } from "react";
import { Translate } from "react-localize-redux";
import { BoxStyle2, FormErrorMsg, Loading } from "../../../../../common";
import EmailVerifyIcon from "../../../../../../assets/images/email-veri.png";
import {
  client_sendVerifyEmail,
  client_verifyEmail,
} from "../../../../../../lib/api/client/clientUserPanel";
import { toast } from "react-toastify";
import { getErrorMsg } from "../../../../../../lib/helpers";
import { useSelector } from "react-redux";
import { selectLang } from "../../../../../../appConfigSlice";
import { getToastConfig } from "../../../../../../lib/toast";
import { PROFILE } from "./Profile";
import Timer from "react-compound-timer/build";
import { validateEmpty } from "../../../../../../lib/formValidator";

const ProfileVerifyEmail = ({ handleSitu, email }) => {
  const [code, setCode] = useState("");
  const [sendEmailLoading, setSendEmailLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errors, setErrors] = useState({});

  let can_send_new_email = false;

  const lang = useSelector(selectLang);
  // const [errors]

  const sendEmail = () => {
    setSendEmailLoading(true);
    client_sendVerifyEmail({ email })
      .then((res) => {
        setSendEmailLoading(false);
      })
      .catch((err) => {
        toast.error("error occurred", getToastConfig());
        setSendEmailLoading(false);
      });
  };

  useEffect(() => {
    sendEmail();
    return () => {};
  }, []);

  const handleResendEmail = (e) => {
    e.preventDefault();
    sendEmail();
    can_send_new_email = false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitLoading) return;
 
    for (let key in errors) {
      if (errors[key]) {
        toast.error(getErrorMsg(lang, "error-detected"), getToastConfig());
        return;
      }
    }

    setSubmitLoading(true);

    try {
      const res = await client_verifyEmail({ email, code });
      toast.success(getErrorMsg(lang, "verification-succes"), getToastConfig());
      handleSitu(PROFILE);
    } catch (err) {
      toast.error(err.response.data.message, getToastConfig());
      setSubmitLoading(false);
    }
  };

  return (
    <BoxStyle2>
      <section className="container-fluid verify-email-cnt">
        <div className="verify-email">
          {sendEmailLoading ? (
            <Loading
              width="40px"
              height="40px"
              styleSheet={{ margin: "60px auto 40px auto" }}
            />
          ) : (
            <img
              alt="verify your email"
              src={EmailVerifyIcon}
              className="verify-email__img"
            />
          )}
          <p className="verify-email__top-text">
            <Translate id="email-verify.check-email" />
          </p>
          <p className="verify-email__btm-text">
            <Translate id="email-verify.enter-code" />
          </p>
          <form className="verify-email__form" onSubmit={handleSubmit}>
            <Translate>
              {({ translate: t }) => {
                return (
                  <>
                    {/* <ToastContainer rtl={this.is_rtl} {...getToastConfig()} /> */}
                    <div className="verify-email__input-cnt">
                      <input
                        type="text"
                        className="gray__input"
                        name="code"
                        value={code}
                        required
                        placeholder={t(
                          "email-verify.verification-code-placeholder"
                        )}
                        onChange={(e) => {
                          setCode(e.target.value);
                          validateEmpty({
                            name: "code",
                            value: e.target.value,
                            handler: setErrors,
                            lang,
                          });
                        }}
                        onBlur={(e) => {
                          validateEmpty({
                            name: "code",
                            value: e.target.value,
                            handler: setErrors,
                            lang,
                          });
                        }}
                      />
                    </div>
                    <FormErrorMsg show={errors["code"]} msg={errors["code"]} />
                  </>
                );
              }}
            </Translate>
            <button className="primary-btn no-address__btn">
              {submitLoading ? (
                <Loading type="white" width="20px" height="20px" />
              ) : (
                <Translate id="email-verify.verify" />
              )}
            </button>
          </form>
        </div>
        <Timer initialTime={180000} direction="backward">
          {({ start, reset, getTime }) => {
            if (getTime() <= 0) {
              can_send_new_email = true;
            }
            return (
              <div className="timer mt-5 d-flex align-items-center justify-content-center">
                <span className="timer__count">
                  <Timer.Minutes /> : <Timer.Seconds />
                </span>

                <a
                  onClick={(e) => {
                    if (!can_send_new_email) return;
                    handleResendEmail(e);
                    reset();
                    start();
                  }}
                  className="timer__text"
                >
                  <Translate id="profile.send-new-email" />
                </a>
              </div>
            );
          }}
        </Timer>
      </section>
    </BoxStyle2>
  );
};

export default ProfileVerifyEmail;
