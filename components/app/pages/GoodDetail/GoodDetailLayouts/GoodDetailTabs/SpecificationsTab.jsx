import React from "react";
import { useSelector } from "react-redux";
import { Loading } from "../../../../../common";
import { LOADING, selectSpecifiStatus } from "../../GoodDetailSlice";

export default ({ specifications }) => {
  const specifiStatus = useSelector(selectSpecifiStatus);
  if (specifiStatus === LOADING) return <Loading type="gray" width={"80px"} />;

  // console.log(specifications);
  // const leftSpecifi = [];
  // const rightSpecifi = [];
  // for (let i = 0; i < specifications.length; i++) {
  //   if (i % 2 === 0) {
  //     leftSpecifi.push(
  //       <tr className="goodDetailTabs__table-row">
  //         <td className="goodDetailTabs__speci-name">
  //           {specifications[i]?.specTitle}
  //         </td>
  //         <td className="goodDetailTabs__speci-name goodDetailTabs__speci-name--value">
  //           {specifications[i].tGoodsSpecification?.map((value, b) => {
  //             return (
  //               <>
  //                 {value.specValueText}
  //                 {specifications[i].tGoodsSpecification[b + 1] ? "," : ""}
  //                 {value.tGoodsSpecificationOptions.map((value2) => {
  //                   return value2.optionTitle;
  //                 })}
  //               </>
  //             );
  //           })}
  //         </td>
  //       </tr>
  //     );
  //   } else {
  //     rightSpecifi.push(
  //       <tr className="goodDetailTabs__table-row">
  //         <td className="goodDetailTabs__speci-name">
  //           {specifications[i]?.specTitle}
  //         </td>
  //         <td className="goodDetailTabs__speci-name goodDetailTabs__speci-name--value">
  //
  //           {specifications[i].tGoodsSpecification?.map((value, b) => {
  //             return (
  //               <>
  //                 {value.specValueText}
  //                 {specifications[i].tGoodsSpecification[b + 1] ? "," : ""}
  //                 {value.tGoodsSpecificationOptions.map((value2) => {
  //                   return value2.optionTitle;
  //                 })}
  //               </>
  //             );
  //           })}
  //         </td>
  //       </tr>
  //     );
  //   }
  // }

  return (
    <section className="goodDetailTabs__speci row no-gutters v2 mb-3">
      {/* <div className="col-md-6 col-12 goodDetailTabs__speci-item">
        <table className="goodDetailTabs__table">{leftSpecifi}</table>
      </div>
      <div className="mt-md-0 mt-4 col-md-6 col-12 goodDetailTabs__speci-item">
        <table className="goodDetailTabs__table">{rightSpecifi}</table>
      </div> */}
      {specifications?.map((item, index) => {
        return (
          <div key={index} className="goodDetailTabs__cnt w-100">
            {item.specGroupTitle && (
              <h2 className="goodDetailTabs__general-title">
                {item.specGroupTitle}
              </h2>
            )}
            {item.specification?.map((specifi, index) => {
              return (
                <div
                  key={index}
                  className="goodDetailTabs__specifi-item-cnt row mt-3"
                >
                  <div className="col-12 col-md-3 title-cnt">
                    <div className="goodDetailTabs__specifi-item goodDetailTabs__specifi-item--left">
                      <span className="goodDetailTabs__specfifi-title">
                        {specifi.specTitle}
                      </span>
                    </div>
                  </div>
                  <div className="col-12 col-md-9 mt-2 mt-md-0">
                    <div className="goodDetailTabs__specifi-item goodDetailTabs__specifi-item--right">
                      <ul className="goodDetailTabs__value-list">
                        { specifi.tGoodsSpecification?.map((value, index) => {
                          return value.specValueText ? (
                            <li
                              key={index}
                              className="goodDetailTabs__value-item"
                            >
                              {value.specValueText}
                            </li>
                          ) : (
                            <li
                            className="goodDetailTabs__value-item">
                            {
                              value.tGoodsSpecificationOptions?.map(
                                (value2, index) => {
                                  return (
                                    <>
                                    <span
                                      key={index}
                                      className="goodDetailTabs__value-item"
                                    >
                                      {value2.optionTitle}
                                    </span>
                                   {(value.tGoodsSpecificationOptions?.length - 1) > index && (
                                    <span>
                                    ,
                                    &nbsp;
                                    </span>
                                   )}  
                                    </>

                                  );
                                }
                              )
                            }
                          </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </section>
  );
};
