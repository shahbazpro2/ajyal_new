import React from "react";
// import "./Order.scss";
// import "./Order-rtl.scss";
// import orderTranslations from "./../../../../translations/order-translations.json";
/// for UI development
// import data from "../../../data/data2.json";
// import data2 from "../../../data/data.jsx";
import { connect } from "react-redux";
import {
  SHIPPING,
  PAYMENT,
  MAXSTEP,
  COMPLETE_AND_NEXT,
  NEXT,
  PREV,
  ORDERPLACED,
} from "./OrderConstants";
import { orderContext } from "./OrderContext";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { v4 } from "uuid";
import {
  ShippingAddress,
  OrderNav,
  Payment,
  MobileOrderNav,
} from "./OrderLayouts";
import OrderPlaced from "./OrderLayouts/OrderPlaced/OrderPlaced";
import { DesktopsAndBigger, Desktops } from "../../../../Responsive";
import { selectLang } from "../../../../appConfigSlice";
import { ToastContainer, toast } from "react-toastify";
import { isRtl } from "../../../../lib/isRtl";
import { getToastConfig } from "../../../../lib/toast";
import { withRouter } from "next/router";

import { selectCart} from "../CartAndWishlist/cartAndWishlistSlice";
class Order extends React.Component {
  constructor(props) {
    super(props);

    //this code is for Development purpose

    this.lang = this.props.lang;

    // this.content = data[this.lang].search;
    // this.content2 = data2[this.lang].goodsSliderComponent;

    ///////////

    this.randId = v4();

    const formData = {
      [SHIPPING]: {},
      [PAYMENT]: {},
    };

    const token = this.props.router.query.token ? true : false;
    const payment = this.props.router.query.to == "pay" ? true : (this.props.router.query.to == "downloadable" ? true : false) ;

    let step = SHIPPING;
    if (token) {
      step = ORDERPLACED;
    } else if (payment) {
      step = PAYMENT;
    }

    const orderState = {
      [SHIPPING]: {
        complete: payment ? true : false,
        active: payment ? false : true,
        id: v4(),
      },
      [PAYMENT]: { complete: false, active: payment ? true : false, id: v4() },
      [ORDERPLACED]: { complete: false, active: false, id: v4() },
    };

    this.state = {
      step: step,
      orderState,
      handleStep: this.handleStep,
    };
  }

  handleStep = (type) => {
    let step, newFormState;
    const curstep = this.state.step;

    if (type === COMPLETE_AND_NEXT) {
      newFormState = {
        ...this.state.orderState,
        [curstep]: {
          ...this.state.orderState[curstep],
          active: false,
          complete: true,
        },
      };
      type = NEXT;
    } else {
      newFormState = {
        ...this.state.orderState,
        [curstep]: {
          ...this.state.orderState[curstep],
          active: false,
        },
      };
    }

    switch (type) {
      case NEXT:
        step = curstep >= MAXSTEP ? MAXSTEP : curstep + 1;
        break;
      case PREV:
        step = curstep <= 1 ? 1 : curstep - 1;
        break;
      default:
        step = type;
        break;
    }

    newFormState[step].active = true;

    this.setState({
      step,
      orderState: newFormState,
    });
  };
  componentDidMount() {
    //   setTimeout(() => {
    //     this.setState(
    //       {
    //         step: PAYMENT,
    //       },
    //       () => {
    //         setTimeout(() => {
    //           this.setState({
    //             step: ORDERPLACED,
    //           });
    //         }, 4000);
    //       }
    //     );
    //   }, 2000);
    console.log(this.props)
  }

  chngingstate(token){
    this.setState({...this.state,shippingprovider:token})
    
  }

  render() {

  
{console.log(this.state)}

    const step = this.state.step;
    let content;
    switch (step) {
      case SHIPPING:
        content = <ShippingAddress handleOrderStep={this.handleStep} />;
        break;
      case PAYMENT:
        content = <Payment content2={this.content2} />;
        break;
      case ORDERPLACED:
        content = <OrderPlaced content2={this.content2} />;
        break;
      default:
        break;
    }

   

    return (
      <main className="order-re container siteWidthContainer">
        <ToastContainer rtl={isRtl(this.props.lang)} {...getToastConfig()} />
        <orderContext.Provider value={this.state}>
          <SwitchTransition className="user-panel__container">
            <CSSTransition
              key={
                step !== ORDERPLACED
                  ? this.randId
                  : this.state.orderState[step].id
              }
              classNames="user-panel__routes"
              timeout={200}
            >
              <>
                {step !== ORDERPLACED && (
                  <div>
                    <>
                      {/* display on desktop and bigger */}
                      <DesktopsAndBigger>
                        <OrderNav />
                      </DesktopsAndBigger>
                      {/* display on desktop and smaller */}
                      <Desktops>
                        <MobileOrderNav />
                      </Desktops>
                      <SwitchTransition className="user-panel__container">
                        <CSSTransition
                          key={this.state.orderState[step].id}
                          classNames="user-panel__routes"
                          timeout={200}
                        >
                          <div className="animate-cnt">{content}</div>
                        </CSSTransition>
                      </SwitchTransition>
                    </>
                  </div>
                )}

                {step === ORDERPLACED && content}
              </>
            </CSSTransition>
          </SwitchTransition>
        </orderContext.Provider>
      </main>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    lang: selectLang(state),
    cart: selectCart(state)
  };
};

export default connect(mapStateToProps)(withRouter(Order));
