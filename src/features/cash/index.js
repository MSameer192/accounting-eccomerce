import moment from "moment"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import TitleCard from "../../components/Cards/TitleCard"
import { openModal } from "../common/modalSlice"
import { deleteLead, getLeadsContent, getCashContent } from "./cashSlice"
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../../utils/globalConstantUtil'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import PencilSquareIcon from '@heroicons/react/24/outline/PencilSquareIcon'
import { showNotification } from '../common/headerSlice'
import { getUsersById } from "../settings/profilesettings/profileSlice"
import axios from "axios"
import BasicTable from "../../components/Table/BasicTable"

const TopSideButtons = () => {
  const dispatch = useDispatch();

    const openAddNewCashModal = () => {
        dispatch(openModal({title : "Add New Cash", bodyType : MODAL_BODY_TYPES.CASH_ADD_EDIT, extraObject: {}}))
    }



    return(
        <div className="inline-block float-right">
            <button className="btn px-6 btn-sm normal-case btn-primary" onClick={() => openAddNewCashModal()}>Add New</button>
        </div>
    )
}

function Cash() {
  const { cash } = useSelector((state) => state.cash);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCashContent());
  }, []);

    const getDummyStatus = (index) => {
        if(index % 5 === 0)return <div className="badge">Not Interested</div>
        else if(index % 5 === 1)return <div className="badge badge-primary">In Progress</div>
        else if(index % 5 === 2)return <div className="badge badge-secondary">Sold</div>
        else if(index % 5 === 3)return <div className="badge badge-accent">Need Followup</div>
        else return <div className="badge badge-ghost">Open</div>
    }

    const deleteCurrentCash = async(index, id) => {
        try {
            const response = await axios.delete(process.env.REACT_APP_BASE_URL + `/cash/${id}`)
            if(response.status === 200){
                dispatch(openModal({title : "Confirmation", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
                extraObject : { message : `Are you sure you want to delete this Cash?`, type : CONFIRMATION_MODAL_CLOSE_TYPES.CASH_DELETE, index}}))
            }
        } catch (error) {
            console.log(error.message);            
        }
    }

    const editCurrentCash = async(index, id) => {
        dispatch(openModal({title : "Edit Cash", bodyType : MODAL_BODY_TYPES.CASH_ADD_EDIT, extraObject: { index, id, cash: cash[index] }}))
    }


    const cashColum = [
        // {
        //     header: 'Student Name',
        //     accessorFn: (row) => (`${row.student.firstName} ${row.student.lastName}`),
        //     cell: ({getValue}) => (<>
        //         <div className="flex items-center space-x-3">
        //             <div className="avatar">
        //                 <div className="mask mask-circle w-12 h-12">
        //                     <img src={cardImage} alt="Avatar" />
        //                 </div>
        //             </div>
        //             <div>
        //                 <div className="font-bold">{getValue().split(' ')[0]}</div>
        //                 <div className="font-bold">{getValue().split(' ')[1]}</div>
        //             </div>
        //         </div>
        //     </>)
        //   },
        {
          header: 'Debit',
          accessorKey: 'debit',
        },
        {
          header: 'Credit',
          accessorKey: 'credit',
        },
        {
          header: 'Date',
          accessorKey: 'date',
        },
        {
          header: 'Type',
          accessorKey: 'type',
        },
        {
          header: 'Bank Transaction',
          accessorKey: 'bankTransaction',
        },
          {
            header: '', 
            accessorKey: '',
            id: 'actions',
            cell: ({row}) => (<>
                    <button className="btn btn-square btn-ghost" onClick={() => editCurrentCash(row.index, row.original.id)}><PencilSquareIcon className="w-5"/></button>
                    <button className="btn btn-square btn-ghost" onClick={() => deleteCurrentCash(row.index, row.original.id)}><TrashIcon className="w-5"/></button>
            </>)
          },
    ]


    return(
        <>
            
            <TitleCard title="Current Cash" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>
                <BasicTable data={cash} columns={cashColum} />
            </TitleCard>
        </>
    )
}

export default Cash;
