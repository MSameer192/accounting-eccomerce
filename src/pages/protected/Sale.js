import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import Sale from '../../features/sale'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Sale"}))
      }, [])


    return(
        <Sale />
    )
}

export default InternalPage