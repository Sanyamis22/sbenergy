import React from 'react';
import {View, Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Verify from './pages/auth/Verify';
import Signup from './pages/auth/Signup';

const Stack = createStackNavigator();

const AuthNavigation = () => {
    return(
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" options={{headerShown: false}} component={Login} />
        <Stack.Screen name="Signup" options={{headerShown: false}} component={Signup} />
        <Stack.Screen name="ForgotPassword" options={{headerShown: false}} component={ForgotPassword} />
        <Stack.Screen name="Verify" options={{headerShown: false}} component={Verify} />
        <Stack.Screen name="ResetPassword" options={{headerShown: false}} component={ResetPassword} />
      </Stack.Navigator>
    )
}

export default AuthNavigation