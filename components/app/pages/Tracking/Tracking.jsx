import React, { useCallback, useReducer, useState } from "react";
import { Translate } from "react-localize-redux";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { selectCurr, selectLang } from "../../../../appConfigSlice";
import { client_fetchTrackingDetail } from "../../../../lib/api/client/clientTracking";
import { validateEmpty } from "../../../../lib/formValidator";
import { getErrorMsg } from "../../../../lib/helpers";
import { isRtl } from "../../../../lib/isRtl";
import { getToastConfig } from "../../../../lib/toast";
import { BoxStyle1, FormErrorMsg, Loading } from "../../../common";
import TrackingSvg from "./../../../../assets/icons/tracking.svg";
import TrackingResult from "./TrackingResult";
const renderBoxHeader = () => {
  return (
    <div className="profile-edit__header-container">
      <h2 className="profile-edit__box-header">
        <Translate id="order-tracking" />
      </h2>
      <p className="profile-edit__box-subheader">
        <Translate id="tracking-sub" />
      </p>
    </div>
  );
};

export const TRACK = 1;
export const RESULT = 2;

const Tracking = () => {
  const lang = useSelector(selectLang);
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState({});
  const [clickLoading, setClickLoading] = useState(false);
  const [reqResult, setReqResult] = useState({});

  const reducer = (state, action) => {
    return action.type;
  };
  const [situ, dispatch] = useReducer(reducer, TRACK);

  const handleClick = async (e) => {
    e.preventDefault();
    if (clickLoading) return;

    for (let key in errors) {
      if (errors[key]) {
        toast.error(getErrorMsg(lang, "error-detected"), getToastConfig());
        return;
      }
    }

    setClickLoading(true);

    try {
      const res = await client_fetchTrackingDetail(code);
      if (res.status == 200) {
        setReqResult(res.result);
        setCode("");
        dispatch({ type: RESULT });
        setClickLoading(false);
      }
    } catch (err) {
      toast.error(err.response.data.message, getToastConfig());
      setClickLoading(false);
    }
  };

  return (
    <>
      <ToastContainer rtl={isRtl(lang)} {...getToastConfig()} />
      <SwitchTransition className="user-panel__container">
        <CSSTransition key={situ} classNames="user-panel__routes" timeout={200}>
          {situ == RESULT ? (
            <TrackingResult result={reqResult} dis={dispatch} />
          ) : (
            <div className="tracking container siteWidthContainer">
              <BoxStyle1 headerContent={renderBoxHeader()}>
                <div className="tracking-content">
                  <div className="verify-email">
                    <TrackingSvg
                      alt="verify your email"
                      className="tracking__img"
                    />

                    {/* <p className="verify-email__top-text">
              <Translate id="email-verify.check-email" />
            </p> */}
                    <p className="verify-email__btm-text">
                      <Translate id="tracking-input-msg" />
                    </p>
                    <form className="verify-email__form" onSubmit={handleClick}>
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
                                  placeholder={t("tracking-placeholder")}
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
                              <FormErrorMsg
                                show={errors["code"]}
                                msg={errors["code"]}
                              />
                            </>
                          );
                        }}
                      </Translate>
                      <button className="primary-btn no-address__btn">
                        {clickLoading ? (
                          <Loading type="white" width="20px" height="20px" />
                        ) : (
                          <Translate id="tracking" />
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </BoxStyle1>
            </div>
          )}
        </CSSTransition>
      </SwitchTransition>
    </>
  );
};

export default Tracking;
