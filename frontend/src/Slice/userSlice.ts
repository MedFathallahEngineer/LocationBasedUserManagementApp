import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';


// Define the User interface
interface User {
  _id: string;
  name: string;
  email: string;
  latitude: number;
  longitude: number;
}

// Define the initial state for the users slice
interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}


interface ApiResponse {
    success: boolean;
    data: User[]; 
  }


const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

// Fetch users
export const fetchUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<ApiResponse>('http://localhost:5000/api/users');
      return response.data.data;
    } catch (error) {
      console.error('Fetch Users Error:', error);
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
      }
      return rejectWithValue('Failed to fetch users');
    }
  }
);

// Add user
export const addUser = createAsyncThunk<User, Omit<User, '_id'>, { rejectValue: string }>(
  'users/addUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post<User>('http://localhost:5000/api/users', userData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to add user');
      }
      return rejectWithValue('Failed to add user');
    }
  }
);

// User slice to handle the users state
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload; // Store fetched users
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch users'; // Store error message
      })
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        if (Array.isArray(state.users)) {
          state.users.push(action.payload); // Add new user to the state
        } else {
          console.error('Erreur: state.users is not an array');
        }
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add user';
      });
  },
});

export default userSlice.reducer;