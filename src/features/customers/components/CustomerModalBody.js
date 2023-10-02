import { useState } from "react";
import { useDispatch } from "react-redux";
import InputText from "../../../components/Input/InputText";
import ErrorText from "../../../components/Typography/ErrorText";
import { showNotification } from "../../common/headerSlice";
import {
  addNewLead,
  addNewCustomer,
  updateNewCustomer,
} from "../customerSlice";
import axios from "axios";
import InputTextUpdated from "../../../components/Input/InputTextUpdated";
import { toast } from "react-toastify"
import SelectBox from "../../../components/Input/SelectBox";
import { useEffect } from "react";

const INITIAL_CUSTOMER_OBJ = {
  name: "",
  email: "",
  phone: "",
  address: "",
  user_id: localStorage.getItem("userId"),
  // platform_id: 1,
};

function CustomerModalBody({ closeModal, extraObject }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [customerObj, setCustomerObj] = useState(
    extraObject.customer ? extraObject.customer : INITIAL_CUSTOMER_OBJ
  );
  // const [customerOption, setCustomerOption] = useState([]);
  // const [customerStatus, setCustomerStatus] = useState([
  //   { name: "Completed", value: "Completed" },
  //   { name: "Pending", value: "Pending" },
  //   { name: "Refunded", value: "Refunded" },
  // ]);

  // const getCustomers = async () => {
  //   const response = await instance.get(
  //     process.env.REACT_APP_BASE_URL + `/customer`
  //   );
  //   setCustomerOption(response.data.data);
  // };

  // useEffect(() => {
  //   getCustomers();
  // }, []);

  const submitCustomer = async (submit) => {
    if (submit === "Update") {
      try {
        const res = await axios.patch(
          process.env.REACT_APP_BASE_URL + `/customer/${extraObject?.id}`,
          customerObj
        );
        if (res.status === 200) {
          dispatch(
            updateNewCustomer({ data: res.data.data, index: extraObject.index })
          );
          toast.success("Customer Updated!")
          closeModal();
        }
      } catch (error) {
        console.log(error.message);
      }
    } else {
      if (customerObj.name.trim() === "")
        return setErrorMessage("Name is required!");
      else if (customerObj.email.trim() === "")
        return setErrorMessage("Email is required!");
      else if (customerObj.phone.trim() === "")
        return setErrorMessage("phone is required!");
      else if (customerObj.address.trim() === "")
        return setErrorMessage("address is required!");
      else {
        try {
          const res = await axios.post(
            process.env.REACT_APP_BASE_URL + "/customer",
            customerObj
          );
          if (res.status === 200) {
            dispatch(addNewCustomer(res?.data?.data));
            toast.success("New Customer Added!")
            closeModal()
          }
        } catch (error) {
          console.log(error.message);
          toast.error(error?.response?.data?.message.split(':')[1])
        }
      }
    }
  };

  // const

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setCustomerObj({ ...customerObj, [updateType]: value });
  };
  console.log(
    "🚀 ~ file: CustomerModalBody.js:81 ~ updateFormValue ~ CustomerObj:",
    customerObj
  );

  return (
    <>
      {/* <SelectBox
        options={customerOption}
        labelTitle="Product"
        updateType="product_id"
        containerStyle="form-control w-full mt-4"
        placeholder="Pick one Product"
        updateFormValue={updateFormValue}
      /> */}

      <InputTextUpdated
        type="text"
        defaultValue={customerObj?.name}
        updateType="name"
        containerStyle="mt-4"
        labelTitle="Name"
        updateFormValue={updateFormValue}
      />

      <InputTextUpdated
        type="email"
        defaultValue={customerObj?.email}
        updateType="email"
        containerStyle="mt-4"
        labelTitle="Email"
        updateFormValue={updateFormValue}
      />

      <InputTextUpdated
        type="number"
        defaultValue={customerObj?.phone}
        updateType="phone"
        containerStyle="mt-4"
        labelTitle="Phone Number"
        updateFormValue={updateFormValue}
      />

      <InputTextUpdated
        type="text"
        defaultValue={customerObj?.address}
        updateType="address"
        containerStyle="mt-4"
        labelTitle="Address"
        updateFormValue={updateFormValue}
      />

      {/* <SelectBox
        options={setCustomerStatus}
        labelTitle="Order Status"
        updateType="customerStatus"
        containerStyle="form-control w-full mt-4"
        placeholder="Choose one Customer"
        updateFormValue={updateFormValue}
      /> */}

      <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
      <div className="modal-action">
        <button
          className="btn btn-outline btn-ghost"
          onClick={() => closeModal()}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary px-6"
          onClick={() =>
            submitCustomer(extraObject.customer ? "Update" : "Save")
          }
        >
          {extraObject.customer ? "Update" : "Save"}
        </button>
      </div>
    </>
  );
}

export default CustomerModalBody;
