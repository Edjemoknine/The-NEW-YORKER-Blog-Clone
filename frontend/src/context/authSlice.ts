/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/handlers/client";
import type { LoginPayload, SessionStatus } from "@/types/auth";

const getStoredUser = () => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

const user = getStoredUser();
const initialState = {
  user: user ? user : null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  sessionStatus: "unknown" as SessionStatus,
};

// Register

export const register = createAsyncThunk(
  "auth/register",
  async (payload: LoginPayload, thunkAPI) => {
    try {
      const response = await api.post("/api/auth/register", payload);
      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue("An unexpected error occurred");
    }
  },
);

// Login

export const login = createAsyncThunk(
  "auth/login",
  async (payload: LoginPayload, thunkAPI) => {
    try {
      const response = await api.post("/api/auth/login", payload);
      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue("An unexpected error occurred");
    }
  },
);

export const restoreSession = createAsyncThunk(
  "auth/restoreSession",
  async (_, thunkAPI) => {
    try {
      const response = await api.post("/api/auth/refresh");
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        status: error.response?.status,
        message: error.response?.data?.message ?? "Unable to verify session",
      });
    }
  },
);

// Logout
export const logout = createAsyncThunk(
  "auth/logout",
  async (user, thunkAPI) => {
    try {
      await api.post("/api/auth/logout");
      localStorage.removeItem("user");
      return user;
    } catch (error: any) {
      localStorage.removeItem("user");
      if (error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue("An unexpected error occurred");
    }
  },
);

const authSlice = createSlice({
  initialState,
  name: "auth",
  reducers: {
    reset: (state) => {
      state.isSuccess = false;
      state.isError = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
        // state.isSuccess = true;
        // state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.sessionStatus = "authenticated";
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.user = null;
        state.sessionStatus = "unauthenticated";
      })
      .addCase(restoreSession.pending, (state) => {
        state.sessionStatus = "checking";
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.sessionStatus = "authenticated";
      })
      .addCase(restoreSession.rejected, (state, action) => {
        const status = (action.payload as { status?: number } | undefined)
          ?.status;
        state.sessionStatus = status === 401 ? "unauthenticated" : "error";
        if (status === 401) {
          state.user = null;
          localStorage.removeItem("user");
        }
      })

      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = null;
        state.sessionStatus = "unauthenticated";
      })
      .addCase(logout.rejected, (state) => {
        state.user = null;
        state.sessionStatus = "unauthenticated";
      });
  },
});
export const { reset } = authSlice.actions;
export default authSlice.reducer;
