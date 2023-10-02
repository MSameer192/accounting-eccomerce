import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import SaleOrderForm from '../../features/saleOrder/detail/saleOrderForm'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "SaleOrder Form"}))
      }, [])


    return(
        <SaleOrderForm />
    )
}

export default InternalPage