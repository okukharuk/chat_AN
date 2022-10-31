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
  const { queueStatus, uid } = useAppSelector((state) => state.SocketReducer);
  const [addUserToQueue, {}] = socketAPI.useAddUserToQueueMutation();
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(SocketSlice.actions.update_queue_status(true));
    addUserToQueue(uid);
  };

  React.useEffect(() => {
    console.log(queueStatus);
  }, [queueStatus]);
  return (
    <div className="flex flex-col justify-center items-center h-[75%] w-1/2 rounded-lg shadow-xl relative">
      <OnlineWidget />
      <motion.div
        className={
          "flex justify-center items-center w-1/2 bg-main-100 h-[10%] my-auto text-2xl rounded-2xl text-main-500 absolute " +
          (!findIsClicked && "cursor-pointer")
        }
        onClick={() => {
          if (!findIsClicked) {
            setFindIsClicked(true);
            handleClick();
          }
        }}
        animate={
          findIsClicked
            ? queueStatus
              ? { width: "15%", height: "15%" }
              : { width: "75%", height: "75%" }
            : { width: "50%", height: "10%" }
        }
      >
        {findIsClicked ? (
          queueStatus ? (
            <LoadingIcon />
          ) : (
            <Messenger />
          )
        ) : (
          <div>Find new person</div>
        )}
      </motion.div>
    </div>
  );
};

export default Chat;
