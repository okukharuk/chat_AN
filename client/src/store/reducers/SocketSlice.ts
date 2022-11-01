import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IMessages {
  message: string;
  type: number;
}

export interface ISocketState {
  messages: IMessages[];
  queueStatus: boolean;
  inRoom: boolean;
  uid: string;
  users: string[];
}

export const initialState: ISocketState = {
  messages: [],
  queueStatus: false,
  inRoom: false,
  uid: "",
  users: [],
};

export const SocketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    clear_messages(state) {
      state.messages = [];
    },
    update_messages(state, action: PayloadAction<IMessages>) {
      state.messages = [...state.messages, action.payload];
    },
    update_queue_status(state, action: PayloadAction<boolean>) {
      state.queueStatus = action.payload;
    },
    update_in_room(state, action: PayloadAction<boolean>) {
      state.inRoom = action.payload;
    },
    update_uid(state, action: PayloadAction<string>) {
      state.uid = action.payload;
    },
    update_users(state, action: PayloadAction<string[]>) {
      state.users = action.payload;
    },
    remove_user(state, action: PayloadAction<string>) {
      state.users = state.users.filter((uid) => uid !== action.payload);
    },
  },
});

export default SocketSlice.reducer;
