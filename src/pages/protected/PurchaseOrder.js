import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import PurchaseOrder from '../../features/purchaseOrder'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "PurchaseOrder"}))
      }, [])


    return(
        <PurchaseOrder />
    )
}

export default InternalPage