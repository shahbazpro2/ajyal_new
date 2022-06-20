import React from "react";
import { Translate } from "react-localize-redux";
import { useSelector } from "react-redux";
import { ColorFullProgressBar, Loading } from "../../../../../common/";
import { LOADING, selectCommnetStatus } from "../../GoodDetailSlice";
import RatingAside from "./RatingAside";
import ReviewItem from "./ReviewItem";
import EmptyComments from "./../../../../../../assets/icons/emptyComments.svg";

export default ({ data, moreCommentExist, handleMoreReview, asideData }) => {
  const handleMoreRiviewsClick = () => {
    handleMoreReview();
  };

  const commentStatus = useSelector(selectCommnetStatus);

  return (
    <section className="row">
      <div className="col-12 col-md-3">
        <RatingAside data={asideData} />
      </div>
      <div className="col-12 col-md-9 goodDetail">
        {data?.length === 0 && (
          <div
            style={{ textAlign: "center", margin: "20px 0px 50px 0px" }}
            className="goodDetail__empty-cnt"
          >
            <EmptyComments className="goodDetail__emptyIcon" />
          </div>
        )}

        {data?.map((comment) => {
          return <ReviewItem key={comment.commentId} {...comment} />;
        })}

        <div className="col-12 text-align-center-ltr">
          {commentStatus === LOADING ? (
            <Loading type="gray" width="50px" />
          ) : (
            moreCommentExist && (
              <button
                onClick={handleMoreRiviewsClick}
                className="d-inline goodDetailTabs__more-review-btn"
              >
                <Translate id="tabs.more-reviews" />
              </button>
            )
          )}
        </div>
      </div>
    </section>
  );
};
