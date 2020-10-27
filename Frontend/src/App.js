import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import Users from "./user/pages/Users";
import NewEvent from "./events/pages/NewEvent";
import Events from "./events/pages/Events";
import UpdateEvent from "./events/pages/UpdateEvent";
import MainNavigation from "./shared/components/Navigation/MainNavigation";

function App() {
  return (
    <Router>
      <MainNavigation />
      <main>
        <Switch>
          <Route path="/" exact>
            <Users />
          </Route>
          <Route path="/events" exact>
            <Events />
          </Route>
          <Route path="/events/new" exact>
            <NewEvent />
          </Route>
          <Route path="/events/:eventId">
            <UpdateEvent />
          </Route>
          <Redirect to="/" />
        </Switch>
      </main>
    </Router>
  );
}

export default App;
