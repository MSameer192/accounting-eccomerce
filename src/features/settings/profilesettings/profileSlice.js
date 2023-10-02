import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import instance from '../../../utils/axios-config';

export const getUsersById = createAsyncThunk('/users/content', async () => {
    const userId = localStorage.getItem("userId");
	const response = await instance.get(process.env.REACT_APP_BASE_URL + `/user/${userId}`)
	return response.data;
})

// export const updateUserById = createAsyncThunk('/users/content', async (payload) => {
//     const userId = localStorage.getItem("userId");
// 	const response = await axios.patch(process.env.REACT_APP_BASE_URL + `/user/${userId}`, payload)
// 	return response;
// })

export const usersSlice = createSlice({
    name: 'users',
    initialState: {
        isLoading: false,
        users : {}
    },
    reducers: {
        updateUser: (state, action) => {
            state.users = action.payload
        },

        deleteUser: (state, action) => {
            let {index} = action.payload
            state.users.splice(index, 1)
        }
    },

    extraReducers: {
		[getUsersById.pending]: state => {
			state.isLoading = true
		},
		[getUsersById.fulfilled]: (state, action) => {
			state.users = action.payload.data
			state.isLoading = false
		},
		[getUsersById.rejected]: state => {
			state.isLoading = false
		},
    }
})

export const { updateUser, deleteUser } = usersSlice.actions

export default usersSlice.reducer