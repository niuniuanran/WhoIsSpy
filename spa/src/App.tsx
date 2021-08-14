import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import ChooseLanguage from "./Components/EnterGame/ChooseLanguage";
import {LanguageProvider} from "./Contexts/LanguageContext";
import GameRoute from "./Components/GameRoute";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

function App() {
  const theme = createMuiTheme({
    palette: {
      type: 'dark',
    }
  })
  return (
    <ThemeProvider theme={theme}>
        <Router>
            <Switch>
              <Route path="/WhoIsSpy/en">
                <LanguageProvider language={"en"}>
                  <GameRoute/>
                </LanguageProvider>
              </Route>
              <Route path="/WhoIsSpy/cn">
                <LanguageProvider language={"cn"}>
                  <GameRoute/>
                </LanguageProvider>
              </Route>
              <Route path="/WhoIsSpy/">
                <ChooseLanguage />
              </Route>
            </Switch>
        </Router>
    </ThemeProvider>
  );
}

export default App;
