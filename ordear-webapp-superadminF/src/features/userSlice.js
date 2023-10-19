import {createSlice,createAsyncThunk} from "@reduxjs/toolkit"

export const fetchUserData = createAsyncThunk(
    "user/fetchUserData",
    async ({ email, password }) => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, {
          method: "POST",
          credentials:'include',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        return data;
      
      } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;

      }
    }
  );
  export const userSlice = createSlice({
    name: "user",
    initialState: {
      user: null,
      isLoading: false,
      error: null,
      success: false,
    },
    reducers: {
      login: (state, action) => {
        state.user = action.payload;
        state.success = true; // Définissez success à true en cas de connexion réussie
      },
      logout: (state) => {
        state.user = null;
        state.success = false; // Définissez success à false lors de la déconnexion
        // Supprimez le token et les données de l'utilisateur du localStorage
        localStorage.removeItem('tokenLogin');
        localStorage.removeItem('user');
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchUserData.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(fetchUserData.fulfilled, (state, action) => {
          state.isLoading = false;
          if (action.payload.message == 'Invalid credentials') {
            state.error = 'Invalid credentials'; // Set the error message for invalid credentials
            state.success = false;
          } else if (action.payload.message == 'Invalid email format') {
            state.error = 'Invalid email format'; // Set the error message for invalid credentials
            state.success = false;
          } else if (action.payload.message == 'No account with this email has been founded') {
            state.error = 'No account with this email has been founded'; // Set the error message for invalid credentials
            state.success = false;
          } else if (action.payload.message == 'User desactivated') {
            state.error = 'User desactivated'; // Set the error message for invalid credentials
            state.success = false;
          } else if (action.payload.message == "Cannot read properties of null (reading 'activate')") {
            state.error = "Cannot read properties of null (reading 'activate')"; // Set the error message for invalid credentials
            state.success = false;
          } else {
            state.user = action.payload.user;
            state.success = true;
            // Enregistrez tokenLogin et les données de l'utilisateur dans le localStorage
            localStorage.setItem('tokenLogin', action.payload.tokenLogin);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
          }
        })
        .addCase(fetchUserData.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.error.message;
        });
    },
  });
export const {login,logout}= userSlice.actions;
export const selectUser = (state)=> state.user.user;
export const selectLoading = (state) => state.user.isLoading;
export const selectError = (state) => state.user.error;
export const selectSuccess = (state) => state.user.success;


export default userSlice.reducer;