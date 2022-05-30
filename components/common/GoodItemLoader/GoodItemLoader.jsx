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
    <div
      className={`goodItem-s1-container goodItem-loader ${
        props.className ? props.className : ""
      }`}
    >
      <article className="goodItem-s1">
        <figure className="goodItem-s1__fig goodItem-loader__img-cnt">
          <img className="goodItem-loader__img" src={placeholder} />
        </figure>

        <ContentLoader
          uniqueKey="my-random-valye"
          width={100}
          height={25}
          // viewBox="0 0 100 100"
          style={{ width: "100%" }}
          {...props}
        >
          <rect x="0" y="0" rx="3" ry="3" width="100%" height="25" />
          {/* <rect x="0" y="20" rx="3" ry="3" width="100%" height="6" />
          <rect x="0" y="30" rx="3" ry="3" width="100%" height="6" /> */}
          {/* <circle cx="132" cy="60" r="20" /> */}
        </ContentLoader>
        <div className="d-flex justify-content-between">
          <div className="w-100 mt-3" style={{ flexBasis: "63%" }}>
            <ContentLoader
              width={100}
              uniqueKey="qweqweqw"
              height={50}
              // viewBox="0 0 100 100"
              style={{ width: "100%" }}
              {...props}
            >
              {/* <rect x="1" y="50" rx="3" ry="3" width="100%" height="15" /> */}
              <rect x="0" y="0" rx="3" ry="3" width="100%" height="40" />
              {/* <rect x="0" y="17" rx="4" ry="4" width="300" height="13" /> */}
            </ContentLoader>
          </div>
          <div className="mt-3" style={{ flexBasis: "29%" }}>
            <ContentLoader
              width={30}
              height={50}
              // viewBox="0 0 100 100"
              style={{ width: "100%" }}
              {...props}
            >
              <circle cx="20" cy="20" r="20" />
            </ContentLoader>
          </div>
        </div>
      </article>
    </div>
  );
};

export default GoodItemLoader;
