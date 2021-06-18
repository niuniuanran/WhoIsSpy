import react from 'react'
import {
    BrowserRouter as Router,
    Route,
    Link
  } from "react-router-dom";
export default function ChooseLanguage(){
    return <div>
        <Route>
            <Link to="/en">English</Link>
            <Link to="/cn">中文</Link>
        </Route>
    </div>
}