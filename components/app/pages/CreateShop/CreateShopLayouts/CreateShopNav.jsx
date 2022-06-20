import React from "react";
import LoginIcon from "./../../../../../assets/icons/createshop/login.svg";
import CountryIcon from "./../../../../../assets/icons/createshop/country.svg";
import StoreIcon from "./../../../../../assets/icons/createshop/store.svg";
import DocumentIcon from "./../../../../../assets/icons/createshop/document.svg";
import BankIcon from "./../../../../../assets/icons/createshop/bank.svg";
import VatIcon from "./../../../../../assets/icons/createshop/vat.svg";
import { Translate } from "react-localize-redux";
import { CreateShopContext } from "../CreateShopContext";
import classnames from "classnames";
import {
  LOGIN,
  COUNTRY,
  STORE,
  DOCUMENT,
  BANK,
  VAT,
} from "../CreateShopConstant";
export default class extends React.Component {
  static contextType = CreateShopContext;

  render() {
    const formState = this.context.formState;

    return (
      <header className="shopnav">
        <nav className="shopnav__shopnav">
          <ul className="shopnav__list">
            <li
              className={classnames("shopnav__list-item", {
                active: formState[LOGIN].active || formState[LOGIN].complete,
              })}
            >
              <a href="#" className="shopnav__link">
                <LoginIcon className="shopnav__icon" />
                <span className="shopnav__text">
                  <Translate id="nav.login" />
                </span>
              </a>
            </li>
            <li
              className={classnames("shopnav__list-item", {
                active:
                  formState[COUNTRY].active || formState[COUNTRY].complete,
              })}
            >
              <a href="#" className="shopnav__link">
                <CountryIcon className="shopnav__icon" />
                <span className="shopnav__text">
                  <Translate id="nav.country" />
                </span>
              </a>
            </li>
            <li
              className={classnames("shopnav__list-item", {
                active: formState[STORE].active || formState[STORE].complete,
              })}
            >
              <a href="#" className="shopnav__link">
                <StoreIcon className="shopnav__icon" />
                <span className="shopnav__text">
                  <Translate id="nav.store" />
                </span>
              </a>
            </li>
            <li
              className={classnames("shopnav__list-item", {
                active:
                  formState[DOCUMENT].active || formState[DOCUMENT].complete,
              })}
            >
              <a href="#" className="shopnav__link">
                <DocumentIcon className="shopnav__icon" />
                <span className="shopnav__text">
                  <Translate id="nav.document" />
                </span>
              </a>
            </li>
            <li
              className={classnames("shopnav__list-item", {
                active: formState[BANK].active || formState[BANK].complete,
              })}
            >
              <a href="#" className="shopnav__link">
                <BankIcon className="shopnav__icon" />
                <span className="shopnav__text">
                  <Translate id="nav.bank" />
                </span>
              </a>
            </li>
            <li
              className={classnames("shopnav__list-item", {
                active: formState[VAT].active || formState[VAT].complete,
              })}
            >
              <a href="#" className="shopnav__link">
                <VatIcon className="shopnav__icon" />
                <span className="shopnav__text">
                  <Translate id="nav.vat" />
                </span>
              </a>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
}
