import { useState } from "react";
import { useDispatch } from "react-redux";
import InputText from "../../../components/Input/InputText";
import ErrorText from "../../../components/Typography/ErrorText";
import { showNotification } from "../../common/headerSlice";
import { addNewLead, addNewCash, updateNewCash } from "../cashSlice";
import axios from "axios";
import InputTextUpdated from "../../../components/Input/InputTextUpdated";
import SelectBox from "../../../components/Input/SelectBox";
import { useEffect } from "react";
import TextAreaInput from "../../../components/Input/TextAreaInput";
import { toast } from "react-toastify";

const INITIAL_CASH_OBJ = {
  credit: "",
  debit: "",
  date: "",
  type: "",
  description: "",
  bankTransaction: "",
  user_id: localStorage.getItem("userId"),
};

function CashModalBody({ closeModal, extraObject }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [cashObj, setCashObj] = useState(
    extraObject.cash ? extraObject.cash : INITIAL_CASH_OBJ
  );
  const cashOption = [
    { name: "Please select", id: "Please select" },
    { name: "Inventory", id: "Inventory" },
    { name: "Fixed Assets", id: "Fixed Assets" },
    { name: "Account Payable", id: "Payable" },
    { name: "Account Receivable", id: "Receivable" },
    { name: "Liability", id: "Liability" },
    { name: "Revenue", id: "Revenue" },
    { name: "Expenses", id: "Expenses" },
    { name: "Withdrawal", id: "Withdrawal" },
    { name: "Capital", id: "Capital" },
  ];
  

  const bankTransactionOption = [
    { name: "Yes", id: "Yes" },
    { name: "No", id: "No" },
  ];

  const submitCash = async (submit) => {
    if (submit === "Update") {
      try {
        const res = await axios.patch(
          process.env.REACT_APP_BASE_URL + `/cash/${extraObject?.id}`,
          cashObj
        );
        if (res.status === 200) {
          dispatch(
            updateNewCash({ data: res.data.data, index: extraObject.index })
          );
          toast.success("Cash Updated!")
          closeModal();
        }
      } catch (error) {
        console.log(error.message);
        toast.error(error?.response?.data?.message.split(':')[1])
      }
    } else {
      if (cashObj.credit.trim() === "" && cashObj.debit.trim() === "")
        return setErrorMessage("Please enter amount in Credit / Debit Column!");
      if (cashObj.type.trim() === "" || cashObj.type.trim() === "Please select")
        return setErrorMessage("Cash Type is required!");
      else if (cashObj.description.trim() === "")
        return setErrorMessage("Description is required!");
      else if (cashObj.date.trim() === "")
        return setErrorMessage("Transaction Date is required!");
      else if (cashObj.bankTransaction.trim() === "")
        return setErrorMessage("Bank Transaction is required!");
      else {
        try {
          const res = await axios.post(
            process.env.REACT_APP_BASE_URL + "/cash",
            cashObj
          );
          if (res.status === 200) {
            dispatch(addNewCash(res?.data?.data));
              toast.success("Cash Added successfully!")
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
    setCashObj({ ...cashObj, [updateType]: value });
  };

  return (
    <>
      <InputTextUpdated
        type="number"
        defaultValue={cashObj?.credit}
        updateType="credit"
        containerStyle="mt-4"
        labelTitle="Credit"
        updateFormValue={updateFormValue}
      />

      <InputTextUpdated
        type="number"
        defaultValue={cashObj?.debit}
        updateType="debit"
        containerStyle="mt-4"
        labelTitle="Debit"
        updateFormValue={updateFormValue}
      />

      <SelectBox
        options={cashOption}
        labelTitle="Cash Type"
        updateType="type"
        containerStyle="form-control w-full mt-4"
        placeholder="Pick one"
        updateFormValue={updateFormValue}
      />

      <SelectBox
        options={bankTransactionOption}
        labelTitle="Bank Transaction"
        updateType="bankTransaction"
        containerStyle="form-control w-full mt-4"
        placeholder="Pick one"
        updateFormValue={updateFormValue}
      />

      <TextAreaInput
        defaultValue={cashObj?.description}
        updateType="description"
        containerStyle="mt-4"
        labelTitle="Description"
        updateFormValue={updateFormValue}
      />

      <InputTextUpdated
        type="date"
        defaultValue={cashObj?.date}
        updateType="date"
        containerStyle="mt-4"
        labelTitle="Transaction Date"
        updateFormValue={updateFormValue}
      />

            <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
            <div className="modal-action">
                <button  className="btn btn-outline btn-ghost" onClick={() => closeModal()}>Cancel</button>
                <button  className="btn btn-primary px-6" onClick={() => submitCash(extraObject.cash ? "Update" : "Save")}>{extraObject.cash ? "Update" : "Save"}</button>
            </div>
        </>
    )
}

export default CashModalBody;
