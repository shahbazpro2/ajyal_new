import React from "react";
// import "./MobileMenu.scss";
// import "./MobileMenu-rtl.scss";
import Item from "./../../app/header/LayoutsHeader/Nav/Items/item";
import Category from "./../../app/header/LayoutsHeader/Nav/Category/category";
import { ReactComponent as HomeIcon } from "./../../../assets/icons/house.svg";
import { ReactComponent as HeaderDealsIcon } from "./../../../assets/icons/header-deals.svg";
import { ReactComponent as OrderTrackingIcon } from "./../../../assets/icons/header-OrderTracking.svg";
import { ReactComponent as HelpIcon } from "./../../../assets/icons/header-help.svg";
import { ReactComponent as StoreIcon } from "./../../../assets/icons/header-store.svg";
import { ReactComponent as StoreIcon2 } from "./../../../assets/icons/store-icon.svg";
import Bahrain from "./../../../assets/images/img-bahrain.svg";
import UnitedStates from "./../../../assets/images/img-united-states.svg";
import logo2 from "./../../../assets/images/logo-2.png";
import { Dropdown, Button } from "../../common";
import CheckBoxList from "./../../app/pages/Search/SearchLayout/CheckBoxList/CheckBoxList";
import exp from "../../../assets/icons/express.png";
import expAr from "../../../assets/icons/express-ar.png";
import SeeMore from "./../../app/pages/Search/SearchLayout/SeeMore/SeeMore";
import RangeBox from "./../../app/pages/Search/SearchLayout/RangeBox/RangeBox";
import { Translate } from "react-localize-redux";
import classnames from "classnames";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectLang, selectCurr } from "../../../appConfigSlice";
import { useRouter } from "next/router";
import { switchLang, switchCurr } from "../../../lib/switch";
import CheckBoxList2 from "../../app/pages/Search/SearchLayout/CheckBoxList/CheckBoxList2";
import { useState } from "react";
import { SEARCH_TYPE_DEAL } from "../../../lib/querys";
import Switch from "react-switch";
import BrandsCheckList from "../../app/pages/Search/SearchLayout/CheckBoxList/BrandsCheckList";

const MobileMenu = (props) => {
  const disableBodyOverflow = (flag) => {
    if (flag) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
      props.closeMenu();
    }
  };

  const { asPath } = useRouter();
  const [specSelected, setSpecSelected] = useState(props.specSelected);
  const [range, setRange] = useState({});
  const [arrival, setArrival] = useState([props.filters?.goodsCreatedDay]);
  const [brands, setBrand] = useState({
    selected: props.selectedBrands,
    ids: props.filters?.brandId,
  });
  const [justExist, setJustExist] = useState(props.filters?.justExist);
  const [sortedId, setSortId] = useState(props.filters?.orderByType);
  const lang = useSelector(selectLang);
  const curr = useSelector(selectCurr);
  const data = props.data;
  // document.getElementById('page-nav-toggle').checked = true;
  disableBodyOverflow(true);

  const handleFilterClick = () => {
    props.mobileFilterClick(arrival, brands, range, justExist);
    disableBodyOverflow(false);
  };

  const handleBrandClick = (brand, checked) => {
    const id = parseInt(brand.id);
    let selected = [...brands.selected];
    let ids = [...brands.ids];
    if (checked) {
      selected.push(brand);
      ids.push(id);
    } else {
      // if is remove
      selected = selected.filter((brand) => {
        return brand.id != id;
      });

      const index = ids.indexOf(id);
      if (index > -1) {
        ids.splice(index, 1);
      }
    }

    setBrand({ selected, ids });
  };

  const handleSortClick = () => {
    props.mobileSortClick(sortedId);
    disableBodyOverflow(false);
  };

  const handleSortChange = (e) => {
    setSortId(parseInt(e.target.value));
  };
  return (
    <div>
      <input
        id="page-nav-toggle"
        className="main-navigation-toggle"
        type="checkbox"
        defaultChecked="true"
      />

      <nav className="main-navigation">
        <label
          className="main-navigation-toggle-label"
          htmlFor="page-nav-toggle"
        >
          <svg
            onClick={() => disableBodyOverflow(false)}
            id="close_big"
            width="24"
            height="24"
            data-name="close big"
            viewBox="0 0 24 24"
            className="icon--menu-toggle-close"
          >
            <g id="close" transform="translate(4.158 4.156)">
              <path
                id="Path_537"
                fill="#acb1b8"
                d="M15.637 3.19l-4.9 4.9 4.9 4.9A1.867 1.867 0 1 1 13 15.64l-4.9-4.9-4.9 4.9A1.867 1.867 0 0 1 .547 13l4.9-4.9-4.9-4.9A1.867 1.867 0 0 1 3.187.548l4.9 4.9L13 .548a1.867 1.867 0 0 1 2.637 2.642z"
                data-name="Path 537"
                transform="translate(0 -.002)"
              />
            </g>
          </svg>
        </label>
        {props.weAreInPanel && props.userPanelNavi}
        {/* این قسمت برای منو اصلی است */}
        <div
          ref={props.mainManuRef}
          className={classnames({
            "mainMenu--inactive": props.weAreInPanel,
            mainMenu: props.weAreInPanel,
          })}
        >
          {props.isMainMenu === true ? (
            <div>
              <div className="main-navigation__logo">
                <img
                  src={`${process.env.NEXT_PUBLIC_LOGO_PREFIX}/${props.logo}`}
                  alt="logo2"
                />
              </div>
              {/* <p className="main-navigation__desc">
                <Translate id="mobileMenuDesc" />
              </p> */}
              <div className="main-navigation__section">
                <div className="main-navigation__sign-in">
                  <Link href={`/${curr}-${lang}/Auth`}>
                    <a href="">
                      <img src={props.userCheckIcon} alt="userCheckIcon" />
                      <span>
                        <Translate id="singin" />
                      </span>
                    </a>
                  </Link>
                </div>
                <div className="main-navigation__lang">
                  <span>
                    <Translate id="language" />
                  </span>

                  {props.lang.code === "en" ? (
                    <span
                      className="main-navigation__lang-ar"
                      onClick={(e) => {
                        e.preventDefault();
                        switchLang(asPath, true);
                      }}
                    >
                      العربية
                    </span>
                  ) : (
                    <span
                      className="main-navigation__lang-en"
                      onClick={(e) => {
                        e.preventDefault();
                        switchLang(asPath, true);
                      }}
                    >
                      English
                    </span>
                  )}
                </div>
                <div
                  className="main-navigation__lang"
                  style={{ borderBottom: "none" }}
                >
                  <span>
                    <Translate id="currency" />
                  </span>

                  {props.currency === "usd" ? (
                    <div
                      className="main-navigation__lang-ar"
                      onClick={() => {
                        switchCurr(asPath, true);
                      }}
                    >
                      <img className="mr-3 ml-3" src={Bahrain} alt="bhd" />
                      BHD
                    </div>
                  ) : (
                    <div
                      className="main-navigation__lang-en"
                      onClick={() => {
                        switchCurr(asPath, true);
                      }}
                    >
                      <img className="mr-3 ml-3" src={UnitedStates} alt="usd" />
                      USD
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{ padding: "0 2rem" }}
              className="main-navigation__section-filter d-flex align-items-center"
            >
              <h4 className="section-filter-top-title">
                {props.filterSort ? (
                  <Translate id="sort" />
                ) : (
                  <Translate id="filter" />
                )}
              </h4>
              <span className="section-filter-top-clear">
                {/* {props.filterSort ? null : <Translate id="clear" />} */}
              </span>
            </div>
          )}
          {/* این قسمت برای فیلتر جستجو  است */}

          {props.filterSort || props.filtersMenu ? null : (
            <div className="main-navigation__section">
              <Category
                categoryTitle={<Translate id="category" />}
                type="mobile"
                data={props.data.categories}
              />
            </div>
          )}

          {props.isMainMenu === true ? (
            <div className="main-navigation__section main-navigation__items mb-5">
              <ul>
                <li className="nav__item nav__item--secound">
                  <Link href={`/${curr}-${lang}`}>
                    <a>
                      <Item
                        content={<Translate id="homeItem" />}
                        isCategory={false}
                        icon={<HomeIcon className="nav__item-svg" />}
                      />
                    </a>
                  </Link>
                </li>
                <li className="nav__item">
                  <Link
                    href={`/${curr}-${lang}/search?type=${SEARCH_TYPE_DEAL}`}
                  >
                    <a>
                      <Item
                        content={<Translate id="dealsItem" />}
                        isCategory={false}
                        icon={<HeaderDealsIcon className="nav__item-svg" />}
                      />
                    </a>
                  </Link>
                </li>
                <li className="nav__item">
                  <Link href={`/${curr}-${lang}/tracking`}>
                    <a>
                      <Item
                        content={<Translate id="orderTrackingItem" />}
                        isCategory={false}
                        icon={<OrderTrackingIcon className="nav__item-svg" />}
                      />
                    </a>
                  </Link>
                </li>
                <li className="nav__item">
                  <Link href={`/${curr}-${lang}/hc`}>
                    <a>
                      <Item
                        content={<Translate id="helpCenterItem" />}
                        isCategory={false}
                        icon={<HelpIcon className="nav__item-svg" />}
                      />
                    </a>
                  </Link>
                </li>
                <li className="nav__item">
                  <Link href={`/${curr}-${lang}/vendors`}>
                    <a>
                      <Item
                        content={<Translate id="main-nav.storeList" />}
                        isCategory={false}
                        icon={<StoreIcon2 className="nav__item-svg" />}
                      />
                    </a>
                  </Link>
                </li>
                <li className="nav__item nav__item--last">
                  <Link href={`/${curr}-${lang}/becomeSeller`}>
                    <a>
                      <Item
                        content={<Translate id="sellWithUsItem" />}
                        isCategory={false}
                        icon={<StoreIcon className="nav__item-svg" />}
                      />
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
          ) : (
            <div className="main-navigation__section-filter main-navigation__section-filter--items">
              {props.filterSort ? (
                <div className="section-filter-sort">
                  {props.sortedBy.map((sort) => {
                    return (
                      <label key={sort.value} htmlFor={`rdo-${sort.value}`}>
                        <input
                          type="radio"
                          className="option-input radio"
                          name={sort.label}
                          value={sort.value}
                          id={`rdo-${sort.value}`}
                          checked={sort.value === sortedId}
                          onChange={handleSortChange}
                        />
                        {sort.label}
                      </label>
                    );
                  })}
                </div>
              ) : (
                <div>
                  {/* for provider filter menu */}
                  {props.providerMenu && (
                    <Dropdown
                      alwaysOpen={false}
                      headerClass="search__filter-header"
                      containerClass="search__list-container"
                      text={<Translate id="searchAside.FeaturedCategories" />}
                    >
                      <ul className="search__filter-list">
                        {data.childCategory &&
                          data.childCategory.map((cat) => {
                            return (
                              <li
                                key={cat.categoryId}
                                className="search__list-item"
                              >
                                <Dropdown
                                  headerClass="search__drop-header"
                                  text={cat.categoryTitle}
                                  haveLink
                                  link={`/${curr}-${lang}/${props.providerName}?id=${cat.categoryId}`}
                                >
                                  <ul className="search__drop-list">
                                    {cat.child &&
                                      cat.child.map((child2) => {
                                        return (
                                          <li
                                            key={child2.categoryId}
                                            className="search__list-item"
                                          >
                                            <Link
                                              href={`/${curr}-${lang}/${props.providerName}?id=${child2.categoryId}`}
                                            >
                                              <a
                                                onClick={() => {
                                                  disableBodyOverflow(false);
                                                }}
                                                className="search__list-link"
                                              >
                                                {child2.categoryTitle}
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
                      {/* <ul className="search__filter-list">
                      {props.searchContent.Fulfillment.items.map((item) => {
                        return (
                          <li className="search__list-item">
                            <CheckBoxList
                              data={[
                                <img
                                  alt=""
                                  className="search__checkList-img"
                                  src={props.rtl ? expAr : exp}
                                />,
                              ]}
                            />
                          </li>
                        );
                      })}
                    </ul> */}
                    </Dropdown>
                  )}
                  {props.searchMenu && data.childCategory && (
                    <Dropdown
                      alwaysOpen={true}
                      headerClass="search__filter-header"
                      containerClass="search__list-container"
                      text={data.childCategory.categoryTitle}
                    >
                      <ul className="search__filter-list">
                        {data.childCategory.child?.map((cat) => {
                          return (
                            <li
                              key={cat.categoryId}
                              className="search__list-item"
                            >
                              <Dropdown
                                headerClass="search__drop-header"
                                text={cat.categoryTitle}
                              >
                                <ul className="search__drop-list">
                                  {cat.child &&
                                    cat.child.map((child2) => {
                                      return (
                                        <li
                                          key={child2.categoryId}
                                          className="search__list-item"
                                        >
                                          <Link
                                            href={`/${props.curr}-${props.lang}/search?type=3&id=${child2.categoryId}`}
                                          >
                                            <a
                                              onClick={() => {
                                                disableBodyOverflow(false);
                                              }}
                                              className="search__list-link"
                                            >
                                              {child2.categoryTitle}
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
                  )}

                  <Dropdown
                    alwaysOpen={false}
                    headerClass="search__filter-header"
                    containerClass="search__list-container"
                    text={<Translate id="searchAside.NewArrivals" />}
                  >
                    <CheckBoxList
                      listClass="search__filter-list"
                      itemClass="search__list-item search__list-item--check"
                      data={props.arrivals}
                      dataName="title"
                      dataValue="value"
                      initialSelectIdArr={arrival}
                      singleSelect
                      onSelect={(arr) => {
                        setArrival(arr);
                      }}
                    />
                  </Dropdown>
                  {/* specs */}
                  {Object.keys(data.specs || {})?.map((key) => {
                    return (
                      <Dropdown
                        key={data.specs[key].specId}
                        alwaysOpen={false}
                        headerClass="search__filter-header"
                        containerClass="search__list-container"
                        text={data.specs[key].specTitle}
                      >
                        <CheckBoxList2
                          listClass="search__filter-list"
                          itemClass="search__list-item search__list-item--check"
                          data={data.specs[key].options}
                          dataName="optionTitle"
                          dataValue="optionId"
                          initialSelectIdArr={specSelected[key]}
                          singleSelect={!data.specs[key].isMultiSelectInFilter}
                          onSelect={(arr) => {
                            props.handleSpecSelect(
                              data.specs[key].specId,
                              arr,
                              true
                            );

                            setSpecSelected({
                              ...specSelected,
                              [data.specs[key].specId]: arr,
                            });
                          }}
                        />
                      </Dropdown>
                    );
                  })}

                  <Dropdown
                    alwaysOpen={false}
                    headerClass="search__filter-header"
                    containerClass="search__list-container"
                    text={<Translate id="searchAside.Price" />}
                  >
                    <RangeBox
                      show={false}
                      min={0}
                      max={data.maxPrice}
                      onChange={(value) => {
                        setRange(value);
                      }}
                      setText={<Translate id="setPrice" />}
                    />
                  </Dropdown>

                  {/*  Brand */}
                  <Dropdown
                    alwaysOpen={false}
                    headerClass="search__filter-header"
                    containerClass="search__list-container"
                    text={<Translate id="searchAside.Brand" />}
                  >
                    <Translate>
                      {({ translate }) => {
                        return (
                          <BrandsCheckList
                            catId={props.filters?.id}
                            itemClass="search__list-item search__list-item--check"
                            listClass="search__filter-list"
                            placeholder={translate("searchplaceholder")}
                            selecteIds={brands.ids}
                            onSelect={(brand, checked) => {
                              handleBrandClick(brand, checked);
                              // this.props.brandsChangedAction(brand, checked);
                            }}
                          />
                          // <CheckBoxList2
                          //   search
                          //   textOpen={<Translate id="seemore" />}
                          //   textClose="close"
                          //   seeMore
                          //   maxItemShow={2}
                          //   placeholder={translate("searchplaceholder")}
                          //   data={data.brands}
                          //   dataName="brandTitle"
                          //   dataValue="brandId"
                          //   initialSelectIdArr={brands}
                          //   listClass="search__filter-list"
                          //   itemClass="search__list-item search__list-item--check"
                          //   onSelect={(arr) => {
                          //     setBrands(arr);
                          //   }}
                          // />
                        );
                      }}
                    </Translate>
                  </Dropdown>
                  {/* just exist */}
                  <div className={`dropdown search__list-container`}>
                    <div
                      href="#"
                      className={`dropdown__link search__filter-header single-lined`}
                    >
                      <span>
                        <Translate id="just-exist" />
                      </span>
                      <Switch
                        onChange={(checked) => {
                          setJustExist(checked);
                        }}
                        // width={46}
                        // height={22}
                        uncheckedIcon=""
                        checkedIcon=""
                        checked={justExist}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
      {!props.isMainMenu ? (
        <div className="section-filter-button">
          {props.filterSort ? (
            <Button
              onClick={handleSortClick}
              radius={false}
              value={<Translate id="sort" />}
            />
          ) : (
            <Button
              onClick={handleFilterClick}
              radius={false}
              value={<Translate id="filter3" />}
            />
          )}
        </div>
      ) : null}
    </div>
  );
};

export default MobileMenu;
