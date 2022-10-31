import React from 'react';

import { useAppDispatch, useAppSelector } from '../hooks/redux';
import SendIcon from '../public/svgs/SendIcon.svg';
import { socketAPI } from '../services/SocketService';
import { SocketSlice } from '../store/reducers/SocketSlice';

const Messenger = () => {
  const [message, setMessage] = React.useState("");
  const { uid, messages } = useAppSelector((state) => state.SocketReducer);
  const [sendMessage, {}] = socketAPI.useSendMessageMutation();
  const dispatch = useAppDispatch();
  return (
    <div className="flex flex-col w-full h-full items-center relative">
      <div className="flex flex-col w-[87.5%] h-[82.5%] my-8 bg-white rounded-xl text-black text-base overflow-scroll no-scrollbar">
        {messages.map((item) => {
          return item.type == 1 ? (
            <div className="flex items-center ml-auto bg-main-300 w-[40%] h-auto py-2 mr-4 mt-2 first:mt-4 last:mb-4 rounded-xl pl-3 leading-4">
              {item.message}
            </div>
          ) : (
            <div className="flex items-center mr-auto bg-main-100 w-[40%] h-auto py-2 ml-4 mt-2 first:mt-4 last:mb-4 rounded-xl pl-3 leading-4">
              {item.message}
            </div>
          );
        })}
      </div>
      <div className="flex justify-center w-full h-[17.5%] bg-main-300 rounded-2xl">
        <div className="flex flex-row bg-white rounded-xl w-[87.5%] my-3">
          <input
            type="text"
            className="rounded-lg text-base ml-2 w-[85%] outline-none text-black"
            placeholder="Write your message..."
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          <div
            className="flex w-[15%] ml-auto items-center cursor-pointer"
            onClick={() => {
              dispatch(
                SocketSlice.actions.update_messages({
                  message: message,
                  type: 1,
                })
              );
              sendMessage([message, uid]);
            }}
          >
            <img src={SendIcon} className="w-16" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messenger;
