
import axios from 'axios'
import capitalize from 'capitalize-the-first-letter'
import React, { useState, useEffect } from 'react'
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon'


function SelectBox(props){
    
    const {labelTitle, labelDescription, defaultValue, containerStyle, placeholder, labelStyle, options, updateType, updateFormValue, nestedObj, nestedIndex} = props

    const [value, setValue] = useState(defaultValue || "")


    const updateValue = (newValue) =>{
        setValue(newValue)

        if(nestedObj) return updateFormValue({updateType, value : newValue, nestedObj, nestedIndex})

        updateFormValue({updateType, value : newValue})
    }


    return (
        <div className={`inline-block ${containerStyle}`}>
            <label  className={`label  ${labelStyle}`}>
                <div className="label-text">{labelTitle}
                {labelDescription && <div className="tooltip tooltip-right" data-tip={labelDescription}><InformationCircleIcon className='w-4 h-4'/></div>}
                </div>
            </label>

            <select className="select select-bordered w-full" onChange={(e) => updateValue(e.target.value)} defaultValue={value}>
                <option hidden selected value={placeholder}>{placeholder}</option>
                {
                    options?.map((o, k) => {
                        return <option value={o.id || o.skuId} key={k}>{o.name || o.skuName}</option>
                    })
                }
            </select>
        </div>
    )
}

export default SelectBox
