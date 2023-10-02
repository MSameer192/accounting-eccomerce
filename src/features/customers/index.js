import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { openModal } from "../common/modalSlice";
import {
  deleteLead,
  getLeadsContent,
  getCustomersContent
} from "./customerSlice";
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

  const openAddNewCustomerModal = () => {
    dispatch(
      openModal({
        title: "Add New Customer",
        bodyType: MODAL_BODY_TYPES.CUSTOMER_ADD_EDIT,
        extraObject: {},
      })
    );
  };

  return (
    <div className="inline-block float-right">
      <button
        className="btn px-6 btn-sm normal-case btn-primary"
        onClick={() => openAddNewCustomerModal()}
      >
        Add New
      </button>
    </div>
  );
};

function Customers() {
  const { customers } = useSelector((state) => state.customer);
  const dispatch = useDispatch();

  console.log("customers", customers)
  const [customerData, setCustomerData] = useState(null);

  useEffect(() => {
    dispatch(getCustomersContent());
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

  const deleteCurrentCustomer = async (index, id) => {
    try {
      const response = await axios.delete(
        process.env.REACT_APP_BASE_URL + `/customer/${id}`
      );
      if (response.status === 200) {
        dispatch(
          openModal({
            title: "Confirmation",
            bodyType: MODAL_BODY_TYPES.CONFIRMATION,
            extraObject: {
              message: `Are you sure you want to delete this Customers?`,
              type: CONFIRMATION_MODAL_CLOSE_TYPES.CUSTOMER_DELETE,
              index,
            },
          })
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const editCurrentCustomer = async (index, id) => {
    dispatch(
      openModal({
        title: "Edit Customer",
        bodyType: MODAL_BODY_TYPES.CUSTOMER_ADD_EDIT,
        extraObject: { index, id, customer: customers[index] },
      })
    );
  };
  const categoryColum = [
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Email',
      accessorKey: 'email',
    },
    {
      header: 'Address',
      accessorKey: 'address',
    },
    {
      header: 'Phone',
      accessorKey: 'phone',
    },
      {
        header: '', 
        accessorKey: '',
        id: 'actions',
        cell: ({row}) => (<>
                <button className="btn btn-square btn-ghost" onClick={() => editCurrentCustomer(row.index, row.original.id)}><PencilSquareIcon className="w-5"/></button>
                <button className="btn btn-square btn-ghost" onClick={() => deleteCurrentCustomer(row.index, row.original.id)}><TrashIcon className="w-5"/></button>
        </>)
      },
]

  return (
    <>
      <TitleCard
        title="Current Customers"
        topMargin="mt-2"
        TopSideButtons={<TopSideButtons />}
      >
        <BasicTable data={customers} columns={categoryColum} />

      </TitleCard>
    </>
  );
}

export default Customers;
