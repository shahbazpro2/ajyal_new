import React from "react";
import { Translate } from "react-localize-redux";
// import "./Addresses.scss";
// import "./Addresses-rtl.scss";
import { BoxStyle1, MobileItemDrop, Loading } from "../../../../../common";
import { Route, Switch, Link } from "react-router-dom";
import NoAddressesPage from "./AddressesLayouts/NoAddressesPage";
import AddressesAdd from "./AddressesLayouts/AddressesAdd";
import { ReactComponent as ArsIcon1 } from "./../../../../../../assets/icons/business-and-trade.svg";
import { ReactComponent as EditIcon } from "./../../../../../../assets/icons/edit-small.svg";
import { ReactComponent as DeleteIcon } from "./../../../../../../assets/icons/delete.svg";
import {
  LandScapePhonesAndBigger,
  LandScapePhones,
} from "../../../../../../Responsive";
import { client_getUserAddresses } from "./../../../../../../lib/api/client/clientUserPanel";
import { getErrorMsg } from "../../../../../../lib/helpers";
import { connect } from "react-redux";
import { selectLang, selectCurr } from "../../../../../../appConfigSlice";
import {
  client_getAddresses,
  client_deleteAddress,
  client_changeDestination,
} from "../../../../../../lib/api/client/clientOrder";
import { ToastContainer, toast } from "react-toastify";
import { getToastConfig } from "../../../../../../lib/toast";
import { isRtl } from "./../../../../../../lib/isRtl";
import classnames from "classnames";
import {
  client_changeMobileNumber,
  client_setDefaultAddress,
} from "../../../../../../lib/api/client/clientCommon";
import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber";

class Addresses extends React.Component {
  constructor(props) {
    super(props);
    // for UI development
    this.state = {
      emptyAddresspage: true,
      showLoader: false,
      data: [],
      selectedItemForEdit: null,
      verifyLoading: false,
    };

    this.verifyPhone = null;

    this.phoneUtil = PhoneNumberUtil.getInstance();
    this.PNF = PhoneNumberFormat;
  }

  //// for testing
  handleAddressPage = () => {
    this.props.history.push(
      "/" + this.state.curr + "-" + this.state.lang + "/panel/addresses"
    );
  };

  renderBoxHeader() {
    return (
      <>
        <h2 className="user-panel__box-header">
          <Translate id="addresses.addresses" />
        </h2>
        <LandScapePhonesAndBigger>
          <Link
            to={`${this.props.match.url}/add`}
            className="addresses__addnew primary-btn"
            onClick={() => {
              this.setState({ selectedItemForEdit: null });
            }}
          >
            <Translate id="addresses.addnewadd" />
          </Link>
        </LandScapePhonesAndBigger>
      </>
    );
  }

  componentDidMount() {
    this.getAddresses();

    this.unlisten = this.props.history.listen((location, action) => {
      if (this.props.match.url == location.pathname) {
        this.getAddresses();
      }
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  getAddresses = async () => {
    this.setState({ showLoader: true });
    const result = await client_getUserAddresses();
    let showEmpty = result.result.length == 0 ? true : false;
    this.setState({
      data: result.result,
      showLoader: false,
      emptyAddresspage: showEmpty,
    });
  };

  handleDelete = async (addressId) => {
    const con = confirm(getErrorMsg(this.state.lang, "confirm-address-delete"));
    if (!con) return;

    const del_resutl = await client_deleteAddress(addressId);

    if (del_resutl.status === 200) {
      this.getAddresses();
      toast.success(
        getErrorMsg(this.props.lang, "success-delete-address"),
        getToastConfig()
      );
    }
  };

  handleClickEdit = (item) => {
    this.setState({ selectedItemForEdit: item });
    this.props.history.push(this.props.match.url + "/add");
  };

  handleVerifyClick = async (item) => {
    this.verifyPhone = null;
    if (this.state.verifyLoading) return;
    this.setState({ verifyLoading: true });

    try {
      const res = await client_changeMobileNumber({
        addressId: item.addressId,
        mobileNumber: item.transfereeMobile.trim(),
      });

      if (res.status == "200") {
        this.verifyPhone = {
          requestId: res.result.requestId,
          addressId: item.addressId,
          phoneNumber: item.transfereeMobile.trim(),
          phoneIso: item.iso,
          phoneCode: item.phoneCode,
        };

        this.props.history.push(this.props.match.url + "/add");
        this.setState({ verifyLoading: false });
      }
    } catch (err) {
      this.setState({ verifyLoading: false });
      toast.error(err.response.data.message, getToastConfig);
    }
  };

  componentDidUpdate() {
    this.verifyPhone = null;
  }

  handleSetDefault = async (addressId) => {
    try {
      const res = await client_setDefaultAddress({ addressId });

      if (res.status == "200") {
        this.getAddresses();
      }
    } catch (err) {
      toast.error(err.response.data.message, getToastConfig());
    }
  };

  render() {
    return (
      <Switch>
        <Route
          path={`${this.props.match.path}/add`}
          render={() => (
            <>
              <ToastContainer
                rtl={isRtl(this.props.lang)}
                {...getToastConfig()}
              />
              <AddressesAdd
                addpage={this.handleAddressPage}
                editItem={this.state.selectedItemForEdit}
                verifyPhone={this.verifyPhone}
              />
            </>
          )}
        />
        <Route path={`${this.props.match.path}`}>
          <ToastContainer rtl={isRtl(this.props.lang)} {...getToastConfig()} />
          {this.state.showLoader ? (
            <div style={{ minHeight: "100vh" }}>
              <Loading type="gray" width="11%" height="70%" />
            </div>
          ) : this.state.emptyAddresspage ? (
            <NoAddressesPage />
          ) : (
            <BoxStyle1 headerContent={this.renderBoxHeader()}>
              <section className="addresses">
                <div>
                  <ul className="addresses__list">
                    {this.state.data.map((item) => {
                      return (
                        <li className="addresses__item-cnt flex-wrap no-gutters">
                          {/* <LandScapePhones>
                            <a
                              href=""
                              className="mb-4 addresses__right-item addresses__right-item--gray-btn"
                            >
                              <Translate id="addresses.pri-add" />
                            </a>
                          </LandScapePhones> */}
                          <LandScapePhones className="w-100">
                            {/* <MobileItemDrop> */}
                            <div className="d-flex justify-content-between mb-2">
                              <div>
                                {item.isDefualt ? (
                                  <a
                                    onClick={(e) => {
                                      e.preventDefault();
                                    }}
                                    className="addresses__right-item addresses__right-item--gray-btn"
                                  >
                                    <Translate id="addresses.pri-add" />
                                  </a>
                                ) : (
                                  <a
                                    onClick={(e) => {
                                      e.preventDefault();
                                      this.handleSetDefault(item.addressId);
                                    }}
                                    className="addresses__right-item addresses__right-item--primary-btn"
                                  >
                                    <Translate id="addresses.default" />
                                  </a>
                                )}
                              </div>

                              <div class="addresses__btn-cnt d-flex align-items-center">
                                <a
                                  className="addresses__right-item addresses__right-item--iconi"
                                  onClick={() =>
                                    this.handleDelete(item.addressId)
                                  }
                                >
                                  <DeleteIcon className="addresses__right-item-icon" />
                                  <Translate id="common.delete" />
                                </a>
                                <a
                                  onClick={() => this.handleClickEdit(item)}
                                  className="addresses__right-item addresses__right-item--iconi"
                                >
                                  <EditIcon className="addresses__right-item-icon" />
                                  <Translate id="addresses.edit" />
                                </a>
                              </div>
                            </div>
                            {/* </MobileItemDrop> */}
                          </LandScapePhones>
                          <div className="col-12 col-md-auto addresses__row-item addresses__row-item--first">
                            <span className="addresses__icon-cnt">
                              <ArsIcon1 className="addresses__left-icon" />
                            </span>
                            <p className="addresses__ars-text">
                              {item.address}
                            </p>
                          </div>
                          <div className="mt-2 mt-md-0 addresses__row-item">
                            <span className="addresses__ars-head">
                              <Translate id="addresses.name" />
                            </span>
                            <span className="addresses__ars-value">
                              {item.transfereeName} {item.transfereeFamily}
                            </span>
                          </div>
                          <div className="mt-2 mt-md-0 addresses__row-item">
                            <span className="addresses__ars-head">
                              <Translate id="addresses.phone" />
                            </span>
                            <span className="addresses__ars-value">
                              {this.phoneUtil.format(
                                this.phoneUtil.parseAndKeepRawInput(
                                  item.phoneCode + item.transfereeMobile,
                                  item.iso
                                ),
                                this.PNF.INTERNATIONAL
                              )}
                            </span>
                            {!item.mobileVerifed && (
                              <span
                                className={classnames(
                                  "addresses__ars-alert",
                                  "d-block",
                                  {
                                    "addresses__ars-alert--disable": this.state
                                      .verifyLoading,
                                  }
                                )}
                                onClick={() => {
                                  this.handleVerifyClick(item);
                                }}
                              >
                                <span className="addresses__alert-icon">!</span>
                                <Translate id="addresses.notvery" />
                              </span>
                            )}
                          </div>
                          <LandScapePhonesAndBigger>
                            <div className="addresses__row-item">
                              {item.isDefualt ? (
                                <a
                                  onClick={(e) => {
                                    e.preventDefault();
                                  }}
                                  className="addresses__right-item addresses__right-item--gray-btn"
                                >
                                  <Translate id="addresses.pri-add" />
                                </a>
                              ) : (
                                <a
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.handleSetDefault(item.addressId);
                                  }}
                                  className="addresses__right-item addresses__right-item--primary-btn"
                                >
                                  <Translate id="addresses.default" />
                                </a>
                              )}
                              <a
                                className="addresses__right-item addresses__right-item--iconi"
                                onClick={() =>
                                  this.handleDelete(item.addressId)
                                }
                              >
                                <DeleteIcon className="addresses__right-item-icon" />
                                <Translate id="addresses.delete" />
                              </a>
                              <a
                                onClick={() => this.handleClickEdit(item)}
                                className="addresses__right-item addresses__right-item--iconi"
                              >
                                <EditIcon className="addresses__right-item-icon" />
                                <Translate id="addresses.edit" />
                              </a>
                            </div>
                          </LandScapePhonesAndBigger>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <LandScapePhones>
                  <div className="checkout-fix justify-content-center">
                    <Link
                      to={`${this.props.match.url}/add`}
                      className="primary-btn returns__add-btn primary-btn--icon"
                      onClick={() => {
                        this.setState({ selectedItemForEdit: null });
                      }}
                    >
                      <Translate id="addresses.addnewadd" />
                    </Link>
                  </div>
                </LandScapePhones>
              </section>
            </BoxStyle1>
          )}
        </Route>
      </Switch>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    lang: selectLang(state),
    curr: selectLang(state),
  };
};

export default connect(mapStateToProps)(Addresses);
