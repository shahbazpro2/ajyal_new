import React from "react";
import InputRange from "react-input-range";
// import "./RangeBox.scss";
// import "./RangeBox-rtl.scss";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: { min: this.props.min, max: this.props.max },
    };

  }

  handleRangeBoxChange = (value) => {
    this.setState({ value });
    this.props.onChange && this.props.onChange(value);
  };

  render() {
    return (
      <div className="rangeBox">
        {/* <div className="rangeBox__range">
          <InputRange
            maxValue={this.props.max}
            minValue={0}
            step={10}
            value={this.state.value}
            onChange={this.handleRangeBoxChange}
            InputRangeClassNames={{ sliderContainer: "hellloooo" }}
          />
        </div> */}
        {this.props.show ? (
          <div className="rangeBox__input-container">
            <input
              className="rangeBox__input"
              type="number"
              minValue={0}
              value={this.state.value.min}
              onChange={(event) => {
                const value = event.target.value;
                this.setState((prevstate) => {
                  return {
                    value: {
                      min: value,
                      max: prevstate.value.max,
                    },
                  };
                });
              }}
            />
            <span className="rangeBox__to">to</span>
            <input
              className="rangeBox__input"
              type="number"
              maxValue={this.props.max}
              value={this.state.value.max}
              onChange={(event) => {
                const value = event.target.value;
                this.setState((state) => {
                  return {
                    value: { min: state.value.min, max: value },
                  };
                });
              }}
            />
            <a
              className="rangeBox__set"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                this.props.onSet(this.state.value);
              }}
            >
              {this.props.setText}
            </a>
          </div>
        ) : null}
      </div>
    );
  }
}
