import React from "react";
// import "./Filter.scss";
import { ReactComponent as CloseIcon } from "./../../../../../../assets/icons/close.svg";
// import "./Filter-rtl.scss";

export default class extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="filter">
        <span className="filter__name">{this.props.name}</span>
        <span className="filter__value">{this.props.value}</span>
        <CloseIcon className="filter__icon" onClick={this.props.onClose} />
      </div>
    );
  }
}
