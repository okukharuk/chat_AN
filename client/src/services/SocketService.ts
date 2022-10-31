import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { io } from 'socket.io-client';

import { SocketSlice } from '../store/reducers/SocketSlice';

const socket = io("ws://localhost:1337", {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  autoConnect: false,
});

export const socketAPI = createApi({
  reducerPath: "socketAPI",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (build) => ({
    addUserToQueue: build.mutation<void, string>({
      queryFn: (userUid: string) => {
        return new Promise((resolve) => {
          socket.emit("add_user_to_queue", userUid);
        });
      },
    }),
    createRoom: build.mutation<void, string[]>({
      queryFn: (chatUsers: string[]) => {
        return new Promise((resolve) => {
          socket.emit("create_room", chatUsers);
        });
      },
    }),
    sendMessage: build.mutation<void, string[]>({
      queryFn: (data: string[]) => {
        return new Promise((resolve) => {
          socket.emit("send_message", data);
        });
      },
    }),
    subscribeToEvents: build.query<any, void>({
      queryFn: () => ({ data: [] }),
      async onCacheEntryAdded(
        _arg,
        { dispatch, updateCachedData, cacheEntryRemoved }
      ) {
        // Path is a prefix that will be used right after domain name

        const SendHandshake = async () => {
          console.info("Sending handshake to server ...");

          socket.emit("handshake", async (uid: string, users: string[]) => {
            console.info("User handshake callback message received");
            dispatch(SocketSlice.actions.update_users(users));
            dispatch(SocketSlice.actions.update_uid(uid));
          });
        };

        socket.connect();
        SendHandshake();

        socket.on("disconnect", (reason) => {
          console.log("hello");
          if (reason === "io server disconnect") {
            // the disconnection was initiated by the server, you need to reconnect manually
            socket.connect();
          }
          // else the socket will automatically try to reconnect
        });

        socket.on("user_left", () => {});

        socket.on("user_connected", (users: string[]) => {
          console.info("User connected message received");
          dispatch(SocketSlice.actions.update_users(users));
        });

        socket.on("user_disconnected", (uid: string) => {
          console.info("User disconnected message received");
          dispatch(SocketSlice.actions.remove_user(uid));
        });

        socket.on("get_message", (message: string) => {
          console.info("Message received");
          dispatch(
            SocketSlice.actions.update_messages({ message: message, type: 2 })
          );
        });

        socket.on("room_created", (roomCreated: boolean) => {
          if (roomCreated) {
            dispatch(SocketSlice.actions.update_queue_status(false));
            console.info("Room was successfully created");
          } else console.info("Room was not created");
        });

        socket.io.on("reconnect", (attempt) => {
          console.info("Reconnected on attempt: " + attempt);
          SendHandshake();
        });

        socket.io.on("reconnect_attempt", (attempt) => {
          console.info("Reconnection Attempt: " + attempt);
        });

        socket.io.on("reconnect_error", (error) => {
          console.info("Reconnection error: " + error);
        });

        socket.io.on("reconnect_failed", () => {
          console.info("Reconnection failure.");
          alert(
            "We are unable to connect you to the chat service.  Please make sure your internet connection is stable or try again later."
          );
        });

        await cacheEntryRemoved;
        socket.close();
      },
    }),
  }),
});

export const { useSubscribeToEventsQuery } = socketAPI;
