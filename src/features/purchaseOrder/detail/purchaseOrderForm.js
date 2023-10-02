import { useEffect, useState } from "react"
import TitleCard from "../../../components/Cards/TitleCard"
import TextAreaInput from '../../../components/Input/TextAreaInput'
import axios from "axios"
import InputTextUpdated from "../../../components/Input/InputTextUpdated"
import ErrorText from "../../../components/Typography/ErrorText"
import { useLocation, useNavigate } from "react-router-dom"
import SelectBox from "../../../components/Input/SelectBox"
import Subtitle from "../../../components/Typography/Subtitle"
import { toast } from "react-toastify"
import instance from "../../../utils/axios-config"

function PurchaseOrderForm(){
    const navigate = useNavigate()
    const { state } = useLocation()
    const userId = localStorage.getItem('userId');

    const STATUS = [{ name: "Completed", value: "Completed" }, { name: "In Progress", value: "In Progress" }, { name: "Pending", value: "Pending" }]
    
    const INITIAL_PURCHASE_ORDER_OBJ = {
        date: new Date().toISOString().slice(0, 10),
        number: "",
        arrivalDate: "",
        status: "",
        mainMarketPlace: "",
        carrier: "",
        trackingNumber: "",
        comment: "",
        totalCost: "",
        supplier_id: null,
        user_id: userId,
        platform_id: null,
        extraCost: 0,
    }
    const INITIAL_PURCHASE_ORDER_ITEM_OBJ = [{ skuId: '', quantityOrdered: '', unitPrice: '', totalPrice: '', user_id: userId, purchase_order_id: '', platform_id: null }]

    const [errorMessage, setErrorMessage] = useState("")
    const [purchaseOrderObj, setPurchaseOrderObj] = useState(state ? state : INITIAL_PURCHASE_ORDER_OBJ);
    const [purchaseOrderItemObj, setPurchaseOrderItemObj] = useState(INITIAL_PURCHASE_ORDER_ITEM_OBJ);
    const [getProduct, setGetProduct] = useState()
    const [getSupplier, setGetSupplier] = useState()

    // Get Purchases
    async function fetchProduct() {
        const response = await instance.get(process.env.REACT_APP_BASE_URL + `/product`)
        setGetProduct(response.data?.data);
    }
    // Get Suppliers
    async function fetchSupplier() {
        const response = await instance.get(process.env.REACT_APP_BASE_URL + `/supplier`)
        setGetSupplier(response.data?.data);
    }
    // Get purchase order items
    async function fetchPurchaseOrderItems(name, id) {
        const response = await instance.get(process.env.REACT_APP_BASE_URL + `/purchaseOrderItem/find?${name}=${id}`)
        setPurchaseOrderItemObj(response.data?.data);
    }

    useEffect(() => {
        fetchProduct()
        fetchSupplier()
        if(state) {
            fetchPurchaseOrderItems("purchase_order_id", state.id)
        }
    },[])
    


    const submitForm = async (submit) => {
        if(submit === "Update"){
            let purchaseOrderId;
            // let cashTransactionId;
            try {
                const res = await axios.patch(process.env.REACT_APP_BASE_URL + `/purchaseOrder/${state.id}`, purchaseOrderObj)
                if(res.status === 200){
                    purchaseOrderId = res.data.data.id;
                    // purchaseOrderId = res.data.data.purchaseOrder.id;
                    // cashTransactionId = res.data.data.cashTransaction.id
                    const purchaseOrderItem = purchaseOrderItemObj.map(productItem => ({ ...productItem, purchase_order_id: purchaseOrderId }))
                    const response = await axios.patch(process.env.REACT_APP_BASE_URL + "/purchaseOrderItem", purchaseOrderItem)
                    if(response.status === 200) {
                        toast.success("PurchaseOrder Updated Successfully!")
                        navigate("/app/purchase-order")
                    }
                }
            } catch (error) {
                console.log(error.message);
                toast.error(error?.response?.data?.message.split(':')[1])
                if(purchaseOrderId){
                    await axios.delete(process.env.REACT_APP_BASE_URL + `/purchaseOrder/${purchaseOrderId}`)
                }
            }
        } else {
            // if(purchaseOrderObj?.supplier_id === "")return setErrorMessage("Supplier is required!")
            // else if(purchaseOrderObj?.number?.trim() === "")return setErrorMessage("Number is required!")
            // else if(purchaseOrderObj?.arrivalDate?.trim() === "")return setErrorMessage("Arrival Date is required!")
            // else if(purchaseOrderObj?.status?.trim() === "")return setErrorMessage("Status is required!")
            // else if(purchaseOrderObj?.mainMarketPlace?.trim() === "")return setErrorMessage("Main Market place is required!")
            // else if(purchaseOrderObj?.carrier?.trim() === "")return setErrorMessage("Carrier is required!")
            // else if(purchaseOrderObj?.trackingNumber?.trim() === "")return setErrorMessage("Tracking Number is required!")
            // else if(purchaseOrderObj?.totalCost?.trim() === "")return setErrorMessage("Total Cost is required!")
            // else if(purchaseOrderObj?.extraCost?.trim() === "")return setErrorMessage("Extra Cost is required!")
            // else if(purchaseOrderObj?.comment?.trim() === "")return setErrorMessage("Comment is required!")
            // else{
            // }
            let purchaseOrderId;
            let cashTransactionId;
            try {
                const res = await axios.post(process.env.REACT_APP_BASE_URL + "/purchaseOrder", purchaseOrderObj)
                if(res.status === 200){
                    purchaseOrderId = res.data.data.purchaseOrder.id;
                    cashTransactionId = res.data.data.cashTransaction.id
                    const purchaseOrderItem = purchaseOrderItemObj.map(productItem => ({ ...productItem, purchase_order_id: purchaseOrderId }))
                    const response = await axios.post(process.env.REACT_APP_BASE_URL + "/purchaseOrderItem", purchaseOrderItem)
                    if(response.status === 200) {
                        toast.success("Purchase Order Created Successfully!")
                        navigate("/app/purchase-order")
                    }
                }
            } catch (error) {
                toast.error(error?.response?.data?.message.split(':')[1])
                if(purchaseOrderId){
                    await axios.delete(process.env.REACT_APP_BASE_URL + `/purchaseOrder/${purchaseOrderId}`)
                }if (cashTransactionId) {
                    await axios.delete(process.env.REACT_APP_BASE_URL + `/cash/${cashTransactionId}`)
                }
                console.log(error.message);
            }
        }
    }
    

    const updateFormValue = ({updateType, value, nestedObj, nestedIndex}) => {
        // console.log("🚀 ~ file: purchaseOrderForm.js:93 ~ updateFormValue ~ updateType, value, nestedObj, nestedIndex:", updateType, value, nestedObj, nestedIndex)
        setErrorMessage("")

        if(!nestedObj) return setPurchaseOrderObj({...purchaseOrderObj, [updateType] : value})

        setPurchaseOrderItemObj((prevPurchaseOrderObj) => {
            const updatedStates = [...prevPurchaseOrderObj]; 
            if(updateType === "skuId"){
                updatedStates[nestedIndex][nestedObj] = value;
                const productDetail = getProduct.find(item => item.skuId == value)
                updatedStates[nestedIndex]['unitPrice'] = parseInt(productDetail.cogs);
                updatedStates[nestedIndex]['totalPrice'] = updatedStates[nestedIndex]['quantityOrdered'] * parseInt(productDetail.cogs);
                setPurchaseOrderObj({ ...purchaseOrderObj, "totalCost": purchaseOrderItemObj?.reduce((sum, item) => sum + parseFloat(item.totalPrice || 0), 0) })
                return [...updatedStates];
            } else if( updateType === "quantityOrdered"){
                updatedStates[nestedIndex][nestedObj] = value;
                const unitPrice = updatedStates[nestedIndex]['unitPrice'];
                updatedStates[nestedIndex]['totalPrice'] = unitPrice * value;
                setPurchaseOrderObj({ ...purchaseOrderObj, "totalCost": purchaseOrderItemObj?.reduce((sum, item) => sum + parseFloat(item.totalPrice || 0), 0) })
                return [...updatedStates];
            }
        });
    }


    const handleAddField = () => {
        setPurchaseOrderItemObj((prevPurchaseOrderObj) => ([
            ...prevPurchaseOrderObj,
            { skuId: '', quantityOrdered: '', unitPrice: '', user_id: userId, purchase_order_id: '', platform_id: null }
        ]));
    };

    const handleRemoveField = async(index, data) => {
        if(state) {
            const response = await axios.delete(process.env.REACT_APP_BASE_URL + `/purchaseOrderItem/${data?.id}`)
            if(response.status === 200) {
                toast.success("Product Item Deleted Successfully!")
                // navigate("/app/purchase-order")
            }
        }
        setPurchaseOrderItemObj((prevFormData) => {
            const updatedStates = [...prevFormData];
            updatedStates.splice(index, 1)
            return [ ...updatedStates  ];
        });
    };
    // purchaseOrderItemObj.reduce((sum, item) => sum + parseFloat(item.totalPrice || 0), 0)

    console.log("🚀 ~ file: purchaseOrderForm.js:117 ~ setPurchaseOrderItemObj ~ setPurchaseOrderObj:", purchaseOrderObj)
    console.log("🚀 ~ file: purchaseOrderForm.js:117 ~ setPurchaseOrderItemObj ~ setPurchaseOrderItemObj:", purchaseOrderItemObj)
    
    return(
        <>
            <TitleCard title="Purchase Order Form" topMargin="mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* <InputTextUpdated type='date' labelTitle="Date" defaultValue={ purchaseOrderObj?.name} updateFormValue={updateFormValue} updateType="date"/> */}
                    <SelectBox 
                    options={getSupplier} labelTitle="Supplier" updateType="supplier_id" placeholder={state ? purchaseOrderObj?.supplier?.name : "Pick one Supplier"} updateFormValue={updateFormValue}
                    />
                    <InputTextUpdated type='text' labelTitle="Number" defaultValue={ purchaseOrderObj?.number} updateFormValue={updateFormValue} updateType="number"/>
                    <InputTextUpdated type='date' labelTitle="Arrival Date" defaultValue={ purchaseOrderObj?.arrivalDate} updateFormValue={updateFormValue} updateType="arrivalDate"/>
                    <SelectBox options={STATUS} type='text' labelTitle="Status" defaultValue={ purchaseOrderObj?.status} placeholder={state ? state.product?.status : "Pick one Status"} updateFormValue={updateFormValue} updateType="status"/>
                    <InputTextUpdated type='text' labelTitle="Main Market Place" defaultValue={ purchaseOrderObj?.mainMarketPlace} updateFormValue={updateFormValue} updateType="mainMarketPlace"/>
                    <InputTextUpdated type='text' labelTitle="Carrier" defaultValue={ purchaseOrderObj?.carrier} updateFormValue={updateFormValue} updateType="carrier"/>
                    <InputTextUpdated type='text' labelTitle="Tracking Number" defaultValue={ purchaseOrderObj?.trackingNumber} updateFormValue={updateFormValue} updateType="trackingNumber"/>
                    <InputTextUpdated disabled={true} type='text' labelTitle="Total Cost" defaultValue={ purchaseOrderObj?.totalCost} updateFormValue={updateFormValue} updateType="totalCost"/>
                    <InputTextUpdated type='number' labelTitle="Extra Cost" defaultValue={ purchaseOrderObj?.extraCost} updateFormValue={updateFormValue} updateType="extraCost"/>
                    <TextAreaInput type='text' labelTitle="Comment" defaultValue={ purchaseOrderObj?.comment} updateFormValue={updateFormValue} updateType="comment"/>
                </div>
                <Subtitle styleClass='my-8 align-baseline'>
                    Product Items
                    {<button className="btn btn-primary float-right" onClick={handleAddField}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>}
                </Subtitle>
                <div className="divider mt-2"></div>
                <div className="overflow-x-auto w-full">
                    <table className="table w-full">
                        <thead>
                        <tr>
                            <th>Product</th>
                            <th>Unit Price</th>
                            <th>Quantity Order</th>
                            <th>Total Price</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                purchaseOrderItemObj?.map((data, index) => (
                                    <tr key={index}>
                                        <td><SelectBox 
                                        options={getProduct} containerStyle='max-w-xs w-full' labelTitle="" updateType="skuId" placeholder={state ? data.product?.name : "Pick one Product"} nestedObj='skuId' nestedIndex={index} updateFormValue={updateFormValue}
                                        /></td>
                                        <td>
                                            <InputTextUpdated disabled={true} containerStyle='max-w-xs' type="text" defaultValue={data.unitPrice} updateType="unitPrice" nestedObj='unitPrice' nestedIndex={index} placeholder="Price" labelTitle="" updateFormValue={updateFormValue}/>
                                        </td>
                                        <td>
                                            <InputTextUpdated containerStyle='max-w-xs' type="number" defaultValue={data.quantityOrdered} updateType="quantityOrdered" disabled={data.unitPrice ? false : true} nestedObj='quantityOrdered' nestedIndex={index} placeholder="Quantity" labelTitle="" updateFormValue={updateFormValue}/>
                                        </td>
                                        <td>
                                            <InputTextUpdated disabled={true} containerStyle='max-w-xs' type="number" defaultValue={data.totalPrice} updateType="totalPrice" nestedObj='totalPrice' nestedIndex={index} placeholder="Total" labelTitle="" updateFormValue={updateFormValue}/>
                                        </td>
                                        <td>
                                            {
                                                index > 0 && (
                                                    <button className="bg-base-100 rounded-full mt-3" onClick={() => handleRemoveField(index, data)}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>
                                                    </button>
                                                )
                                            }
                                        </td>
                                    </tr>
                                ))
                            }
                            <tr>
                                <td></td>
                                <td></td>
                                <td className="text-center text-2xl">
                                    <h2 className="font-bold">Total:</h2>
                                </td>
                                <td>
                                    
                                    <InputTextUpdated disabled={true} containerStyle='max-w-xs' type="text" defaultValue={purchaseOrderItemObj.reduce((sum, item) => sum + parseFloat(item.totalPrice || 0), 0)} updateType="unitPrice" placeholder="Price" labelTitle="" updateFormValue={updateFormValue}/>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>

                <div className="mt-16"><button className="btn btn-primary float-right" onClick={() => submitForm(state ? "Update" : "Save")}>{state ? "Update" : "Save"}</button></div>
            </TitleCard>
        </>
    )
}


export default PurchaseOrderForm