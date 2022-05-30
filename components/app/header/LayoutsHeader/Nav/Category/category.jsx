import React, { useState } from "react";
import { Dropdown } from "../../../../../common";
import Link from "next/link";
import { TabContent, TabItem } from "./Tabs";
import { SEARCH_TYPE_CATEGORY } from "../../../../../../lib/querys";
import { selectLang, selectCurr } from "../../../../../../appConfigSlice";
import { useSelector } from "react-redux";
// import App2 from "./TabContent";
const Category = (probs) => {
  let [tabActiveIndex, setTabActiveIndex] = useState(
    probs.data && probs.data[0] && probs.data[0]?.categoryId
  );

  const lang = useSelector(selectLang);
  const curr = useSelector(selectCurr);
  return (
    <div>
      {probs.type === "web" ? (
        <div style={{ position: "absolute", width: "100%" }}>
          <div className="web-category container siteWidthContainer p-0">
            <div className="web-category__left-side">
              <ul className="web-category__items">
                {/* {probs.categoryContent.categoryTitle.map((title, index) => {
                  return (
                    <li onMouseEnter={() => changeCategory(title)} key={index}>
                      <Link href="/[lang-curr]" as="/usd-en">
                        <a>
                          <span>{title}</span>
                        </a>
                      </Link>
                    </li>
                  );
                })} */}
                {
                  // data is results.categories
                  probs.data &&
                    probs.data.map((cat) => {
                      return (
                        <TabItem
                          closeHomeMenu={probs.closeHomeMenu}
                          catId={cat.categoryId}
                          iconUrl={cat.iconUrl}
                          haveWebPage={cat.haveWebPage}
                          key={cat.categoryId}
                          onMouseEnterEvent={() => {
                            setTabActiveIndex(cat.categoryId);
                          }}
                        >
                          {cat.categoryTitle}
                        </TabItem>
                      );
                    })
                }
              </ul>
            </div>
            {
              // data is results.categories
              probs.data &&
                probs.data.map((cat) => {
                  return (
                    <TabContent
                      closeHomeMenu={probs.closeHomeMenu}
                      key={cat.categoryId}
                      isActive={tabActiveIndex === cat.categoryId}
                      categories={cat}
                    />
                  );
                })
            }
          </div>
        </div>
      ) : (
        <div className="mobile-category">
          <Dropdown
            alwaysOpen={false}
            headerClass="mobile-category__filter-header"
            containerClass="mobile-category__list-container"
            text={probs.categoryTitle}
          >
            <ul className="mobile-category__filter-list">
              {probs.data?.map((cat, index) => {
                let allLink = "#";
                if (cat.haveWebPage) {
                  allLink = `/${curr}-${lang}/category/${cat.categoryId}`;
                } else {
                  allLink = `/${curr}-${lang}/search?id=${cat.categoryId}&type=${SEARCH_TYPE_CATEGORY}`;
                }
                return (
                  <li className="mobile-category__list-item" key={index}>
                    <Dropdown
                      alwaysOpen={false}
                      headerClass="mobile-category__drop-header"
                      text={cat.categoryTitle}
                      haveLink
                      link={allLink}
                    >
                      <ul className="mobile-category__drop-list">
                        {cat.childs?.map((child, index) => {
                          let allLink2 = "#";
                          if (child.haveWebPage) {
                            allLink2 = `/${curr}-${lang}/category/${child.categoryId}`;
                          } else {
                            allLink2 = `/${curr}-${lang}/search?id=${child.categoryId}&type=${SEARCH_TYPE_CATEGORY}`;
                          }
                          return (
                            <li
                              className="mobile-category__list-item-secound"
                              key={index + 100}
                            >
                              <Link href={allLink2}>
                                <a className="mobile-category__list-link">
                                  {child.categoryTitle}
                                </a>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </Dropdown>
                  </li>
                );
              })}
            </ul>
          </Dropdown>
        </div>
      )}
    </div>
  );
};

export default Category;
