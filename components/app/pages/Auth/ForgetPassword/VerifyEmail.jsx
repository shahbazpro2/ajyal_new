import React, { useState } from "react";
import Timer from "react-compound-timer/build";
import { Translate } from "react-localize-redux";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { selectLang } from "../../../../../appConfigSlice";
import EmailVerifyIcon from "../../../../../assets/images/email-veri.png";
import {
  client_sendForgetEmail,
  client_verifyForgetEmail,
} from "../../../../../lib/api/client/clientCustomer";
import { getToastConfig } from "../../../../../lib/toast";
import { Button, Loading } from "../../../../common";
import { ENTER_NEW_PASSWORD } from "../SignIn/SignIn";
const VerifyEmail = ({ dis, forgotEmail }) => {
  const [code, setCode] = useState("");
  const [submitStatus, setSubmitStatus] = useState(false);
  const [errors, setErrors] = useState({});
  const lang = useSelector(selectLang);

  let can_send_new_email = false;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitStatus) return;
    setSubmitStatus(true);

    try {
      const res = await client_verifyForgetEmail({ email: forgotEmail, code });
      dis({ type: ENTER_NEW_PASSWORD });
    } catch (err) {
      toast.error(err.response.data.message, getToastConfig());
      setSubmitStatus(false);
    }
  };

  const sendEmail = async () => {
    try {
      const res = await client_sendForgetEmail({ email: forgotEmail });
    } catch (err) {
      toast.error(err.response.data.message, getToastConfig());
      can_send_new_email = true;
    }
  };

  const handleResendEmail = () => {
    sendEmail();
    can_send_new_email = false;
  };

  return (
    <section className="forgetpass">
      <div className="verify-email">
        <img
          alt="verify your email"
          src={EmailVerifyIcon}
          className="verify-email__img"
        />
        <p className="verify-email__top-text">
          <Translate id="check-inbox" />
        </p>
        <p className="verify-email__btm-text text-align-left px-5">
          <Translate id="sent-email-msg1" />
          <span className="timer__text">{forgotEmail}</span>
          <Translate id="sent-email-msg2" />
        </p>
        <form
          onSubmit={handleSubmit}
          className="verify-email__form"
          //   onSubmit={this.handleSubmit}
        >
          <label className="auth__form-label">
            <Translate>
              {({ translate }) => {
                return (
                  <input
                    className="auth__input"
                    type="text"
                    placeholder={translate("verify-code-placeholder")}
                    onChange={(event) => {
                      setCode(event.target.value);
                    }}
                    value={code}
                    name="code"
                    required
                    onBlur={(e) => {
                      // validateEmail({
                      //   name: "email",
                      //   value: e.target.value,
                      //   handler: setErrors,
                      //   lang,
                      // });
                    }}
                    // pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                  />
                );
              }}
            </Translate>
            {/* <FormErrorMsg show={errors["email"]} msg={errors["email"]} /> */}
          </label>
          <div className="forgetpass__btn-cnt">
            <Button
              radius="true"
              value={
                submitStatus ? (
                  <Loading type="white" width="20px" height="20px" />
                ) : (
                  <Translate id="verify" />
                )
              }
            />
          </div>
        </form>
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
                    e.preventDefault();
                    if (!can_send_new_email) return;
                    handleResendEmail();
                    reset();
                    start();
                  }}
                  className="timer__text"
                >
                  <Translate id="send-new-email" />
                </a>
              </div>
            );
          }}
        </Timer>
      </div>
    </section>
  );
};

export default VerifyEmail;
