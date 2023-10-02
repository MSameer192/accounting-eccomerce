import moment from "moment"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import TitleCard from "../../components/Cards/TitleCard"
import { openModal } from "../common/modalSlice"
import { deleteLead, getLeadsContent, getPurchaseOrdersContent } from "./purchaseOrderSlice"
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../../utils/globalConstantUtil'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import PencilSquareIcon from '@heroicons/react/24/outline/PencilSquareIcon'
import { showNotification } from '../common/headerSlice'
import { getUsersById } from "../settings/profilesettings/profileSlice"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import BasicTable from "../../components/Table/BasicTable"
import instance from "../../utils/axios-config"

const TopSideButtons = () => {

    const dispatch = useDispatch()
    const openAddNewPurchaseOrderModal = () => {
        dispatch(openModal({title : "Add New PurchaseOrder", bodyType : MODAL_BODY_TYPES.PURCHASE_ORDER_ADD_EDIT, extraObject: {}}))
    }



    return(
        <div className="inline-block float-right">
            <Link to='form'>
                <button className="btn px-6 btn-sm normal-case btn-primary" >Add New</button>
            </Link>
        </div>
    )
}

function PurchaseOrder(){

    // const { purchaseOrders } = useSelector(state => state.purchaseOrder)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // useEffect(() => {
    //     dispatch(getPurchaseOrdersContent())
    // }, [])

    const [getPurchaseOrder, setGetPurchaseOrder] = useState([])

    // Get purchaseOrder
    async function purchaseOrder() {
        const response = await instance.get(process.env.REACT_APP_BASE_URL + `/purchaseOrder`)
        setGetPurchaseOrder(response.data?.data);
    }

    useEffect(() => {
        purchaseOrder()
    },[])

    
    const deleteCurrentPurchaseOrder = async(index, id) => {
        try {
            const response = await axios.delete(process.env.REACT_APP_BASE_URL + `/purchaseOrder/${id}`)
            if(response.status === 200){
                dispatch(openModal({title : "Confirmation", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
                extraObject : { message : `Are you sure you want to delete this PurchaseOrder?`, type : CONFIRMATION_MODAL_CLOSE_TYPES.PURCHASE_ORDER_DELETE, index}}))
                purchaseOrder();
            }
        } catch (error) {
            console.log(error.message);            
        }
    }

    const editCurrentPurchaseOrder = async(index, data) => {
        // dispatch(openModal({title : "Edit PurchaseOrder", bodyType : MODAL_BODY_TYPES.PURCHASE_ORDER_ADD_EDIT, extraObject: { index, id, purchaseOrder: purchaseOrders[index] }}))
        navigate('form', { state: data })

    }

    const purchaseOrderColum = [
        {
            header: 'Number',
            accessorKey: 'number',
          },
          {
            header: 'Arrival Date',
            accessorKey: 'arrivalDate',
          },
          {
            header: 'Status',
            accessorKey: 'status',
          },
          {
            header: 'Main Market Place',
            accessorKey: 'mainMarketPlace',
          },
          {
            header: 'Carrier',
            accessorKey: 'carrier',
          },
          {
            header: 'Tracking Number',
            accessorKey: 'trackingNumber',
          },
          {
            header: 'Total Cost',
            accessorKey: 'totalCost',
          },
        {
        header: '', 
        accessorKey: '',
        id: 'actions',
        cell: ({row}) => (<>
                <button className="btn btn-square btn-ghost" onClick={() => editCurrentPurchaseOrder(row.index, row.original)}><PencilSquareIcon className="w-5"/></button>
                <button className="btn btn-square btn-ghost" onClick={() => deleteCurrentPurchaseOrder(row.index, row.original.id)}><TrashIcon className="w-5"/></button>
        </>)
        },
    ]

    return(
        <>
            
            <TitleCard title="Current PurchaseOrders" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>

                <BasicTable data={getPurchaseOrder} columns={purchaseOrderColum} />

            </TitleCard>
        </>
    )
}


export default PurchaseOrder