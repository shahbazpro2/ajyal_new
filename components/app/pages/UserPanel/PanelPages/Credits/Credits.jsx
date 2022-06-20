import React from "react";
// import "./Credits.scss";
// import "./Credits-rtl.scss";
import BoxStyle2 from "../../../../../common/BoxStyle2";
import { Translate } from "react-localize-redux";
import { ReactComponent as EmptyWalletIcon } from "./../../../../../../assets/icons/empty wallet.svg";
import { client_getCreditList } from "../../../../../../lib/api/client/clientUserPanel";
import { Pager, Loading } from "../../../../../common";
import {
  LandScapePhones,
  LandScapePhonesAndBigger,
} from "../../../../../../Responsive";
import { selectCurr } from "../../../../../../appConfigSlice";
import { connect } from "react-redux";

class Credit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emptyCrdits: false,
      pageNumber: 1,
      pageSize: 10,
      totalNumber: 0,
      credit: 0,
      showLoader: false,
      creditsItems: [],
    };
  }

  renderEmtpySection() {
    return (
      <section className="no-address">
        <div>
          <EmptyWalletIcon className="no-address__icon" />
          <p className="no-address__topText">
            <Translate id="credits.msg2" />
          </p>
        </div>
      </section>
    );
  }
  componentDidMount() {
    this.getData(this.state.pageNumber);
  }

  pageChangedAction = async (pagenumber) => {
    this.setState({ pageNumber: pagenumber });
    await this.getData(pagenumber);
  };

  getData = async (pagenumber) => {
    this.setState({ showLoader: true });
    const result = await client_getCreditList({
      pageNumber: pagenumber,
      pageSize: this.state.pageSize,
    });
    if (result.result.count == 0) {
      this.setState({ emptyCrdits: true });
    } else {
      this.setState({
        creditsItems: result.result.transactionList,
        totalNumber: result.result.count,
        credit: result.result.credit,
      });
    }
    this.setState({ showLoader: false });
  };
  render() {
    return (
      <BoxStyle2 className="credit">
        {this.state.showLoader ? (
          <Loading type="gray" width="9%" height="70%" />
        ) : (
          <div>
            <header className="credit__header row no-gutters align-items-center justify-content-between">
              {/* <div className="credit__header-div credit__header-div--top  col-md-7 col-lg-6 d-flex flex-wrap flex-row align-items-center">
                <span className="credit__text basis-sm-100">
                  <Translate id="credits.msg1" />
                </span>
                <div className="input-with-add-icon credit__input">
                  <Translate>
                    {({ translate: t }) => {
                      return (
                        <>
                          <input
                            type="text"
                            placeholder={t("credits.redeem-placeholder")}
                            className="gray__input "
                          />
                          <span className="credit__icon-cnt">
                            <AddIcon />
                          </span>
                        </>
                      );
                    }}
                  </Translate>
                </div>
              </div> */}
              <div className="credit__header-div col-md-5 col-lg-4">
                <div className="credit__header-div--back">
                  <span className="credit__text-s2">
                    <Translate id="credits.av-balance" />
                  </span>
                  <span className="credit__text credit__text--bold">
                    <Translate id={this.props.curr} /> {this.state.credit}
                  </span>
                </div>
              </div>
            </header>

            <section className="credit__content">
              {this.state.emptyCrdits && this.renderEmtpySection()}
              {!this.state.emptyCrdits && (
                <div className="credit__table-cnt">
                  <LandScapePhonesAndBigger>
                    <table className="credit__table">
                      <thead className="credit__table-header">
                        <tr>
                          <th>
                            <Translate id="credits.date" />
                          </th>

                          <th>
                            <Translate id="credits.type" />
                          </th>
                          <th>
                            <Translate id="credits.details" />
                          </th>
                          <th>
                            <Translate id="credits.amount" />
                          </th>
                          <th>
                            <Translate id="credits.balance" />
                          </th>
                        </tr>
                      </thead>
                      <tbody className="credit__table-body">
                        {this.state.creditsItems?.map(
                          (item) => {
                            return (
                              <tr>
                                <td className="credit__tbl-text credit__tbl-text--gray">
                                  {
                                    item.transactionDateTime}
                                </td>
                                <td className="credit__tbl-text credit__tbl-text--primary">
                                  {item.transactionType}
                                </td>
                                <td className="credit__tbl-text credit__tbl-text--primary">
                                  {item.comment}
                                </td>
                                <td
                                  className={
                                    `credit__tbl-text d-ltr ${item.transactionTypeId != 10 ? 'credit__tbl-text--green' : 'credit__tbl-text--orange'}` 
                                      
                                  }
                                >
                                  {item.transactionTypeId == 10 ? (
                                    <span>-</span>
                                  ) : (
                                    <span>+</span>
                                  )}{" "}
                                  {this.props.curr.toUpperCase()} {item.amount}
                                </td>
                                <td className="credit__tbl-text credit__tbl-text--primary">
                                {this.props.curr.toUpperCase()} {item.balance}
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </LandScapePhonesAndBigger>
                  <LandScapePhones>
                    <ul className="credit__landScape-list">
                      {this.state.creditsItems?.map((item) => {
                        return (
                          <li className="credit__landScape-item">
                            <div className="credit__div">
                              <span className="d-block credit__tbl-text credit__tbl-text--primary">
                                {item.transactionType}
                              </span>
                              <span className="credit__tbl-text credit__tbl-text--gray">
                                  {item.transactionDateTime}
                              </span>
                            </div>
                            <div className="credit__div">
                              <span
                                className={
                                  "d-block credit__tbl-text d-ltr" +
                                    item.transactionTypeId == 10
                                    ? "credit__tbl-text--orange"
                                    :  "credit__tbl-text--green"
                                }
                              >
                                {item.transactionTypeId == 10 ? (
                                  <span>-</span>
                                ) : (
                                  <span>+</span>
                                )}{" "}
                                {this.props.curr.toUpperCase()} {item.amount} {this.props.curr.toUpperCase()} {item.amount}
                              </span>
                              <span className="d-block credit__tbl-text credit__tbl-text--primary d-ltr">
                                <span className="credit__tbl-text credit__tbl-text--margin-right credit__tbl-text--gray">
                                  Balance
                                </span>
                                {this.props.curr.toUpperCase()} {item.balance}
                              </span>
                            </div>
                            <div className="credit__div credit__div--basis">
                              <span className="d-block credit__tbl-text credit__tbl-text--primary">
                                {item.comment}
                              </span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </LandScapePhones>

                  <Pager
                    count={Math.ceil(
                      this.state.totalNumber / this.state.pageSize
                    )}
                    activeItem={this.state.pageNumber}
                    onPageClick={(pageNumber) => {
                      this.pageChangedAction(pageNumber);
                    }}
                  />
                </div>
              )}
            </section>
          </div>
        )}
      </BoxStyle2>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    curr: selectCurr(state),
  };
};

export default connect(mapStateToProps)(Credit);
