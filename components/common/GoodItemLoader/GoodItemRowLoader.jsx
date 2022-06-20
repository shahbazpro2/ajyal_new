import React from "react";
import ContentLoader from "react-content-loader";
import placeholder from "./../../../assets/images/img-image-placeholder.svg";

const props2 = {
  speed: 2,
  width: "100%",
  height: "100%",
  backgroundColor: "#f3f3f3",
  foregroundColor: "#ecebeb",
};

const GoodItemLoader = (props) => {
  return (
    <div className="goodItem-s2-container goodItem-loader goodItem-loader--row" href="#">
      <article className="goodItem-s2">
        <div className="goodItem-s2__left-container">
          <figure className="goodItem-s2__fig goodItem-loader__img-cnt goodItem-loader__img-cnt--row">
            <img
              className="goodItem-loader__img--row goodItem-loader__img"
              alt="loader"
              title="loader"
              src={placeholder}
            />
          </figure>

          <div className="goodItem-s2__left-right">
            <ContentLoader
              uniqueKey="my-random-valye"
              width={100}
              height={100}
              // viewBox="0 0 100 100"
              style={{ width: "100%" }}
              {...props}
            >
              <rect x="0" y="25" rx="3" ry="3" width="100%" height="30" />
              <rect x="0" y="65" rx="3" ry="3" width="30%" height="25" />

              {/* <rect x="0" y="20" rx="3" ry="3" width="100%" height="6" />
          <rect x="0" y="30" rx="3" ry="3" width="100%" height="6" /> */}
              {/* <circle cx="132" cy="60" r="20" /> */}
            </ContentLoader>
          </div>
        </div>

        {!props.withoutRightBox && (
          <div className="goodItem-s2__right-container">
             
          </div>
        )}
      </article>
    </div>
  );
};

export default GoodItemLoader;
