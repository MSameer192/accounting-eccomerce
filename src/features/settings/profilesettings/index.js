import moment from "moment"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import TitleCard from "../../../components/Cards/TitleCard"
import { showNotification } from '../../common/headerSlice'
import InputText from '../../../components/Input/InputText'
import TextAreaInput from '../../../components/Input/TextAreaInput'
import ToogleInput from '../../../components/Input/ToogleInput'
import { addNewUser, getUsersById, updateUser, updateUserById } from "./profileSlice";
import axios from "axios"
import InputTextUpdated from "../../../components/Input/InputTextUpdated"

function ProfileSettings(){
    const { users } = useSelector(state => state.user)
    const [patchData, setPatchData] = useState({})
    // console.log("🚀 ~ file: index.js:16 ~ ProfileSettings ~ users:", users)

    const dispatch = useDispatch()
    
    useEffect(() => {
        dispatch(getUsersById())
    }, [])
    
    const updateFormValue = ({updateType, value}) => {
        setPatchData({...patchData, [updateType]: value})
    }

    const updateUserById = async (payload) => {
        const userId = localStorage.getItem("userId");
        const response = await axios.patch(process.env.REACT_APP_BASE_URL + `/user/${userId}`, payload)
        return response;
    }

    // Call API to update profile settings changes
    const updateProfile = async() => {
        try {
            const res = await updateUserById(patchData)
            if(res.status === 200) {
                // res.data
                dispatch(updateUser(res.data.data))
                dispatch(showNotification({message : "Profile Updated", status : 1}))    
            }
        } catch (error) {
            console.log(error.message);
        }

    }

    return(
        <>
            
            <TitleCard title="Profile Settings" topMargin="mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputTextUpdated labelTitle="First Name" defaultValue={ users?.firstName} updateFormValue={updateFormValue} updateType="firstName"/>
                    <InputTextUpdated labelTitle="Last Name" defaultValue={ users?.lastName} updateFormValue={updateFormValue} updateType="lastName"/>
                    <InputTextUpdated labelTitle="Email" defaultValue={ users?.email} updateFormValue={updateFormValue} updateType="email"/>

                    {/* <InputText labelTitle="Email Id" defaultValue="alex@dashwind.com" updateFormValue={updateFormValue}/>
                    <InputText labelTitle="Title" defaultValue="UI/UX Designer" updateFormValue={updateFormValue}/>
                    <InputText labelTitle="Place" defaultValue="California" updateFormValue={updateFormValue}/>
                    <TextAreaInput labelTitle="About" defaultValue="Doing what I love, part time traveller" updateFormValue={updateFormValue}/> */}
                </div>
                {/* <div className="divider" ></div> */}

                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputText labelTitle="Language" defaultValue="English" updateFormValue={updateFormValue}/>
                    <InputText labelTitle="Timezone" defaultValue="IST" updateFormValue={updateFormValue}/>
                    <ToogleInput updateType="syncData" labelTitle="Sync Data" defaultValue={true} updateFormValue={updateFormValue}/>
                </div> */}

                <div className="mt-16"><button className="btn btn-primary float-right" onClick={() => updateProfile()}>Update</button></div>
            </TitleCard>
        </>
    )
}


export default ProfileSettings