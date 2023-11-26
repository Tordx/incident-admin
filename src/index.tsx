import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from 'global/redux/reducers/indexReducer';
import { AuthContextProvider } from 'auth';

const root = document.getElementById('root');
const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() 
)
if (root) {
  ReactDOM.render(
    <Provider store={store}>
      <AuthContextProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </AuthContextProvider>
    </Provider>,
    root
    
  );
}