// components/CustomDrawerContent.js

import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

const CustomDrawerContent = ({ navigation }) => {
  const navigateToScreen = (screenName) => () => {
    navigation.navigate(screenName);
  };

  return (
    <DrawerContentScrollView style={{
      width: 150,
    }}>
      <View style={styles.drawerContent}>
        {/* App Logo and Name */}
        <View style={{
          width: 150,
        }}>
          <Image
            source={require('../assets/rpw.png')} // Adjust path to your app logo
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>Time Glide</Text>
        </View>

        {/* Drawer Items */}
        <DrawerItem
          label="Home"
          labelStyle={styles.drawerLabel}
          onPress={navigateToScreen('Home')}
        />
        <DrawerItem
          label="Profile"
          labelStyle={styles.drawerLabel}
          onPress={navigateToScreen('Profile')}
        />
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingTop: 30, // Added padding to avoid overlap with status bar
    backgroundColor: '#ffffff', // Added background color for visibility
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 10,
    // Removed tintColor as it doesn't work with all image types
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F5A623', // App name color
  },
  drawerLabel: {
    color: '#F5A623', // Drawer item label color
  },
});

export default CustomDrawerContent;
