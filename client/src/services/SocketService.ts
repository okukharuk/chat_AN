import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { io } from 'socket.io-client';

export const socketAPI = createApi({
  reducerPath: "socketAPI",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (build) => ({
    subscribeToEvents: build.query<any, void>({
      queryFn: () => ({ data: [] }),
      async onCacheEntryAdded(
        _arg,
        { dispatch, updateCachedData, cacheEntryRemoved }
      ) {
        // Path is a prefix that will be used right after domain name
        const socket = io("ws://localhost:1337", {
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          autoConnect: false,
        });

        const SendHandshake = async () => {
          console.info("Sending handshake to server ...");

          socket.emit("handshake", async (uid: string, users: string[]) => {
            console.info("User handshake callback message received");
            dispatch({ type: "update_users", payload: users });
            dispatch({ type: "update_uid", payload: uid });
          });
        };

        socket.connect();
        SendHandshake();
        console.log(socket);

        socket.on("disconnect", (reason) => {
          if (reason === "io server disconnect") {
            // the disconnection was initiated by the server, you need to reconnect manually
            socket.connect();
          }
          // else the socket will automatically try to reconnect
        });

        socket.on("user_connected", (users: string[]) => {
          console.info("User connected message received");
          console.log("hello");
          dispatch({ type: "update_users", payload: users });
        });

        socket.on("user_disconnected", (uid: string) => {
          console.info("User disconnected message received");
          dispatch({ type: "remove_user", payload: uid });
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
