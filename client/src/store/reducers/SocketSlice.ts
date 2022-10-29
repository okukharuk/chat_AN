import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ISocketState {
  uid: string;
  users: string[];
}

export const initialState: ISocketState = {
  uid: "",
  users: [],
};

export const SocketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    update_uid(state, action: PayloadAction<string>) {
      console.log(2);
      state.uid = action.payload;
    },
    update_users(state, action: PayloadAction<string[]>) {
      console.log(2);

      state.users = action.payload;
    },
    remove_user(state, action: PayloadAction<string>) {
      console.log(2);

      state.users = state.users.filter((uid) => uid !== action.payload);
    },
  },
});

export default SocketSlice.reducer;
