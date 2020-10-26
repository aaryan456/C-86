import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { AppStackNavigator } from './AppStackNavigator'
import request from '../screens/request';


export const AppTabNavigator = createBottomTabNavigator({
  DonateBooks : {
    screen: AppStackNavigator,
    navigationOptions :{
      tabBarLabel : "Donate",
    }
  },
  BookRequest: {
    screen: request,
    navigationOptions :{
      tabBarLabel : "Request",
    }
  }
});
