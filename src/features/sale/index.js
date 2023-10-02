import moment from "moment"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import TitleCard from "../../components/Cards/TitleCard"
import { openModal } from "../common/modalSlice"
// import { deleteLead, getLeadsContent, getSaleOrdersContent } from "./saleOrderSlice"
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../../utils/globalConstantUtil'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import PencilSquareIcon from '@heroicons/react/24/outline/PencilSquareIcon'
import { showNotification } from '../common/headerSlice'
import { getUsersById } from "../settings/profilesettings/profileSlice"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import BasicTable from "../../components/Table/BasicTable"
import CreditCardIcon from "@heroicons/react/24/outline/CreditCardIcon"
import instance from "../../utils/axios-config"

const TopSideButtons = () => {

    const dispatch = useDispatch()
    const openAddNewSaleOrderModal = () => {
        dispatch(openModal({title : "Add New SaleOrder", bodyType : MODAL_BODY_TYPES.PURCHASE_ORDER_ADD_EDIT, extraObject: {}}))
    }



    return(
        <div className="inline-block float-right">
            <Link to='form'>
                <button className="btn px-6 btn-sm normal-case btn-primary" >Add New</button>
            </Link>
        </div>
    )
}

function SaleOrder(){

    // const { saleOrders } = useSelector(state => state.saleOrder)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // useEffect(() => {
    //     dispatch(getSaleOrdersContent())
    // }, [])

    const [getSaleOrder, setGetSaleOrder] = useState([])

    // Get saleOrder
    async function saleOrder() {
        const response = await instance.get(process.env.REACT_APP_BASE_URL + `/saleOrder`)
        setGetSaleOrder(response.data?.data);
    }

    useEffect(() => {
        saleOrder()
    },[])

    
    const deleteCurrentSaleOrder = async(index, id) => {
        try {
            const response = await axios.delete(process.env.REACT_APP_BASE_URL + `/saleOrder/${id}`)
            if(response.status === 200){
                dispatch(openModal({title : "Confirmation", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
                extraObject : { message : `Are you sure you want to delete this SaleOrder?`, type : CONFIRMATION_MODAL_CLOSE_TYPES.PURCHASE_ORDER_DELETE, index}}))
                saleOrder();
            }
        } catch (error) {
            console.log(error.message);            
        }
    }

    const editCurrentSaleOrder = async(index, data) => {
        // dispatch(openModal({title : "Edit SaleOrder", bodyType : MODAL_BODY_TYPES.PURCHASE_ORDER_ADD_EDIT, extraObject: { index, id, saleOrder: saleOrders[index] }}))
        navigate('form', { state: data })

    }

    const saleOrderColum = [
        {
            header: 'Number',
            accessorKey: 'number',
          },
          {
            header: 'Status',
            accessorKey: 'status',
          },
          {
            header: 'Tax Fee',
            accessorKey: 'taxFee',
          },
          {
            header: 'Total Price',
            accessorKey: 'totalPrice',
          },
        {
        header: '', 
        accessorKey: '',
        id: 'actions',
        cell: ({row}) => (<>
                <button className="btn btn-square btn-ghost" onClick={() => editCurrentSaleOrder(row.index, row.original)}><PencilSquareIcon className="w-5"/></button>
                <button className="btn btn-square btn-ghost" onClick={() => deleteCurrentSaleOrder(row.index, row.original.id)}><TrashIcon className="w-5"/></button>
        </>)
        },
    ]

    return(
        <>
            
            <TitleCard title="Current SaleOrders" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>

                <BasicTable data={getSaleOrder} columns={saleOrderColum} />

            </TitleCard>
            <div className="grid lg:grid-cols-4 mt-2 md:grid-cols-2 grid-cols-1 gap-6">
                <div className="stats shadow">
                    <div className="stat">
                        <div className={`stat-figure dark:text-slate-300 text-primary`}><CreditCardIcon className='w-8 h-8'/></div>
                        <div className="stat-title dark:text-slate-300">{"Today"}</div>
                        <div className={`stat-value dark:text-slate-300 text-primary`}>{"$50K"}</div>
                        <div className={"stat-desc font-bold text-green-700 dark:text-green-300"}>{"description"}</div>
                        {/* <div className="divider mt-2 w-full"></div> */}
                        <div className="stat-title divider mt-2 w-full"></div>
                        <div className="stat-title dark:text-slate-300">{"title"}</div>
                        <div className={`stat-value dark:text-slate-300 text-primary`}>{"value"}</div>
                        <div className={"stat-desc font-bold text-green-700 dark:text-green-300"}>{"description"}</div>
                    </div>
          
                        {/** Card Body */}
                        {/* <div className='h-full w-full pb-6 bg-base-100'>
                        </div> */}
                </div>
            </div>
        </>
    )
}


export default SaleOrder