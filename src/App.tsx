import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import ChooseLanguage from "./Components/ChooseLanguage";

function App() {
  return (
    <Router>
        <Switch>
          <Route path="/en">
          </Route>
          <Route path="/cn">
          </Route>
          <Route path="/">
            <ChooseLanguage />
          </Route>
        </Switch>
    </Router>
  );
}

export default App;
