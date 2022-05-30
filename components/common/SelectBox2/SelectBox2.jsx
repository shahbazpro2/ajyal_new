import React from "react";
import imgcircleIcon from "./../../../assets/icons/img-radio-button-off.svg";
import imgcircleFillIcon from "./../../../assets/icons/img-radio-button-on.svg";
// import "./SelectBox2.scss";

export default class SelectBox2 extends React.Component {
  constructor(props) {
    super(props);
    this.multiSelect = this.props.multiSelect;

    if (this.multiSelect)
      this.state = {
        selectedItems: [],
      };
    else
      this.state = {
        selectedItem: {
          value: this.props.selectedItemValue,
          name: this.props.selectedItemName,
        },
      };
  }

  updateChildren = () => {
    const children2 = React.Children.toArray(this.props.children);
    this.newChildren = children2.map((child) => {
      if (child.type === SelectBox2.SelectItem) {
        if (this.multiSelect) {
          for (let item of this.state.selectedItems) {
            if (child.props.name === item.name)
              return React.cloneElement(child, {
                handleChange: this.handleChange,
                selected: true,
              });
          }
          return React.cloneElement(child, {
            handleChange: this.handleChange,
          });
        } else if (child.props.name === this.state.selectedItem.name) {
          return React.cloneElement(child, {
            handleChange: this.handleChange,
            selected: true,
          });
        } else
          return React.cloneElement(child, { handleChange: this.handleChange });
      } else {
        return child;
      }
    });
  };

  handleParentChange = () => {
    if (this.props.onChange) {
      if (this.multiSelect) this.props.onChange(this.state.selectedItems);
      else this.props.onChange(this.state.selectedItem);
    }
  };

  handleChange = (selectedItem, isSelected) => {
    if (this.multiSelect) {
      if (isSelected) {
        const newitems = this.state.selectedItems.filter((item) => {
          return item.name !== selectedItem.name;
        });

        this.setState(
          {
            selectedItems: newitems,
          },
          this.handleParentChange
        );
      } else
        this.setState(
          {
            selectedItems: [
              ...this.state.selectedItems,
              {
                value: selectedItem.value,
                name: selectedItem.name,
              },
            ],
          },
          this.handleParentChange
        );
    } else {
      if (isSelected) {
        this.setState(
          {
            selectedItem: {
              value: "",
              name: "",
            },
          },
          this.handleParentChange
        );
      } else
        this.setState(
          {
            selectedItem: {
              value: selectedItem.value,
              name: selectedItem.name,
            },
          },
          this.handleParentChange
        );
    }
  };

  render() {
    this.updateChildren();
    return (
      <div
        className={`SelectBox2 ${
          this.props.className ? this.props.className : ""
        }`}
      >
        {this.newChildren}
      </div>
    );
  }
}

SelectBox2.SelectItem = class extends React.Component {
  componentDidMount() {
    if (
      this.props.selectedId != 0 &&
      this.props.selectedId == this.props.value
    ) {
      this.handleClick();
    }
  }

  handleClick = () => {
    debugger;
    this.props.handleSelect(this.props.value);
    this.props.handleChange(
      {
        value: this.props.value,
        name: this.props.name,
      },
      this.props.selected
    );
  };

  render() {
    return (
      <>
        <div className="SelectBox2__item" onClick={this.handleClick}>
          <img
            className="SelectBox2__img"
            alt="select item"
            src={this.props.selected ? imgcircleFillIcon : imgcircleIcon}
          />
          <div className="SelectBox2__content">{this.props.children}</div>
        </div>
      </>
    );
  }
};
