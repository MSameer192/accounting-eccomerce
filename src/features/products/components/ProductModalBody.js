import { useState } from "react"
import { useDispatch } from "react-redux"
import InputText from '../../../components/Input/InputText'
import ErrorText from '../../../components/Typography/ErrorText'
import { showNotification } from "../../common/headerSlice"
import { addNewLead, addNewProduct, updateNewProduct } from "../productSlice"
import axios from "axios"
import InputTextUpdated from "../../../components/Input/InputTextUpdated"
import SelectBox from "../../../components/Input/SelectBox"
import { useEffect } from "react"
import { toast } from "react-toastify"
import instance from "../../../utils/axios-config"

const INITIAL_LEAD_OBJ = {
    skuId: "",
    name: "",
    description: "",
    cogs: "",
    productImage: "",
    user_id: localStorage.getItem("userId"),
    category_id: ""
}

function ProductModalBody({closeModal, extraObject}){
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [productObj, setProductObj] = useState(extraObject.product ? extraObject.product : INITIAL_LEAD_OBJ)
    const [categoryOption, setCategoryOption] = useState([])

    const getCategories = async () => {
    	const response = await instance.get(process.env.REACT_APP_BASE_URL + `/category`)
        setCategoryOption(response.data.data)
    }

    useEffect(() => {
        getCategories()
    }, [])

    const submitProduct = async (submit) => {
        if(submit === "Update"){
            try {
                delete productObj.category;
                const res = await axios.patch(process.env.REACT_APP_BASE_URL + `/product/${extraObject?.id}`, productObj)
                if(res.status === 200){
                    dispatch(updateNewProduct({data: res.data.data, index: extraObject.index}))
                    toast.success("Product Updated!")
                    closeModal()
                }
            } catch (error) {
                console.log(error.message);
            }
        } else {
            if(productObj.skuId.trim() === "")return setErrorMessage("SKU is required!")
            else if(productObj.description.trim() === "")return setErrorMessage("Description is required!")
            else if(productObj.category_id.trim() === "")return setErrorMessage("Category is required!")
            else if(productObj.name.trim() === "")return setErrorMessage("Name is required!")
            else if(productObj.cogs.trim() === "")return setErrorMessage("COGS is required!")
            else if(productObj.productImage.trim() === "")return setErrorMessage("Product Image is required!")
            else{
                try {
                    const res = await axios.post(process.env.REACT_APP_BASE_URL + "/product", productObj)
                    if(res.status === 200){
                        dispatch(addNewProduct(res?.data?.data))
                        toast.success("New Product Added!")
                        closeModal()
                    }
                } catch (error) {
                    console.log(error.message);
                    toast.error(error?.response?.data?.message.split(':')[1])
                }
            }
        }
    }

    // const 


    const updateFormValue = ({updateType, value}) => {
        setErrorMessage("")
        setProductObj({...productObj, [updateType] : value})
    }
    console.log("🚀 ~ file: ProductModalBody.js:81 ~ updateFormValue ~ productObj:", productObj)
    
    return(
        <>
            <InputTextUpdated type="number" defaultValue={productObj?.skuId} updateType="skuId" containerStyle="mt-4" labelTitle="SKU Name" updateFormValue={updateFormValue}/>

            <InputTextUpdated type="text" defaultValue={productObj?.name} updateType="name" containerStyle="mt-4" labelTitle="Name" updateFormValue={updateFormValue}/>

            <InputTextUpdated type="text" defaultValue={productObj?.description} updateType="description" containerStyle="mt-4" labelTitle="Description" updateFormValue={updateFormValue}/>

             <SelectBox 
                options={categoryOption} labelTitle="Category" updateType="category_id" containerStyle="form-control w-full mt-4" placeholder="Pick one category" updateFormValue={updateFormValue}
            />

            <InputTextUpdated type="number" defaultValue={productObj?.cogs} updateType="cogs" containerStyle="mt-4" labelTitle="COGS" updateFormValue={updateFormValue}/>

            <InputTextUpdated type="text" defaultValue={productObj?.productImage} updateType="productImage" containerStyle="mt-4" labelTitle="Product Image" updateFormValue={updateFormValue}/>
            
            <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
            <div className="modal-action">
                <button  className="btn btn-outline btn-ghost" onClick={() => closeModal()}>Cancel</button>
                <button  className="btn btn-primary px-6" onClick={() => submitProduct(extraObject.product ? "Update" : "Save")}>{extraObject.product ? "Update" : "Save"}</button>
            </div>
        </>
    )
}

export default ProductModalBody