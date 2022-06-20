import React, { useCallback, useEffect, useState } from "react";
import SearchIcon from "./../../../../../../assets/icons/search-gray.svg";
// import "./CheckBoxList.scss";
// import "./CheckBoxList-rtl.scss";

export default ({
  data,
  itemClass,
  listClass,
  search,
  placeholder,
  dataName,
  dataValue,
  singleSelect = false,
  onSelect = () => {},
  initialSelectIdArr = [],
  seeMore,
  maxItemShow,
  textOpen,
  textClose,
}) => {
  const [searchText, setSearchText] = useState("");
  const [checkedIds, setCheckedIds] = useState({});
  const [seemoreFlag, setSeemoreFlag] = useState(false);

  useEffect(() => {
    const gen = {};
    for (let id of initialSelectIdArr) {
      if (data[id]) {
        gen[id] = {
          value: data[id][dataValue],
          checked: true,
        };
      }
    }
    setCheckedIds(gen);

    return () => {};
  }, [initialSelectIdArr.length]);

  const handleCheckChange = (event) => {
    if (singleSelect) {
      const newState = {
        [event.target.value]: {
          value: event.target.value,
          checked: event.target.checked,
        },
      };
      setCheckedIds(newState);
      createSelectedArrayValue(newState);
    } else {
      const newState = {
        ...checkedIds,
        [event.target.value]: {
          value: event.target.value,
          checked: event.target.checked,
        },
      };
      setCheckedIds(newState);
      createSelectedArrayValue(newState);
    }
  };

  const createSelectedArrayValue = (checkedList) => {
    const arr = [];
    for (let key in checkedList) {
      if (checkedList[key].checked) arr.push(parseInt(key));
    }

    onSelect(arr);
  };

  //const placeholder = <Placeholder />;
  const handleChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleClick = (e) => {
    e.preventDefault();
    setSeemoreFlag(!seemoreFlag);
  };

  if (!data) return null;
  const arrayData = Object.keys(data);

  let count = arrayData.length;

  if (seeMore) {
    count = maxItemShow;

    if (searchText) {
      count = arrayData.length;
    }

    if (seemoreFlag) {
      count = arrayData.length;
    }
  }

  return (
    <>
      {search && (
        <div className="checklist__search">
          <SearchIcon className="checklist__search-input-icon" />
          <input
            onChange={handleChange}
            type="text"
            value={searchText}
            className="checklist__search-input"
            placeholder={placeholder}
          />
        </div>
      )}
      <ul className={`checklist ${listClass}`}>
        {arrayData.slice(0, count).map((key, index) => {
          return (
            ((searchText && data[key][dataName].includes(searchText)) ||
              !searchText) && (
              <label key={index} className="checklist__label">
                <li className={`${itemClass}`}>
                  <input
                    className="checklist__check"
                    type="checkbox"
                    name={data[key][dataName]}
                    value={data[key][dataValue]}
                    checked={
                      checkedIds[data[key][dataValue]]
                        ? checkedIds[data[key][dataValue]].checked
                        : false
                    }
                    onChange={handleCheckChange}
                  />
                  <span>{data[key][dataName]}</span>
                </li>
              </label>
            )
          );
        })}
      </ul>
      {seeMore && !searchText && (
        <a href="" onClick={handleClick} className="seemore__link">
          {!seemoreFlag ? textOpen : textClose}
        </a>
      )}
    </>
  );
};
