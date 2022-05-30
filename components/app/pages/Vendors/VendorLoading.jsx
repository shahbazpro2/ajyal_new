import React from "react";

const VendorLoading = () => {
  let loader = [];
  for (let i = 0; i < 9; i++) {
    loader.push(
      <div className="col-12 col-sm-6 col-lg-4 mt-4 pl-4">
        <article className="vendor">
          <div className="vendor__img-cnt">
            <div className="vendor__cover"></div>
          </div>
          <div className="vendor__contents">
            <h2 className="vendor__name">
              <div className="vendor__name ssc-line"></div>
            </h2>
            <div className="vendor__texts-cnt">
              <p className="vendor__address">
                {/* <img src={vendorLocation} /> Suite 12, Building 2216 G, Road */}
                <div className="vendor__address ssc-line"></div>
              </p>
              <p className="vendor__phone">
                {/* <img src={vendorPhoneIcon} /> */}
                <div className="vendor__phone ssc-line"></div>
              </p>
            </div>
          </div>
          <a href="#" className="vendor__btn--loading">
            <div className="ssc-square vendor__btn"></div>
          </a>
        </article>
      </div>
    );
  }
  return (
    <section>
      <div className="row no-gutters vendor__row vendorLoading">{loader}</div>
    </section>
  );
};

export default VendorLoading;
