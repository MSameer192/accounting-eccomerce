import PageContent from "./PageContent"
import LeftSidebar from "./LeftSidebar"
import { useSelector, useDispatch } from 'react-redux'
import RightSidebar from './RightSidebar'
import { useEffect } from "react"
import  {  removeNotificationMessage } from "../features/common/headerSlice"
// import {NotificationContainer, NotificationManager} from 'react-notifications';
// import 'react-notifications/lib/notifications.css';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import toast from 'react-hot-toast';
import ModalLayout from "./ModalLayout"

function Layout(){
  const dispatch = useDispatch()
  const {newNotificationMessage, newNotificationStatus} = useSelector(state => state.header)


  useEffect(() => {
      if(newNotificationMessage !== ""){
        // if(newNotificationStatus === 1)toast.success(newNotificationMessage)
        // if(newNotificationStatus === 0)toast.error( newNotificationMessage)
          dispatch(removeNotificationMessage())
      }
  }, [newNotificationMessage])

    return(
      <>
        { /* Left drawer - containing page content and side bar (always open) */ }
        <div className="drawer drawer-mobile">
            <input id="left-sidebar-drawer" type="checkbox" className="drawer-toggle" />
            <PageContent/>
            <LeftSidebar />
        </div>

        { /* Right drawer - containing secondary content like notifications list etc.. */ }
        <RightSidebar />


        {/** Notification layout container */}
        {/* <NotificationContainer /> */}
        {/* <ToastContainer /> */}


      {/* Modal layout container */}
        <ModalLayout />

      </>
    )
}

export default Layout