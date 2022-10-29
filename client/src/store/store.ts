import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { socketAPI } from '../services/SocketService';
import SocketReducer from './reducers/SocketSlice';

const rootReducer = combineReducers({
  [socketAPI.reducerPath]: socketAPI.reducer,
  SocketReducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(socketAPI.middleware),
  });
};

export type AppStore = ReturnType<typeof setupStore>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore["dispatch"];
