import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import PurchaseOrderForm from '../../features/purchaseOrder/detail/purchaseOrderForm'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "PurchaseOrder Form"}))
      }, [])


    return(
        <PurchaseOrderForm />
    )
}

export default InternalPage