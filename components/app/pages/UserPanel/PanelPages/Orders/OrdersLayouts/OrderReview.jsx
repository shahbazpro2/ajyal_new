import React from "react";
import {
  BoxStyle2,
  StarRating,
  MultiAddInput,
  SelectBox2 as SelectBox,
  FormErrorMsg,
  Loading,
} from "../../../../../../common";
import { Translate } from "react-localize-redux";
import { ReactComponent as BackIcon } from "./../../../../../../../assets/icons/back.svg";
import { Link } from "react-router-dom";
import SlideDown from "react-slidedown";
import {
  ProtraitPhones,
  ProtraitPhonesAndBigger,
} from "../../../../../../../Responsive";
import { client_addCustomerGoodsComment, client_customerGoodsComment } from "../../../../../../../lib/api/client/clientUserPanel";
import { validateEmpty } from "../../../../../../../lib/formValidator";
import { selectCurr, selectLang } from "../../../../../../../appConfigSlice";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { getToastConfig } from "../../../../../../../lib/toast";

class OrderReview extends React.Component {
  constructor(props) {
    super(props);
    this.goods_Pre = process.env.NEXT_PUBLIC_Goods_PREFIX;
    this.lang = this.props.lang;

    this.state = {
      showLoader: false,
      showRatingInput: false,
      commentText: null,
      consItems: [],
      prosItems: [],
      errors: {},
      lockPage: false,
      submitLoading: false
    };
  };

  handleStarClick = (value) => {

    if (this.state.lockPage)
      return;
    if (!this.state.showRatingInput) {
      this.setState({
        showRatingInput: true
      });
    };

    let comment = { ...this.state.data.comment };
    comment.reviewPoint = value;

    this.setState((state) => {
      return {
        ...state,
        data: {
          ...state.data,
          comment: comment
        }
      };
    });
  };

  handleAddClick = (text, pointType) => {
    if (this.state.lockPage)
      return;

    const model = {
      pointId: 0,
      fkCommentId: 0,
      pointText: text,
      pointType: pointType
    }

    if (pointType == true) {
      // add pros
      let points = Array.isArray(this.state.prosItems) ? [...this.state.prosItems] : [];
      points.push(model);

      this.setState({ prosItems: points });
    } else {
      // add const
      let points = Array.isArray(this.state.consItems) ? [...this.state.consItems] : [];
      points.push(model);

      this.setState({ consItems: points });
    }
  };

  handleCloseClick = (index, pointType) => {
    if (this.state.lockPage)
      return;

    if (pointType == true) {
      // delete pros
      const prosItems = [...this.state.prosItems];
      prosItems.splice(index, 1);
      this.setState({ prosItems: prosItems });
    } else {
      // delete cons
      const consItems = [...this.state.consItems];
      consItems.splice(index, 1);
      this.setState({ consItems: consItems });
    }
  };

  componentDidMount() {
    this.getData();
  };

  getData = async () => {
    console.log(this.props.match.params.orderItemId);
    console.log(this.props.match.params.good);
    this.setState({ showLoader: true });
    const result = await client_customerGoodsComment(this.props.match.params.orderItemId, this.props.match.params.good);
    // console.log(result?.result);
    this.setState({ data: result.result });
    const consItems = result.result.comment.goodsCommentPoints?.filter(x => x.pointType == false);
    const prosItems = result.result.comment.goodsCommentPoints?.filter(x => x.pointType == true);
    if (result.result?.comment?.reviewPoint && result.result?.comment?.reviewPoint > 0) {
      this.setState({ lockPage: true, showRatingInput: true });
    };
    this.setState({ consItems: consItems, prosItems: prosItems })
    this.setState({ showLoader: false });
    // this.setState({ data: result.result });

  };

  handleQuestionStarClick = (value, item) => {
    if (this.state.lockPage)
      return;

    console.log(value);
    const model = {
      ansId: 0,
      fkCommentId: 0,
      fkQuestionId: item.queId,
      fkCustomerId: 0,
      fkShopId: 0,
      ansValue: value
    }

    const findAnswerIndex = this.state.data?.comment?.shopSurveyAnswers?.findIndex(x => x.fkQuestionId == item.queId);
    if (findAnswerIndex != -1 && findAnswerIndex != undefined) {
      // answer exist edit value
      const answers = Array.isArray(this.state.data.comment.shopSurveyAnswers) ? [...this.state.data.comment.shopSurveyAnswers] : [];
      answers[findAnswerIndex].ansValue = value;

      this.setState((state) => {
        return {
          ...state,
          data: {
            ...state.data,
            comment: {
              ...state.data.comment,
              shopSurveyAnswers: answers
            }
          }
        };
      });
    } else {
      // add new answer
      let answers = []
      if (this.state.data?.comment?.shopSurveyAnswers) {
        answers = [...this.state.data.comment.shopSurveyAnswers];
      } else {

      }

      answers.push(model);

      this.setState((state) => {
        return {
          ...state,
          data: {
            ...state.data,
            comment: {
              ...state.data.comment,
              shopSurveyAnswers: answers
            }
          }
        };
      });
    }
  };

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
              <Translate id="orders.order-det" />
            </h2>
          </div>
        </Link>
      </header>
    );
  };

  setErrors = (func) => {
    const error = func(this.state.errors);
    this.setState({
      errors: error,
    });
  };

  submitReview = async () => {

    if (this.state.lockPage)
      return;

    const model = {
      commentId: this.state.data?.comment?.commentId || 0,
      commentText: this.state.commentText || this.state.data?.comment?.commentText,
      commentDate: null,
      customerName: null,
      customerId: 0,
      orderItemId: this.props.match.params.orderItemId,
      likeCount: 0,
      reviewPoint: this.state.data.comment.reviewPoint,
      isAccepted: null,

      tGoodsCommentPoints: [],
      shopSurveyAnswers: []
    };

    const surveyAnswers = [];
    
    if(this.state.data.comment.shopSurveyAnswers !== null) {
    
      for (let index = 0; index < this.state.data.comment.shopSurveyAnswers.length; index++) {
        const element = this.state.data.comment.shopSurveyAnswers[index];
        const surveyModel = {
          ansId: 0,
          fkCommentId: 0,
          fkQuestionId: element.fkQuestionId,
          fkCustomerId: 0,
          fkShopId: 0,
          ansValue: element.ansValue,
          fkOrderItemId: this.props.match.params.orderItemId
        };
  
        surveyAnswers.push(surveyModel);
      }
    }

    model.shopSurveyAnswers = surveyAnswers;

    const allPoints = this.state.prosItems.concat(this.state.consItems);

    model.tGoodsCommentPoints = allPoints;

    console.log(model);

    this.setState({ showLoader: true });
    try {
      this.setState({ submitLoading: true });
      const result = await client_addCustomerGoodsComment(model);
      toast.success(result.message, getToastConfig());
      this.setState({ submitLoading: false });
      this.setState({ lockPage: true });
    } catch (error) {
      this.setState({ submitLoading: false });
      toast.error(error?.response?.data?.message, getToastConfig());
    }
    // if (result.status === 200) {
    // } else {
    // }
    this.setState({ showLoader: false });
  };

  render() {
    if (this.state.data) {
      return (
        <section className="order-review">
          <BoxStyle2 headerContent={this.renderBoxHeader()}>
            <div className="row no-gutters">
              <div className="col-12 col-lg-7">
                <article className="goodItem-s2 cart-item order-item">
                  <div className="goodItem-s2__left-container">
                    <figure className="goodItem-s2__fig">
                      <img
                        alt=""
                        className="goodItem-s2__img"
                        src={`${this.goods_Pre}/${this.state.data?.goods?.goodsId}/${this.state.data?.goods?.image}`}
                      />
                    </figure>

                    <div className="goodItem-s2__left-right">
                      <div className="goodItem-s2__ns-con">
                        <a className="goodItem-s2__name">{this.state.data?.goods.title}</a>
                        <div className="cart-item__model-container">
                          <span className="order-item__small-text">
                            <Translate id="orders.model-num" />
                          </span>
                          <span className="order-item__small-value">
                            {this.state.data?.goods.serialNumber}
                          </span>
                        </div>
                        <div className="cart-item__model-container">
                          <span className="order-item__small-text">
                            <Translate id="orders.sold-by" />
                          </span>
                          <span className="sky-text-link">{this.state.data?.goods.shopName}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
                <p className="order-review__text order-review__text--mobile-center">
                  <Translate id="orders.rate-this" />
                </p>
                <StarRating
                  name="rating"
                  starCount={5}
                  value={this.state.data.comment.reviewPoint}
                  onStarClick={(value) => this.handleStarClick(value)}
                />
                <SlideDown>
                  {this.state.showRatingInput && (
                    <Translate>
                      {({ translate: t }) => {
                        return (
                          <>
                            <textarea
                              placeholder={t("orders.comment-placeholder")}
                              className="gray__input order-review__text-area"
                              disabled={this.state.lockPage}
                              required
                              name='commentText'
                              onChange={(event) => {
                                this.setState({ commentText: event.target.value });
                              }}
                              value={this.state?.data?.comment.commentText}
                              onBlur={(e) => {
                                validateEmpty({
                                  name: 'commentText',
                                  value: e.target.value,
                                  handler: this.setErrors,
                                  lang: this.lang,
                                });
                              }}
                            ></textarea>
                            <FormErrorMsg
                              show={this.state.errors["commentText"]}
                              msg={this.state.errors["commentText"]}
                            />
                            <label htmlFor="pros" className="order-review__label">
                              <Translate id="orders.pros" />
                            </label>
                            <MultiAddInput
                              disabled={this.state.lockPage}
                              itemColor="#3ad976"
                              itemBgColor="#f0fdf4"
                              name="pros"
                              handleAddClick={(text) => this.handleAddClick(text, true)}
                              handleCloseClick={(index) => this.handleCloseClick(index, true)}
                              items={this.state.prosItems}
                              placeholder={t("orders.pros-placeholder")}
                            />
                            <label htmlFor="cons" className="order-review__label">
                              <Translate id="orders.cons" />
                            </label>
                            <MultiAddInput
                              disabled={this.state.lockPage}
                              itemColor="#f07040"
                              itemBgColor="#fef0eb"
                              handleAddClick={(text) => this.handleAddClick(text, false)}
                              handleCloseClick={(index) => this.handleCloseClick(index, false)}
                              items={this.state.consItems}
                              name="cons"
                              placeholder={t("orders.cons-placeholder")}
                            />
                          </>
                        );
                      }}
                    </Translate>
                  )}
                </SlideDown>

                <div className="order-review__ques">
                  {this.state.data.questions?.map((item, index) => {
                    let rateValue = null;
                    const findAnswerIndex = this.state.data?.comment?.shopSurveyAnswers?.findIndex(x => x.fkQuestionId == item.queId);
                    if (findAnswerIndex != -1 && findAnswerIndex != undefined) {
                      rateValue = this.state.data.comment?.shopSurveyAnswers[findAnswerIndex]?.ansValue;
                    }

                    return (
                      <div key={item.queId} className="order-review__ques-item">
                        <p className="order-review__text">
                          {item.questionText}
                        </p>
                        <div>
                          <StarRating
                            name="rating"
                            starCount={5}
                            value={rateValue}
                            onStarClick={(value) => this.handleQuestionStarClick(value, item)}
                          />
                        </div>
                      </div>
                    )
                  })}

                </div>

                {this.state.lockPage == false ?
                  <>
                    <ProtraitPhonesAndBigger>
                      <button onClick={this.submitReview.bind(this)} className="primary-btn order-review__submit-btn"
                      >
                        {this.state.submitLoading ? (
                          <Loading type="white" width="20px" height="20px" />
                        ) : <Translate id="orders.submit-review" />}
                      </button>
                    </ProtraitPhonesAndBigger>
                    <ProtraitPhones>
                      <div className="checkout-fix justify-content-center">
                        <button onClick={this.submitReview.bind(this)} className="primary-btn returns__add-btn">
                          <Translate id="orders.submit-review" />
                        </button>
                      </div>
                    </ProtraitPhones>
                  </>
                  :
                  null}
                {/* <button className="primary-btn disabled order-review__submit-btn">
                  <Translate id="orders.submit-review" />
                </button> */}
              </div>
            </div>
          </BoxStyle2>
        </section >
      );
    } else {
      return (
        <div></div>
      )
    }

  }
}

const mapStateToProps = (state) => {
  return {
    lang: selectLang(state),
    curr: selectCurr(state),
  };
};
export default connect(mapStateToProps)(OrderReview);