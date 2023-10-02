import { useEffect, useState } from "react"


function InputTextUpdated({labelTitle, labelStyle, type, containerStyle, defaultValue, placeholder, updateFormValue, updateType, nestedObj, nestedIndex, disabled}){

    const [value, setValue] = useState(defaultValue)

    useEffect(() => {
        setValue(defaultValue)
    }, [defaultValue])

    const updateInputValue = (val) => {
        setValue(val)

        if(nestedObj) return updateFormValue({updateType, value : val, nestedObj, nestedIndex})

        updateFormValue({updateType, value : val})
    }

    return(
        <div className={`form-control w-full ${containerStyle}`}>
            <label className="label">
                <span className={"label-text text-base-content " + labelStyle}>{labelTitle}</span>
            </label>
            <input disabled={disabled ? true : false} type={type || "text"} value={value} placeholder={placeholder || ""} onChange={(e) => updateInputValue(e.target.value)}className="input  input-bordered w-full " />
        </div>
    )
}


export default InputTextUpdated