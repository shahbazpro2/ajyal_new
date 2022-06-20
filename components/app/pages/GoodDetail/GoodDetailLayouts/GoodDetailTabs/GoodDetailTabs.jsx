import React from "react";
// import "./GoodDetailTabs.scss";
// import "./GoodDetailTabs-rtl.scss";
// import "react-tabs/style/react-tabs.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Translate } from "react-localize-redux";
import SpecificationsTab from "./SpecificationsTab";
import RatingAndOverviews from "./RatingAndOverviews";
import { connect } from "react-redux";
import {
  fetchComment,
  LOADING,
  selectCommnetStatus,
  SUCCEEDED,
  selectSpecifiStatus,
  fetchSpecifi,
} from "./../../GoodDetailSlice";
import { withRouter } from "next/router";
import { Loading } from "../../../../../common/";

const REVIEW_AND_RATING = 2;
const SPECIFICATION = 1;

class GoodDetailTabs extends React.Component {
  constructor(props) {
    super(props);
    this.comments = "hello";
    this.state = {
      commentsPageNumber: 1,
      commentsPageSize: 10,
      goodId: this.props.router.query.good[0],
      comments: [],
      moreCommentExist: false,
      reqResult: {},
      specifications: [],
    };
  }

  handleSwitchTab = async (index, lastIndex) => {
    /// check clicked tab is review and rating
    if (
      index === REVIEW_AND_RATING &&
      this.props.commnetStatus !== SUCCEEDED &&
      this.state.comments.length === 0
    ) {
      let result = await this.props.fetchComment({
        pageSize: this.state.commentsPageSize,
        pageNumber: this.state.commentsPageNumber,
        id: this.state.goodId,
      });
      result = result.payload.result;

      // let result = {
      //   status: 0,
      //   result: {
      //     surveyList: [
      //       {
      //         value: 0,
      //         average: 0,
      //       },
      //       {
      //         value: 5,
      //         average: 10,
      //       },
      //       {
      //         value: 10,
      //         average: 10,
      //       },
      //     ],
      //     goodsComment: [
      //       {
      //         commentId: 0,
      //         commentText: "string",
      //         commentDate: "2020-10-22T07:37:55.834Z",
      //         customerName: "string",
      //         likeCount: 0,
      //         reviewPoint: 0,
      //         isAccepted: true,
      //         tGoodsCommentPoints: [
      //           {
      //             pointId: 0,
      //             pointText: "string",
      //             pointType: true,
      //           },
      //         ],
      //       },
      //       {
      //         commentId: 10,
      //         commentText: "string",
      //         commentDate: "2020-10-22T07:37:55.834Z",
      //         customerName: "string",
      //         likeCount: 0,
      //         reviewPoint: 0,
      //         isAccepted: true,
      //         tGoodsCommentPoints: [
      //           {
      //             pointId: 0,
      //             pointText: "string",
      //             pointType: true,
      //           },
      //         ],
      //       },
      //       {
      //         commentId: 5,
      //         commentText: "commmentewsfsdf",
      //         commentDate: "2020-10-22T07:37:55.834Z",
      //         customerName: "john hall",
      //         likeCount: 40,
      //         reviewPoint: 4,
      //         isAccepted: true,
      //         tGoodsCommentPoints: [
      //           {
      //             pointId: 1,
      //             pointText: "possetive",
      //             pointType: true,
      //           },
      //           {
      //             pointId: 10,
      //             pointText: "false item",
      //             pointType: false,
      //           },
      //         ],
      //       },
      //     ],
      //     goodsCommentCount: 1000,
      //     allSurveyAverage: 5,
      //   },
      //   message: "string",
      // };

      // result = result.result;

      let moreCommentExist = true;
      if (result.goodsComment.length < this.state.commentsPageSize)
        moreCommentExist = false;

      this.setState({
        comments: result.goodsComment,
        moreCommentExist: moreCommentExist,
        reqResult: result,
      });
    }

    if (index === SPECIFICATION && this.props.specifiStatus !== SUCCEEDED) {
      let result = await this.props.fetchSpecifi(this.state.goodId);
      result = result.payload.result;

      this.setState({
        specifications: result,
      });
    }
  };

  handleMoreReview = async () => {
    const newPageNumber = this.state.commentsPageNumber++;
    let result = await this.props.fetchComment({
      pageSize: this.state.pageSize,
      pageNumber: newPageNumber,
      id: this.state.goodId,
    });

    result = result.payload.result;

    let moreCommentExist = true;
    if (result.goodsComment.length < this.state.commentsPageSize)
      moreCommentExist = false;
    this.setState((state) => {
      const newCommentsList = [...state.comments, ...result.goodsComment];
      return {
        ...state,
        commentsPageNumber: newPageNumber,
        comments: newCommentsList,
        moreCommentExist: moreCommentExist,
      };
    });
  };

  render() {
    return (
      <section className="goodDetailTabs">
        <Tabs onSelect={this.handleSwitchTab}>
          <TabList>
            <Tab>
              <Translate id="tabs.overview" />
            </Tab>
            <Tab>
              <Translate id="tabs.specification" />
            </Tab>
            <Tab>
              <Translate id="tabs.rating" />
            </Tab>
          </TabList>

          <TabPanel>
            <div className="ql-editor"
              dangerouslySetInnerHTML={{ __html: this.props.description }}
            ></div>
          </TabPanel>
          <TabPanel>
            <SpecificationsTab specifications={this.state.specifications} />
          </TabPanel>
          <TabPanel>
            {this.state.comments.length === 0 &&
            this.props.commnetStatus === LOADING ? (
              <Loading type="gray" width={"80px"} />
            ) : (
              <RatingAndOverviews
                asideData={this.state.reqResult}
                data={this.state.comments}
                moreCommentExist={this.state.moreCommentExist}
                handleMoreReview={this.handleMoreReview}
              />
            )}
          </TabPanel>
        </Tabs>
      </section>
    );
  }
}

const mapDispatchToProps = {
  fetchComment,
  fetchSpecifi,
};

const mapStateToProps = (state) => {
  return {
    commnetStatus: selectCommnetStatus(state),
    specifiStatus: selectSpecifiStatus(state),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(GoodDetailTabs));
