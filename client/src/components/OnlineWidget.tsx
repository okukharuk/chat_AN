import React from 'react';

import { useAppSelector } from '../hooks/redux';

const OnlineWidget = () => {
  const usersCount = useAppSelector(
    (state) => state.SocketReducer.users.length
  );
  return (
    <div className="flex flex-col justify-center items-center w-36 h-36 rounded-full drop-shadow-lg absolute left-[-4rem] top-[-4rem] z-10 bg-white">
      <div className="flex flex-row">
        <div className="text-xl">Online</div>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative rounded-full h-2 w-2 bg-sky-500"></span>
        </span>
      </div>
      <div className="flex text-xl">{usersCount}</div>
    </div>
  );
};

export default OnlineWidget;
