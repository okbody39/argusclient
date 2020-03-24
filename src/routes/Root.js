// Libs
import React from "react";
import { HashRouter, Switch, Route, Redirect } from "react-router-dom";
// Screens
import Root from "@/screens/Root/Root";
import Home from "@/screens/Home/Home";

import Admin from "@/screens/Admin/Admin";

import Signin from "@/screens/Signin/Signin";
import Signup from "@/screens/Signup/Signup";
import Failure from "@/screens/Failure/Failure";
import Notice from "@/screens/Notice/Notice";
import Alarm from "@/screens/Alarm/Alarm";

import Change from "@/screens/Change/Change";
import ChangePassword from "@/screens/Change/Password";

import Settings from "@/screens/Settings/Settings";

import HistoryChange from "@/screens/History/Change";
import HistoryFailure from "@/screens/History/Failure";
import HistoryAccess from "@/screens/History/Access";

import VMCreate from "@/screens/VM/Create";

function PrivateRoute ({component: Component, ...rest}) {

  let userToken = localStorage.getItem("ARGUS.USERTOKEN");

  return (
    <Route
      {...rest}
      render={(props) => userToken === "true"
        ? <Component {...props} />
        : <Redirect to={{pathname: '/signin', state: {from: props.location}}} />}
    />
  )
}

const Routes = () => (
  <HashRouter>
    <Switch>
      <PrivateRoute exact path='/' component={Root} />
      <PrivateRoute path='/home' component={Root} />

      <PrivateRoute path='/admin' component={Admin} />

      {/*
      <Route exact path="/" component={Root} />
      <Route exact path="/home" component={Root} />
      */}

      <Route path="/signin" component={Signin} />
      <Route path="/signup" component={Signup} />

      <Route path="/failure" component={Failure} />
      <Route path="/notice" component={Notice} />
      <Route path="/alarm" component={Alarm} />

      <Route path="/change/password" component={ChangePassword} />
      <Route path="/change" component={Change} />

      <Route path="/settings" component={Settings} />

      <Route path="/history/change" component={HistoryChange} />
      <Route path="/history/failure" component={HistoryFailure} />
      <Route path="/history/access" component={HistoryAccess} />

      <Route path="/vm/create" component={VMCreate} />
    </Switch>
  </HashRouter>
);

export default Routes;
