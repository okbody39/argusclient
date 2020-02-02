// Libs
import React from "react";
import { HashRouter, Switch, Route } from "react-router-dom";
// Screens
import Home from "@/screens/Home/Home";
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

const Routes = () => (
  <HashRouter>
    <Switch>
      <Route exact path="/" component={Home} />
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
    </Switch>
  </HashRouter>
);

export default Routes;
