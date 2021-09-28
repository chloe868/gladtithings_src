import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationActions, StackActions} from 'react-navigation';
import Dashboard from 'modules/dashboard/Stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faBell, faUsers } from '@fortawesome/free-solid-svg-icons';
import { Color } from 'common';
import Menu from 'modules/menu/index';


const Tab = createBottomTabNavigator();

export default function TabNavigator(props) {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={
          props.navigation.state.params != null
            ? props.navigation.state.params.initialRouteName
            : 'Dashboard'
        }
        tabBarOptions={{
          activeTintColor: '#81CB9C',
          style: {
            height: 60,
          },
          showLabel: false,
          tabStyle: {
            marginTop: '2%',
            marginBottom: '2%',
          },
        }}>
        <Tab.Screen
          name="Dashboard"
          children={route => (
            <Dashboard
              {...route}
              initialPage={props.navigation.state.routeName}
              parentNav={props.navigation}
            />
          )}
          options={{
            tabBarLabel: 'SETTINGS',
            tabBarIcon: () => 
            <FontAwesomeIcon
              icon={faUsers}
              size={30}
              color={Color.gray}
              />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
