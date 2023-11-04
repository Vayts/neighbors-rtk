import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import { BrowserRouter } from 'react-router-dom';
import { store } from '@src/store';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { SkeletonTheme } from 'react-loading-skeleton';
import { App } from './components/App/App';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-toastify/dist/ReactToastify.css';
import './i18n';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <>
    <SkeletonTheme baseColor='#eeeff3' highlightColor='#e9eaef'/>
    <BrowserRouter>
      <Provider store={store}>
        <ToastContainer
          position="bottom-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover={false}
          theme="light"
        />
        <App/>
      </Provider>
    </BrowserRouter>
  </>
  ,
);
