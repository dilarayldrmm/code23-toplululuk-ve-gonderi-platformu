import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { useAuth } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import FeedScreen from '../screens/FeedScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import ExploreScreen from '../screens/ExploreScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const RootStack = createNativeStackNavigator();
const FeedStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function FeedStackNavigator() {
  return (
    <FeedStack.Navigator screenOptions={{ headerShown: false }}>
      <FeedStack.Screen name="Feed" component={FeedScreen} />
      <FeedStack.Screen name="PostDetail" component={PostDetailScreen} />
      <FeedStack.Screen name="Notifications" component={NotificationsScreen} />
    </FeedStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#16a34a',
        tabBarInactiveTintColor: '#111827',
        tabBarStyle: {
          height: 60,
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 8,
        },
        tabBarIcon: ({ color, focused }) => {
          let iconName = 'home-outline';

          if (route.name === 'FeedTab') iconName = focused ? 'home' : 'home-outline';
          if (route.name === 'ExploreTab') iconName = focused ? 'search' : 'search-outline';
          if (route.name === 'SettingsTab') iconName = focused ? 'settings' : 'settings-outline';
          if (route.name === 'ProfileTab') iconName = focused ? 'person' : 'person-outline';

          if (route.name === 'CreatePostTab') {
            return (
              <View style={styles.createButton}>
                <Ionicons name="add" size={30} color="#000" />
              </View>
            );
          }

          return <Ionicons name={iconName} size={25} color={color} />;
        },
      })}
    >
      <Tab.Screen name="FeedTab" component={FeedStackNavigator} />
      <Tab.Screen name="ExploreTab" component={ExploreScreen} />
      <Tab.Screen name="CreatePostTab" component={CreatePostScreen} />
      <Tab.Screen name="SettingsTab" component={SettingsScreen} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { token } = useAuth();

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
          <>
            <RootStack.Screen name="MainTabs" component={MainTabs} />
            <RootStack.Screen name="PostDetail" component={PostDetailScreen} />
            <RootStack.Screen name="Notifications" component={NotificationsScreen} />
          </>
        ) : (
          <RootStack.Screen name="Login" component={LoginScreen} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = {
  createButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
};