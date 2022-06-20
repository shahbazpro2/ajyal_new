import React from "react";
import { Translate } from "react-localize-redux";
import TickIcon from "./../../../../../assets/icons/createshop/tick.svg";
import {
  client_getShopEndMsg,
} from "./../../../../../lib/api/client/clientShop";
import { Loading } from "../../../../common";

class End extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      msg: "",
      showLoader: false,
    };
  }

  async componentDidMount() {
    this.setState({ showLoader: true });
    try {
      const result = await client_getShopEndMsg();
      this.setState({
        msg: result.result.description,
        showLoader: false,
      });
    } catch (error) {
      
    }


  }


  render() {
    return (
      <div className="createshop__transition-cnt">
        <div className="mt-5">
          <TickIcon className="mx-auto d-block createshop__end-icon" />
          {this.state.showLoader ? (
          <Loading type="gray" width="11%" height="70%" />
        ) : (
          <div className="ql-editor mt-4"
          dangerouslySetInnerHTML={{ __html: this.state.msg }}
        ></div>
        )}       
        
           {/* <h3 className="createshop__header-text mt-5">
            <Translate id="end.thanks" />
          </h3>
          <div className="createshop__form createshop__form--end">
            <p className="createshop__text1rem text-align-center-ltr">
              <Translate id="end.msg1" />
            </p>
            <p className="mt-5 createshop__text1rem text-align-center-ltr">
              <Translate id="end.msg2" />
            </p>
            <p className="createshop__text1rem text-align-center-ltr">
              <Translate id="end.msg3" />
            </p>
          </div> */}
        </div>
        <div className="text-align-center-ltr mb-0">
          <div className="auth__btn">
            <a
              href="https://panel.ajyal.bh"
              target="_blank"
              //   onClick={this.handleClick}
              className="primary__link"
              style={{ fontSize: "15px" }}
            >
              <Translate id="end.back" />
            </a>
          </div>          
          <div className="auth__btn mt-3">
          <a
              href="https://ajyal.bh"
              target="_blank"
              //   onClick={this.handleClick}
              className="primary__link"
              style={{ fontSize: "15px" }}
            >
              <Translate id="end.backToHome" />
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default End;
