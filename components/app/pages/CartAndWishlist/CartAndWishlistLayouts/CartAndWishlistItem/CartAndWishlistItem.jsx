import React from "react";
import expressIcon from "./../../../../../../assets/icons/express.png";
import expressArIcon from "./../../../../../../assets/icons/express-ar.png";
import { Translate } from "react-localize-redux";
import DropDown from "react-dropdown";
import { ReactComponent as LikeIcon } from "./../../../../../../assets/icons/like-small.svg";
import { ReactComponent as RemoveIcon } from "./../../../../../../assets/icons/delete-cart.svg";
import { ReactComponent as CartIcon } from "./../../../../../../assets/icons/cart1.svg";
import { ReactComponent as ComponentIcon } from "./../../../../../../assets/icons/Component88.svg";
import { ReactComponent as ReturnsIcon } from "./../../../../../../assets/icons/Returns.svg";

import LazyLoad from "react-lazyload";
import Link from "next/link";
import {
  slugy,
  generateArrNumberRange,
  formatMoney,
  trimTextLonger,
} from "../../../../../../lib/helpers";
import { connect } from "react-redux";
import { selectLang, selectCurr } from "../../../../../../appConfigSlice";
import { isRtl } from "../../../../../../lib/isRtl";
import { FormErrorMsg } from "../../../../../common";

const MARKET = 1;
const AJYAL = 2;
const UBEX = 3;
const DHL = 4;
const ARAMEX = 5;
const EXPRESS = 6;
const NOT_POSSIBLE = 7;

class CartAndWishlistItem extends React.Component {
  handleRemoveItem = (e) => {
    e.preventDefault();
    if (this.props.wishlistItem) {
      this.props.handleRemoveFromWishlist(this.props.goodsId);
    } else {
      this.props.removeItemFromCart(this.props.itemId);
    }
  };

  handleQuantityChange = (selected) => {
    const count = parseInt(selected.value);
    this.props.handleItemQuantityChange(
      count,
      this.props.goodsId,
      this.props.providerId
    );
  };

  handleWishToCart = (e) => {
    e.preventDefault();
    this.props.handleMoveWishToCart(this.props.goodsId, this.props.providerId);
  };

  renderDeliverType = () => {
    let content = null;
    switch (this.props.method) {
      case MARKET:
        content = (
          <>
            <img
              src={`${process.env.NEXT_PUBLIC_SHIPPINGMETHODIMAGE_PREFIX}/${
                MARKET + "." + this.props.lang + ".png"
              }`}
              alt="marketpalce"
              className="goodItem-s2__exp"
            />
          </>
        );
        break;
      case EXPRESS:
        content = (
          <img
            src={`${process.env.NEXT_PUBLIC_SHIPPINGMETHODIMAGE_PREFIX}/${
              EXPRESS + "." + this.props.lang + ".png"
            }`}
            alt="EXPRESS"
            className="goodItem-s2__exp"
          />
        );
        break;
      case AJYAL:
        content = (
          <img
            src={`${process.env.NEXT_PUBLIC_SHIPPINGMETHODIMAGE_PREFIX}/${
              AJYAL + "." + this.props.lang + ".png"
            }`}
            alt="AJYAL"
            className="goodItem-s2__exp"
          />
        );
        break;
      case UBEX:
        content = (
          <img
            src={`${process.env.NEXT_PUBLIC_SHIPPINGMETHODIMAGE_PREFIX}/${
              UBEX + "." + this.props.lang + ".png"
            }`}
            alt="UBEX"
            className="goodItem-s2__exp"
          />
        );
        break;
      case ARAMEX:
        content = (
          <img
            src={`${process.env.NEXT_PUBLIC_SHIPPINGMETHODIMAGE_PREFIX}/${
              ARAMEX + "." + this.props.lang + ".png"
            }`}
            alt="ARAMEX"
            className="goodItem-s2__exp"
          />
        );
        break;
      case DHL:
        content = (
          <img
            src={`${process.env.NEXT_PUBLIC_SHIPPINGMETHODIMAGE_PREFIX}/${
              DHL + "." + this.props.lang + ".png"
            }`}
            alt="DHL"
            className="goodItem-s2__exp"
          />
        );
        break;

      case NOT_POSSIBLE:
        content = (
          <p class="itemDetail__cityError">
            <Translate id="detail.city-not" />
          </p>
        );
        break;
    }
    return content;
  };

  render() {
    return (
      <div className="goodItem-s2-container cart-item">
        <article className="goodItem-s2">
          <div className="goodItem-s2__left-container">
            {/* <span
              style={{
                backgroundColor: this.props.caption["bg-color"],
              }}
              className="goodItem-s2__sticky"
            >
              {this.props.caption.text}
            </span> */}

            <figure className="goodItem-s2__fig">
              <LazyLoad
                placeholder={
                  <img
                    className="goodItem-loader__img"
                    src="/assets/imgs/placeholder-v2.png"
                  />
                }
              >
                <img
                  alt={this.props.title}
                  className="goodItem-s2__img"
                  src={`${process.env.NEXT_PUBLIC_Goods_PREFIX}/${this.props.goodsId}/thumb-${this.props.goodsImage}`}
                />
              </LazyLoad>
            </figure>

            <div className="goodItem-s2__left-right">
              <div className="goodItem-s2__ns-con">
                <div className="cart-item__model">{this.props.goodsBrand}</div>
                <Link
                  href="/[usd-cur]/product/[...good]"
                  as={`/${this.props.curr}-${this.props.lang}/product/${
                    this.props.goodsId
                  }/${this.props.providerId}/${slugy(this.props.title)}`}
                >
                  <a className="goodItem-s2__name">
                    {trimTextLonger(this.props.title)}
                  </a>
                </Link>
                {!this.props.wishlistItem && (
                  <FormErrorMsg
                    show={!this.props.shippingAvailable || !this.props.exist}
                    style={{ marginTop: "-2px", width: "90%" }}
                    msg={
                      !this.props.exist ? (
                        <Translate id="cart-cart.doesnt-exist-ava" />
                      ) : (
                        <Translate id="cart-cart.doesnt-exist-city" />
                      )
                    }
                  />
                )}
                {/* {this.props.modelNumber && (
                  <div className="cart-item__model-container">
                    <span className="cart-item__model">
                      <Translate id="cart-cart.model-num" />
                    </span>
                    <span className="cart-item__model-num-value">
                      {this.props.modelNumber}
                    </span>
                  </div>
                )} */}
                {!this.props.wishlistItem && this.props.goodsVariety && (
                  <div className="cart-item__model-container">
                    <ul className="d-flex flex-wrap cart-item__varietyList">
                      {this.props.goodsVariety.map((variety) => {
                        return (
                          <li className="d-flex">
                            <span className="cart-item__model cart-item__model--less-margin">
                              {variety.parameterTitle}:
                            </span>
                            <span className="cart-item__model-num-value">
                              {variety.valueTitle}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>

              <div className="cart-item__store-name">
                <span>
                  <Translate id="soldby" />
                </span>
                <span className="store">{this.props.storeName}</span>
              </div>

              {this.props.haveGuarantee  && (

              <div className="cart-item__Guarantee">
                <ComponentIcon className="cart-item__Guarantee-icon" />
                <span>
                  {this.props.guaranteeMonthDuration}&nbsp;
                  <Translate id="month-war" />
                </span>
              </div>
           
              ) }

              {this.props.returningAllowed  && (

              <div className="cart-item__Guarantee">
                <ReturnsIcon className="cart-item__Guarantee-icon" />
                <span>
                  <Translate id="free-return" />
                </span>
              </div>
           
              ) }

              <div className="cart-item-remove-like d-flex">
                <a
                  href=""
                  className={
                    this.props.wishlistItem
                      ? "cart-item__remove cart-item__remove--margin"
                      : "cart-item__remove"
                  }
                  onClick={this.handleRemoveItem}
                >
                  <RemoveIcon className="cart-item__text-icon cart-item__text-icon--remove" />
                  <Translate id="cart-cart.removeFromList" />
                </a>
                {this.props.wishlistItem && !this.props.saleWithCall && (
                  <a
                    href=""
                    className="cart-item__remove"
                    onClick={this.handleWishToCart}
                  >
                    <CartIcon className="cart-item__text-icon" />
                    <Translate id="cart-wishlist.move-cart" />
                  </a>
                )}
                {this.props.cart && (
                  <a href="" className="cart-item__remove">
                    <LikeIcon className="cart-item__text-icon" />
                    <Translate id="cart-cart.move-whishlist" />
                  </a>
                )}
              </div>
            </div>
          </div>
          {!this.props.withoutRight && (
            <div className="goodItem-s2__right-container cart-item__right">
              {!this.props.saleWithCall ? (
                <div className="goodItem-s2__right-ft-con">
                  <div className="goodItem-s2__right-ft">

                    <div className="goodItem-s2__price-container">
                        {!isRtl(this.props.lang) ? (
                        <span className="goodItem-s2__currency">
                          <Translate id={this.props.curr} />
                        </span>
                      ) : undefined}
                      <span className="goodItem-s2__number">
                        {this.props.wishlistItem
                          ? formatMoney(this.props.finalPrice)
                          : formatMoney(this.props.priceWithDiscount)}
                      </span>
                      {isRtl(this.props.lang) ? (
                      <span className="goodItem-s2__currency">
                        <Translate id={this.props.curr} />
                      </span>
                    ) : undefined}
                    </div>
                    {this.props.discountAmount > 0 ? (
                      <>
                        <div className="goodItem-s2__off-percentage-container">
                          <span className="goodItem-s2__off-percentage">
                            {this.props.wishlistItem
                              ? this.props.discountPercentage
                              : this.props.discountPercent}
                          </span>
                          <span className="goodItem-s2__off-text">% OFF</span>
                        </div>

                        <span className="goodItem-s2__price-off">
                          {this.props.wishlistItem
                            ? formatMoney(this.props.price + this.props.vat)
                            : formatMoney(
                                this.props.unitPrice * this.props.quantity +
                                  this.props.vat
                              )}
                        </span>
                      </>
                    ) : undefined}

                  </div>
                </div>
              ) : (
                <div className="goodItem-s2__connect-provider">
                  <Translate id="connect-provider" />
                </div>
              )}
              
              <div>

              {this.props.showQuantity && this.props.isDownloadable != true && (
                <div className="cart-item__quantity">
                  {/* <span className="cart-item__qut-text">
                    <Translate id="cart-cart.quantity" />
                  </span> */}
                  <DropDown
                    value={this.props.quantity.toString()}
                    className="gray__dropDown cart-item__dropdown"
                    options={generateArrNumberRange(
                      1,
                      this.props.inventoryCount
                    )}
                    onChange={this.handleQuantityChange}
                  />
                </div>
              )}
                  {!this.props.isDownloadable && this.renderDeliverType()}

              </div>

            </div>
          )}
        </article>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { lang: selectLang(state), curr: selectCurr(state) };
};
export default connect(mapStateToProps)(CartAndWishlistItem);
