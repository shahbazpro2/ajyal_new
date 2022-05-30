import Link from "next/link";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurr, selectLang } from "../../../../../appConfigSlice";
import { SEARCH_TYPE_SEARCH } from "../../../../../lib/querys";
import SearchIcon from "../../../../../assets/icons/search-gray.svg";
import { List, WindowScroller } from "react-virtualized";
import { client_categoryBrands } from "../../../../../lib/api/client/clientCommon";
import { brandsPageSize } from "../Categories";
import { Translate } from "react-localize-redux";
import { Loading } from "../../../../common";

let SearchTimer = null;

const brandQuery = {
  pageSize: null,
  pageNumber: 1,
  catId: null,
  search: "",
};

let resCount = 0;

const Brands = ({ brands, catId2 }) => {
  const lang = useSelector(selectLang);
  const curr = useSelector(selectCurr);
  // const [search, setSearch] = useState("");
  const [brandsList, setbrandsList] = useState(brands);
  const [loading, setLoading] = useState(false);
  const [seeloading, setSeeLoading] = useState(false);

  brandQuery.catId = catId2;
  brandQuery.pageSize = brandsPageSize;

  // const rowRenderer = ({
  //   index, // Index of row
  //   isScrolling, // The List is currently being scrolled
  //   isVisible, // This row is visible within the List (eg it is not an overscanned row)
  //   key, // Unique key within array of rendered rows
  //   parent, // Reference to the parent List (instance)
  //   style, // Style object to be applied to row (to position it);
  //   // This must be passed through to the rendered row element.
  // }) => {
  //   // if (search && brands[index].brandTitle.toLowerCase().includes(search)) {
  //   return (
  //     <li key={brandsList[index].brandId} style={style}>
  //       <Link
  //         href={`/${curr}-${lang}/search?brandId=${brandsList[index].brandId}&type=${SEARCH_TYPE_SEARCH}`}
  //       >
  //         <a className="categories__list-link">
  //           {brandsList[index].brandTitle}
  //         </a>
  //       </Link>
  //     </li>
  //   );
  //   // }
  // };

  const handleSearch = async (e) => {
    const q = e.target.value;

    brandQuery.search = q;
    brandQuery.pageNumber = 1;

    if (SearchTimer) {
      clearTimeout(SearchTimer);
      SearchTimer = null;
    }

    const callback = async (brandQuery) => {
      setLoading(true);
      try {
        const res = await client_categoryBrands(brandQuery);
        if (res.result) {
          resCount = res.result.length;
          setbrandsList(res.result);
          setLoading(false);
        }
      } catch (er) {
        setbrandsList([]);
        setLoading(false);
      }
    };

    SearchTimer = setTimeout(callback.bind(null, brandQuery), 500);
  };

  const handleSeeMoreClick = async (e) => {
    e.preventDefault();
    if (loading) return;

    setSeeLoading(true);

    brandQuery.pageNumber = brandQuery.pageNumber + 1;

    try {
      const res = await client_categoryBrands(brandQuery);
      if (res.result) {
        resCount = res.result.length;
        setbrandsList([...brandsList, ...res.result]);
        setSeeLoading(false);
      }
    } catch (err) {
      console.log(err);
      setSeeLoading(false);
    }
  };

  return (
    <>
      <div className="checklist__search">
        <SearchIcon className="checklist__search-input-icon" />
        <input
          onChange={handleSearch}
          type="text"
          // value={search}
          className="checklist__search-input"
          placeholder={"search"}
        />
      </div>
      {loading ? (
        <Loading width="20px" height="20px" />
      ) : (
        <ul className="categories__list">
          {brandsList.map((brand) => {
            return (
              <li
                key={brand.brandId}
                className="categories__list-item d-flex justify-content-between align-items-center"
              >
                <Link
                  href={`/${curr}-${lang}/search?brandId=${brand.brandId}&type=${SEARCH_TYPE_SEARCH}`}
                >
                  <a className="categories__list-link">{brand.brandTitle}</a>
                </Link>
                <span>({brand.goodsCount})</span>
              </li>
            );
          })}
        </ul>
      )}
      {/* <ul className="categories__list brandsScroll">
        <List
          height={400}
          rowCount={brandsList.length}
          rowHeight={35}
          rowRenderer={rowRenderer}
          width={200}
          overscanRowCount={3}
        />
      </ul> */}
      {resCount >= brandsPageSize && !loading && (
        <>
          {seeloading ? (
            <Loading width="20px" height="20px" />
          ) : (
            <a
              href=""
              onClick={handleSeeMoreClick}
              className="seemore__link-brands"
            >
              <Translate id="seemore" />
            </a>
          )}
        </>
      )}
    </>
  );
};

export default Brands;
