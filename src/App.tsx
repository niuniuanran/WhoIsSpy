import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import ChooseLanguage from "./Components/ChooseLanguage";
import LanguageProvider from "./Contexts/LanguageContext";
import Main from "./Components/Main";

function App() {
  return (
    <Router>
        <Switch>
          <Route path="/en">
            <LanguageProvider language={"en"}>
              <Main/>
            </LanguageProvider>
          </Route>
          <Route path="/cn">
            <LanguageProvider language={"cn"}>
              <Main/>
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
