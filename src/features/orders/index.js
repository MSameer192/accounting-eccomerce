import moment from "moment"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import TitleCard from "../../components/Cards/TitleCard"
import { openModal } from "../common/modalSlice"
import { deleteLead, getLeadsContent, getOrdersContent } from "./orderSlice"
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../../utils/globalConstantUtil'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import PencilSquareIcon from '@heroicons/react/24/outline/PencilSquareIcon'
import { showNotification } from '../common/headerSlice'
import { getUsersById } from "../settings/profilesettings/profileSlice"
import axios from "axios"

const TopSideButtons = () => {

    const dispatch = useDispatch()

    const openAddNewOrderModal = () => {
        dispatch(openModal({title : "Add New Order", bodyType : MODAL_BODY_TYPES.ORDER_ADD_EDIT, extraObject: {}}))
    }



    return(
        <div className="inline-block float-right">
            <button className="btn px-6 btn-sm normal-case btn-primary" onClick={() => openAddNewOrderModal()}>Add New</button>
        </div>
    )
}

function Orders(){

    const { orders } = useSelector(state => state.order)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getOrdersContent())
    }, [])

    

    const getDummyStatus = (index) => {
        if(index % 5 === 0)return <div className="badge">Not Interested</div>
        else if(index % 5 === 1)return <div className="badge badge-primary">In Progress</div>
        else if(index % 5 === 2)return <div className="badge badge-secondary">Sold</div>
        else if(index % 5 === 3)return <div className="badge badge-accent">Need Followup</div>
        else return <div className="badge badge-ghost">Open</div>
    }

    const deleteCurrentOrder = async(index, id) => {
        try {
            const response = await axios.delete(process.env.REACT_APP_BASE_URL + `/order/${id}`)
            if(response.status === 200){
                dispatch(openModal({title : "Confirmation", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
                extraObject : { message : `Are you sure you want to delete this Order?`, type : CONFIRMATION_MODAL_CLOSE_TYPES.ORDER_DELETE, index}}))
            }
        } catch (error) {
            console.log(error.message);            
        }
    }

    const editCurrentOrder = async(index, id) => {
        dispatch(openModal({title : "Edit Order", bodyType : MODAL_BODY_TYPES.ORDER_ADD_EDIT, extraObject: { index, id, order: orders[index] }}))
    }

    return(
        <>
            
            <TitleCard title="Current Orders" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>

                {/* Leads List in table format loaded from slice after api call */}
            <div className="overflow-x-auto w-full">
                <table className="table w-full">
                    <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total Price</th>
                        <th>Order Date</th>
                        <th>Order Status</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            orders.map((l, k) => {
                                return(
                                    <tr key={k}>
                                        <td>{l?.product?.skuName}</td>
                                        <td>{l?.quantity}</td>
                                        <td>{l?.unitPrice}</td>
                                        <td>{l?.totalPrice}</td>
                                        <td>{l?.orderDate}</td>
                                        <td>{l?.orderStatus}</td>
                                        <td><button className="btn btn-square btn-ghost" onClick={() => editCurrentOrder(k, l?.id)}><PencilSquareIcon className="w-5"/></button><button className="btn btn-square btn-ghost" onClick={() => deleteCurrentOrder(k, l?.id)}><TrashIcon className="w-5"/></button></td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            </TitleCard>
        </>
    )
}


export default Orders