import React from "react";
import { ColorFullProgressBar, StarRating } from "../../../../../common/";
import { Translate } from "react-localize-redux";

export default ({ data }) => {
  return (
    <aside className="goodDetailTabs__rating-cnt">
      <h2 className="goodDetailTabs__rate">{data.allSurveyAverage}</h2>
      <StarRating
        name="good rating aside"
        editing={false}
        starCount={5}
        value={data.allSurveyAverage}
      />
      <p className="goodDetailTabs__rate-text">
        <Translate id="tabs.basedon" /> {data.goodsCommentCount} &nbsp;
        <Translate id="tabs.review" />
      </p>
      <div className="goodDetailTabs__progress">
        {data.surveyList?.length > 0 &&
          data.surveyList.map((item, index) => {
            return (
              <ColorFullProgressBar
                key={index}
                number={item.value}
                percent={item.average}
                strokeWidth={3.5}
                trailWidth={3.5}
              />
            );
          })}
      </div>
    </aside>
  );
};
