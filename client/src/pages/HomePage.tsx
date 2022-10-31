import React from 'react';

import Chat from '../components/Chat';
import Header from '../components/Header';
import { useAppSelector } from '../hooks/redux';
import { socketAPI } from '../services/SocketService';

const HomePage = () => {
  const { uid, users } = useAppSelector((state) => state.SocketReducer);
  const socket = socketAPI.useSubscribeToEventsQuery();
  React.useEffect(() => {
    console.log(socket);
    console.log(uid);
    console.log(users);
  }, [uid, users]);
  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <div className="absolute top-10">
        <Header />
      </div>
      <Chat />
    </div>
  );
};

export default HomePage;
