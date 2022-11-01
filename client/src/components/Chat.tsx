import { motion } from 'framer-motion';
import React from 'react';

import { useAppDispatch, useAppSelector } from '../hooks/redux';
import LoadingIcon from '../public/svgs/LoadingIcon';
import { socketAPI } from '../services/SocketService';
import { SocketSlice } from '../store/reducers/SocketSlice';
import Messenger from './Messenger';
import OnlineWidget from './OnlineWidget';

const Chat = () => {
  const [findIsClicked, setFindIsClicked] = React.useState(false);
  const { inRoom, queueStatus, uid } = useAppSelector(
    (state) => state.SocketReducer
  );
  const [addUserToQueue, {}] = socketAPI.useAddUserToQueueMutation();
  const dispatch = useAppDispatch();

  const handleClick = () => {
    if (!queueStatus && !inRoom) {
      setFindIsClicked(true);
      dispatch(SocketSlice.actions.update_queue_status(true));
      addUserToQueue(uid);
    }
  };

  React.useEffect(() => {
    console.log(queueStatus);
  }, [queueStatus]);
  return (
    <div className="flex flex-col justify-center items-center h-[75%] w-[85%] lg:w-1/2 rounded-2xl shadow-xl relative">
      <OnlineWidget />
      <motion.div
        className={
          "flex justify-center items-center w-1/2 bg-main-100 h-[10%] my-auto text-2xl rounded-2xl text-main-500 absolute z-0 " +
          (!queueStatus && !inRoom && "cursor-pointer")
        }
        onClick={handleClick}
        animate={
          queueStatus || inRoom
            ? inRoom
              ? { width: "100%", height: "100%" }
              : { width: "4rem", height: "4rem" }
            : { width: "50%", height: "10%" }
        }
      >
        {queueStatus || inRoom ? (
          inRoom ? (
            <Messenger />
          ) : (
            <LoadingIcon />
          )
        ) : (
          <div>Find new person</div>
        )}
      </motion.div>
    </div>
  );
};

export default Chat;
