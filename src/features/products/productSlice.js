import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import instance from '../../utils/axios-config';



export const getProductsContent = createAsyncThunk('/products/content', async () => {
    const userId = localStorage.getItem("userId");
	const response = await instance.get(process.env.REACT_APP_BASE_URL + `/product`)
	return response.data;
})

export const productsSlice = createSlice({
    name: 'products',
    initialState: {
        isLoading: false,
        products : []
    },
    reducers: {
        addNewProduct: (state, action) => {
            state.products.unshift(action.payload)
            // let {newProductObj} = action.payload
            // state.products = [...state.products, action.payload]
        },

        deleteProduct: (state, action) => {
            let {index} = action.payload
            state.products.splice(index, 1)
        },

        updateNewProduct: (state, action) => {
            let {data, index} = action.payload
            state.products[index] = data;
        }
    },

    extraReducers: {
		[getProductsContent.pending]: state => {
			state.isLoading = true
		},
		[getProductsContent.fulfilled]: (state, action) => {
			state.products = action.payload.data
			state.isLoading = false
		},
		[getProductsContent.rejected]: state => {
			state.isLoading = false
		},
    }
})

export const { addNewProduct, deleteProduct, updateNewProduct } = productsSlice.actions

export default productsSlice.reducer