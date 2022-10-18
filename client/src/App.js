
import React  from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Routing
import {PrivateRoute, AdminPrivateRoute} from './components/routing/PrivateRoute';

// Screens
import PrivateScreen from './components/screens/PrivateScreen';
import LoginScreen from './components/screens/LoginScreen';
import RegisterScreen from './components/screens/RegisterScreen';
import ForgotPasswordScreen from './components/screens/ForgotPasswordScreen';
import ResetPasswordScreen from './components/screens/ResetpasswordScreen';
import CaptchaScreen from './components/screens/CaptchaScreen';
import DashboardScreen from './components/screens/DashboardScreen';
import NintyDaysScreen from './components/screens/NintyDaysScreen';
import NotFound from './components/screens/pathFail';

import TestScreen from './components/screens/TestScreen';
import MapScreen from './components/maps/MapScreen';

import AdminMapScreen from './components/maps/AdminMapScreen';
import AdminStatusScreen from './components/maps/AdminStatusScreen';


const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* <PrivateRoute exact path="/" element={<PrivateScreen/>}/> */}
          <Route path="/"element={<PrivateRoute><PrivateScreen /></PrivateRoute>}/>
          <Route exact path="/login" element={<LoginScreen/>}/>
          <Route exact path="/register" element={<RegisterScreen/>}/>
          <Route exact path="/forgotpassword" element={<ForgotPasswordScreen/>}/>
          <Route exact path="/passwordreset/:resetToken" element={<ResetPasswordScreen/>}/>

          <Route exact path="/90dayresetpassword" element={<NintyDaysScreen/>}/>
          <Route exact path="/dashboard" element={<AdminPrivateRoute><DashboardScreen/></AdminPrivateRoute>}/>
          <Route exact path="/captcha" element={<CaptchaScreen/>}/>

          <Route path="*" element={<NotFound />}/>

          <Route exact path="/p" element={<TestScreen/>}/>
          <Route exact path="/map" element={<MapScreen/>}/>

          <Route exact path="/admin/map" element={<AdminMapScreen/>}/>
          <Route exact path="/admin/status" element={<AdminStatusScreen/>}/>


        </Routes>
      </div>
    </Router>
  );
}

export default App;
