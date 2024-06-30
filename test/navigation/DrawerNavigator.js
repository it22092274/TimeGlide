import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BoardsScreen from '../screens/DisplayBoardScreen';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome for icons

const Drawer = createDrawerNavigator();

const DrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.contentContainer}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.appName}>Time Glide</Text>
      </View>
      <View style={styles.drawerItemsContainer}>
        <DrawerItem
          label="Home"
          icon={({ color, size }) => (
            <Icon name="home" color="#F5A623" size={size} />
          )}
          onPress={() => props.navigation.navigate('Home')}
          style={styles.drawerItem}
          labelStyle={styles.drawerLabel}
        />
        <DrawerItem
          label="Profile"
          icon={({ color, size }) => (
            <Icon name="user" color="#F5A623" size={size} />
          )}
          onPress={() => props.navigation.navigate('Profile')}
          style={styles.drawerItem}
          labelStyle={styles.drawerLabel}
        />
        <DrawerItem
          label="Boards"
          icon={({ color, size }) => (
            <Icon name="clipboard" color="#F5A623" size={size} />
          )}
          onPress={() => props.navigation.navigate('Boards')}
          style={styles.drawerItem}
          labelStyle={styles.drawerLabel}
        />
        {/* Add more DrawerItems for other screens with icons */}
      </View>
    </DrawerContentScrollView>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          width: 200, // Set the width of the drawer sidebar
        },
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Boards" component={BoardsScreen} />
      {/* Add more screens as needed */}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#F5A623', // Change app name color
  },
  drawerItemsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%', // Ensure items take full width
  },
  drawerItem: {
    width: '80%', // Adjust width to center items horizontally
    marginVertical: 4,
  },
  drawerLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f1f1f',
  },
});
