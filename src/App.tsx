import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import ChooseLanguage from "./Components/ChooseLanguage";
import {LanguageProvider} from "./Contexts/LanguageContext";
import Main from "./Components/Main";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import MainLayout from "./Components/MainLayout";

function App() {
  const theme = createMuiTheme({
    palette: {
      type: 'dark',
    }
  })
  return (
    <ThemeProvider theme={theme}>
      <MainLayout>
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
      </MainLayout>
    </ThemeProvider>
  );
}

export default App;
