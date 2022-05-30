import React, { useState } from "react";
import { Translate } from "react-localize-redux";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { selectLang } from "../../../../../appConfigSlice";
import { client_changeForgetPass } from "../../../../../lib/api/client/clientCustomer";
import {
  validateConfirmPassword,
  validatePassword,
} from "../../../../../lib/formValidator";
import { getErrorMsg } from "../../../../../lib/helpers";
import { getToastConfig } from "../../../../../lib/toast";
import { Button, FormErrorMsg, Loading } from "../../../../common";
import { SIGNIN } from "../SignIn/SignIn";

const EnterNewPassWord = ({ dis, forgotEmail }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
      const res = await client_changeForgetPass({
        email: forgotEmail,
        pass: password,
      });
      toast.success(res.message, getToastConfig());
      dis({ type: SIGNIN });
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
        <h4 className="auth__header-sub text-align-center-ltr mb-5">
          <Translate id="change-pass" />
        </h4>
        <div className="forgetpass__input-cnt">
          <form onSubmit={handleSubmit}>
            <Translate>
              {({ translate }) => {
                return (
                  <>
                    <label className="auth__form-label auth__form-label--signup">
                      <span className="auth__input-label">
                        <Translate id="new-pass" />
                      </span>
                      <input
                        className="auth__input"
                        type="password"
                        placeholder={translate("new-pass-placeholder")}
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
                          validateConfirmPassword({
                            name: "cpassword",
                            value1: event.target.value,
                            value2: confirmPassword,
                            handler: setErrors,
                            lang,
                          });
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
                    <label className="auth__form-label auth__form-label--signup mt-5">
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
                          setConfirmPassword(event.target.value);
                          validateConfirmPassword({
                            name: event.target.name,
                            value1: password,
                            value2: event.target.value,
                            handler: setErrors,
                            lang,
                          });
                        }}
                        value={confirmPassword}
                        name="cpassword"
                        placeholder={translate("cpass-placeholder")}
                      />
                      <FormErrorMsg
                        show={errors["cpassword"]}
                        msg={errors["cpassword"]}
                      />
                    </label>
                  </>
                );
              }}
            </Translate>
            <div className="forgetpass__btn-cnt">
              <Button
                radius="true"
                value={
                  submitStatus ? (
                    <Loading type="white" width="20px" height="20px" />
                  ) : (
                    <Translate id="submit" />
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

export default EnterNewPassWord;
