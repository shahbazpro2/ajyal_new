import React from "react";
import { Translate } from "react-localize-redux";
// import "./CartAndWishlist.scss";
// import "./CartAndWishlist-rtl.scss";
import { connect } from "react-redux";
import { BoxStyle1, Button, Loading } from "../../../common";
import {
  CartAndWishlistItem,
  CartAndWishlistAside,
  EmptyCart,
} from "./CartAndWishlistLayouts";

import {
  fetchCart,
  selectStatus,
  IDLE,
  selectCart,
  ERROR,
  fetchWishList,
  selectWishListStatus,
  selectWishList,
  selectCityId,
  selectCityText,
  selectCountryId,
  cityChanged,
  addCoupon,
  selectCoupon,
  selectErrorMsg,
} from "./cartAndWishlistSlice";

import {
  selectLang,
  LOADING,
  selectCurr,
  selectLogin,
  PREVLINK_CHANGE,
} from "../../../../appConfigSlice";
import { CSSTransition } from "react-transition-group";
import DeliveryPanel from "./CartAndWishlistLayouts/DeliveryPanel/DeliveryPanel";
import {
  client_addItemCount,
  client_addToCart,
  client_likeGood,
  client_removeFromCart,
} from "../../../../lib/api/client/clientCart";
import { toast, ToastContainer } from "react-toastify";
import { getToastConfig } from "../../../../lib/toast";
import { isRtl } from "../../../../lib/isRtl";
import {
  formatMoney,
  removeCouponCookie,
  setCouponCookie,
} from "../../../../lib/helpers";
import { withRouter } from "next/router";
import Cookies from "js-cookie";
import { unwrapResult } from "@reduxjs/toolkit";

class CardAndWhishlist extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      cartLoading: false,
      inProp: false,
      changeCityLoading: false,
      mobileCheckoutLoading: false,
    };
    this.panelRef = React.createRef();
  }

  componentDidMount() {
    const coupon = Cookies.get(
      process.env.NEXT_PUBLIC_Token_Cookie_name_coupon
    );
    if (coupon) {
      this.props.addCoupon(coupon);
    }

    this.props.fetchCart({
      code: coupon,
    });
    this.props.fetchWishList();
  }

  renderCartBoxHeader() {
    return (
      <div className="cart__header-container">
        {this.props.cart.itemsCount !== 0 && (
          <div className="itemDetail__deli-cnt cart__deli-cnt">
            {this.state.changeCityLoading ? (
              <Loading type="gray" width="20px" height="20px" />
            ) : (
              <>
                <div className="itemDetail__item">
                  <span className="item-currect-address-1">
                  <Translate id="deliver.deliverCurrect" />
                  </span>
                  <span className="itemDetail__item-small-text d-flex">
                    <Translate id="deliver.deliverTo" />
                    <span className="itemDetail__item-small-text itemDetail__item-small-text--bold">
                      {this.props.cityText}
                    </span>
                  </span>
                  <span
                    className="itemDetail__link mr-3 ml-3"
                    onClick={this.openPanel}
                  >
                    <Translate id="deliver.changeAre" />
                  </span>
                </div>
                <span className="item-currect-address-2">
                  <Translate id="deliver.deliverCurrect" />
                  </span>
              </>
            )}
          </div>
        )}
        <h2 className="cart__box-header">
          <Translate id="cart-cart.mycart" />
        </h2>
        <p className="cart__box-subheader">
          {this.props.cart.itemsCount}&nbsp;
          {this.props.cart.itemsCount > 1 ? (
            <Translate id="cart-cart.items" />
          ) : (
            <Translate id="cart-cart.item" />
          )}
        </p>
      </div>
    );
  }

  renderWishlistBoxHeader() {
    return (
      <div className="cart__header-container">
        <h2 className="cart__box-header">
          <Translate id="cart-wishlist.mywishlist" />
        </h2>
        <p className="cart__box-subheader">
          {this.props.wishList.length}&nbsp;
          {this.props.wishList.length > 1 ? (
            <Translate id="cart-cart.items" />
          ) : (
            <Translate id="cart-cart.item" />
          )}
        </p>
      </div>
    );
  }

  openPanel = () => {
    this.setState({
      inProp: true,
    });
  };

  closePanel = () => {
    this.setState({
      inProp: false,
    });
  };

  removeItemFromCart = async (goodItemId) => {
    try {
      const result = await client_removeFromCart(goodItemId);
      if (result.status === 200) {
        this.props.fetchCart({
          code: this.props.coupon,
        });
      }
    } catch (err) {}
  };

  handleItemQuantityChange = async (count, goodId, providerId) => {
    try {
      const result = await client_addItemCount({
        goodsId: goodId,
        providerId,
        number: count,
        cityId: this.props.cityId,
        countryId: this.props.countryId,
        provinceId: this.props.provinceId,
      });
      if (result.status === 200) {
        this.props.fetchCart({
          code: this.props.coupon,
          city: this.props.cityId,
          country: this.props.countryId,
          province: this.props.provinceId,
        });
      }
    } catch (err) {}
  };

  handleRemoveFromWishlist = async (goodId) => {
    const result = await client_likeGood(goodId);
    if (result.status === 200) {
      this.props.fetchWishList();
    }
  };

  handleMoveWishToCart = async (goodId, providerId) => {
    try {
      const result = await client_addToCart({
        goodId: goodId,
        providerId: providerId,
        count: 1,
        countryId: this.props.countryId,
        cityId: this.props.cityId,
      });

      if (result.status === 200) {
        this.props.fetchCart({
          code: this.props.coupon,
          city: this.props.cityId,
          country: this.props.countryId,
          province: this.props.provinceId,
        });
      }
    } catch (err) {
      // return false;
    }
  };

  handleCouponClick = async (couponCode) => {
    try {
      const result = await this.props.fetchCart({
        code: couponCode,
        city: this.props.cityId,
        country: this.props.countryId,
        province: this.props.provinceId,
      });

      unwrapResult(result);

      this.props.addCoupon(couponCode);
      if (couponCode) {
        setCouponCookie(couponCode);
      } else {
        removeCouponCookie();
      }
    } catch (err) {
      console.log(err);
    }
  };

  handleCityChange = async (countryId, provinceId, cityId, cityText) => {
    this.props.cityChanged({ cityId, countryId, cityText });
    this.props.fetchCart({
      code: this.props.coupon,
      city: cityId,
      country: countryId,
      province: provinceId,
    });
  };

  handleCheckOutClick = async () => {
    console.log(this.props)
    if (!this.props.isLogin) {

      console.log(this.props.isLogin)
      this.props.prevUrlChange(this.props.router.asPath);
      this.props.router.push(`/${this.props.curr}-${this.props.lang}/Auth`);
      return;
    }
    let digitalFile = false;
    const downloadAbleItem = this.props.cart.items.filter(
      (x) => x.isDownloadable
    );
    if (downloadAbleItem.length == this.props.cart.items.length) {
      digitalFile = true;
    }

    if (digitalFile) {
    
      this.props.router.push(
        `/${this.props.curr}-${this.props.lang}/order?to=downloadable`
      );
    } else {
      this.props.router.push(`/${this.props.curr}-${this.props.lang}/order`);
    }
  };

  componentDidUpdate() {
    if (this.props.cartStatus === ERROR) {
      toast.error(this.props.errorText, getToastConfig());
    }
  }

  render() {
    const load = (
      <Loading type="gray" width="80px" styleSheet={{ margin: "100px auto" }} />
    );

    if (this.state.cartLoading) {
      return <>{load}</>;
    }

    if (this.props.isLogin) {
      if (this.props.cartLoading || this.props.wishListLoading) {
        return <>{load}</>;
      }
    } else {
      if (this.props.cartLoading) return <>{load}</>;
    }

    if (!this.props.isLogin && this.props.cart.itemsCount === 0) {
      return (
        <EmptyCart
          icon
          dark
          p1={<Translate id="emptyshop" />}
          p2={<Translate id="startshopping" />}
          history={this.props.router}
        />
      );
    }

    if (this.props.isLogin) {
      if (
        this.props.cart.itemsCount === 0 &&
        this.props.wishList.length === 0
      ) {
        return (
          <EmptyCart
            icon
            dark
            p1={<Translate id="emptyshop" />}
            p2={<Translate id="startshopping" />}
            history={this.props.router}
          />
        );
      }
    }

    return (
      <section className="container siteWidthContainer cart-wishlist-section">
        <ToastContainer rtl={isRtl(this.props.lang)} {...getToastConfig()} />
        <CSSTransition
          unmountOnExit
          in={this.state.inProp}
          timeout={300}
          classNames="goodDetail__panel--anim"
          nodeRef={this.panelRef}
        >
          <DeliveryPanel
            panelRef={this.panelRef}
            closePanel={this.closePanel}
            countryId={this.props.cart.countryId}
            provinceId={this.props.cart.provinceId}
            handleCityChange={this.handleCityChange}
          />
        </CSSTransition>

        <div className="row no-gutters">
          <div
            className={
              this.props.cart?.itemsCount > 0 ? "col-12 col-xl-9" : "col"
            }
          >
            {/* my cart box */}

            <BoxStyle1 headerContent={this.renderCartBoxHeader()}>
              <div className="cart">
                {this.props.cart?.itemsCount <= 0 ? (
                  <EmptyCart
                    normal
                    p1={<Translate id="emptyshop" />}
                    p2={<Translate id="have-wish" />}
                    history={this.props.router}
                  />
                ) : (
                  <>
                    {this.props.cart?.items.map((item, index) => {
                      return (
                        <CartAndWishlistItem
                          key={index}
                          removeItemFromCart={this.removeItemFromCart}
                          handleItemQuantityChange={
                            this.handleItemQuantityChange
                          }
                          showQuantity
                          key={item.itemId}
                          {...item}
                        />
                      );
                    })}
                    {/* <CartAndWishlistItem
                        cart
                        showQuantity
                        {...this.content2[3]}
                      />
                      <CartAndWishlistItem
                        cart
                        showQuantity
                        {...this.content2[4]}
                      /> */}
                  </>
                )}
              </div>
            </BoxStyle1>
            {this.props.isLogin ? (
              this.props.wishListLoading ? (
                <Loading
                  type="gray"
                  width="50px"
                  height="50px"
                  styleSheet={{ margin: "80px auto" }}
                />
              ) : (
                <BoxStyle1 headerContent={this.renderWishlistBoxHeader()}>
                  {this.props.wishList.length > 0 ? (
                    <div className="cart">
                      {this.props.wishList.map((item, index) => {
                        return (
                          <CartAndWishlistItem
                            key={index}
                            handleRemoveFromWishlist={
                              this.handleRemoveFromWishlist
                            }
                            handleMoveWishToCart={this.handleMoveWishToCart}
                            wishlistItem
                            {...item}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <EmptyCart
                      normal
                      p1={<Translate id="emptyWish" />}
                      p2={""}
                      history={this.props.router}
                    />
                  )}
                </BoxStyle1>
              )
            ) : null}
            {!this.props.isLogin && (
              <BoxStyle1 headerContent={this.renderWishlistBoxHeader()}>
                <div className="cart">
                  <EmptyCart
                    normal
                    p1={<Translate id="emptyWish" />}
                    p2={<Translate id="login-wish" />}
                    history={this.props.router}
                  />
                </div>
              </BoxStyle1>
            )}
          </div>
          {this.props.cart?.itemsCount > 0 && (
            <div className="col-12 col-xl-3">
              <CartAndWishlistAside
                data={this.props.cart}
                addCoupon={this.handleCouponClick}
                checkOut={this.handleCheckOutClick}
              />
              <div className="checkout-fix">
                {/* <div className="checkout-fix__price">
                  <span>
                    <Translate id="aside.total" />
                  </span>
                  <span>
                    <Translate id={this.props.curr} />
                    &nbsp; {formatMoney(this.props.cart.total)}
                  </span>
                </div> */}
           
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }
}

const prevUrlChange = (url) => {
  return { type: PREVLINK_CHANGE, payload: { link: url } };
};

const mapDispatchToProps = {
  prevUrlChange,
  fetchCart,
  cityChanged,
  fetchWishList,
  addCoupon,
};

const mapStateToProps = (state) => {
  return {
    lang: selectLang(state),
    curr: selectCurr(state),
    cartLoading:
      selectStatus(state) === LOADING || selectStatus(state) === IDLE,
    cartStatus: selectStatus(state),
    cart: selectCart(state),
    isLogin: selectLogin(state).isLogin,
    wishListLoading:
      selectWishListStatus(state) === LOADING ||
      selectWishListStatus(state) === IDLE,
    wishList: selectWishList(state),
    countryId: selectCountryId(state),
    cityId: selectCityId(state),
    cityText: selectCityText(state),
    coupon: selectCoupon(state),
    errorText: selectErrorMsg(state),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CardAndWhishlist));
