import React from "react";
import { Translate } from "react-localize-redux";
// import "./Profile.scss";
import { BoxStyle1, Loading } from "../../../../../common";
import { Link, Route, Switch } from "react-router-dom";
import { client_getProfileGeneralDetail } from "../../../../../../lib/api/client/clientUserPanel";
import TickIcon from "../../../../../../assets/icons/tick.svg";
import ProfileEdit from "./ProfileEdit";
// import "./Profile-rtl.scss";
import profileImage from "./../../../../../../assets/icons/profile.svg";
import classnames from "classnames";
import {
  ProtraitPhonesAndBigger,
  ProtraitPhones,
  LandScapePhones,
  Tablets,
} from "../../../../../../Responsive";
import PanelNavi from "../../PanelLayouts/PanelNavi/PanelNavi";
import ProfileVerifyEmail from "./ProfileVerifyEmail";
import { ToastContainer } from "react-toastify";
import { connect } from "react-redux";
import { selectLang } from "../../../../../../appConfigSlice";
import { getToastConfig } from "../../../../../../lib/toast";
import { isRtl } from "../../../../../../lib/isRtl";
import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber";

export const PROFILE = 1;
export const PROFILE_EMAIL_VERIFY = 2;

class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      profilePosi: PROFILE,
      birthDate: "",
      cityName: "",
      countryName: "",
      customerId: 0,
      email: "",
      family: "",
      fkCountryId: "",
      lastLogin: "",
      mobileNumber: "",
      name: "",
      nationalCode: "",
      registeryDate: "",
      showLoader: false,
    };

    this.phoneUtil = PhoneNumberUtil.getInstance();
    this.PNF = PhoneNumberFormat;
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    this.setState({ showLoader: true });
    const result = await client_getProfileGeneralDetail();
    this.setState({
      birthDate: result.result.birthDate,
      cityName: result.result.cityName,
      countryName: result.result.countryName,
      customerId: result.result.customerId,
      email: result.result.email,
      family: result.result.family,
      fkCountryId: result.result.fkCountryId,
      lastLogin: result.result.lastLogin,
      mobileNumber: result.result.mobileNumber,
      name: result.result.name,
      nationalCode: result.result.nationalCode,
      registeryDate: result.result.registeryDate,
      emailVerifed: result.result.emailVerifed,
      iso: result.result.iso,
      phoneCode: result.result.phoneCode,
      mobileVerifed: result.result.mobileVerifed,
      fkCityId: result.result.fkCityId,
      fkProvinceId: result.result.fkProvinceId,
      provinceName: result.result.provinceName,
      showLoader: false,
    });
  };

  renderBoxHeader() {
    return (
      <h2 className="user-panel__box-header">
        <Translate id="nav.profile" />
      </h2>
    );
  }

  handleSituation = (situ) => {
    switch (situ) {
      case PROFILE:
        this.setState({ profilePosi: PROFILE });
        this.getData();
        break;
      case PROFILE_EMAIL_VERIFY:
        this.setState({ profilePosi: PROFILE_EMAIL_VERIFY });
        break;
    }
  };

  formatPhoneNumber = () => {
    if (this.state.mobileNumber) {
      try {
        return this.phoneUtil.format(
          this.phoneUtil.parseAndKeepRawInput(
            this.state.phoneCode + this.state.mobileNumber,
            this.state.iso
          ),
          this.PNF.INTERNATIONAL
        );
      } catch (error) {
        console.log(error);
        return "";
      }
    } else {
      return "";
    }
  };

  render() {
    return (
      <>
        <ToastContainer rtl={isRtl(this.props.lang)} {...getToastConfig()} />
        <Switch>
          <Route
            path={`${this.props.match.path}/edit`}
            render={() => (
              <ProfileEdit state={this.state} getData={this.getData} />
            )}
          />
          <Route exact path={`${this.props.match.path}`}>
            {this.state.profilePosi === PROFILE_EMAIL_VERIFY ? (
              <>
                <ProfileVerifyEmail
                  email={this.state.email}
                  handleSitu={this.handleSituation}
                />
              </>
            ) : (
              <>
                {this.state.showLoader ? (
                  <div style={{ minHeight: "100vh" }}>
                    <Loading type="gray" width="11%" height="70%" />
                  </div>
                ) : (
                  <BoxStyle1 headerContent={this.renderBoxHeader()}>
                    <section className="profile">
                      {/* <ProtraitPhonesAndBigger> */}
                      <div className="row">
                        <div className="col-12 col-md-6">
                          <div className="profile__item-container flex-wrap">
                            <span className="profile__item">
                              <Translate id="profile.firstname" />
                            </span>
                            <span className="profile__item profile__item--color">
                              {this.state.name}
                            </span>
                          </div>
                          <div className="profile__item-container profile__item-container--color">
                            <span className="profile__item">
                              <Translate id="profile.lastname" />
                            </span>
                            <span className="profile__item profile__item--color">
                              {this.state.family}
                            </span>
                          </div>
                          <div className="profile__item-container">
                            <span className="profile__item">
                              <Translate id="profile.national-code" />
                            </span>
                            <span className="profile__item profile__item--color">
                              {this.state.nationalCode}
                            </span>
                          </div>
                          <div className="profile__item-container profile__item-container--color">
                            <span className="profile__item">
                              <Translate id="profile.birthday-date" />
                            </span>
                            <span className="profile__item profile__item--color">
                              {this.state.birthDate}
                            </span>
                          </div>
                        </div>
                        <div className="col-12 mt-md-0 col-md-6">
                          <div className="profile__item-container profile__item-container--color">
                            <span className="profile__item">
                              <Translate id="profile.email1" />
                            </span>
                            <div>
                              <span className="profile__item profile__item--color">
                                {this.state.email}
                                {this.state.emailVerifed && (
                                  <TickIcon className="ml-3 mr-3 mb-1" />
                                )}
                              </span>
                              {!this.state.emailVerifed && (
                                <div>
                                  <span
                                    className={classnames(
                                      "addresses__ars-alert"
                                    )}
                                    onClick={() => {
                                      this.handleSituation(
                                        PROFILE_EMAIL_VERIFY
                                      );
                                    }}
                                  >
                                    <span className="addresses__alert-icon">
                                      !
                                    </span>
                                    <Translate id="email-verify.verify-email" />
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="profile__item-container">
                            <span className="profile__item">
                              <Translate id="profile.country-name" />
                            </span>
                            <span className="profile__item profile__item--color">
                              {this.state.countryName}
                            </span>
                          </div>
                          <div className="profile__item-container profile__item-container--color">
                            <span className="profile__item">
                              <Translate id="profile.city-name" />
                            </span>
                            <span className="profile__item profile__item--color">
                              {this.state.cityName}
                            </span>
                          </div>

                          <div className="profile__item-container profile__item-container">
                            <span className="profile__item">
                              <Translate id="profile.mobile-number" />
                            </span>
                            <div>
                              <span className="profile__item profile__item--color">
                                {this.formatPhoneNumber()}
                                {this.state.mobileVerifed && (
                                  <TickIcon className="ml-3 mr-3 mb-1" />
                                )}
                              </span>
                              {this.state.mobileNumber &&
                              !this.state.mobileVerifed ? (
                                <div>
                                  <span
                                    className={classnames(
                                      "addresses__ars-alert"
                                    )}
                                    onClick={() => {
                                      // this.handleSituation(
                                      //   PROFILE_EMAIL_VERIFY
                                      // );
                                    }}
                                  >
                                    <span className="addresses__alert-icon">
                                      !
                                    </span>
                                    <Translate id="addresses.notvery" />
                                  </span>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* </ProtraitPhonesAndBigger> */}
                      {/* <ProtraitPhones className="col-12">
                        <div>
                          <figure className="profile__user-img">
                            <img src={profileImage} alt="user-profile-image" />
                          </figure>
                          <span className="mt-5 d-block profile__item profile__item--color">
                            {this.state.name} {this.state.family}
                          </span>
                          <span className="m-3 d-block profile__item">
                            {this.state.email}
                          </span>
                        </div>
                      </ProtraitPhones> */}

                      <Link
                        to={`${this.props.match.url}/edit`}
                        className="primary-btn profile__btn"
                      >
                        <Translate id="profile.editprofile" />
                      </Link>
                    </section>
                    {/* <LandScapePhones>
                          <div className="user-panel-nav__signout profile__signout-btn">
                            <a href="/#" className="user-panel-nav__signout-text">
                              <Translate id="nav.signout" />
                            </a>
                          </div>
                        </LandScapePhones> */}
                  </BoxStyle1>
                )}
              </>
            )}
          </Route>
        </Switch>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    lang: selectLang(state),
  };
};

export default connect(mapStateToProps)(Profile);
