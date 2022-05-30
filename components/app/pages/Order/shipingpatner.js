/* eslint-disable array-callback-return */

import React, { createContext, useReducer } from 'react'
import { reducer, initialState } from './shipingpatnerr'
export const CartContext = createContext()


 const CartContextProvider = ({ children }) => {
    const [state, dispatch] =
    useReducer(reducer, initialState)
    return (
        <CartContext.Provider
            value={{ state, dispatch}}>
            {children}
        </CartContext.Provider>
    )
}
export default CartContextProvider
