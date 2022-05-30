import React from 'react';
import { Translate } from "react-localize-redux";
import { ReactComponent as TrashIcon } from "./../../../../../../assets/icons/trash.svg";
import moment from "moment";
import "./CreditCardItem.scss";
import "./CreditCardItem-rtl.scss";

export default (props) => {

    const cardDate = moment('20' + props.data.bankCardYear + '/' + props.data.bankCardMonth + '/01').format('MMM YYYY');

    return (
        <div className="card-container">
            <div className="card">
                <div className="card__header">
                    <div className="card__header__left">
                        <div>
                            <img
                                src={`${process.env.NEXT_PUBLIC_PAYMENTLOGO_PREFIX}/${props.data.paymentMethodImageName}`}
                                alt="jyal refund icon"
                                className="card-icon"
                            />
                        </div>
                    </div>
                    <div className="card__header__right">
                        <span>{props.data.bankCardNumber}</span>
                    </div>
                </div>
                <div className="card__body">
                    <div className="card__body__left">
                        <p className="full-text"><span className="expire-text"><Translate id="payment.expiry" /> </span><span className="expire-data-text">{cardDate}</span></p>
                    </div>
                    <div className="card__body__right">

                    </div>
                </div>
                <div className="card__footer">
                    <div onClick={() => props.onItemClick(props.data.bankCardId)} className="card__footer__delete-wrapper">
                        <span className="card__footer__icon-container">
                            <TrashIcon className="trash-icon" />
                        </span>
                        <span className="card__footer__delete-text">
                            <Translate id="payment.delete" />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};