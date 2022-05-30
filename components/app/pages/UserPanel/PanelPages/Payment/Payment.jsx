import React, { useEffect, useState } from 'react';
import BoxStyle2 from "../../../../../common/BoxStyle2";
import { Translate } from "react-localize-redux";
import { ReactComponent as EmptyWalletIcon } from "./../../../../../../assets/icons/empty-payment.svg";
import { client_getCreditList, client_getCustomerBankCards, client_removeCustomerBankCard } from "../../../../../../lib/api/client/clientUserPanel";
import { format } from "date-fns";
import { Pager, Loading } from "../../../../../common";
import {
    TRANSACTIONTYPE_Purchase,
    TRANSACTIONTYPE_Cash,
    TRANSACTIONTYPE_Gift,
    TRANSACTIONTYPE_Refund,
} from "./../../UserPanelConstants";
import {
    LandScapePhones,
    LandScapePhonesAndBigger,
} from "../../../../../../Responsive";
import { selectCurr } from "../../../../../../appConfigSlice";
import CreditCardItem from "./CreditCardItem";
import { connect } from "react-redux";

export default () => {

    const [isLoading, setIsLoading] = useState(false);
    const [cards, setCards] = useState([]);

    useEffect(() => {
        const res = getData();
    }, []);

    const removeCustomerBankCard = async (bankCardId) => {
        setIsLoading(true);
        client_removeCustomerBankCard(bankCardId)
            .then((res) => {
                console.log(res);
                setIsLoading(false);
                getData();
            })
            .catch((err) => {
                setIsLoading(false);
                console.log(err);
            });
    };

    const getData = async () => {
        setIsLoading(true);
        client_getCustomerBankCards()
            .then((res) => {
                console.log(res);
                setCards(res.result);
                setIsLoading(false);
            })
            .catch((err) => {
                setIsLoading(false);
                console.log(err);
            });
    };

    const onItemClickHandler = (bankCardId) => {
        console.log(bankCardId);
        removeCustomerBankCard(bankCardId);
    }

    return (
        <BoxStyle2 className="payment">
            {isLoading ? (
                <Loading type="gray" width="9%" height="70%" />
            ) : (
                    <div>
                        <section className="payment__content">
                            {/* {this.state.emptyCrdits && this.renderEmtpySection()} */}
                            {cards?.length > 0 ? (
                                <div className="payment__data-wrapper">
                                    {cards?.map((item) => {
                                        return (
                                            <div key={item.bankCardId} className="card-item-wrapper">
                                                <CreditCardItem onItemClick={onItemClickHandler} data={item} />
                                            </div>
                                        )
                                    })}

                                    {/* <Pager
                                        count={Math.ceil(
                                            this.state.totalNumber / this.state.pageSize
                                        )}
                                        activeItem={this.state.pageNumber}
                                        onPageClick={(pageNumber) => {
                                            pageChangedAction(pageNumber);
                                        }}
                                    /> */}
                                </div>
                            )
                                :
                                (
                                    <section className="no-address">
                                        <div>
                                            <EmptyWalletIcon className="no-address__icon" />
                                            <p className="no-address__topText">
                                                <Translate id="payment.dont-have-payment-card" />
                                            </p>
                                        </div>
                                    </section>
                                )}
                        </section>
                    </div>
                )}
        </BoxStyle2>
    );
};