import {Paper} from '@material-ui/core'
import MainLayout from './MainLayout'
import CreateRoom from './CreateRoom';
import EnterGameOptions from './EnterGameOptions';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useRouteMatch
  } from "react-router-dom";

export default function Main(){
    const match = useRouteMatch();

   return <MainLayout>
                <Switch>
                    <Route path={`${match.path}/create-room`}>
                        <CreateRoom/>
                    </Route>
                    <Route path={match.path}>
                        <EnterGameOptions/>
                    </Route>
                </Switch>
          </MainLayout>
}