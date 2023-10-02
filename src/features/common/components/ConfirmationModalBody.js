import {useDispatch, useSelector} from 'react-redux'
import axios from 'axios'
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_CLOSE_TYPES } from '../../../utils/globalConstantUtil'
import { showNotification } from '../headerSlice'
import { deleteProduct } from '../../products/productSlice'
import { deleteCategory } from '../../category/categorySlice'
import { deleteCash } from '../../cash/cashSlice'
import { deletePurchaseOrder } from '../../purchaseOrder/purchaseOrderSlice'
import { deleteOrder } from '../../orders/orderSlice'
import { toast } from 'react-toastify'

function ConfirmationModalBody({ extraObject, closeModal}){

    const dispatch = useDispatch()

    const { message, type, _id, index, id} = extraObject


    const proceedWithYes = async() => {

        if(type === CONFIRMATION_MODAL_CLOSE_TYPES.PRODUCT_DELETE){
            // positive response, call api or dispatch redux function
            dispatch(deleteProduct({index}))
            // dispatch(showNotification({message : "Product Deleted!", status : 1}))
            toast.success("Product Deleted!")
        }
        if(type === CONFIRMATION_MODAL_CLOSE_TYPES.CATEGORY_DELETE){
            // positive response, call api or dispatch redux function
            dispatch(deleteCategory({index}))
            // dispatch(showNotification({message : "Category Deleted!", status : 1}))
            toast.success("Category Deleted!")
        }
        if(type === CONFIRMATION_MODAL_CLOSE_TYPES.CASH_DELETE){
            // positive response, call api or dispatch redux function
            dispatch(deleteCash({index}))
            // dispatch(showNotification({message : "Cash Deleted!", status : 1}))
            toast.success("Cash Deleted!")
        }
        if(type === CONFIRMATION_MODAL_CLOSE_TYPES.PURCHASE_ORDER_DELETE){
            // positive response, call api or dispatch redux function
            dispatch(deletePurchaseOrder({index}))
            // dispatch(showNotification({message : "Purchase Order Deleted!", status : 1}))
            toast.success("Purchase Order Deleted!")
        }
        if(type === CONFIRMATION_MODAL_CLOSE_TYPES.ORDER_DELETE){
            // positive response, call api or dispatch redux function
            dispatch(deleteOrder({index}))
            // dispatch(showNotification({message : "Order Deleted!", status : 1}))
            toast.success("Order Deleted!")
        }
        if(type === CONFIRMATION_MODAL_CLOSE_TYPES.SUPPLIER_DELETE){
            // positive response, call api or dispatch redux function
            dispatch(deleteOrder({index}))
            // dispatch(showNotification({message : "Supplier Deleted!", status : 1}))
            toast.success("Supplier Deleted!")
        }
        closeModal()
    }

    return(
        <> 
        <p className=' text-xl mt-8 text-center'>
            {message}
        </p>

        <div className="modal-action mt-12">
                
                <button className="btn btn-outline" onClick={() => closeModal()}>Cancel</button>

                <button className="btn btn-primary w-36" onClick={() => proceedWithYes()}>Yes</button> 

        </div>
        </>
    )
}

export default ConfirmationModalBody