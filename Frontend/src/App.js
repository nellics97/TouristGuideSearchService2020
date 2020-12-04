import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

//import Users from "./user/pages/Users";
//import NewEvent from "./events/pages/NewEvent";
//import Events from "./events/pages/Events";
//import UpdateEvent from "./events/pages/UpdateEvent";
//import EventProfile from "./events/pages/EventProfile";
//import Profile from "./user/pages/Profile";
//import UpdateProfile from "./user/pages/UpdateProfile";
//import Chat from "./chat/Chat";
//import Auth from "./user/pages/Auth";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";
import UserEvents from "./events/pages/UserEvents";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";

const Users = React.lazy(() => import("./user/pages/Users"));
const NewEvent = React.lazy(() => import("./events/pages/NewEvent"));
const Events = React.lazy(() => import("./events/pages/Events"));
const UpdateEvent = React.lazy(() => import("./events/pages/UpdateEvent"));
const EventProfile = React.lazy(() => import("./events/pages/EventProfile"));
const Profile = React.lazy(() => import("./user/pages/Profile"));
const UpdateProfile = React.lazy(() => import("./user/pages/UpdateProfile"));
const Chat = React.lazy(() => import("./chat/Chat"));
const Auth = React.lazy(() => import("./user/pages/Auth"));

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
        <Route path="/events/user/:userId" exact>
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
        <main>
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner />
              </div>
            }
          >
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
