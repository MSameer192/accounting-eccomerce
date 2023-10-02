import { useState } from "react"
import { useDispatch } from "react-redux"
import InputText from '../../../components/Input/InputText'
import ErrorText from '../../../components/Typography/ErrorText'
import { showNotification } from "../../common/headerSlice"
import { addNewLead, addNewOrder, updateNewOrder } from "../orderSlice"
import axios from "axios"
import InputTextUpdated from "../../../components/Input/InputTextUpdated"
import SelectBox from "../../../components/Input/SelectBox"
import { useEffect } from "react"
import instance from "../../../utils/axios-config"

const INITIAL_ORDER_OBJ = {
    skuName: "",
    description: "",
    buyingPrice: "",
    sellingPrice: "",
    orderImage: "",
    quantityInStock: "",
    user_id: localStorage.getItem("userId"),
    order_id: ""
}

function OrderModalBody({closeModal, extraObject}){
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [orderObj, setOrderObj] = useState(extraObject.order ? extraObject.order : INITIAL_ORDER_OBJ)
    const [productOption, setProductOption] = useState([])
    const [productStatus, setProductStatus] = useState([{"name": "Completed", "value": "Completed"},{"name": "Pending", "value": "Pending"},{"name": "Refunded", "value": "Refunded"}])

    const getProducts = async () => {
    	const response = await instance.get(process.env.REACT_APP_BASE_URL + `/product`)
        setProductOption(response.data.data)
    }

    useEffect(() => {
        getProducts()
    }, [])

    const submitOrder = async (submit) => {
        if(submit === "Update"){
            try {
                const res = await axios.patch(process.env.REACT_APP_BASE_URL + `/order/${extraObject?.id}`, orderObj)
                if(res.status === 200){
                    dispatch(updateNewOrder({data: res.data.data, index: extraObject.index}))
                    dispatch(showNotification({message : "Order Updated!", status : 1}))
                    closeModal()
                }
            } catch (error) {
                console.log(error.message);
            }
        } else {
            if(orderObj.product_id.trim() === "")return setErrorMessage("Product is required!")
            else if(orderObj.quantity.trim() === "")return setErrorMessage("Quantity is required!")
            else if(orderObj.unitPrice.trim() === "")return setErrorMessage("Unit Price is required!")
            else if(orderObj.totalPrice.trim() === "")return setErrorMessage("Total Price is required!")
            else if(orderObj.orderDate.trim() === "")return setErrorMessage("Order Date is required!")
            else if(orderObj.orderStatus.trim() === "")return setErrorMessage("Order Status is required!")
            else{
                try {
                    const res = await axios.post(process.env.REACT_APP_BASE_URL + "/order", orderObj)
                    if(res.status === 200){
                        dispatch(addNewOrder(res?.data?.data))
                        dispatch(showNotification({message : "New Order Added!", status : 1}))
                        closeModal()
                    }
                } catch (error) {
                    console.log(error.message);
                }
            }
        }
    }

    // const 


    const updateFormValue = ({updateType, value}) => {
        setErrorMessage("")
        setOrderObj({...orderObj, [updateType] : value})
    }
    console.log("🚀 ~ file: OrderModalBody.js:81 ~ updateFormValue ~ orderObj:", orderObj)
    
    return(
        <>
             <SelectBox 
                options={productOption} labelTitle="Product" updateType="product_id" containerStyle="form-control w-full mt-4" placeholder="Pick one Product" updateFormValue={updateFormValue}
            />

            <InputTextUpdated type="text" defaultValue={orderObj?.quantity} updateType="quantity" containerStyle="mt-4" labelTitle="Order Quantity" updateFormValue={updateFormValue}/>

            <InputTextUpdated type="text" defaultValue={orderObj?.unitPrice} updateType="unitPrice" containerStyle="mt-4" labelTitle="Unit Price" updateFormValue={updateFormValue}/>


            <InputTextUpdated type="number" defaultValue={orderObj?.totalPrice} updateType="totalPrice" containerStyle="mt-4" labelTitle="Total Price" updateFormValue={updateFormValue}/>

            <InputTextUpdated type="date" defaultValue={orderObj?.orderDate} updateType="orderDate" containerStyle="mt-4" labelTitle="Order Date" updateFormValue={updateFormValue}/>

            <SelectBox 
                options={productStatus} labelTitle="Order Status" updateType="orderStatus" containerStyle="form-control w-full mt-4" placeholder="Choose one Status" updateFormValue={updateFormValue}
            />

            <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
            <div className="modal-action">
                <button  className="btn btn-outline btn-ghost" onClick={() => closeModal()}>Cancel</button>
                <button  className="btn btn-primary px-6" onClick={() => submitOrder(extraObject.order ? "Update" : "Save")}>{extraObject.order ? "Update" : "Save"}</button>
            </div>
        </>
    )
}

export default OrderModalBody