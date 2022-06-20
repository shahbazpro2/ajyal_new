import React from "react";
import {
  BoxStyle2,
  SelectBox3 as SelectBox,
  Loading,
} from "../../../../../../common";
import { Translate } from "react-localize-redux";
import { ReactComponent as BackIcon } from "./../../../../../../../assets/icons/back.svg";
import { Link } from "react-router-dom";
import SlideDown from "react-slidedown";
import { ReactComponent as CreditCardIcon } from "./../../../../../../../assets/icons/credit-card.svg";
import ajyallWallet from "./../../../../../../../assets/icons/ajyal-wallet.png";
import OrderItem from "./OrderItem";
import DropDown from "react-dropdown";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import CancelResult from "./CancelResult";
import {
  ProtraitPhonesAndBigger,
  ProtraitPhones,
} from "../../../../../../../Responsive";
import {
  client_getCancelList,
  client_getCancelReasonList,
  client_submitCancelRequest,
} from "../../../../../../../lib/api/client/clientUserPanel";
import { connect } from "react-redux";
import { selectCurr, selectLang } from "../../../../../../../appConfigSlice";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import { getErrorMsg } from "../../../../../../../lib/helpers";
import { getToastConfig } from "../../../../../../../lib/toast";
import { isRtl } from "../../../../../../../lib/isRtl";

class CancelOrders extends React.Component {
  constructor(props) {
    super(props);
    // console.log(this.props.content2,"----------");
    this.state = {
      selectedItems: [],
      showResultPage: false,
      showLoader: false,
      data: [],
      cancelReasonData: [],
      selectedReasopnOPtions: [],
      cancelResultData: [],
    };
  }

  handleItemSelect(SelecetdItemData) {
    let newItemState = [];
    for (let item of SelecetdItemData) {
      const orderItem = this.state.data.find((x) => x.itemId == item.value);
      const datas = {};
      datas.fkOrderId = this.props.match.params.id;
      datas.fkOrderItemId = orderItem.itemId;
      datas.fkCancelingReasonId = 0;
      newItemState.push(datas);
    }

    this.setState({ selectedItems: newItemState });
  }

  showResultPage = async () => {
    if (
      this.state.selectedItems.some((x) => x.fkCancelingReasonId == 0) == true
    ) {
      toast.error(
        getErrorMsg(this.props.lang, "reason-error"),
        getToastConfig()
      );
      return;
    }

    try {
      this.setState({ showButtonLoader: true });

      const result = await client_submitCancelRequest(this.state.selectedItems);
      this.setState({ showButtonLoader: false });

      if (result.status == 200) {
        toast.success(
          getErrorMsg(this.props.lang, "return-req"),
          getToastConfig()
        );
        this.setState({
          showResultPage: true,
          cancelResultData: result.result,
        });
      }
    } catch (error) {
      this.setState({ showButtonLoader: false });
      toast.error(error.response?.data.message, getToastConfig());
    }
  };

  handleStarClick = () => {
    if (!this.state.showRatingInput) {
      this.setState({
        showRatingInput: true,
      });
    }
  };

  componentDidMount() {
    this.getListCancelData();
    this.getListCancelReason();
  }

  getListCancelData = async () => {
    this.setState({ showLoader: true });
    const result = await client_getCancelList(this.props.match.params.id);
    this.setState({ showLoader: false });
    this.setState({ data: result.data.result });
  };

  getListCancelReason = async () => {
    const result = await client_getCancelReasonList();
    let options = [];
    result.result.forEach((element) => {
      options.push({
        value: element.reasonId,
        label: element.reasonTitle,
      });
    });

    this.setState({ cancelReasonData: options });
  };

  handleSelectReason = (itemId, index, reason) => {
    const items = this.state.selectedItems;
    items.find((c) => c.fkOrderItemId == itemId).fkCancelingReasonId =
      reason.value;
    const reasonItem = this.state.selectedReasopnOPtions;
    reasonItem[index] = reason;
    this.setState({
      selectedItems: items,
      selectedReasopnOPtions: reasonItem,
    });
  };

  renderQuestions(itemId, index) {
    return (
      <div className="order-cancel__slide-cnt mt-2 mt-md-0">
        <div className="cart-item__quantity order-cancel__que">
          <ProtraitPhonesAndBigger>
            <span className="order-cancel__text">
              <Translate id="orders.cancel-msg1" />
            </span>
          </ProtraitPhonesAndBigger>
          <Select
            className="react-select"
            options={this.state.cancelReasonData}
            onChange={this.handleSelectReason.bind(event, itemId, index)}
            placeholder={<Translate id="returns.select-reason-place" />}
            value={this.state.selectedReasopnOPtions[index]}
            required
          />
        </div>
      </div>
    );
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
            <h2 className="orders__item-cnt-header">
              <Translate id="orders.select-for-cancel" />
            </h2>
          </div>
        </Link>
      </header>
    );
  }

  render() {
    return (
      <div>
        <ToastContainer rtl={isRtl(this.props.lang)} {...getToastConfig()} />

        <SwitchTransition>
          <CSSTransition
            classNames="user-panel__routes"
            timeout={200}
            key={this.state.showResultPage ? 1 : 2}
          >
            {this.state.showResultPage ? (
              <CancelResult
                content={this.state.cancelResultData}
                currency={this.props.currency}
                lang={this.props.lang}
                orderBackLink={this.props.match.url
                  .split("/")
                  .slice(0, -1)
                  .join("/")}
              />
            ) : (
              <section className="order-cancel">
                <BoxStyle2 headerContent={this.renderBoxHeader()}>
                  <ProtraitPhonesAndBigger>
                    <div className="order-cart__credit-cnt">
                      {this.state.data[0]?.customerRefound == 2 ? (
                        <>
                          <CreditCardIcon className="order-cart__credit-icon" />
                          <span className="order-cancel__card">
                            <Translate id="orders.card-refund" />
                          </span>
                        </>
                      ) : (
                        <>
                          <img
                            src={ajyallWallet}
                            className="payment__icon"
                            alt="cash icon"
                          />
                          <span className="order-cancel__card">
                            <Translate id="preference.wallet" />
                          </span>
                        </>
                      )}
                    </div>
                    <p className="order-cancel__text">
                      <Translate id="orders.card-msg1" />
                      <br />
                      <a
                        href="/bhd-en/panel/preference"
                        className="order-cancel__link"
                      >
                        <Translate id="orders.de-re" />
                      </a>
                    </p>
                  </ProtraitPhonesAndBigger>
                  <div className="row no-gutters">
                    <div className="col-12">
                      <SelectBox
                        multiSelect
                        onChange={this.handleItemSelect.bind(this)}
                      >
                        {this.state.data?.map((item, index) => {
                          return (
                            <>
                              <SelectBox.SelectItem
                                name={index}
                                value={item.itemId}
                              >
                                <OrderItem
                                  data={item}
                                  key={item.itemId}
                                  currency={this.props.currency}
                                  lang={this.props.lang}
                                  withoutRightBox="true"
                                />
                              </SelectBox.SelectItem>
                              <SlideDown>
                                {this.state.selectedItems.find(
                                  (c) => c.fkOrderItemId == item.itemId
                                ) && this.renderQuestions(item.itemId, index)}
                              </SlideDown>
                            </>
                          );
                        })}
                      </SelectBox>
                      <ProtraitPhonesAndBigger>
                        <div className="order-cancel__btn-cnt">
                          {this.state.selectedItems.length > 0 && (
                            <button
                              onClick={this.showResultPage}
                              className="primary-btn order-review__submit-btn"
                            >
                              {this.state.showButtonLoader ? (
                                <Loading
                                  type="white"
                                  width="20px"
                                  height="20px"
                                />
                              ) : (
                                <span>
                                  <Translate id="orders.cancel" />
                                  &nbsp; {this.state.selectedItems.length}
                                  &nbsp; <Translate id="orders.items" />
                                </span>
                              )}
                            </button>
                          )}
                        </div>
                      </ProtraitPhonesAndBigger>
                      <ProtraitPhones>
                        <div className="checkout-fix justify-content-center">
                          {this.state.selectedItems.length > 0 && (
                            <button
                              onClick={this.showResultPage}
                              className="primary-btn order-review__submit-btn"
                            >
                              {this.state.showButtonLoader ? (
                                <Loading
                                  type="white"
                                  width="20px"
                                  height="20px"
                                />
                              ) : (
                                <span>
                                  <Translate id="orders.cancel" />
                                  &nbsp; {this.state.selectedItems.length}
                                  &nbsp; <Translate id="orders.items" />
                                </span>
                              )}
                            </button>
                          )}
                        </div>
                      </ProtraitPhones>
                    </div>
                  </div>
                </BoxStyle2>
              </section>
            )}
          </CSSTransition>
        </SwitchTransition>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    lang: selectLang(state),
    currency: selectCurr(state),
  };
};

export default connect(mapStateToProps)(CancelOrders);
