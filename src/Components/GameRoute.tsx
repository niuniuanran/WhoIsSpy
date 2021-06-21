import NewRoom from './EnterGame/NewRoom';
import EnterGameOptions from './EnterGame/EnterGameOptions';
import {
    Switch,
    Route,
    useRouteMatch
  } from "react-router-dom";

export default function GameRoute(){
    const match = useRouteMatch();

   return  <Switch>
                <Route path={`${match.path}/new-room`}>
                    <NewRoom/>
                </Route>
                <Route path={match.path}>
                    <EnterGameOptions/>
                </Route>
            </Switch>
}