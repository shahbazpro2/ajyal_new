import React from "react";
import { varitySort } from "../../GoodDetailAlgo";
import border from "./../../../../../../assets/icons/border.png";
import classnames from "classnames";
import { selectLang } from "../../../../../../appConfigSlice";
import { connect } from "react-redux";
import { isAr } from "../../../../../../lib/helpers";
import { withRouter } from "next/router";

class VariSelect extends React.Component {
  constructor(props) {
    super(props);

    this.textRef = React.createRef();

    const {
      type,
      data,
      varietyExistencePossibility,
      handleVariSelect,
      handleNonMatchedVariSelect,
    } = this.props;

    this.type = type;
    this.data = data;
    this.varietyExistencePossibility = varietyExistencePossibility;

    this.handleVariSelect = handleVariSelect;
    this.handleNonMatchedVariSelect = handleNonMatchedVariSelect;
    this.findedText = "";

    this.goodId = this.props.router.query?.good[0];
  }

  isAvailable = (id) => {
    const newArray = varitySort([
      ...this.selectedArrayWithoutMe,
      id,
    ]).toString();

    // console.log(this.varietyExistencePossibility, "==");
    // console.log(newArray, this.varietyExistencePossibility[newArray]);
    if (this.varietyExistencePossibility[newArray] === 0) return true;
    if (this.varietyExistencePossibility[newArray]) return true;
    return false;
  };

  handleClick = (id) => {
    if (this.isAvailable(id)) {
      const newSelectedObj = { ...this.variSelected, [this.type]: id };
      const newArray = varitySort([
        ...this.selectedArrayWithoutMe,
        id,
      ]).toString();
      this.handleVariSelect(
        newSelectedObj,
        this.varietyExistencePossibility[newArray]
      );
    } else {
      for (let key in this.varietyExistencePossibility) {
        if (key.includes(id.toString())) {
          this.handleNonMatchedVariSelect(
            this.varietyExistencePossibility[key]
          );
          break;
        }
      }
    }
  };

  handleMouseEnter(text) {
    this.textRef.current.innerHTML = text;
  }

  componentDidMount() {
    this.textRef.current.innerHTML = this.findedText;
  }

  componentDidUpdate() {
    this.textRef.current.innerHTML = this.findedText;
  }

  render() {
    const { variSelected } = this.props;
    // console.log(variSelected)
    this.variSelected = this.props.variSelected;
    this.whichSelecteId = variSelected[this.type];
    this.selectedArrayWithoutMe = [];
    for (let key in variSelected) {
      if (key !== this.type)
        this.selectedArrayWithoutMe.push(variSelected[key]);
    }

    return (
      <div className="itemDetail__property-item-cnt">
        <div>
          <span className="itemDetail__small-text">{this.type}:</span>
          <span ref={this.textRef} className="itemDetail__small-value"></span>
        </div>
        <ul className="itemDetail__property-list">
          {this.data?.map((item) => {
            const isAva = this.isAvailable(item.fkVariationParameterValueId);
            const IamSelected =
              this.whichSelecteId === item.fkVariationParameterValueId;
            if (IamSelected) this.findedText = item.valueTitle;
            return (
              <li
                className={classnames(
                  "itemDetail__property-item",
                  "itemDetail__property-item--padding",
                  {
                    "itemDetail__property-item--active": IamSelected,
                    "itemDetail__property-item--inactive":
                      !isAva && !IamSelected,
                    "itemDetail__property-item--border": true,
                  }
                )}
                onMouseEnter={() => {
                  this.handleMouseEnter(item.valueTitle);
                }}
                onMouseLeave={() => {
                  this.handleMouseEnter(this.findedText);
                }}
                onClick={() => {
                  this.handleClick(item.fkVariationParameterValueId);
                }}
              >
                {/* {!isAva && (
                  <img
                    alt="border"
                    className="itemDetail__border"
                    src={border}
                  />
                )} */}
                {item.imageUrl ? (
                  <img
                    className="itemDetail__property-img"
                    src={`${process.env.NEXT_PUBLIC_Goods_PREFIX}/${this.goodId}/GoodsVariety/${item.imageUrl}`}
                    alt={item.valueTitle}
                    title={item.valueTitle}
                  />
                ) : (
                  item.valueTitle
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    lang: selectLang(state),
  };
};

export default connect(mapStateToProps)(withRouter(VariSelect));
