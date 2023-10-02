import { useState } from "react"
import { useDispatch } from "react-redux"
import InputText from '../../../components/Input/InputText'
import ErrorText from '../../../components/Typography/ErrorText'
import { showNotification } from "../../common/headerSlice"
import { addNewLead, addNewcustomer, updateNewcustomer } from "../customerSlice"
import axios from "axios"
import InputTextUpdated from "../../../components/Input/InputTextUpdated"
import SelectBox from "../../../components/Input/SelectBox"
import { useEffect } from "react"
import instance from "../../../utils/axios-config"

const INITIAL_customer_OBJ = {
    skuName: "",
    description: "",
    buyingPrice: "",
    sellingPrice: "",
    customerImage: "",
    quantityInStock: "",
    user_id: localStorage.getItem("userId"),
    customer_id: ""
}

function CustomerModalBody({closeModal, extraObject}){
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [customerObj, setcustomerObj] = useState(extraObject.customer ? extraObject.customer : INITIAL_customer_OBJ)
    const [productOption, setProductOption] = useState([])
    const [productStatus, setProductStatus] = useState([{"name": "Completed", "value": "Completed"},{"name": "Pending", "value": "Pending"},{"name": "Refunded", "value": "Refunded"}])

    const getProducts = async () => {
    	const response = await instance.get(process.env.REACT_APP_BASE_URL + `/product`)
        setProductOption(response.data.data)
    }

    useEffect(() => {
        getProducts()
    }, [])

    const submitcustomer = async (submit) => {
        if(submit === "Update"){
            try {
                const res = await axios.patch(process.env.REACT_APP_BASE_URL + `/customer/${extraObject?.id}`, customerObj)
                if(res.status === 200){
                    dispatch(updateNewcustomer({data: res.data.data, index: extraObject.index}))
                    dispatch(showNotification({message : "customer Updated!", status : 1}))
                    closeModal()
                }
            } catch (error) {
                console.log(error.message);
            }
        } else {
            if(customerObj.product_id.trim() === "")return setErrorMessage("Product is required!")
            else if(customerObj.quantity.trim() === "")return setErrorMessage("Quantity is required!")
            else if(customerObj.unitPrice.trim() === "")return setErrorMessage("Unit Price is required!")
            else if(customerObj.totalPrice.trim() === "")return setErrorMessage("Total Price is required!")
            else if(customerObj.customerDate.trim() === "")return setErrorMessage("customer Date is required!")
            else if(customerObj.customerStatus.trim() === "")return setErrorMessage("customer Status is required!")
            else{
                try {
                    const res = await axios.post(process.env.REACT_APP_BASE_URL + "/customer", customerObj)
                    if(res.status === 200){
                        dispatch(addNewcustomer(res?.data?.data))
                        dispatch(showNotification({message : "New customer Added!", status : 1}))
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
        setcustomerObj({...customerObj, [updateType] : value})
    }
    console.log("🚀 ~ file: CustomerModalBody.js:81 ~ updateFormValue ~ customerObj:", customerObj)
    
    return(
        <>
             <SelectBox 
                options={productOption} labelTitle="Product" updateType="product_id" containerStyle="form-control w-full mt-4" placeholder="Pick one Product" updateFormValue={updateFormValue}
            />

            <InputTextUpdated type="text" defaultValue={customerObj?.quantity} updateType="quantity" containerStyle="mt-4" labelTitle="customer Quantity" updateFormValue={updateFormValue}/>

            <InputTextUpdated type="text" defaultValue={customerObj?.unitPrice} updateType="unitPrice" containerStyle="mt-4" labelTitle="Unit Price" updateFormValue={updateFormValue}/>


            <InputTextUpdated type="number" defaultValue={customerObj?.totalPrice} updateType="totalPrice" containerStyle="mt-4" labelTitle="Total Price" updateFormValue={updateFormValue}/>

            <InputTextUpdated type="date" defaultValue={customerObj?.customerDate} updateType="customerDate" containerStyle="mt-4" labelTitle="customer Date" updateFormValue={updateFormValue}/>

            <SelectBox 
                options={productStatus} labelTitle="customer Status" updateType="customerStatus" containerStyle="form-control w-full mt-4" placeholder="Choose one Status" updateFormValue={updateFormValue}
            />

            <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
            <div className="modal-action">
                <button  className="btn btn-outline btn-ghost" onClick={() => closeModal()}>Cancel</button>
                <button  className="btn btn-outline btn-primary px-6" onClick={() => submitcustomer(extraObject.customer ? "Update" : "Save")}>{extraObject.customer ? "Update" : "Save"}</button>
            </div>
        </>
    )
}

export default CustomerModalBody