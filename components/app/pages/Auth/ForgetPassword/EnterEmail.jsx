import React, { useState } from "react";
import { Translate } from "react-localize-redux";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { selectLang } from "../../../../../appConfigSlice";
import { client_sendForgetEmail } from "../../../../../lib/api/client/clientCustomer";
import { validateEmail } from "../../../../../lib/formValidator";
import { getErrorMsg } from "../../../../../lib/helpers";
import { getToastConfig } from "../../../../../lib/toast";
import { Button, FormErrorMsg, Loading } from "../../../../common";
import { VERIFY_EMAIL } from "../SignIn/SignIn";

const EnterEmail = ({ dis, setForgotEmail }) => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(false);
  const lang = useSelector(selectLang);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitStatus) return;

    for (let key in errors) {
      if (errors[key]) {
        toast.error(getErrorMsg(lang, "error-detected"), getToastConfig());
        return;
      }
    }

    setSubmitStatus(true);

    try {
      const res = await client_sendForgetEmail({ email });
      setForgotEmail(email);
      dis({ type: VERIFY_EMAIL });
    } catch (err) {
      toast.error(err.response.data.message, getToastConfig());
      setSubmitStatus(false);
    }
  };

  return (
    <div
      className="forgetpass"
      // onClick={() => {
      //   dis({ type: VERIFY_EMAIL });
      // }}
    >
      <section style={{ width: "100%" }}>
        <h4 className="auth__header-sub text-align-center-ltr">
          <Translate id="forget-pass" />
        </h4>
        <h4 className="auth__header mt-0 text-align-center-ltr">
          <Translate id="enter-email" />
        </h4>
        <div className="forgetpass__input-cnt">
          <form onSubmit={handleSubmit}>
            <label className="auth__form-label">
              <span className="auth__input-label">
                <Translate id="email" />
              </span>
              <Translate>
                {({ translate }) => {
                  return (
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
                  );
                }}
              </Translate>
              <FormErrorMsg show={errors["email"]} msg={errors["email"]} />
            </label>
            <div className="forgetpass__btn-cnt">
              <Button
                radius="true"
                value={
                  submitStatus ? (
                    <Loading type="white" width="20px" height="20px" />
                  ) : (
                    <Translate id="submit-email" />
                  )
                }
              />
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default EnterEmail;
