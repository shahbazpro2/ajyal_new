import React from "react";
import { ReactComponent as LoginIcon } from "./../../../../../assets/icons/createshop/login.svg";
import { ReactComponent as CountryIcon } from "./../../../../../assets/icons/createshop/country.svg";
import { ReactComponent as StoreIcon } from "./../../../../../assets/icons/createshop/store.svg";
import { ReactComponent as DocumentIcon } from "./../../../../../assets/icons/createshop/document.svg";
import { ReactComponent as BankIcon } from "./../../../../../assets/icons/createshop/bank.svg";
import { ReactComponent as VatIcon } from "./../../../../../assets/icons/createshop/vat.svg";
import { ReactComponent as BackIcon } from "./../../../../../assets/icons/back.svg";

import { Translate } from "react-localize-redux";
import { CreateShopContext } from "../CreateShopContext";
import {
  LOGIN,
  COUNTRY,
  STORE,
  DOCUMENT,
  BANK,
  VAT,
  END,
  COUNT,
  PREV,
} from "../CreateShopConstant";

export default class extends React.Component {
  static contextType = CreateShopContext;
  step = LOGIN;
  name = null;
  icon = null;

  render() {
    // const step = this.context.step;
    // console.log("start", step);
    const step = this.context.step;
    switch (step) {
      case LOGIN:
        this.icon = (
          <LoginIcon className="shopnav-mobile__icon shopnav__icon" />
        );
        this.name = <Translate id="nav.login" />;
        break;
      case COUNTRY:
        this.icon = (
          <CountryIcon className="shopnav-mobile__icon shopnav__icon" />
        );
        this.name = <Translate id="nav.country" />;
        break;
      case STORE:
        this.icon = (
          <StoreIcon className="shopnav-mobile__icon shopnav__icon" />
        );
        this.name = <Translate id="nav.store" />;
        break;
      case DOCUMENT:
        this.icon = (
          <DocumentIcon className="shopnav-mobile__icon shopnav__icon" />
        );
        this.name = <Translate id="nav.document" />;
        break;
      case BANK:
        this.icon = <BankIcon className="shopnav-mobile__icon shopnav__icon" />;
        this.name = <Translate id="nav.bank" />;
        break;
      case VAT:
        this.icon = <VatIcon className="shopnav-mobile__icon shopnav__icon" />;
        this.name = <Translate id="nav.vat" />;
        break;
      case END:
        this.icon = null;
        this.name = null;
        break;
      default:
        break;
    }
    const needBack = step !== LOGIN && step !== END ? true : false;
    return (
      <header className="shopnav-mobile">
        <nav className="shopnav-mobile__shopnav px-5 d-flex flex-row align-items-center justify-content-between">
          <div className="shopnav-mobile__item">
            {needBack && (
              <BackIcon
                onClick={() => {
                  this.context.handleStep(PREV);
                }}
                className="shopnav-mobile__backicon"
              />
            )}
          </div>
          <div className="shopnav-mobile__item">
            <a href="#" className="shopnav__link">
              {this.icon}
              <span className="shopnav__text">{this.name}</span>
            </a>
          </div>
          <div className="shopnav-mobile__item">
            <span className="shopnav-mobile__stepcounter">
              {step != 7 && `${step}/${COUNT - 1}`}
            </span>
          </div>
        </nav>
      </header>
    );
  }
}
