import moment from "moment";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { openModal } from "../common/modalSlice";
import {
  deleteLead,
  getLeadsContent,
  getProductsContent,
} from "./productSlice";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../utils/globalConstantUtil";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import PencilSquareIcon from "@heroicons/react/24/outline/PencilSquareIcon";
import { showNotification } from "../common/headerSlice";
import { getUsersById } from "../settings/profilesettings/profileSlice";
import axios from "axios";
import BasicTable from "../../components/Table/BasicTable";

const TopSideButtons = () => {
  const dispatch = useDispatch();

    const openAddNewProductModal = () => {
        dispatch(openModal({title : "Add New Product", bodyType : MODAL_BODY_TYPES.PRODUCT_ADD_NEW, extraObject: {}}))
    }



    return(
        <div className="inline-block float-right">
            <button className="btn px-6 btn-sm normal-case btn-primary" onClick={() => openAddNewProductModal()}>Add New</button>
        </div>
    )
}

function Products() {
  const { products } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  console.log("products", products)

  useEffect(() => {
    dispatch(getProductsContent());
  }, []);

  const deleteCurrentProduct = async (index, id) => {
    try {
      const response = await axios.delete(
        process.env.REACT_APP_BASE_URL + `/product/${id}`
      );
      if (response.status === 200) {
        dispatch(
          openModal({
            title: "Confirmation",
            bodyType: MODAL_BODY_TYPES.CONFIRMATION,
            extraObject: {
              message: `Are you sure you want to delete this Product?`,
              type: CONFIRMATION_MODAL_CLOSE_TYPES.PRODUCT_DELETE,
              index,
            },
          })
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const editCurrentProduct = async (index, id) => {
    dispatch(
      openModal({
        title: "Edit Product",
        bodyType: MODAL_BODY_TYPES.PRODUCT_ADD_NEW,
        extraObject: { index, id, product: products[index] },
      })
    );
  };

  const productColum = [
    // {
    //     header: 'Student Name',
    //     accessorFn: (row) => (`${row.student.firstName} ${row.student.lastName}`),
    //     cell: ({getValue}) => (<>
    //         <div className="flex items-center space-x-3">
    //             <div className="avatar">
    //                 <div className="mask mask-circle w-12 h-12">
    //                     <img src={cardImage} alt="Avatar" />
    //                 </div>
    //             </div>
    //             <div>
    //                 <div className="font-bold">{getValue().split(' ')[0]}</div>
    //                 <div className="font-bold">{getValue().split(' ')[1]}</div>
    //             </div>
    //         </div>
    //     </>)
    //   },
    {
      header: 'SKU Id',
      accessorKey: 'skuId',
    },
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Description',
      accessorKey: 'description',
    },
    {
      header: 'cogs',
      accessorKey: 'cogs',
    },
    {
      header: 'Category',
      accessorKey: 'category?.name',
    },
      {
        header: '', 
        accessorKey: '',
        id: 'actions',
        cell: ({row}) => (<>
                <button className="btn btn-square btn-ghost" onClick={() => editCurrentProduct(row.index, row.original.id)}><PencilSquareIcon className="w-5"/></button>
                <button className="btn btn-square btn-ghost" onClick={() => deleteCurrentProduct(row.index, row.original.id)}><TrashIcon className="w-5"/></button>
        </>)
      },
]

  return (
    <>
      <TitleCard
        title="Current Products"
        topMargin="mt-2"
        TopSideButtons={<TopSideButtons />}
      >
        <BasicTable data={products} columns={productColum} />

      </TitleCard>
    </>
  );
}

export default Products;
