import React from "react";
// import "./MultiAddInput.scss";
import { ReactComponent as CloseIcon } from "./../../../assets/icons/close-naviblue.svg";
import { ReactComponent as AddIcon } from "./../../../assets/icons/add-icon.svg";

let id = 0;
export default class extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      items: [],
      inputText: "",
    };
  }

  handleCloseClick = (itemIndex, e) => {
    // const newItems = this.state.items.filter((item) => {
    //   return item.id !== itemId;
    // });
    // this.setState({ items: [...newItems] });
    this.props.handleCloseClick(itemIndex);
  };

  handleAddClick = (e) => {
    if (!this.state.inputText) return;
    // this.setState({
    //   items: [
    //     ...this.state.items,
    //     {
    //       id: id,
    //       text: this.state.inputText,
    //       item: (
    //         <li
    //           className="multiaddinput__list-item"
    //           style={{
    //             backgroundColor: this.props.itemBgColor,
    //             color: this.props.itemColor,
    //           }}
    //           key={id}
    //         >
    //           {this.state.inputText}
    //           <CloseIcon
    //             onClick={this.handleCloseClick.bind(this, id)}
    //             className="multiaddinput__close-icon"
    //           />
    //         </li>
    //       ),
    //     },
    //   ],
    // });
    this.props.handleAddClick(this.state.inputText);
    id++;
    this.setState({ inputText: "" });
    this.inputRef.current.focus();
  };

  render() {
    return (
      <div className="multiaddinput">
        <div className="multiaddinput__input-cnt">
          <input
            id={this.props.name}
            ref={this.inputRef}
            name={this.props.name}
            placeholder={this.props.placeholder}
            type="text"
            className="gray__input multiaddinput__input"
            value={this.state.inputText}
            onChange={(e) => {
              this.setState({ inputText: e.target.value });
            }}
          />
          <span
            onClick={this.handleAddClick}
            className="multiaddinput__icon-cnt"
          >
            <AddIcon className="multiaddinput__input-icon" />
          </span>
        </div>
        <ul className="multiaddinput__list">
          {this.props.items?.map((item, index) => {
            return (
              <li
                className="multiaddinput__list-item"
                style={{
                  backgroundColor: this.props.itemBgColor,
                  color: this.props.itemColor,
                }}
                key={index}
              >
                {item.pointText}
                {this.props.disabled ?
                  null
                  :
                  <CloseIcon
                    onClick={this.handleCloseClick.bind(this, index)}
                    className="multiaddinput__close-icon"
                  />}

              </li>
            )
          })}
        </ul>
      </div>
    );
  }
}
