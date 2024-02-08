import { configureStore } from '@reduxjs/toolkit';
import dealsReducer from './dealsSlice';

const store = configureStore({
  reducer: {
    deals: dealsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
