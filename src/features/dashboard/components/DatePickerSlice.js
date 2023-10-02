import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const datePickerSlice = createSlice({
    name: 'datePicker',
    initialState: {
        isLoading: false,
        datePicker : []
    },
    reducers: {
        addNewDatePicker: (state, action) => {
            state.datePicker.unshift(action.payload)
            // let {newDatePickerObj} = action.payload
            // state.datePicker = [...state.datePicker, action.payload]
        },

        deleteDatePicker: (state, action) => {
            let {index} = action.payload
            state.datePicker.splice(index, 1)
        },

        updateNewDatePicker: (state, action) => {
            let {data, index} = action.payload
            state.datePicker[index] = data;
        }
    },

    extraReducers: {
		[getDatePickerContent.pending]: state => {
			state.isLoading = true
		},
		[getDatePickerContent.fulfilled]: (state, action) => {
			state.datePicker = action.payload.data
			state.isLoading = false
		},
		[getDatePickerContent.rejected]: state => {
			state.isLoading = false
		},
    }
})

export const { addNewDatePicker, deleteDatePicker, updateNewDatePicker } = datePickerSlice.actions

export default datePickerSlice.reducer