import React, { useEffect, useRef, useState } from "react";
import { Translate } from "react-localize-redux";
import { client_categoryBrands } from "../../../../../../lib/api/client/clientCommon";
import { Loading } from "../../../../../common";
import SearchIcon from "./../../../../../../assets/icons/search-gray.svg";
// import "./CheckBoxList.scss";
// import "./CheckBoxList-rtl.scss";
let SearchTimer = null;
export default ({
  catId,
  itemClass,
  listClass,
  placeholder,
  pageSize = 10,
  onSelect = () => {},
  selecteIds = [],
}) => {
  const [brands, setBrands] = useState([]);
  const [brandsLoading, setBrandsLoading] = useState(false);
  const [seeLoading, setSeeLoading] = useState(false);

  const query = React.useMemo(() => {
    return {
      pageSize: pageSize,
      pageNumber: 1,
      search: "",
      catId,
      BrandIds: selecteIds,
    };
  }, [catId]);

  query.BrandIds = selecteIds;

  const resCount = useRef(200);

  const getBrands = () => {
    setBrandsLoading(true);
    client_categoryBrands(query)
      .then((res) => {
        resCount.current = res.result.length;
        setBrands(res.result);
        setBrandsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setBrands([]);
        setBrandsLoading(false);
      });
  };

  useEffect(() => {
    getBrands();
  }, [catId]);

  const handleSeeClick = (e) => {
    e.preventDefault();
    if (seeLoading) return;

    setSeeLoading(true);

    query.pageNumber = query.pageNumber + 1;

    client_categoryBrands(query)
      .then((res) => {
        resCount.current = res.result.length;
        setBrands([...brands, ...res.result]);
      })
      .catch((err) => {
        console.log(err);
        setBrands([]);
      })
      .finally(() => {
        setSeeLoading(false);
      });
  };

  const handleSearchChange = (e) => {
    const q = e.target.value;

    query.search = q;
    query.pageNumber = 1;

    if (SearchTimer) {
      clearTimeout(SearchTimer);
      SearchTimer = null;
    }

    const callback = async (query) => {
      setBrandsLoading(true);
      try {
        const res = await client_categoryBrands(query);
        if (res.result) {
          resCount.current = res.result.length;
          setBrands(res.result);
        }
      } catch (er) {
        setBrands([]);
      } finally {
        setBrandsLoading(false);
      }
    };

    SearchTimer = setTimeout(callback.bind(null, query), 500);
  };

  const handleCheckChange = (e) => {
    onSelect({ value: e.target.name, id: e.target.value }, e.target.checked);
  };

  return (
    <>
      <div className="checklist__search">
        <SearchIcon className="checklist__search-input-icon" />
        <input
          onChange={handleSearchChange}
          type="text"
          // value={searchText}
          className="checklist__search-input"
          placeholder={placeholder}
        />
      </div>
      <ul className={`checklist ${listClass}`}>
        {brandsLoading ? (
          <Loading width="20px" height="20px" />
        ) : (
          brands.map((brand, index) => {
            return (
              <label key={index} className="checklist__label">
                <li
                  className={`${itemClass} d-flex justify-content-between align-items-center`}
                >
                  <div>
                    <input
                      className="checklist__check"
                      type="checkbox"
                      name={brand.brandTitle}
                      value={brand.brandId}
                      checked={
                        selecteIds.includes(brand.brandId) ? true : false
                      }
                      onChange={handleCheckChange}
                    />
                    <span>{brand.brandTitle}</span>
                  </div>
                  <span>({brand.goodsCount})</span>
                </li>
              </label>
            );
          })
        )}
      </ul>
      {resCount.current >= pageSize && !brandsLoading && (
        <>
          {seeLoading ? (
            <Loading width="20px" height="20px" />
          ) : (
            <a href="" onClick={handleSeeClick} className="seemore__link">
              <Translate id="seemore" />
            </a>
          )}
        </>
      )}
    </>
  );
};
