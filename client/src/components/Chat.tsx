import { motion } from 'framer-motion';
import React from 'react';

import Header from './Header';
import Messenger from './Messenger';
import OnlineWidget from './OnlineWidget';

const Chat = () => {
  const [findIsClicked, setFindIsClicked] = React.useState(false);
  return (
    <div className="flex flex-col justify-center items-center h-[75%] w-1/2 rounded-lg shadow-xl relative">
      <OnlineWidget />
      <Header />
      <motion.div
        className={
          "flex justify-center items-center w-1/2 bg-main-100 h-[10%] my-auto text-2xl rounded-xl text-main-500 absolute " +
          (!findIsClicked && "cursor-pointer")
        }
        onClick={() => setFindIsClicked(!findIsClicked)}
        animate={
          findIsClicked
            ? { width: "75%", height: "75%" }
            : { width: "50%", height: "10%" }
        }
      >
        {findIsClicked ? <Messenger /> : <div>Find new person</div>}
      </motion.div>
    </div>
  );
};

export default Chat;
