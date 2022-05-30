import React from "react";
import AdidasLogo from "./../../../../../../assets/images/Adidas_Logo.svg";
import classnames from "classnames";
import { Translate } from "react-localize-redux";
import Link from "next/link";
import { selectCurr, selectLang } from "../../../../../../appConfigSlice";
import { SEARCH_TYPE_CATEGORY } from "../../../../../../lib/querys";
import { useSelector } from "react-redux";

export const TabItem = ({
  onMouseEnterEvent,
  children,
  haveWebPage,
  catId,
  iconUrl,
  closeHomeMenu,
}) => {
  const lang = useSelector(selectLang);
  const curr = useSelector(selectCurr);
  const Category_pre = process.env.NEXT_PUBLIC_CategoryImages_PREFIX;

  return (
    <li onMouseEnter={onMouseEnterEvent}>
      {haveWebPage ? (
        <Link href={`/${curr}-${lang}/category/${catId}`}>
          <a onClick={closeHomeMenu}>
            {iconUrl !== null ? (
              <img src={`${Category_pre}/${catId}/${iconUrl}`} alt={children} />
            ) : null}

            <span>{children}</span>
          </a>
        </Link>
      ) : (
        <Link
          href={`/${curr}-${lang}/search?id=${catId}&type=${SEARCH_TYPE_CATEGORY}`}
        >
          <a onClick={closeHomeMenu}>
            {iconUrl !== null ? (
              <img src={`${Category_pre}/${catId}/${iconUrl}`} alt={children} />
            ) : null}
            <span>{children}</span>
          </a>
        </Link>
      )}
    </li>
  );
};

export const TabContent = ({
  isActive,
  children,
  categories,
  haveWebPage,
  catId,
  closeHomeMenu,
}) => {
  const Brand_Pre = process.env.NEXT_PUBLIC_BrandImages_PREFIX;
  const Category_pre = process.env.NEXT_PUBLIC_CategoryImages_PREFIX;

  const lang = useSelector(selectLang);
  const curr = useSelector(selectCurr);

  let allLink = "#";
  if (categories.haveWebPage) {
    allLink = `/${curr}-${lang}/category/${categories.categoryId}`;
  } else {
    allLink = `/${curr}-${lang}/search?id=${categories.categoryId}&type=${SEARCH_TYPE_CATEGORY}`;
  }

  return (
    <div
      className={classnames("web-category__right-side", { active: isActive })}
    >
      <div className="web-category__right-side--header">
        <span>{categories.categoryTitle}</span>
        <Link href={allLink}>
          <a onClick={closeHomeMenu}>
            <Translate id="footer.viewAll" />
          </a>
        </Link>
      </div>
      <div className="web-category__right-side--body">
        <div className="right-side-items">
          <h2 className="mb-4 right-side-title">
            <Translate id="footer.topCategories" />
          </h2>
          <ul>
            {categories.childs &&
              categories.childs.map((child) => {
                return (
                  <React.Fragment key={child.categoryId}>
                    {child.haveWebPage ? (
                      <Link
                        key={child.categoryId}
                        href={`/${curr}-${lang}/category/${child.categoryId}`}
                      >
                        <a onClick={closeHomeMenu}>
                          <li> {child.categoryTitle}</li>
                        </a>
                      </Link>
                    ) : (
                      <Link
                        key={child.categoryId}
                        href={`/${curr}-${lang}/search?id=${child.categoryId}&?type=${SEARCH_TYPE_CATEGORY}`}
                      >
                        <a onClick={closeHomeMenu}>
                          <li>{child.categoryTitle}</li>
                        </a>
                      </Link>
                    )}
                  </React.Fragment>
                );
              })}
          </ul>
        </div>
        <div className="right-side-brands">
          <h2 className="mb-0 right-side-title">
            <Translate id="footer.topBrand" />
          </h2>
          <div className="right-side-brands--list">
            {categories.websiteBrand &&
              categories.websiteBrand.map((brand) => {
                // { console.log(`${Brand_Pre}/${brand.brandId}/${brand.brandLogoImage}`)}
                return (
                  <Link
                    key={brand.brandId}
                    href={`/${curr}-${lang}/search?id=${categories.categoryId}&?type=${SEARCH_TYPE_CATEGORY}&brandId=${brand.brandId}`}
                  >
                    <a onClick={closeHomeMenu}>
                      <img
                        className="header-brand-images"
                        title={brand.brandTitle}
                        src={`${Brand_Pre}/${brand.brandId}/${brand.brandLogoImage}`}
                        alt={brand.brandTitle}
                      />
                    </a>
                  </Link>
                );
              })}
          </div>
        </div>

        <div className="right-side-image">
          {categories.imageUrl && (
            <img
              src={`${Category_pre}/${categories.categoryId}/${categories.imageUrl}`}
              alt={categories.categoryTitle}
            />
          )}
        </div>
      </div>
    </div>
  );
};
