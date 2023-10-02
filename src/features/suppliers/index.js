import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { openModal } from "../common/modalSlice";
import {
  deleteLead,
  getLeadsContent,
  getSuppliersContent
} from "./supplierSlice";
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

  const openAddNewSupplierModal = () => {
    dispatch(
      openModal({
        title: "Add New Supplier",
        bodyType: MODAL_BODY_TYPES.SUPPLIER_ADD_EDIT,
        extraObject: {},
      })
    );
  };

  return (
    <div className="inline-block float-right">
      <button
        className="btn px-6 btn-sm normal-case btn-primary"
        onClick={() => openAddNewSupplierModal()}
      >
        Add New
      </button>
    </div>
  );
};

function Suppliers() {
  const { suppliers } = useSelector((state) => state.supplier);
  const dispatch = useDispatch();

  console.log("suppliers", suppliers)

  useEffect(() => {
    dispatch(getSuppliersContent());
  }, []);


  const getDummyStatus = (index) => {
    if (index % 5 === 0) return <div className="badge">Not Interested</div>;
    else if (index % 5 === 1)
      return <div className="badge badge-primary">In Progress</div>;
    else if (index % 5 === 2)
      return <div className="badge badge-secondary">Sold</div>;
    else if (index % 5 === 3)
      return <div className="badge badge-accent">Need Followup</div>;
    else return <div className="badge badge-ghost">Open</div>;
  };

  const deleteCurrentSupplier = async (index, id) => {
    try {
      const response = await axios.delete(
        process.env.REACT_APP_BASE_URL + `/supplier/${id}`
      );
      if (response.status === 200) {
        dispatch(
          openModal({
            title: "Confirmation",
            bodyType: MODAL_BODY_TYPES.CONFIRMATION,
            extraObject: {
              message: `Are you sure you want to delete this Suppliers?`,
              type: CONFIRMATION_MODAL_CLOSE_TYPES.SUPPLIER_DELETE,
              index,
            },
          })
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const editCurrentSupplier = async (index, id) => {
    dispatch(
      openModal({
        title: "Edit Suppliers",
        bodyType: MODAL_BODY_TYPES.SUPPLIER_ADD_EDIT,
        extraObject: { index, id, supplier: suppliers[index] },
      })
    );
  };

  const suppliersColum = [
    {
      header: 'Company Name',
      accessorKey: 'companyName',
    },
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Email',
      accessorKey: 'email',
    },
    {
      header: 'Phone',
      accessorKey: 'phoneNumber',
    },
    {
      header: 'Website',
      accessorKey: 'website',
    },
    {
      header: 'Address',
      accessorKey: 'address',
    },
    {
      header: 'Comment',
      accessorKey: 'comment',
    },
    {
      header: '', 
      accessorKey: '',
      id: 'actions',
      cell: ({row}) => (<>
              <button className="btn btn-square btn-ghost" onClick={() => editCurrentSupplier(row.index, row.original.id)}><PencilSquareIcon className="w-5"/></button>
              <button className="btn btn-square btn-ghost" onClick={() => deleteCurrentSupplier(row.index, row.original.id)}><TrashIcon className="w-5"/></button>
      </>)
    },
]

  return (
    <>
      <TitleCard
        title="Current Suppliers"
        topMargin="mt-2"
        TopSideButtons={<TopSideButtons />}
      >
        {/* Leads List in table format loaded from slice after api call */}
       
        <BasicTable data={suppliers} columns={suppliersColum} />

      </TitleCard>
    </>
  );
}

export default Suppliers;
