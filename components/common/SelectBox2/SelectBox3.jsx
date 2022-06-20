import React from "react";
import circleIcon from "./../../../assets/icons/img-radio-button-off.svg";
import circleFillIcon from "./../../../assets/icons/img-radio-button-on.svg";
// import "./SelectBox2.scss";
import classnames from "classnames";
const SelectBoxContext = React.createContext();

export default class SelectBox3 extends React.Component {
  constructor(props) {
    super(props);
    this.multiSelect = this.props.multiSelect;

    this.state = {
      handleChange: this.handleChange,
      selectedItems: this.props.selectedItems ? this.props.selectedItems : [],
    };
  }

  handleChange = (selectedItem, isSelected) => {
    let newitems;
    if (this.props.multiSelect) {
      if (!isSelected) {
        newitems = this.state.selectedItems.filter((item) => {
          return item.name !== selectedItem.name;
        });
      } else {
        newitems = [...this.state.selectedItems, selectedItem];
      }
    } else {
      if (!isSelected) {
        newitems = [];
      } else {
        newitems = [selectedItem];
      }
    }
    this.setState({
      selectedItems: newitems,
    });

    this.props.onChange && this.props.onChange(newitems);
  };

  render() {
    return (
      <SelectBoxContext.Provider value={this.state}>
        <div
          className={`SelectBox2 ${
            this.props.className ? this.props.className : ""
          }`}
        >
          {this.props.children}
        </div>
      </SelectBoxContext.Provider>
    );
  }
}

SelectBox3.SelectItem = class extends (
  React.Component
) {
  static contextType = SelectBoxContext;
  constructor(props) {
    super(props);
    this.selected = false;
    this.state = {
      selected: false,
    };
    // this.justCircleClick = this.props.justCircleClick;
  }
  checkSelected = () => {
    for (let item of this.context.selectedItems) {
      if (item.name === this.props.name) {
        this.selected = true;
        return;
      }
    }
    this.selected = false;
  };

  handleClick = () => {
    this.selected = !this.selected;

    this.context.handleChange(
      {
        value: this.props.value,
        name: this.props.name,
      },
      this.selected
    );
  };

  render() {
    this.checkSelected();
    return (
      <>
        <div
          className={classnames("SelectBox2__item", {
            "SelectBox2__item--circleClick": this.props.justCircleClick,
          })}
          onClick={() => {
            if (!this.props.justCircleClick) {
              this.handleClick();
            }
          }}
        >
          <img
            className="SelectBox2__img"
            alt="select item"
            src={this.selected ? circleFillIcon : circleIcon}
            onClick={() => {
              if (this.props.justCircleClick) {
                this.handleClick();
              }
            }}
          />
          <div className="SelectBox2__content">{this.props.children}</div>
        </div>
      </>
    );
  }
};
