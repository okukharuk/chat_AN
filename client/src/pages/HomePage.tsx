import React from 'react';

import Chat from '../components/Chat';
import Header from '../components/Header';
import { useAppSelector } from '../hooks/redux';
import StopSVG from '../public/svgs/stop.svg';
import { socketAPI } from '../services/SocketService';

const HomePage = () => {
  const { uid, users, inRoom } = useAppSelector((state) => state.SocketReducer);
  const [leftRoom, {}] = socketAPI.useLeftRoomMutation();
  const socket = socketAPI.useSubscribeToEventsQuery();
  React.useEffect(() => {
    console.log(socket);
    console.log(uid);
    console.log(users);
  }, [uid, users]);

  const handleLeaveRoom = () => {
    leftRoom(uid);
  };

  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen">
      <div className="absolute top-10">
        <Header />
      </div>
      <Chat />
      {inRoom && (
        <div
          className="flex flex-row justify-center items-center bg-red-500 text-white rounded-2xl absolute bottom-8 w-44 h-10 text-2xl cursor-pointer"
          onClick={handleLeaveRoom}
        >
          <div>END CHAT</div>
          <img src={StopSVG} />
        </div>
      )}
    </div>
  );
};

export default HomePage;
