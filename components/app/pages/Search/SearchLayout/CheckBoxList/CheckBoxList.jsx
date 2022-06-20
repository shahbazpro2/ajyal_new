import React, { useEffect, useState } from "react";
import SearchIcon from "./../../../../../../assets/icons/search-gray.svg";
// import "./CheckBoxList.scss";
// import "./CheckBoxList-rtl.scss";

export default ({
  data = [],
  itemClass,
  listClass,
  search,
  placeholder,
  dataName,
  dataValue,
  singleSelect = false,
  onSelect = () => {},
  initialSelectIdArr = [],
}) => {
  const [searchText, setSearchText] = useState("");
  const [checkedIds, setCheckedIds] = useState({});

  useEffect(() => {
    const gen = {};

    for (let id of initialSelectIdArr) {
      gen[id] = {
        value: data[dataValue],
        checked: true,
      };
    }
    setCheckedIds(gen);
  }, [initialSelectIdArr[0]]);

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
      if (checkedList[key].checked) arr.push(key);
    }

    onSelect(arr);
  };

  //const placeholder = <Placeholder />;
  const handleChange = (e) => {
    setSearchText(e.target.value);
  };

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
        {data.map((item, index) => {
          return (
            ((searchText && item.includes(searchText)) || !searchText) && (
              <label key={index} className="checklist__label">
                <li className={`${itemClass}`}>
                  <input
                    className="checklist__check"
                    type="checkbox"
                    name={item[dataName]}
                    value={item[dataValue]}
                    checked={
                      checkedIds[item[dataValue]]
                        ? checkedIds[item[dataValue]].checked
                        : false
                    }
                    onChange={handleCheckChange}
                  />
                  <span>{item[dataName]}</span>
                </li>
              </label>
            )
          );
        })}
      </ul>
    </>
  );
};
