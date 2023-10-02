import { useState } from "react"
import { useDispatch } from "react-redux"
import InputText from '../../../components/Input/InputText'
import ErrorText from '../../../components/Typography/ErrorText'
import { showNotification } from "../../common/headerSlice"
import { addNewLead, addNewPurchaseOrder, updateNewPurchaseOrder } from "../purchaseOrderSlice"
import axios from "axios"
import InputTextUpdated from "../../../components/Input/InputTextUpdated"
import SelectBox from "../../../components/Input/SelectBox"
import { useEffect } from "react"
import { toast } from "react-toastify"
import instance from "../../../utils/axios-config"

const INITIAL_PURCHASE_ORDER_OBJ = {
    vendor: "",
    purchaseDate: "",
    purchaseStatus: "",
    purchaseQuantity: "",
    unitCost: "",
    user_id: localStorage.getItem("userId"),
    totalCost: "",
    purchaseOrder_id: "",
}

function PurchaseOrderModalBody({closeModal, extraObject}){
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [purchaseOrderObj, setPurchaseOrderObj] = useState(extraObject.purchaseOrder ? extraObject.purchaseOrder : INITIAL_PURCHASE_ORDER_OBJ)
    const [purchaseOrderOption, setProductOption] = useState([])
    const [productStatusOption, setProductStatusOption] = useState([{"name": "Completed", "value": "Completed"}, {"name": "Pending", "value": "Pending"}, {"name": "Back Orders", "value": "Back Orders"}])

    const getProducts = async () => {
    	const response = await instance.get(process.env.REACT_APP_BASE_URL + `/product`)
        setProductOption(response.data.data)
    }

    useEffect(() => {
        getProducts()
    }, [])

    const submitPurchaseOrder = async (submit) => {
        if(submit === "Update"){
            try {
                const res = await axios.patch(process.env.REACT_APP_BASE_URL + `/purchaseOrder/${extraObject?.id}`, purchaseOrderObj)
                if(res.status === 200){
                    dispatch(updateNewPurchaseOrder({data: res.data.data, index: extraObject.index}))
                    toast.success("PurchaseOrder Updated!")
                    closeModal()
                }
            } catch (error) {
                console.log(error.message);
            }
        } else {
            if(purchaseOrderObj.vendor.trim() === "")return setErrorMessage("Vendor is required!")
            else if(purchaseOrderObj.purchaseDate.trim() === "")return setErrorMessage("Purchase Date is required!")
            else if(purchaseOrderObj.purchaseStatus.trim() === "")return setErrorMessage("Purchase Status is required!")
            else if(purchaseOrderObj.purchaseQuantity.trim() === "")return setErrorMessage("Purchase Quantity is required!")
            else if(purchaseOrderObj.unitCost.trim() === "")return setErrorMessage("Unit Cost is required!")
            else if(purchaseOrderObj.totalCost.trim() === "")return setErrorMessage("Total Cost is required!")
            else{
                try {
                    const res = await axios.post(process.env.REACT_APP_BASE_URL + "/purchaseOrder", purchaseOrderObj)
                    if(res.status === 200){
                        dispatch(addNewPurchaseOrder(res?.data?.data))
                        dispatch(showNotification({message : "New PurchaseOrder Added!", status : 1}))
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
        setPurchaseOrderObj({...purchaseOrderObj, [updateType] : value})
    }
    console.log("🚀 ~ file: PurchaseOrderModalBody.js:81 ~ updateFormValue ~ purchaseOrderObj:", purchaseOrderObj)
    
    return(
        <>
            <InputTextUpdated type="text" defaultValue={purchaseOrderObj?.vendor} updateType="vendor" containerStyle="mt-4" labelTitle="Vendor" updateFormValue={updateFormValue}/>

            <InputTextUpdated type="text" defaultValue={purchaseOrderObj?.purchaseDate} updateType="purchaseDate" containerStyle="mt-4" labelTitle="Purchase Date" updateFormValue={updateFormValue}/>

             <SelectBox 
                options={purchaseOrderOption} labelTitle="Product" updateType="purchaseOrder_id" containerStyle="form-control w-full mt-4" placeholder="Pick one Product" updateFormValue={updateFormValue}
            />

             <SelectBox 
                options={productStatusOption} labelTitle="Purchase Status" updateType="purchaseStatus" containerStyle="form-control w-full mt-4" placeholder="Pick one Product" updateFormValue={updateFormValue}
            />

            <InputTextUpdated type="number" defaultValue={purchaseOrderObj?.purchaseQuantity} updateType="purchaseQuantity" containerStyle="mt-4" labelTitle="Purchase Quantity" updateFormValue={updateFormValue}/>

            <InputTextUpdated type="number" defaultValue={purchaseOrderObj?.unitCost} updateType="unitCost" containerStyle="mt-4" labelTitle="Unit Cost" updateFormValue={updateFormValue}/>

            <InputTextUpdated type="number" defaultValue={purchaseOrderObj?.totalCost} updateType="totalCost" containerStyle="mt-4" labelTitle="Total Cost" updateFormValue={updateFormValue}/>
            
            <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
            <div className="modal-action">
                <button  className="btn btn-outline btn-ghost" onClick={() => closeModal()}>Cancel</button>
                <button  className="btn btn-primary px-6" onClick={() => submitPurchaseOrder(extraObject.purchaseOrder ? "Update" : "Save")}>{extraObject.purchaseOrder ? "Update" : "Save"}</button>
            </div>
        </>
    )
}

export default PurchaseOrderModalBody