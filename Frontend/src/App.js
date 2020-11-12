import React, { useState, useCallback } from "react";
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
import EventProfile from "./events/pages/EventProfile";
import Profile from "./user/pages/Profile";
import Chat from "./chat/Chat";
import Auth from "./user/pages/Auth";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { AuthContext } from "./shared/context/auth-context";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(false);

  const login = useCallback((uid) => {
    setIsLoggedIn(true);
    setUserId(uid);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserId(null);
  }, []);

  let routes;

  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Events />
        </Route>
        <Route path="/users" exact>
          <Users />
        </Route>
        <Route path="/users/:userId/" exact>
          <Profile />
        </Route>
        <Route path="/events" exact>
          <Events />
        </Route>
        <Route path="/events/new" exact>
          <NewEvent />
        </Route>
        <Route path="/events/:eventId/update" exact>
          <UpdateEvent />
        </Route>
        <Route path="/events/:eventId">
          <EventProfile />
        </Route>
        <Route path="/chat/:eventId">
          <Chat />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Events />
        </Route>
        <Route path="/events" exact>
          <Events />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
