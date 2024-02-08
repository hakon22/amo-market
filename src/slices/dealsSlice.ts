import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import type { Deal } from '@/types/Deal';
import { InitialStateType } from '@/types/InitialState';
import type { RootState } from './index';

export const dealsAdapter = createEntityAdapter<Deal>();

export const initialState: InitialStateType = {
  loadingStatus: 'idle',
  error: null,
};

const dealsSlice = createSlice({
  name: 'deals',
  initialState: dealsAdapter.getInitialState(initialState),
  reducers: {
    dealsAdd: dealsAdapter.addMany,
  },
});

export const { dealsAdd } = dealsSlice.actions;

export const selectors = dealsAdapter.getSelectors<RootState>((state) => state.deals);

export default dealsSlice.reducer;
