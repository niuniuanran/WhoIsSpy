import CreateRoom from './CreateRoom';
import EnterGameOptions from './EnterGameOptions';
import {
    Switch,
    Route,
    useRouteMatch
  } from "react-router-dom";

export default function Main(){
    const match = useRouteMatch();

   return  <Switch>
                <Route path={`${match.path}/create-room`}>
                    <CreateRoom/>
                </Route>
                <Route path={match.path}>
                    <EnterGameOptions/>
                </Route>
            </Switch>
}