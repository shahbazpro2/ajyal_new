import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  client_getAllShipMethod, client_getaramexShipMethod, client_getDHLShipMethod, client_getubexShipMethod, client_shipingUIupdate
} from "../../../../../../lib/api/client/clientOrder";
import Select from "react-select";

const Shipingprovider = (props) => {

  const [deliverymode, setdeliveryMode] = useState([])
  const [selectd, setselectd] = useState(1);


  useEffect(() => {
    const getdilivery = async () => {
      const result = await client_getAllShipMethod()
      console.log(result.data.result)

      const d = []
      result.data.result.map((item) => {
        d.push({
          value: item.id,
          label: (
            <div>

              {item.shippingMethodTitle}
            </div>
          )
        })
      })
      setdeliveryMode(d)
      console.log(d)
      //  .then((res)=>{
      //   console.log("sejfsfsdfmsdfmsdmfsdmf",deliverymode,res);
      //   setdeliveryMode(res?.result)
      //   }).catch((err)=>{
      //     console.log(err)
      //   })
    }
    getdilivery()

    return () => { };
  }, []);


  const [totald, setotal] = useState({})
  const [shipTo, setShipTo] = useState('')
  useEffect(() => {
    console.log('propsss', props)
    const ppi = []
    setShipTo(props.prevpayment.cityTitle)
    props.prevpayment.items?.map((item) => {
      ppi.push({ weight: item.weight, height: item.heigth, length: item.length, width: item.width })
    })
    let width = 0, length = 0, height = 0, weight = 0
    ppi.map((item) => {
      weight = weight + item.weight
      height = item.height + height
      width = item.width + width
      length = item.length + length
    })
    weight = weight / 1000
    setotal({ weight, height, width, length })
    console.log({ weight, height, width, length })
  }, [props.prevpayment])

  useEffect(() => {
    const figther = async () => {
      props.setasideloading()
      const result = await client_getDHLShipMethod(totald)
      props.shippingchange(result)
      /*  console.log("hrriri", result);
 
       const result1 = await client_shipingUIupdate()
       props.shippingchange(result1)
       console.log('ssdjfsdkfsdkfnsdf', result1) */
    }

    const figther2 = async () => {
      props.setasideloading()
      const result = await client_getubexShipMethod(totald)
      props.shippingchange(result)
      /*    console.log("hrriri", result);
         const result1 = await client_shipingUIupdate()
         props.shippingchange(result1)
         console.log('ssdjfsdkfsdkfnsdf', result1) */
    }

    const figther3 = async () => {
      props.setasideloading()
      console.log('totald', totald)
      const result = await client_getaramexShipMethod({ total: totald, shipTo })
      props.shippingchange(result)
      /* console.log("hrriri", result);
      const result1 = await client_shipingUIupdate()
      props.shippingchange(result1)
      console.log('ssdjfsdkfsdkfnsdf', result1) */
    }

    console.log(selectd)
    if (selectd?.value === 4) figther()
    if (selectd?.value === 3) figther2()
    if (selectd?.value === 5) figther3()

  }, [selectd])

  return (
    <>

      <div className="row mt-4 d-flex flex-column">
        <label className="ml-4 " style={{ fontSize: "15px" }}>Select Delivery patner</label>
        <Select
          className="react-select col-md-4 col-8"
          options={deliverymode}
          value={selectd}
          onChange={(e) => { setselectd(e); }}
        />





      </div>

    </>
  );
};

export default Shipingprovider;
