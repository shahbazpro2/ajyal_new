import React from "react";
import { StarRating } from "../../../../../common/";

export default (data) => {
  return (
    <article className="goodDetailTabs__review-cnt">
      <h2 className="goodDetailTabs__review">{data.customerName}</h2>
      <StarRating
        name="comment rating"
        editing={false}
        starCount={5}
        value={data.reviewPoint}
        nextText={`(${data.reviewPoint})`}
      />
      <p className="goodDetailTabs__review-text">{data.commentText}</p>
      <div className="goodDetailTabs__review-pos-cons-cnt">
        <ul>
          {data?.tGoodsCommentPoints?.map((commentPoint) => {
            if (commentPoint.pointType)
              return (
                <li className="goodDetailTabs__review-item goodDetailTabs__review-item--pos">
                  {commentPoint.pointText}
                </li>
              );
          })}
        </ul>
        <ul>
          {data?.tGoodsCommentPoints?.map((commentPoint) => {
            if (!commentPoint.pointType)
              return (
                <li className="goodDetailTabs__review-item goodDetailTabs__review-item--cons">
                  {commentPoint.pointText}
                </li>
              );
          })}
        </ul>
      </div>
    </article>
  );
};
