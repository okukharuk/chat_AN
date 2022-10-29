import React from 'react';

import Chat from '../components/Chat';
import { useAppSelector } from '../hooks/redux';
import { socketAPI } from '../services/SocketService';

const HomePage = () => {
  const { uid, users } = useAppSelector((state) => state.SocketReducer);
  const {} = useAppSelector((state) => state.socketAPI);
  const {} = socketAPI.useSubscribeToEventsQuery();
  React.useEffect(() => {
    console.log(uid);
    console.log(users);
  }, [uid, users]);
  return (
    <div className="flex justify-center items-center w-screen h-screen">
      {uid}
      <Chat />
    </div>
  );
};

export default HomePage;
