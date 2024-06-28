// components/CustomDrawerContent.js

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

const CustomDrawerContent = ({ navigation }) => {
  const navigateToScreen = (screenName) => () => {
    navigation.navigate(screenName);
  };

  return (
    <DrawerContentScrollView>
      <View style={styles.drawerContent}>
        <DrawerItem
          label="Home"
          onPress={navigateToScreen('Home')}
        />
        <DrawerItem
          label="Profile"
          onPress={navigateToScreen('Profile')}
        />
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    paddingTop: 20,
  },
});

export default CustomDrawerContent;
