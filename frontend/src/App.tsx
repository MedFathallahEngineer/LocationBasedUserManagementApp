import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './Store/store';
import RegisterUser from './pages/RegisterUser';
import UserList from './pages/UserList';

function App() {
  return (
    // The Provider component makes the Redux store available to any nested components that need to access the Redux store.
    // It wraps the entire application and allows React components to interact with the store (via dispatching actions and selecting state).
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<UserList />} />
          <Route path="/add-user" element={<RegisterUser />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
