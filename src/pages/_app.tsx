/* eslint-disable react/jsx-props-no-spreading */
import { Provider } from 'react-redux';
import type { AppProps } from 'next/app';
import store from '../slices/index';
import '../scss/app.scss';

const init = ({ Component, pageProps }: AppProps) => (
  <Provider store={store}>
    <main>
      <div className="container my-4">
        <div className="anim-show">
          <Component {...pageProps} />
        </div>
      </div>
    </main>
  </Provider>
);

export default init;
