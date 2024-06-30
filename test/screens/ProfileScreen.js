import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Image, ScrollView, Modal } from 'react-native';
import UserContext from '../UserContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

const ProfileScreen = ({ navigation }) => {
  const { userData, setUserData } = useContext(UserContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentNew, setCurrentNew] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newProfileData, setNewProfileData] = useState({
    name: '',
    email: '',
    age: '',
    address: '',
    bio: '',
    profilePicture: null,
  });
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.post('http://192.168.43.60:3000/api/auth/profile', {
          email: userData.email,
        });
        setProfile(response.data.data);
        setNewProfileData({
          name: response.data.data.name,
          email: response.data.data.email,
          age: response.data.data.age.toString(),
          address: response.data.data.address,
          bio: response.data.data.bio,
          profilePicture: response.data.data.profilePicture,
        });
        setCurrentNew(response.data.data.profilePicture);
      } catch (error) {
        console.error('Error fetching profile:', error);
        Alert.alert('Error', 'Failed to fetch profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset newProfileData to current profile data
    setNewProfileData({
      name: profile.name,
      email: profile.email,
      age: profile.age.toString(),
      address: profile.address,
      bio: profile.bio,
      profilePicture: profile.profilePicture,
    });
  };

  const handleUpdateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append('name', newProfileData.name);
      formData.append('email', newProfileData.email);
      formData.append('age', newProfileData.age);
      formData.append('address', newProfileData.address);
      formData.append('bio', newProfileData.bio);

      if (newProfileData.profilePicture) {
        const localUri = newProfileData.profilePicture.uri;
        if (localUri) {
          const filename = localUri.split('/').pop();
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : 'image';

          formData.append('profilePicture', {
            uri: localUri,
            name: filename,
            type,
          });
        }
      }

      const response = await axios.put(`http://192.168.43.60:3000/api/auth/profile/update/${profile._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setProfile(response.data.data);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully.');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  const handleImagePicker = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      console.log(result.assets[0].uri);
      

      if (!result.canceled) {
        setNewProfileData({ ...newProfileData, profilePicture: result.assets[0] });
        setCurrentNew(result.assets[0].uri);
      }

    } catch (error) {
      console.error('Error opening image picker:', error);
      Alert.alert('Error', 'Failed to open image picker.');
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setUserData(null);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Failed to logout.');
    }
  };

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setUserData(null);
      navigation.navigate('SignOut');
    } catch (error) {
      console.error('Error during sign out:', error);
      Alert.alert('Error', 'Failed to sign out.');
    }
  };

  const handleImageClick = () => {
    if (isEditing) {
      handleImagePicker();
    } else {
      setShowImageModal(true);
    }
  };

  const closeModal = () => {
    setShowImageModal(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleImageClick}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: currentNew ? currentNew : profile.profilePicture }}
              style={styles.profileImage}
              resizeMode="cover"
            />
            {isEditing && <Text style={styles.editImageText}>Edit Image</Text>}
          </View>
        </TouchableOpacity>

        <View style={styles.profileDetails}>
          <Text style={styles.label}>Name:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={newProfileData.name}
              onChangeText={(text) => setNewProfileData({ ...newProfileData, name: text })}
            />
          ) : (
            <Text style={styles.value}>{profile.name}</Text>
          )}

          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{profile.email}</Text>

          <Text style={styles.label}>Age:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={newProfileData.age}
              onChangeText={(text) => setNewProfileData({ ...newProfileData, age: text })}
              keyboardType="numeric"
            />
          ) : (
            <Text style={styles.value}>{profile.age}</Text>
          )}

          <Text style={styles.label}>Address:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={newProfileData.address}
              onChangeText={(text) => setNewProfileData({ ...newProfileData, address: text })}
            />
          ) : (
            <Text style={styles.value}>{profile.address}</Text>
          )}

          <Text style={styles.label}>Bio:</Text>
          {isEditing ? (
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={newProfileData.bio}
              onChangeText={(text) => setNewProfileData({ ...newProfileData, bio: text })}
              multiline
            />
          ) : (
            <Text style={styles.value}>{profile.bio}</Text>
          )}
        </View>

        {isEditing && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.iconButton} onPress={handleUpdateProfile}>
              <Icon name="check" size={24} color="#F5A623" />
              <Text style={styles.iconButtonText}>update</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleCancelEdit}>
              <Icon name="times" size={24} color="#F5A623" />
              <Text style={styles.iconButtonText}>cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {!isEditing && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.iconButton} onPress={handleEditProfile}>
              <Icon name="edit" size={24} color="#F5A623" />
              <Text style={styles.iconButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
              <Icon name="sign-out" size={24} color="#F5A623" />
              <Text style={styles.iconButtonText}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleSignOut}>
              <Icon name="times-circle" size={24} color="#F5A623" />
              <Text style={styles.iconButtonText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        )}

        <Modal
          visible={showImageModal}
          transparent={true}
          animationType="slide"
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Icon name="times" size={24} color="#fff" />
            </TouchableOpacity>
            <Image
              source={{ uri: currentNew ? currentNew : profile.profilePicture }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  editImageText: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#000',
    color: '#fff',
    padding: 5,
    borderRadius: 5,
  },
  profileDetails: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  input: {
    fontSize: 16,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    paddingVertical: 5,
  },
  bioInput: {
    height: 'auto',
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 10,
  },
  iconButton: {
    alignItems: 'center',
  },
  iconButtonText: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  editButton: {
    backgroundColor: '#F5A623',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: '#F5A623',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 20,
    zIndex: 10,
  },
  modalImage: {
    width: '90%',
    height: '90%',
  },
});

export default ProfileScreen;
