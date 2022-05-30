import React from "react";
// import "./Auth.scss";
// import "./Auth-rtl.scss";
import { Translate } from "react-localize-redux";
import { SignUp } from "./SignUp";
import { SignIn } from "./SignIn";
import { connect } from "react-redux";
import { isRtl } from "../../../../lib/isRtl";
import { ToastContainer, toast } from "react-toastify";
import { getToastConfig } from "../../../../lib/toast";
import {
  selectLang,
  selectLogin,
  selectCurr,
} from "../../../../appConfigSlice";
import { withRouter } from "next/router";

class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.is_signup = this.props.router.query.signup != undefined;
    this.is_rtl = isRtl(this.props.lang);
    this.conRef = React.createRef();
    this.leftForm = this.is_rtl ? (
      <SignIn loc={this.props.loc}
      isDesktop={this.props.isDesktop}
      clickSignUp={this.clickHandler} />
    ) : (
      <SignUp
        loc={this.props.loc}
        isDesktop={this.props.isDesktop}
        clickSignUp={this.clickHandler}
      />
    );
    this.righForm = this.is_rtl ? (
      <SignUp
        loc={this.props.loc}        
        clickSignUp={this.clickHandler}
        isDesktop={this.props.isDesktop}
      />
    ) : (
      <SignIn loc={this.props.loc} 
      clickSignUp={this.clickHandler} 
      isDesktop={this.props.isDesktop}
      
      />
    );
  }

  clickHandler = () => {
    this.conRef.current.classList.toggle("s--signup");
  };

  render() {
    const backImage = this.props.data.backgroundImage
      ? `${process.env.NEXT_PUBLIC_LOGO_PREFIX}/${this.props.data.backgroundImage}`
      : `/assets/imgs/login.jpg`;
    return (
      <section className="auth">
        <ToastContainer rtl={this.is_rtl} {...getToastConfig()} />
        <div
          className={`cont ${this.is_signup ? "s--signup" : ""}`}
          ref={this.conRef}
        >
          {this.leftForm}
          <div className="sub-cont">
            <style>
              {`.img-auth-logo::before{
                    background-image: url("${backImage}")!important;
                `}
            </style>
            <div className="img img-auth-logo">
              <a href="/" className="auth__logo">
              <img
                src={`${process.env.NEXT_PUBLIC_LOGO_PREFIX}/${this.props.data.logo}`}
              />
              </a>

              <div className="img__text m--up">
                <h3 className="auth__up-header">
                  <Translate id="new" />
                </h3>
                <p className="auth__up-p">
                  <Translate id="sign-dis" />
                </p>
              </div>

              <div className="img__text m--in">
                {/* <img className="auth__logo" src={Logo} /> */}
                <h3 className="auth__up-header">
                  <Translate id="acc-have" />
                </h3>
                <p className="auth__up-p">
                  <Translate id="login2" />
                </p>
              </div>
              <div onClick={this.clickHandler} className="img__btn">
                <span className="m--up">
                  <Translate id="signUp3" />
                </span>
                <span className="m--in">
                  <Translate id="signIn3" />
                </span>
              </div>
            </div>

            {this.righForm}
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLogin: selectLogin(state).isLogin,
    lang: selectLang(state),
    cur: selectCurr(state),
  };
};

export default connect(mapStateToProps)(withRouter(Auth));
