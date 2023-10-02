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

function SaleOrderForm(){
    const navigate = useNavigate()
    const { state } = useLocation()
    const userId = localStorage.getItem('userId');

    const STATUS = [{ name: "Completed", value: "Completed" }, { name: "In Progress", value: "In Progress" }, { name: "Pending", value: "Pending" }]
    
    const INITIAL_SALE_ORDER_OBJ = {
        totalPrice: "",
        date: new Date().toISOString().slice(0, 10),
        status: "",
        taxFee: "",
        user_id: userId,
        number: "",
        customer_id: null,
        platform_id: null,
    }
    const INITIAL_SALE_ORDER_ITEM_OBJ = [{ date: new Date().toISOString().slice(0, 10),taxFee: '', skuId: '', quantitySold: '', unitPrice: '', totalPrice: '', user_id: userId, sale_order_id: '', platform_id: null }]

    const [errorMessage, setErrorMessage] = useState("")
    const [saleOrderObj, setSaleOrderObj] = useState(state ? state : INITIAL_SALE_ORDER_OBJ);
    const [saleOrderItemObj, setSaleOrderItemObj] = useState(INITIAL_SALE_ORDER_ITEM_OBJ);
    const [getProduct, setGetProduct] = useState()
    const [getCustomer, setGetCustomer] = useState()

    // Get Sales
    async function fetchProduct() {
        const response = await instance.get(process.env.REACT_APP_BASE_URL + `/product`)
        setGetProduct(response.data?.data);
    }
    // Get Customers
    async function fetchCustomer() {
        const response = await instance.get(process.env.REACT_APP_BASE_URL + `/customer`)
        setGetCustomer(response.data?.data);
    }
    // Get sale order items
    async function fetchSaleOrderItems(name, id) {
        const response = await instance.get(process.env.REACT_APP_BASE_URL + `/saleOrderItem/find?${name}=${id}`)
        setSaleOrderItemObj(response.data?.data);
    }

    useEffect(() => {
        fetchProduct()
        fetchCustomer()
        if(state) {
            fetchSaleOrderItems("sale_order_id", state.id)
        }
    },[])
    


    const submitForm = async (submit) => {
        if(submit === "Update"){
            let saleOrderId;
            // let cashTransactionId;
            try {
                const res = await axios.patch(process.env.REACT_APP_BASE_URL + `/saleOrder/${state.id}`, saleOrderObj)
                if(res.status === 200){
                    saleOrderId = res.data.data.id;
                    // saleOrderId = res.data.data.saleOrder.id;
                    // cashTransactionId = res.data.data.cashTransaction.id
                    const saleOrderItem = saleOrderItemObj.map(productItem => ({ ...productItem, sale_order_id: saleOrderId }))
                    const response = await axios.patch(process.env.REACT_APP_BASE_URL + "/saleOrderItem", saleOrderItem)
                    if(response.status === 200) {
                        toast.success("SaleOrder Updated Successfully!")
                        navigate("/app/sale-order")
                    }
                }
            } catch (error) {
                console.log(error.message);
                toast.error(error?.response?.data?.message.split(':')[1])
                if(saleOrderId){
                    await axios.delete(process.env.REACT_APP_BASE_URL + `/saleOrder/${saleOrderId}`)
                }
            }
        } else {
            // if(saleOrderObj?.customer_id === "")return setErrorMessage("Customer is required!")
            // else if(saleOrderObj?.number?.trim() === "")return setErrorMessage("Number is required!")
            // else if(saleOrderObj?.arrivalDate?.trim() === "")return setErrorMessage("Arrival Date is required!")
            // else if(saleOrderObj?.status?.trim() === "")return setErrorMessage("Status is required!")
            // else if(saleOrderObj?.mainMarketPlace?.trim() === "")return setErrorMessage("Main Market place is required!")
            // else if(saleOrderObj?.carrier?.trim() === "")return setErrorMessage("Carrier is required!")
            // else if(saleOrderObj?.trackingNumber?.trim() === "")return setErrorMessage("Tracking Number is required!")
            // else if(saleOrderObj?.totalPrice?.trim() === "")return setErrorMessage("Total Cost is required!")
            // else if(saleOrderObj?.extraCost?.trim() === "")return setErrorMessage("Extra Cost is required!")
            // else if(saleOrderObj?.comment?.trim() === "")return setErrorMessage("Comment is required!")
            // else{
            // }
            let saleOrderId;
            let cashTransactionId;
            try {
                const res = await axios.post(process.env.REACT_APP_BASE_URL + "/saleOrder", saleOrderObj)
                console.log("🚀 ~ file: saleOrderForm.js:105 ~ submitForm ~ res:", res)
                if(res.status === 200){
                    console.log("Inside");
                    saleOrderId = res.data.data.saleOrder.id;
                    cashTransactionId = res.data.data.cashTransaction.id
                    const saleOrderItem = saleOrderItemObj.map(productItem => ({ ...productItem, sale_order_id: saleOrderId, date : new Date().toISOString().slice(0, 10) }))
                    console.log("🚀 ~ file: saleOrderForm.js:109 ~ submitForm ~ saleOrderItem:", saleOrderItem)
                    const response = await axios.post(process.env.REACT_APP_BASE_URL + "/saleOrderItem", saleOrderItem)
                    if(response.status === 200) {
                        toast.success("Sale Order Created Successfully!")
                        navigate("/app/sale-order")
                    }
                }
            } catch (error) {
                toast.error(error?.response?.data?.message.split(':')[1])
                if(saleOrderId){
                    await axios.delete(process.env.REACT_APP_BASE_URL + `/saleOrder/${saleOrderId}`)
                } 
                if (cashTransactionId) {
                    await axios.delete(process.env.REACT_APP_BASE_URL + `/cash/${cashTransactionId}`)
                }
                console.log(error.message);
            }
        }
    }
    

    const updateFormValue = ({updateType, value, nestedObj, nestedIndex}) => {
        // console.log("🚀 ~ file: saleOrderForm.js:93 ~ updateFormValue ~ updateType, value, nestedObj, nestedIndex:", updateType, value, nestedObj, nestedIndex)
        setErrorMessage("")

        if(!nestedObj) return setSaleOrderObj({...saleOrderObj, [updateType] : value})

        setSaleOrderItemObj((prevSaleOrderObj) => {
            const updatedStates = [...prevSaleOrderObj]; 
            if(updateType === "skuId"){
                updatedStates[nestedIndex][nestedObj] = value;
                const productDetail = getProduct.find(item => item.skuId == value)
                updatedStates[nestedIndex]['unitPrice'] = parseInt(productDetail.cogs);
                updatedStates[nestedIndex]['totalPrice'] = updatedStates[nestedIndex]['quantitySold'] * parseInt(productDetail.cogs);
                setSaleOrderObj({ ...saleOrderObj, "totalPrice": saleOrderItemObj?.reduce((sum, item) => sum + parseFloat(item.totalPrice || 0), 0) })
                return [...updatedStates];
            } else if( updateType === "quantitySold"){
                updatedStates[nestedIndex][nestedObj] = value;
                const unitPrice = updatedStates[nestedIndex]['unitPrice'];
                updatedStates[nestedIndex]['totalPrice'] = unitPrice * value;
                setSaleOrderObj({ ...saleOrderObj, "totalPrice": saleOrderItemObj?.reduce((sum, item) => sum + parseFloat(item.totalPrice || 0), 0) })
                return [...updatedStates];
            }
        });
    }


    const handleAddField = () => {
        setSaleOrderItemObj((prevSaleOrderObj) => ([
            ...prevSaleOrderObj,
            { skuId: '', quantitySold: '', unitPrice: '', user_id: userId, sale_order_id: '', platform_id: null, date: new Date().toISOString().slice(0, 10),taxFee: '' }
        ]));
    };

    const handleRemoveField = async(index, data) => {
        if(state) {
            const response = await axios.delete(process.env.REACT_APP_BASE_URL + `/saleOrderItem/${data?.id}`)
            if(response.status === 200) {
                toast.success("Product Item Deleted Successfully!")
                // navigate("/app/sale-order")
            }
        }
        setSaleOrderItemObj((prevFormData) => {
            const updatedStates = [...prevFormData];
            updatedStates.splice(index, 1)
            return [ ...updatedStates  ];
        });
    };
    // saleOrderItemObj.reduce((sum, item) => sum + parseFloat(item.totalPrice || 0), 0)

    console.log("🚀 ~ file: saleOrderForm.js:117 ~ setSaleOrderItemObj ~ setSaleOrderObj:", saleOrderObj)
    console.log("🚀 ~ file: saleOrderForm.js:117 ~ setSaleOrderItemObj ~ setSaleOrderItemObj:", saleOrderItemObj)
    
    return(
        <>
            <TitleCard title="Sale Order Form" topMargin="mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* <InputTextUpdated type='date' labelTitle="Date" defaultValue={ saleOrderObj?.name} updateFormValue={updateFormValue} updateType="date"/> */}
                    <SelectBox 
                    options={getCustomer} labelTitle="Customer" updateType="customer_id" placeholder={state ? saleOrderObj?.customer?.name : "Pick one Customer"} updateFormValue={updateFormValue}
                    />
                    <InputTextUpdated type='text' labelTitle="Number" defaultValue={ saleOrderObj?.number} updateFormValue={updateFormValue} updateType="number"/>
                    {/* <InputTextUpdated type='date' labelTitle="Arrival Date" defaultValue={ saleOrderObj?.arrivalDate} updateFormValue={updateFormValue} updateType="arrivalDate"/> */}
                    <SelectBox options={STATUS} type='text' labelTitle="Status" defaultValue={ saleOrderObj?.status} placeholder={state ? state.product?.status : "Pick Status"} updateFormValue={updateFormValue} updateType="status"/>
                    {/* <InputTextUpdated type='text' labelTitle="Main Market Place" defaultValue={ saleOrderObj?.mainMarketPlace} updateFormValue={updateFormValue} updateType="mainMarketPlace"/> */}
                    {/* <InputTextUpdated type='text' labelTitle="Carrier" defaultValue={ saleOrderObj?.carrier} updateFormValue={updateFormValue} updateType="carrier"/> */}
                    {/* <InputTextUpdated type='text' labelTitle="Tracking Number" defaultValue={ saleOrderObj?.trackingNumber} updateFormValue={updateFormValue} updateType="trackingNumber"/> */}
                    <InputTextUpdated type='date' labelTitle="Date" defaultValue={ saleOrderObj?.date} updateFormValue={updateFormValue} updateType="date"/>
                    <InputTextUpdated disabled={true} type='text' labelTitle="Total Price" defaultValue={ saleOrderObj?.totalPrice} updateFormValue={updateFormValue} updateType="totalPrice"/>
                    <InputTextUpdated type='number' labelTitle="Tax Fee" defaultValue={ saleOrderObj?.taxFee} updateFormValue={updateFormValue} updateType="taxFee"/>
                    {/* <TextAreaInput type='text' labelTitle="Comment" defaultValue={ saleOrderObj?.comment} updateFormValue={updateFormValue} updateType="comment"/> */}
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
                            <th>Tax Fee</th>
                            <th>Quantity Order</th>
                            <th>Total Price</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                saleOrderItemObj?.map((data, index) => (
                                    <tr key={index}>
                                        <td><SelectBox 
                                        options={getProduct} containerStyle='max-w-xs w-full' labelTitle="" updateType="skuId" placeholder={state ? data.product?.name : "Pick one Product"} nestedObj='skuId' nestedIndex={index} updateFormValue={updateFormValue}
                                        /></td>
                                        <td>
                                            <InputTextUpdated disabled={true} containerStyle='max-w-xs' type="text" defaultValue={data.unitPrice} updateType="unitPrice" nestedObj='unitPrice' nestedIndex={index} placeholder="Price" labelTitle="" updateFormValue={updateFormValue}/>
                                        </td>
                                        <td>
                                            <InputTextUpdated containerStyle='max-w-xs' type="number" defaultValue={data.quantitySold} updateType="taxFee" disabled={data.unitPrice ? false : true} nestedObj='taxFee' nestedIndex={index} placeholder="Tax Fee" labelTitle="" updateFormValue={updateFormValue}/>
                                        </td>
                                        <td>
                                            <InputTextUpdated containerStyle='max-w-xs' type="number" defaultValue={data.quantitySold} updateType="quantitySold" disabled={data.unitPrice ? false : true} nestedObj='quantitySold' nestedIndex={index} placeholder="Quantity" labelTitle="" updateFormValue={updateFormValue}/>
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
                                    
                                    <InputTextUpdated disabled={true} containerStyle='max-w-xs' type="text" defaultValue={saleOrderItemObj.reduce((sum, item) => sum + parseFloat(item.totalPrice || 0), 0)} updateType="unitPrice" placeholder="Price" labelTitle="" updateFormValue={updateFormValue}/>
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


export default SaleOrderForm