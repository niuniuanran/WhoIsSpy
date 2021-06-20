import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import ChooseLanguage from "./Components/ChooseLanguage";
import LanguageProvider from "./Contexts/LanguageContext";

function App() {
  return (
    <Router>
        <Switch>
          <Route path="/en">
            <LanguageProvider language={"en"}>
              <div>

              </div>
            </LanguageProvider>
          </Route>
          <Route path="/cn">
            <LanguageProvider language={"cn"}>
              <div>

              </div>
            </LanguageProvider>
          </Route>
          <Route path="/">
            <ChooseLanguage />
          </Route>
        </Switch>
    </Router>
  );
}

export default App;
