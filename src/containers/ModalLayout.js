import { MODAL_BODY_TYPES } from '../utils/globalConstantUtil'
import { useSelector, useDispatch } from 'react-redux'
import { closeModal } from '../features/common/modalSlice'
import ConfirmationModalBody from '../features/common/components/ConfirmationModalBody'
import ProductModalBody from '../features/products/components/ProductModalBody'
import CategoryModalBody from '../features/category/components/CategoryModalBody'
import CashModalBody from '../features/cash/components/cashModalBody'
import PurchaseOrderModalBody from '../features/purchaseOrder/components/PurchaseOrderModalBody'
import OrderModalBody from '../features/orders/components/OrderModalBody'
import CustomerModalBody from '../features/customers/components/CustomerModalBody'
import SupplierModalBody from '../features/suppliers/components/SupplierModalBody'


function ModalLayout(){

    const {isOpen, bodyType, size, extraObject, title} = useSelector(state => state.modal)
    const dispatch = useDispatch()

    const close = (e) => {
        dispatch(closeModal(e))
    }



    return(
        <>
        {/* The button to open modal */}

            {/* Put this part before </body> tag */}
            <div className={`modal ${isOpen ? "modal-open" : ""}`}>
            <div className={`modal-box  ${size === 'lg' ? 'max-w-5xl' : ''}`}>
                <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => close()}>✕</button>
                <h3 className="font-semibold text-2xl pb-6 text-center">{title}</h3>


                {/* Loading modal body according to different modal type */}
                {
                    {
                             [MODAL_BODY_TYPES.PRODUCT_ADD_NEW] : <ProductModalBody closeModal={close} extraObject={extraObject}/>,
                             [MODAL_BODY_TYPES.CATEGORY_ADD_EDIT] : <CategoryModalBody closeModal={close} extraObject={extraObject}/>,
                             [MODAL_BODY_TYPES.CASH_ADD_EDIT] : <CashModalBody closeModal={close} extraObject={extraObject}/>,
                             [MODAL_BODY_TYPES.PURCHASE_ORDER_ADD_EDIT] : <PurchaseOrderModalBody closeModal={close} extraObject={extraObject}/>,
                             [MODAL_BODY_TYPES.ORDER_ADD_EDIT] : <OrderModalBody closeModal={close} extraObject={extraObject}/>,
                             [MODAL_BODY_TYPES.CUSTOMER_ADD_EDIT] : <CustomerModalBody closeModal={close} extraObject={extraObject}/>,
                             [MODAL_BODY_TYPES.SUPPLIER_ADD_EDIT] : <SupplierModalBody closeModal={close} extraObject={extraObject}/>,
                             [MODAL_BODY_TYPES.CONFIRMATION] : <ConfirmationModalBody extraObject={extraObject} closeModal={close}/>,
                             [MODAL_BODY_TYPES.DEFAULT] : <div></div>
                    }[bodyType]
                }
            </div>
            </div>
            </>
    )
}

export default ModalLayout