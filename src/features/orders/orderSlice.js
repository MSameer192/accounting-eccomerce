import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import instance from '../../utils/axios-config';



export const getOrdersContent = createAsyncThunk('/orders/content', async () => {
    const userId = localStorage.getItem("userId");
	const response = await instance.get(process.env.REACT_APP_BASE_URL + `/order`)
	return response.data;
})

export const ordersSlice = createSlice({
    name: 'orders',
    initialState: {
        isLoading: false,
        orders : []
    },
    reducers: {
        addNewOrder: (state, action) => {
            state.orders.unshift(action.payload)
            // let {newOrderObj} = action.payload
            // state.orders = [...state.orders, action.payload]
        },

        deleteOrder: (state, action) => {
            let {index} = action.payload
            state.orders.splice(index, 1)
        },

        updateNewOrder: (state, action) => {
            let {data, index} = action.payload
            state.orders[index] = data;
        }
    },

    extraReducers: {
		[getOrdersContent.pending]: state => {
			state.isLoading = true
		},
		[getOrdersContent.fulfilled]: (state, action) => {
			state.orders = action.payload.data
			state.isLoading = false
		},
		[getOrdersContent.rejected]: state => {
			state.isLoading = false
		},
    }
})

export const { addNewOrder, deleteOrder, updateNewOrder } = ordersSlice.actions

export default ordersSlice.reducer