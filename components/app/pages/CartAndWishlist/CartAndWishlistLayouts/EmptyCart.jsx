import React from 'react';
import { ReactComponent as EmptyCartIcon } from './../../../../../assets/icons/shopping-cart2.svg';
import { Translate } from 'react-localize-redux';
import classnames from 'classnames';
import {Button} from '../../../../common';

export default ({ dark,p1,p2,icon, normal ,history}) => {
    const navigateTo = () =>  {
        history.push('/');
    }
    return(
       <div className={classnames("empty-cart",{ "empty-cart--gray": dark, "empty-cart--normal": normal})}>
           {icon && <EmptyCartIcon className="empty-cart__icon" />}
           <p className="empty-cart__p1">{p1}</p>
           <p className="empty-cart__p2">{p2}</p>
           <Button onClick={navigateTo} radius={true} value={<Translate id="con-shopping"/>}/>
       </div>
    );
};