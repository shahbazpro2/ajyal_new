import Link from "next/link";
import React from "react";
import { SlideDown } from "react-slidedown";
import "react-slidedown/lib/slidedown.css";
// import "./Dropdown.scss";
// import "./Dropdown-rtl.scss";
import { ReactComponent as LinearArrow } from "./../../../assets/icons/linear-arrow.svg";

export default class extends React.Component {
  constructor(props) {
    super(props);

    if (this.props.alwaysOpen) this.alwaysOpen = true;
    else this.alwaysOpen = false;
    this.firstOpen = this.props.firstOpen;
    this.state = {
      open:  this.firstOpen == true ? true : this.alwaysOpen,
    };
    //this.arrowRef = React.createRef();
  }

  handleClick = (e) => {
    e.preventDefault();
    if (!this.alwaysOpen) this.setState((state) => ({ open: !state.open }));
    // this.arrowRef.current.classList.toggle("dropdown__arrow--open");
  };

  render() {
    return (
      <div className={`dropdown ${this.props.containerClass}`}>
        <div
          href="#"
          className={`dropdown__link ${this.props.headerClass}`}
          onClick={this.handleClick}
        >
          {this.props.haveLink ? (
            <Link href={this.props.link}>
              <a>
                <span style={{ color: "#4d5a6c" }} className="dropdown__text">
                  {this.props.text}
                </span>
              </a>
            </Link>
          ) : (
            <span className="dropdown__text">{this.props.text}</span>
          )}

          {!this.props.noDropIcon && (
            <LinearArrow
              className={`dropdown__arrow ${
                this.state.open
                  ? "dropdown__arrow--open"
                  : "dropdown__arrow--close"
              }`}
            />
          )}
        </div>
        {this.alwaysOpen ? (
          <div>{this.props.children}</div>
        ) : (
          <SlideDown>{this.state.open && this.props.children}</SlideDown>
        )}
      </div>
    );
  }
}
