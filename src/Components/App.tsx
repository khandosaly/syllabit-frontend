import {useEffect, useState} from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import SignIn from "./SignIn";
import MyTables from "./MyTables";
import SyllabusForm from "./SyllabusForm";
import SyllabusView from "./SyllabusView";
import * as React from "react";

export default function App() {

  return (
    <Routes>
      {!!localStorage.getItem('token') ? (
        <>
          <Route path='/my-tables' element={<MyTables/>} />
          <Route path='/syllabus/form' element={<SyllabusForm/>} />
          <Route path='/syllabus/view/:pk' element={<SyllabusView/>} />
          <Route path="*" element={<Navigate to="/my-tables" replace />}/>
        </>
      ) : (
        <>
          <Route path='/login' element={<SignIn/>} />
          <Route path="*" element={<Navigate to="/login" replace />}/>
        </>
      )}

      {/*<Route path="*" element={<Navigate to="" replace />}/>*/}



    </Routes>
  )
}
