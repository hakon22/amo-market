export type LoadingStatus = 'idle' | 'loading' | 'finish' | 'failed';

export type InitialStateType = {
  loadingStatus: LoadingStatus;
  error: string | null;
}
