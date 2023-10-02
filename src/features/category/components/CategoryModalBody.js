import { useState } from "react"
import { useDispatch } from "react-redux"
import InputText from '../../../components/Input/InputText'
import ErrorText from '../../../components/Typography/ErrorText'
import { showNotification } from "../../common/headerSlice"
import { addNewLead, addNewCategory, updateNewCategory } from "../categorySlice"
import axios from "axios"
import InputTextUpdated from "../../../components/Input/InputTextUpdated"
import SelectBox from "../../../components/Input/SelectBox"
import { useEffect } from "react"
import TextAreaInput from "../../../components/Input/TextAreaInput"
import { toast } from "react-toastify"

const INITIAL_LEAD_OBJ = {
    name: "",
    description: "",
    user_id: localStorage.getItem("userId"),
}

function CategoryModalBody({closeModal, extraObject}){
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [categoryObj, setCategoryObj] = useState(extraObject.category ? extraObject.category : INITIAL_LEAD_OBJ)


    const submitCategory = async (submit) => {
        if(submit === "Update"){
            try {
                delete categoryObj.category;
                const res = await axios.patch(process.env.REACT_APP_BASE_URL + `/category/${extraObject?.id}`, categoryObj)
                if(res.status === 200){
                    dispatch(updateNewCategory({data: res.data.data, index: extraObject.index}))
                    toast.success("Category Updated!")
                    closeModal()
                }
            } catch (error) {
                console.log(error.message);
            }
        } else {
            if(categoryObj.name.trim() === "")return setErrorMessage("Name is required!")
            else if(categoryObj.description.trim() === "")return setErrorMessage("Description is required!")
            else{
                try {
                    const res = await axios.post(process.env.REACT_APP_BASE_URL + "/category", categoryObj)
                    if(res.status === 200){
                        dispatch(addNewCategory(res?.data?.data))
                        toast.success("Category Added successfully!")
                        closeModal()
                    }
                } catch (error) {
                    console.log(error.message);
                    toast.error(error?.response?.data?.message.split(':')[1])
                }
            }
        }
    }


    const updateFormValue = ({updateType, value}) => {
        setErrorMessage("")
        setCategoryObj({...categoryObj, [updateType] : value})
    }
    
    return(
        <>
            <InputTextUpdated type="text" defaultValue={categoryObj?.name} updateType="name" containerStyle="mt-4" labelTitle="Name" updateFormValue={updateFormValue}/>

            <TextAreaInput type="text" defaultValue={categoryObj?.description} updateType="description" containerStyle="mt-4" labelTitle="Description" updateFormValue={updateFormValue}/>

            <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
            <div className="modal-action">
                <button  className="btn btn-outline btn-ghost" onClick={() => closeModal()}>Cancel</button>
                <button  className="btn btn-primary px-6" onClick={() => submitCategory(extraObject.category ? "Update" : "Save")}>{extraObject.category ? "Update" : "Save"}</button>
            </div>
        </>
    )
}

export default CategoryModalBody