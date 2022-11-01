import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { v4 } from 'uuid';

export class ServerSocket {
  public static instance: ServerSocket;
  public io: Server;

  public rooms: { [sid: string]: string };
  public users: { [uid: string]: string };
  public queue: string[];

  constructor(server: HttpServer) {
    ServerSocket.instance = this;
    this.users = {};
    this.rooms = {};
    this.queue = [];
    this.io = new Server(server, {
      serveClient: false,
      pingInterval: 10000,
      pingTimeout: 5000,
      cookie: false,
      cors: {
        origin: "*",
      },
    });

    this.io.on("connect", this.StartListeners);
  }

  StartListeners = (socket: Socket) => {
    console.info("Message received from " + socket.id);

    socket.on(
      "handshake",
      (callback: (uid: string, users: string[]) => void) => {
        console.info("Handshake received from: " + socket.id);
        console.log(this.users);

        const reconnected = Object.values(this.users).includes(socket.id);

        if (reconnected) {
          console.info("This user has reconnected.");

          const uid = this.GetUidFromSocketID(socket.id);
          const users = Object.values(this.users);

          if (uid) {
            console.info("Sending callback for reconnect ...");
            callback(uid, users);
            return;
          }
        }

        const uid = v4();
        this.users[uid] = socket.id;

        const users = Object.values(this.users);
        console.info("Sending callback ...");
        callback(uid, users);

        this.SendMessage(
          "user_connected",
          users.filter((id) => id !== socket.id),
          users
        );
      }
    );

    socket.on("disconnect", () => {
      console.info("Disconnect received from: " + socket.id);

      const uid = this.GetUidFromSocketID(socket.id);

      if (uid) {
        if (this.queue.indexOf(uid) !== -1) this.queue = [];
        this.DeleteLeftUserRoom(this.rooms, this.users[uid], false);
        delete this.users[uid];

        const users = Object.values(this.users);

        this.SendMessage("user_disconnected", users, socket.id);
      }
    });

    socket.on("add_user_to_queue", (uid: string) => {
      this.queue.push(uid);
      console.info("User added to queue");
      if (this.queue.length == 2) this.CreateRoom(this.queue);
    });

    socket.on("send_message", (data: string[]) => {
      console.log(data);
      const sid = this.users[data[1]];
      for (const [key, value] of Object.entries(this.rooms)) {
        if (key == sid) {
          this.io.to(value).emit("get_message", data[0]);
          return;
        }
        if (value == sid) {
          this.io.to(key).emit("get_message", data[0]);
          return;
        }
      }
    });

    socket.on("left_room", (uid: string) => {
      this.DeleteLeftUserRoom(this.rooms, this.users[uid], true);
    });
  };

  CreateRoom = (uids: string[]) => {
    const user1_sid = this.users[uids[0]];
    const user2_sid = this.users[uids[1]];
    this.rooms[user1_sid] = user2_sid;
    [user1_sid, user2_sid].forEach((sid) => {
      this.io.to(sid).emit("room_created", true);
    });
    console.log(this.rooms);
    this.queue = [];
  };

  DeleteLeftUserRoom = (
    object: { [sid: string]: string },
    sid: string,
    leftRoom: boolean
  ) => {
    for (const [key, value] of Object.entries(object)) {
      if (key == sid || value == sid) {
        this.io.to(key == sid ? value : key).emit("user_left");
        if (leftRoom) this.io.to(key == sid ? key : value).emit("user_left");
        delete this.rooms[key];
        return;
      }
    }
    return;
  };

  GetUidFromSocketID = (id: string) => {
    return Object.keys(this.users).find((uid) => this.users[uid] === id);
  };

  SendMessage = (name: string, users: string[], payload?: Object) => {
    console.info("Emitting event: " + name + " to", users);
    users.forEach((id) =>
      payload ? this.io.to(id).emit(name, payload) : this.io.to(id).emit(name)
    );
  };
}
