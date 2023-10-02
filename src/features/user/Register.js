import {useState, useRef} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import LandingIntro from './LandingIntro'
import ErrorText from  '../../components/Typography/ErrorText'
import InputText from '../../components/Input/InputText'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { getUsersById, updateUser } from '../settings/profilesettings/profileSlice'
import { showNotification } from '../common/headerSlice'
import { toast } from 'react-toastify'

function Register(){

    const INITIAL_REGISTER_OBJ = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    }

    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [registerObj, setRegisterObj] = useState(INITIAL_REGISTER_OBJ)

    const submitForm = async (e) =>{
        e.preventDefault()
        setErrorMessage("")

        if(registerObj.firstName.trim() === "")return setErrorMessage("firstName is required! (use any value)")
        if(registerObj.lastName.trim() === "")return setErrorMessage("lastName Id is required! (use any value)")
        if(registerObj.email.trim() === "")return setErrorMessage("email is required! (use any value)")
        if(registerObj.password.trim() === "")return setErrorMessage("password is required! (use any value)")
        else{
            try {
                setLoading(true)
                // Call API to check user credentials and save token in local storage
                const res = await axios.post(process.env.REACT_APP_BASE_URL + "/user/signup", registerObj)
                if(res.status === 201){
                    localStorage.setItem("token", res.data.token)
                    localStorage.setItem("userId", res.data.userId)
                    dispatch(updateUser(res.data.user))
                    setLoading(false)
                    navigate("/app/welcome")
                    toast.success("Logged in successfully!")
                }
            } catch (error) {
                console.log(error.message);
                toast.error(error?.response?.data?.message.split(':')[1])
                setLoading(false)
            }
        }
    }

    const updateFormValue = ({updateType, value}) => {
        setErrorMessage("")
        setRegisterObj({...registerObj, [updateType] : value})
    }

    return(
        <div className="min-h-screen bg-base-200 flex items-center">
            <div className="card mx-auto w-full max-w-5xl  shadow-xl">
                <div className="grid  md:grid-cols-2 grid-cols-1  bg-base-100 rounded-xl">
                <div className=''>
                        <LandingIntro />
                </div>
                <div className='py-24 px-10'>
                    <h2 className='text-2xl font-semibold mb-2 text-center'>Register</h2>
                    <form onSubmit={(e) => submitForm(e)}>

                        <div className="mb-4">

                            <InputText defaultValue={registerObj.firstName} updateType="firstName" containerStyle="mt-4" labelTitle="First Name" updateFormValue={updateFormValue}/>

                            <InputText defaultValue={registerObj.lastName} updateType="lastName" containerStyle="mt-4" labelTitle="Last Name" updateFormValue={updateFormValue}/>

                            <InputText defaultValue={registerObj.email} type="email" updateType="email" containerStyle="mt-4" labelTitle="Email" updateFormValue={updateFormValue}/>

                            <InputText defaultValue={registerObj.password} type="password" updateType="password" containerStyle="mt-4" labelTitle="Password" updateFormValue={updateFormValue}/>

                        </div>

                        <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
                        <button type="submit" className={"btn mt-2 w-full btn-primary" + (loading ? " loading" : "")}>Register</button>

                        <div className='text-center mt-4'>Already have an account? <Link to="/login"><span className="  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">Login</span></Link></div>
                    </form>
                </div>
            </div>
            </div>
        </div>
    )
}

export default Register