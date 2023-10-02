import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import instance from '../../utils/axios-config';



export const getCategoriesContent = createAsyncThunk('/categories/content', async () => {
    const userId = localStorage.getItem("userId");
	const response = await instance.get(process.env.REACT_APP_BASE_URL + `/category`)
	return response.data;
})

export const categoriesSlice = createSlice({
    name: 'categories',
    initialState: {
        isLoading: false,
        categories : []
    },
    reducers: {
        addNewCategory: (state, action) => {
            state.categories.unshift(action.payload)
            // let {newCategoryObj} = action.payload
            // state.categories = [...state.categories, action.payload]
        },

        deleteCategory: (state, action) => {
            let {index} = action.payload
            state.categories.splice(index, 1)
        },

        updateNewCategory: (state, action) => {
            let {data, index} = action.payload
            state.categories[index] = data;
        }
    },

    extraReducers: {
		[getCategoriesContent.pending]: state => {
			state.isLoading = true
		},
		[getCategoriesContent.fulfilled]: (state, action) => {
			state.categories = action.payload.data
			state.isLoading = false
		},
		[getCategoriesContent.rejected]: state => {
			state.isLoading = false
		},
    }
})

export const { addNewCategory, deleteCategory, updateNewCategory } = categoriesSlice.actions

export default categoriesSlice.reducer