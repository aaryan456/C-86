import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import exchangeScreen from '../screens/exchangeScreen';
import RecieverDetailsScreen  from '../screens/RecieverDetailsScreen';




export const AppStackNavigator = createStackNavigator({
  BookDonateList : {
    screen : exchangeScreen,
    navigationOptions:{
      headerShown : false
    }
  },
  RecieverDetails : {
    screen : RecieverDetailsScreen,
    navigationOptions:{
      headerShown : false
    }
  }
},
  {
    initialRouteName: 'BookDonateList'
  }
);
