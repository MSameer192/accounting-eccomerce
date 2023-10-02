import { useState } from "react";
import { useDispatch } from "react-redux";
import InputText from "../../../components/Input/InputText";
import ErrorText from "../../../components/Typography/ErrorText";
import { showNotification } from "../../common/headerSlice";
import {
  addNewLead,
  addNewSupplier,
  updateNewSupplier,
} from "../supplierSlice";
import axios from "axios";
import InputTextUpdated from "../../../components/Input/InputTextUpdated";
import { toast } from "react-toastify"
import SelectBox from "../../../components/Input/SelectBox";
import { useEffect } from "react";

const INITIAL_SUPPLIER_OBJ = {
  companyName: "",
  name: "",
  email: "",
  phoneNumber: "",
  website: "",
  address: "",
  comment: "",
  user_id: localStorage.getItem("userId"),
  // platform_id: 1,
};

function SupplierModalBody({ closeModal, extraObject }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [supplierObj, setSupplierObj] = useState(
    extraObject.supplier ? extraObject.supplier : INITIAL_SUPPLIER_OBJ
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

  const submitSupplier = async (submit) => {
    if (submit === "Update") {
      try {
        const res = await axios.patch(
          process.env.REACT_APP_BASE_URL + `/supplier/${extraObject?.id}`,
          supplierObj
        );
        if (res.status === 200) {
          dispatch(
            updateNewSupplier({ data: res.data.data, index: extraObject.index })
          );
          toast.success("Supplier Updated!")
          closeModal();
        }
      } catch (error) {
        console.log(error.message);
      }
    } else {
      if (supplierObj.companyName.trim() === "")
        return setErrorMessage("companyName is required!");
      else if (supplierObj.name.trim() === "")
        return setErrorMessage("Name is required!");
      else if (supplierObj.email.trim() === "")
        return setErrorMessage("Email is required!");
      else if (supplierObj.phoneNumber.trim() === "")
        return setErrorMessage("Phone Number is required!");
      else if (supplierObj.website.trim() === "")
        return setErrorMessage("Website is required!");
      else if (supplierObj.address.trim() === "")
        return setErrorMessage("Address is required!");
      else if (supplierObj.comment.trim() === "")
        return setErrorMessage("Comment is required!");
      else {
        try {
          const res = await axios.post(
            process.env.REACT_APP_BASE_URL + "/supplier",
            supplierObj
          );
          if (res.status === 200) {
            dispatch(addNewSupplier(res?.data?.data));
            toast.success("New Supplier Added!")
            closeModal();
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
    setSupplierObj({ ...supplierObj, [updateType]: value });
  };
  console.log(
    "🚀 ~ file: SupplierModalBody.js:81 ~ updateFormValue ~ supplierObj:",
    supplierObj
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
        defaultValue={supplierObj?.companyName}
        updateType="companyName"
        containerStyle="mt-4"
        labelTitle="Company Name"
        updateFormValue={updateFormValue}
      />

      <InputTextUpdated
        type="text"
        defaultValue={supplierObj?.name}
        updateType="name"
        containerStyle="mt-4"
        labelTitle="Name"
        updateFormValue={updateFormValue}
      />

      <InputTextUpdated
        type="email"
        defaultValue={supplierObj?.email}
        updateType="email"
        containerStyle="mt-4"
        labelTitle="Email"
        updateFormValue={updateFormValue}
      />

      <InputTextUpdated
        type="number"
        defaultValue={supplierObj?.phoneNumber}
        updateType="phoneNumber"
        containerStyle="mt-4"
        labelTitle="Phone Number"
        updateFormValue={updateFormValue}
      />

      <InputTextUpdated
        type="text"
        defaultValue={supplierObj?.address}
        updateType="address"
        containerStyle="mt-4"
        labelTitle="Address"
        updateFormValue={updateFormValue}
      />

      <InputTextUpdated
        type="text"
        defaultValue={supplierObj?.website}
        updateType="website"
        containerStyle="mt-4"
        labelTitle="Website"
        updateFormValue={updateFormValue}
      />

      <InputTextUpdated
        type="text"
        defaultValue={supplierObj?.comment}
        updateType="comment"
        containerStyle="mt-4"
        labelTitle="Comment"
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
            submitSupplier(extraObject.supplier ? "Update" : "Save")
          }
        >
          {extraObject.supplier ? "Update" : "Save"}
        </button>
      </div>
    </>
  );
}

export default SupplierModalBody;
