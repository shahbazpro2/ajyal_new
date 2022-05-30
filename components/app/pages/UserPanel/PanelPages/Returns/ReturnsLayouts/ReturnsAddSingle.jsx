import React from "react";
import { BoxStyle2, SelectBox2 as SelectBox , Loading } from "../../../../../../common";
import { Translate } from "react-localize-redux";
import { ReactComponent as BackIcon } from "./../../../../../../../assets/icons/back.svg";
import { Link } from "react-router-dom";
import SlideDown from "react-slidedown";
import { ReturnItem } from ".";
import jyalBlackIcon from "./../../../../../../../assets/icons/img-jyal-backicon.svg";

import {
  client_getReturningReasonList,
  client_getReturningActionList,
  client_submitReturnRequest,
  client_getReturningProduct
} from "../../../../../../../lib/api/client/clientUserPanel";
import {
  ProtraitPhonesAndBigger,
  ProtraitPhones,
} from "../../../../../../../Responsive";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import { getErrorMsg } from "../../../../../../../lib/helpers";
import { getToastConfig } from "../../../../../../../lib/toast";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showRatingInput: false,
      showMoreAddresses: false,
      showLoader: false,
      showButtonLoader: false,
      fkReturningReasonId: 0,
      fkReturningActionId: 0,
      reasonComment: "",
      requestComment: "",
      quantity: 1,
      reasopnOPtions: [],
      selectedReasopnOPtions: null,
      actionOptions: [],
      quantityOPtions: [],
      data: null,
      selectReasonError: false,
      actionReasonError: false
    };

    this.handleCommentChange = this.handleCommentChange.bind(this);
  }

  async componentDidMount() {
    const reasonResult = await client_getReturningReasonList();
    let options = [];
    reasonResult.result.forEach((element) => {
      options.push({
        value: element.reasonId,
        label: element.reasonTitle,
        condition: element.returnCondition,
      });
    });
    const actionResult = await client_getReturningActionList();
    this.setDropQuanyityOPtions();
    this.setState({
      reasopnOPtions: options,
      actionOptions: actionResult.result,
    });
    
    try {
      
      const product = await client_getReturningProduct(this.props.match.params.id);
      this.setState({
        data: product.result
      });
    } catch (error) {
      this.props.history.push(
        "/" + this.props.currency + "-" + this.props.lang + "/panel/returns"
      );
    }


  }

  setDropQuanyityOPtions = () => {
    let options = [];
    for (let index = this.props.data.quantity; index < 1; index--) {
      options.push(index);
    }
    this.setState({ quantityOPtions: options });
  };

  handleSelectChange(data) {
    if (data.name === "refund") {
      this.setState({
        showRefundDetail: true,
      });
    } else {
      this.setState({
        showRefundDetail: false,
      });
    }
  }

  handleShowMoreAddresses() {
    this.setState((state) => {
      return {
        showMoreAddresses: !state.showMoreAddresses,
      };
    });
  }

  renderBoxHeader() {
    return (
      <header className="mapAddress__header">
        <Link
          to={this.props.match.url.split("/").slice(0, -1).join("/")}
          className="orderDetail__backlink"
        >
          <BackIcon className="mapAddress__back-icon" />
          <div className="orders__item-header">
            <h2 className="orders__item-cnt-header text-transform-none">
              <Translate id="returns.returns" />
            </h2>
          </div>
        </Link>
      </header>
    );
  }

  selecAction = (id) => {
    this.setState({ fkReturningActionId: id });
  };

  handleSelectReason = (item) => {
    this.setState({
      fkReturningReasonId: item.value,
      reasonComment: item.condition,
      selectedReasopnOPtions : item
    });
  };

  handleCommentChange = (e) => {
    this.setState({ requestComment: e.target.value });
  };

  handleQuantiyChange = (value) => {
    this.setState({ quantity: value });
  };

  handleSubmit = async () => {
    if (this.state.fkReturningReasonId == 0) {
      this.setState({ selectReasonError: true });
    }
    if (this.state.fkReturningActionId == 0) {
      this.setState({ actionReasonError: true });
    }

    try {
      this.setState({ showButtonLoader: true });

      const result = await client_submitReturnRequest({
        fkOrderItemId: this.props.match.params.id,
        fkReturningReasonId: this.state.fkReturningReasonId,
        fkReturningActionId: this.state.fkReturningActionId,
        requestComment: this.state.requestComment,
        quantity: this.state.quantity,
      });
      this.setState({ showButtonLoader: false });

      if (result.status == 200) {
        toast.success(
          getErrorMsg(this.props.lang, "return-req"),
          getToastConfig()
        );
        this.props.history.push(
          "/" + this.props.currency + "-" + this.props.lang + "/panel/returns"
        );
      }
    } catch (error) {
      this.setState({ showButtonLoader: false });
      toast.error(error.response?.data.message, getToastConfig());
    }
  };

  render() {
    return (
      <section className="order-review returns-add-single">
        <BoxStyle2 headerContent={this.renderBoxHeader()}>
            <div className="col-12 col-lg-7">
              {this.state.data && (
              <ReturnItem
              withoutRightBox
              withoutReason
              currency={this.props.currency}
              data={this.state.data }
            />
              )}


              <div className="mt-4 row no-gutters">

                <div className="col-12 col-sm-7 cart-item__quantity">
                  <span className="order-cancel__text">
                    <Translate id="returns.return-msg1" />
                  </span>
                  <Select
                    className="react-select"
                    options={this.state.reasopnOPtions}
                    onChange={this.handleSelectReason}
                    placeholder={<Translate id="returns.select-reason-place" />}
                    value={this.state.selectedReasopnOPtions}
                    required
                  />
                </div>
                {this.state.selectReasonError && (
                  <span className="error-text">
                    <Translate id="returns.reason-error" />
                  </span>
                )}
              </div>
              <div className="mt-3 returns-add-single__box-gray">
                <p className="mb-0 returns-add-single__text2">
                  {this.state.reasonComment}
                </p>
              </div>
              <Translate>
                {({ translate: t }) => {
                  return (
                    <textarea
                      value={this.state.requestComment}
                      onChange={this.handleCommentChange}
                      placeholder={t("returns.return-des-placeholder")}
                      className="gray__input order-review__text-area"
                      required
                    ></textarea>
                  );
                }}
              </Translate>
            </div>
            <div className="col-12">
              <div className="returns-add-single__slc-cnt">
                <p className="returns-add-single__text3 returns-add-single__text3--bold">
                  <Translate id="returns.req-type" />
                </p>
                <SelectBox
                  className="returns-add-single__select-box"
                  onChange={this.handleSelectChange.bind(this)}
                >
                  {this.state.actionOptions.map((item) => {
                    return (
                      <SelectBox.SelectItem
                        key={item.returningTypeId}
                        handleSelect={this.selecAction}
                        name={item.returningTypeTitle}
                        value={item.returningTypeId}
                      >
                        <span className="order-review__text">
                          {item.returningTypeTitle}
                        </span>
                      </SelectBox.SelectItem>
                    );
                  })}
                </SelectBox>
                {this.state.actionReasonError && (
                  <span className="error-text">
                    <Translate id="returns.action-error" />
                  </span>
                )}
              </div>
              <SlideDown>
                {this.state.showRefundDetail && (
                  <div className="returns-add-single__box-gray">
                    <div className="text-align-right">
                      <img
                        src={jyalBlackIcon}
                        alt="jyal refund icon"
                        className="d-inline"
                      />
                      <span
                        style={{ verticalAlign: "middle" }}
                        className="d-inline ml-4 orders__header-gray-text"
                      >
                        Refund to Wallet
                      </span>
                    </div>
                    <p className="mb-0 mt-3 returns-add-single__text2">
                      The amount of returned or canceled purchases will be
                      refunded to your wallet
                    </p>
                  </div>
                )}
              </SlideDown>
            </div>
            {/* <div className="returns-add-single__slc-cnt">
                <p className="returns-add-single__text3 returns-add-single__text3--bold">
                  <Translate id="returns.pickup" />
                </p>
                <SelectBox3
                  className="returns-add-single__select-box returns-add-single__select-box--addresses"
                  //   onChange={this.handleSelectChange.bind(this)}
                >
                  <SelectBox3.SelectItem name="add1" value="add1">
                    <div className="addresses__item-cnt flex-wrap returns-add-single__addresses">
                      <div className="col-12 col-sm-8 col-md-5 addresses__row-item">
                        <span className="addresses__icon-cnt">
                          <ArsIcon1 className="addresses__left-icon" />
                        </span>
                        <p className="addresses__ars-text">
                          Sudan - Nazlet El-Semman - Al Haram Giza Governorate
                          Giza, Egypt
                        </p>
                      </div>
                      <div className="col-12 col-sm-auto addresses__row-item">
                        <span className="addresses__ars-head">
                          <Translate id="addresses.name" />
                        </span>
                        <span className="addresses__ars-value">
                          Eugene Barnett
                        </span>
                      </div>
                      <div className="col-12 mt-3 mt-sm-0 col-sm-auto addresses__row-item">
                        <span className="addresses__ars-head">
                          <Translate id="addresses.phone" />
                        </span>
                        <span className="addresses__ars-value">
                          +20-10-5784741
                        </span>
                        <span className="addresses__ars-alert d-block">
                          <span className="addresses__alert-icon">!</span>
                          <Translate id="addresses.notvery" />
                        </span>
                      </div>
                      <TabletsAndBigger>
                        <div className="col-12 col-sm-auto addresses__row-item">
                          <a
                            href=""
                            className="addresses__right-item addresses__right-item--iconi"
                          >
                            <DeleteIcon className="addresses__right-item-icon" />
                            <Translate id="addresses.delete" />
                          </a>
                          <a
                            href=""
                            className="addresses__right-item addresses__right-item--iconi"
                          >
                            <EditIcon className="addresses__right-item-icon" />
                            <Translate id="addresses.edit" />
                          </a>
                        </div>
                      </TabletsAndBigger>
                    </div>
                  </SelectBox3.SelectItem>
                  <SlideDown>
                    {this.state.showMoreAddresses && (
                      <>
                        <SelectBox3.SelectItem name="add2" value="add1">
                          <div className="addresses__item-cnt flex-wrap returns-add-single__addresses">
                            <div className="col-12 col-sm-8 col-md-5 addresses__row-item">
                              <span className="addresses__icon-cnt">
                                <ArsIcon1 className="addresses__left-icon" />
                              </span>
                              <p className="addresses__ars-text">
                                Sudan - Nazlet El-Semman - Al Haram Giza
                                Governorate Giza, Egypt
                              </p>
                            </div>
                            <div className="col-12 col-sm-auto addresses__row-item">
                              <span className="addresses__ars-head">
                                <Translate id="addresses.name" />
                              </span>
                              <span className="addresses__ars-value">
                                Eugene Barnett
                              </span>
                            </div>
                            <div className="col-12 mt-3 mt-sm-0 col-sm-auto addresses__row-item">
                              <span className="addresses__ars-head">
                                <Translate id="addresses.phone" />
                              </span>
                              <span className="addresses__ars-value">
                                +20-10-5784741
                              </span>
                              <span className="addresses__ars-alert d-block">
                                <span className="addresses__alert-icon">!</span>
                                <Translate id="addresses.notvery" />
                              </span>
                            </div>
                            <TabletsAndBigger>
                              <div className="col-12 col-sm-auto addresses__row-item">
                                <a
                                  href=""
                                  className="addresses__right-item addresses__right-item--iconi"
                                >
                                  <DeleteIcon className="addresses__right-item-icon" />
                                  <Translate id="addresses.delete" />
                                </a>
                                <a
                                  href=""
                                  className="addresses__right-item addresses__right-item--iconi"
                                >
                                  <EditIcon className="addresses__right-item-icon" />
                                  <Translate id="addresses.edit" />
                                </a>
                              </div>
                            </TabletsAndBigger>
                          </div>
                        </SelectBox3.SelectItem>
                        <SelectBox3.SelectItem name="add3" value="add1">
                          <div className="addresses__item-cnt flex-wrap returns-add-single__addresses">
                            <div className="col-12 col-sm-8 col-md-5 addresses__row-item">
                              <span className="addresses__icon-cnt">
                                <ArsIcon1 className="addresses__left-icon" />
                              </span>
                              <p className="addresses__ars-text">
                                Sudan - Nazlet El-Semman - Al Haram Giza
                                Governorate Giza, Egypt
                              </p>
                            </div>
                            <div className="col-12 col-sm-auto addresses__row-item">
                              <span className="addresses__ars-head">
                                <Translate id="addresses.name" />
                              </span>
                              <span className="addresses__ars-value">
                                Eugene Barnett
                              </span>
                            </div>
                            <div className="col-12 mt-3 mt-sm-0 col-sm-auto addresses__row-item">
                              <span className="addresses__ars-head">
                                <Translate id="addresses.phone" />
                              </span>
                              <span className="addresses__ars-value">
                                +20-10-5784741
                              </span>
                              <span className="addresses__ars-alert d-block">
                                <span className="addresses__alert-icon">!</span>
                                <Translate id="addresses.notvery" />
                              </span>
                            </div>
                            <TabletsAndBigger>
                              <div className="col-12 col-sm-auto addresses__row-item">
                                <a
                                  href=""
                                  className="addresses__right-item addresses__right-item--iconi"
                                >
                                  <DeleteIcon className="addresses__right-item-icon" />
                                  <Translate id="addresses.delete" />
                                </a>
                                <a
                                  href=""
                                  className="addresses__right-item addresses__right-item--iconi"
                                >
                                  <EditIcon className="addresses__right-item-icon" />
                                  <Translate id="addresses.edit" />
                                </a>
                              </div>
                            </TabletsAndBigger>
                          </div>
                        </SelectBox3.SelectItem>
                      </>
                    )}
                  </SlideDown>
                </SelectBox3>
                <div className="goodDetailAside__offer-text-cnt">
                  3 <Translate id="returns.other-address" />
                  <span
                    onClick={this.handleShowMoreAddresses.bind(this)}
                    className="sky-text-link goodDetailAside__offer-text"
                  >
                    {this.state.showMoreAddresses ? (
                      <Translate id="returns.less" />
                    ) : (
                      <Translate id="returns.view-all" />
                    )}
                    <ArrowIcon
                      className={classnames("goodDetailAside__offer-arrow", {
                        "goodDetailAside__offer-arrow--close": !this.state
                          .showMoreAddresses,
                        "goodDetailAside__offer-arrow--open": this.state
                          .showMoreAddresses,
                      })}
                    />
                  </span>
                </div>
              </div> */}
            <ProtraitPhonesAndBigger>
              <button onClick={this.handleSubmit.bind(this)} className="primary-btn order-review__submit-btn">
              {this.state.showButtonLoader ? (
                          <Loading type="white" width="20px" height="20px" />
                        ) :  <Translate id="returns.submit-req" />}
               
              </button>
            </ProtraitPhonesAndBigger>
            <ProtraitPhones>
              <div className="checkout-fix">
                <button onClick={this.handleSubmit.bind(this)} className="primary-btn returns__add-btn">
                {this.state.showButtonLoader ? (
                          <Loading type="white" width="20px" height="20px" />
                        ) : <Translate id="returns.submit-req" />}
                  
                </button>
              </div>
            </ProtraitPhones>
        </BoxStyle2>
      </section>
    );
  }
}

