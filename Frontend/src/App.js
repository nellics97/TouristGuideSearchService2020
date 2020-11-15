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
import EventProfile from "./events/pages/EventProfile";
import Profile from "./user/pages/Profile";
import UpdateProfile from "./user/pages/UpdateProfile";
import Chat from "./chat/Chat";
import Auth from "./user/pages/Auth";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";
import UserEvents from "./events/pages/UserEvents";

function App() {
  const { token, login, logout, userId } = useAuth();

  let routes;

  if (token) {
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
        <Route path="/users/:userId/update" exact>
          <UpdateProfile />
        </Route>
        <Route path="/events" exact>
          <Events />
        </Route>
        <Route path="/events/new" exact>
          <NewEvent />
        </Route>
        <Route path="/events/:userId">
          <UserEvents />
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
        isLoggedIn: !!token,
        token: token,
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
