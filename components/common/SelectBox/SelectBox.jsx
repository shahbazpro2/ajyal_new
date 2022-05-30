import React, { Children } from "react";
// import "./SelectBox.scss";
import Bahrain from "./../../../assets/images/img-bahrain.svg";
import UnitedStates from "./../../../assets/images/img-united-states.svg";
import radioButtonOff from "./../../../assets/icons/img-radio-button-off.svg";
import radioButtonOn from "./../../../assets/icons/img-radio-button-on.svg";
import Item from "./items/item";
import { useRouter } from "next/router";
import { PanelNavi } from "../../app/pages/UserPanel/PanelLayouts";
import { connect, useDispatch, useSelector } from "react-redux";
import { PREVLINK_CHANGE, selectLogin } from "../../../appConfigSlice";
import { Translate } from "react-localize-redux";
import Link from "next/link";

const DontLogin = () => {
  const lang = useSelector((state) => {
    return state.appConfig.lang.code;
  });
  const curr = useSelector((state) => {
    return state.appConfig.currency.code;
  });

  const router = useRouter();

  const dis = useDispatch();

  const handleSignInClick = (e, isSignUp) => {
    e.preventDefault();
    dis({
      type: PREVLINK_CHANGE,
      payload: {
        link: router.asPath,
      },
    });
    if (isSignUp) router.push(`/${curr}-${lang}/Auth?signup`);
    else router.push(`/${curr}-${lang}/Auth`);
  };

  return (
    <div className="dontlogin d-flex p-4 flex-column">
      <span className="dontlogin__smallText">
        <Translate id="dontlogin.retu-custo" />
      </span>

      <a
        onClick={(e) => {
          handleSignInClick(e, false);
        }}
        className="dontlogin__btn"
      >
        <Translate id="signin2" />
      </a>

      <span className="dontlogin__smallText dontlogin__smallText--border-top">
        <Translate id="dontlogin.dont-acc" />
      </span>

      <a
        onClick={(e) => {
          handleSignInClick(e, true);
        }}
        className="primary-link dontlogin__link"
      >
        <Translate id="signup" />
      </a>
    </div>
  );
};

const SelectBox = (props) => {
  // will hold a reference for our real input file

  const lang = useSelector((state) => {
    return state.appConfig.lang.code;
  });
  const curr = useSelector((state) => {
    return state.appConfig.currency.code;
  });

  const isLogin = useSelector(selectLogin).isLogin;

  const pathname = useRouter().asPath;
  const weAreInPanel = pathname.includes("/panel");
  const changeLangOrCurrency = (e) => {
    const cuurentEl = e.currentTarget.id.split("-");

    if (cuurentEl[2] !== "active") {
      let path = pathname.split("/");
      const landAndCurrency = cuurentEl[0] + "-" + cuurentEl[1];
      let newPath = "";

      path.forEach((element, index) => {
        if (index != 1) {
          newPath = newPath + "/" + element;
        } else {
          newPath = newPath + landAndCurrency;
        }
      });

      window.location.href = newPath;
    }
  };

  if (props.type === "account") {
    return (
      <div
        className={`select-box-container ${
          props.className ? props.className : ""
        }`}
      >
        {isLogin ? (
          <PanelNavi
            loc={`/${curr}-${lang}/panel`}
            outOfReactRouter
            accountDrop={true}
            weAreInPanel={weAreInPanel}
          />
        ) : (
          <DontLogin />
        )}
      </div>
    );
  }

  return (
    <div
      className={`select-box-container ${
        props.className ? props.className : ""
      }`}
    >
      <div className="select-box-container__item">
        {props.type === "lang" ? (
          <Item
            id={
              props.currency +
              "-" +
              "en-" +
              (props.lang === "en" ? "active" : "deactive")
            }
            click={changeLangOrCurrency}
            value="English"
            flag={UnitedStates}
            active={props.lang === "en" ? radioButtonOn : radioButtonOff}
          />
        ) : (
          <Item
            id={
              "usd-" +
              props.lang +
              "-" +
              (props.currency === "usd" ? "active" : "deactive")
            }
            click={changeLangOrCurrency}
            value="USD"
            flag={UnitedStates}
            active={props.currency === "usd" ? radioButtonOn : radioButtonOff}
          />
        )}
      </div>
      <div className="select-box-container__item">
        {props.type === "lang" ? (
          <Item
            id={
              props.currency +
              "-" +
              "ar-" +
              (props.lang === "ar" ? "active" : "deactive")
            }
            hideBottomBorder={true}
            click={changeLangOrCurrency}
            value="Arabic"
            flag={Bahrain}
            active={props.lang === "ar" ? radioButtonOn : radioButtonOff}
          />
        ) : (
          <Item
            id={
              "bhd-" +
              props.lang +
              "-" +
              (props.currency === "bhd" ? "active" : "deactive")
            }
            hideBottomBorder={true}
            click={changeLangOrCurrency}
            value="BHD"
            flag={Bahrain}
            active={props.currency === "bhd" ? radioButtonOn : radioButtonOff}
          />
        )}
      </div>
    </div>
  );
};

export default SelectBox;
