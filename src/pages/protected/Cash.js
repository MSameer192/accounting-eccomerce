import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import Cash from '../../features/cash'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Cash"}))
      }, [])


    return(
        <Cash />
    )
}

export default InternalPage