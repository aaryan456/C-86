import React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import { AppTabNavigator } from './AppTabNavigator'
import CustomSideBarMenu  from './CustomSideBarMenu';
import MainScreen from '../screens/MainScreen';
import NotificationScreen from '../screens/NotificationScreen';
import SettingScreen from '../screens/SettingScreen';
import ReceivedScreen from '../screens/ReceivedScreen';

export const AppDrawerNavigator = createDrawerNavigator({
  Home : {
    screen : AppTabNavigator
    },
  MyDonations : {
    screen : MainScreen
  },
  Notification : {
    screen : NotificationScreen
  },
  ReceivedScreen :{
    screen: ReceivedScreen
  },
  Setting : {
    screen : SettingScreen
  }
},
  {
    contentComponent:CustomSideBarMenu
  },
  {
    initialRouteName : 'Home'
  })
