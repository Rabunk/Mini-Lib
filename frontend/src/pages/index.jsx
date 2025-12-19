import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import BookManagement from './BookManagement';
import UserManagement from './UserManagement';
import BorrowAndReturn from './Borrow&Return';

function NotFound (){
    return <h1 className='text-center font-bold'> 404 - Not Found </h1>
}

export default function AppRouter() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Login></Login>} ></Route>
        <Route path='/dashboard' element={<Dashboard></Dashboard>} ></Route>
        <Route path='/books' element={<BookManagement></BookManagement>} ></Route>
        <Route path='/members' element={<UserManagement></UserManagement>} ></Route> 
        <Route path='/borrownreturn' element={<BorrowAndReturn></BorrowAndReturn>} ></Route>
        
        <Route path='*' element={<NotFound></NotFound>} ></Route>
      </Routes>
    </>
  )
}
