import React, { createContext } from 'react';

const Shippingpatner=createContext()
const [shipingdetails,setshipdetails]=useState({})

const Shippingpatnerprovider=({children})=>{
    retun(
        <Shippingpatner.Provider value={shipingdetails}>
            {children}
        </Shippingpatner.Provider>
    )
}

export default Shippingpatnerprovider;