import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import instance from '../../utils/axios-config';



export const getPurchaseOrdersContent = createAsyncThunk('/purchaseOrders/content', async () => {
    const userId = localStorage.getItem("userId");
	const response = await instance.get(process.env.REACT_APP_BASE_URL + `/purchaseOrder`)
	return response.data;
})

export const purchaseOrdersSlice = createSlice({
    name: 'purchaseOrders',
    initialState: {
        isLoading: false,
        purchaseOrders : []
    },
    reducers: {
        addNewPurchaseOrder: (state, action) => {
            state.purchaseOrders.unshift(action.payload)
            // let {newPurchaseOrderObj} = action.payload
            // state.purchaseOrders = [...state.purchaseOrders, action.payload]
        },

        deletePurchaseOrder: (state, action) => {
            let {index} = action.payload
            state.purchaseOrders.splice(index, 1)
        },

        updateNewPurchaseOrder: (state, action) => {
            let {data, index} = action.payload
            state.purchaseOrders[index] = data;
        }
    },

    extraReducers: {
		[getPurchaseOrdersContent.pending]: state => {
			state.isLoading = true
		},
		[getPurchaseOrdersContent.fulfilled]: (state, action) => {
			state.purchaseOrders = action.payload.data
			state.isLoading = false
		},
		[getPurchaseOrdersContent.rejected]: state => {
			state.isLoading = false
		},
    }
})

export const { addNewPurchaseOrder, deletePurchaseOrder, updateNewPurchaseOrder } = purchaseOrdersSlice.actions

export default purchaseOrdersSlice.reducer