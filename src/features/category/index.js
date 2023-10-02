import moment from "moment"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import TitleCard from "../../components/Cards/TitleCard"
import { openModal } from "../common/modalSlice"
import { deleteLead, getLeadsContent, getCategoriesContent } from "./categorySlice"
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../../utils/globalConstantUtil'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import PencilSquareIcon from '@heroicons/react/24/outline/PencilSquareIcon'
import { showNotification } from '../common/headerSlice'
import { getUsersById } from "../settings/profilesettings/profileSlice"
import axios from "axios"
import BasicTable from "../../components/Table/BasicTable"

const TopSideButtons = () => {

    const dispatch = useDispatch()

    const openAddNewCategoryModal = () => {
        dispatch(openModal({title : "Add New Category", bodyType : MODAL_BODY_TYPES.CATEGORY_ADD_EDIT, extraObject: {}}))
    }



    return(
        <div className="inline-block float-right">
            <button className="btn px-6 btn-sm normal-case btn-primary" onClick={() => openAddNewCategoryModal()}>Add New</button>
        </div>
    )
}

function Category(){

    const { categories } = useSelector(state => state.category)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getCategoriesContent())
    }, [])

    

    const getDummyStatus = (index) => {
        if(index % 5 === 0)return <div className="badge">Not Interested</div>
        else if(index % 5 === 1)return <div className="badge badge-primary">In Progress</div>
        else if(index % 5 === 2)return <div className="badge badge-secondary">Sold</div>
        else if(index % 5 === 3)return <div className="badge badge-accent">Need Followup</div>
        else return <div className="badge badge-ghost">Open</div>
    }

    const deleteCurrentCategory = async(index, id) => {
        try {
            const response = await axios.delete(process.env.REACT_APP_BASE_URL + `/category/${id}`)
            if(response.status === 200){
                dispatch(openModal({title : "Confirmation", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
                extraObject : { message : `Are you sure you want to delete this Category?`, type : CONFIRMATION_MODAL_CLOSE_TYPES.CATEGORY_DELETE, index}}))
            }
        } catch (error) {
            console.log(error.message);            
        }
    }

    const editCurrentCategory = async(index, id) => {
        dispatch(openModal({title : "Edit Category", bodyType : MODAL_BODY_TYPES.CATEGORY_ADD_EDIT, extraObject: { index, id, category: categories[index] }}))
    }

    const categoryColum = [
        {
          header: 'Name',
          accessorKey: 'name',
        },
        {
          header: 'Description',
          accessorKey: 'description',
        },
          {
            header: '', 
            accessorKey: '',
            id: 'actions',
            cell: ({row}) => (<>
                    <button className="btn btn-square btn-ghost" onClick={() => editCurrentCategory(row.index, row.original.id)}><PencilSquareIcon className="w-5"/></button>
                    <button className="btn btn-square btn-ghost" onClick={() => deleteCurrentCategory(row.index, row.original.id)}><TrashIcon className="w-5"/></button>
            </>)
          },
    ]

    return(
        <>
            
            <TitleCard title="Current Categories" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>
                <BasicTable data={categories} columns={categoryColum} />
            </TitleCard>
        </>
    )
}


export default Category