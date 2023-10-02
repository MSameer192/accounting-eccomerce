import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import instance from '../../utils/axios-config';



export const getCashContent = createAsyncThunk('/cash/content', async () => {
    const userId = localStorage.getItem("userId");
	const response = await instance.get(process.env.REACT_APP_BASE_URL + `/cash`)
	return response.data;
})

export const cashSlice = createSlice({
    name: 'cash',
    initialState: {
        isLoading: false,
        cash : []
    },
    reducers: {
        addNewCash: (state, action) => {
            state.cash.unshift(action.payload)
            // let {newCashObj} = action.payload
            // state.cash = [...state.cash, action.payload]
        },

        deleteCash: (state, action) => {
            let {index} = action.payload
            state.cash.splice(index, 1)
        },

        updateNewCash: (state, action) => {
            let {data, index} = action.payload
            state.cash[index] = data;
        }
    },

    extraReducers: {
		[getCashContent.pending]: state => {
			state.isLoading = true
		},
		[getCashContent.fulfilled]: (state, action) => {
			state.cash = action.payload.data
			state.isLoading = false
		},
		[getCashContent.rejected]: state => {
			state.isLoading = false
		},
    }
})

export const { addNewCash, deleteCash, updateNewCash } = cashSlice.actions

export default cashSlice.reducer