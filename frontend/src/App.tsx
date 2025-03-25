import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './Store/store';
import RegisterUser from './pages/RegisterUser';
import UserList from './pages/UserList';

function App() {
  return (
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
