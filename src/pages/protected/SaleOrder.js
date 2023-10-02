import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import SaleOrder from '../../features/saleOrder'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Sale Order"}))
      }, [])


    return(
        <SaleOrder />
    )
}

export default InternalPage