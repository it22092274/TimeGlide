import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

const ProfileForm = ({ profile, onUpdateProfile, setNewProfileImage, updating, newProfileImage }) => {
  const [formData, setFormData] = useState({
    name: profile.name || '',
    bio: profile.bio || '',
    phone: profile.phone || '',
    address: profile.address || '',
    age: profile.age ? profile.age.toString() : '',
    profilePicture: profile.profilePicture || '',
  });

  useEffect(() => {
    setFormData({
      name: profile.name || '',
      bio: profile.bio || '',
      phone: profile.phone || '',
      address: profile.address || '',
      age: profile.age ? profile.age.toString() : '',
      profilePicture: profile.profilePicture || '',
    });
  }, [profile]);

  const handleUpdate = () => {
    const updatedFormData = new FormData();
    updatedFormData.append('name', formData.name || '');
    updatedFormData.append('bio', formData.bio || '');
    updatedFormData.append('phone', formData.phone || '');
    updatedFormData.append('address', formData.address || '');
    updatedFormData.append('age', formData.age || '');
    if (newProfileImage) {
      updatedFormData.append('profilePicture', {
        uri: newProfileImage.uri,
        type: newProfileImage.type,
        name: newProfileImage.fileName,
      });
    }

    onUpdateProfile(updatedFormData);
  };

  const handleImagePicker = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setNewProfileImage(result);
      } else if (result.error) {
        console.error('ImagePicker Error:', result.error);
        Alert.alert('Error', 'Failed to pick an image.');
      }
    } catch (error) {
      console.error('Error opening image picker:', error);
      Alert.alert('Error', 'Failed to open image picker.');
    }
  };

  return (
    <View style={styles.profileDetails}>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Name"
        />
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Email:</Text>
        <TextInput style={styles.input} value={profile.email} editable={false} />
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>ID:</Text>
        <Text style={styles.value}>{profile._id}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Phone:</Text>
        <TextInput
          style={[styles.input, { textAlign: 'left' }]}
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          placeholder="Phone Number"
        />
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Address:</Text>
        <TextInput
          style={styles.input}
          value={formData.address}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
          placeholder="Address"
        />
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Age:</Text>
        <TextInput
          style={styles.input}
          value={formData.age}
          onChangeText={(text) => setFormData({ ...formData, age: text })}
          placeholder="Age"
          keyboardType="numeric"
        />
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Bio:</Text>
        <TextInput
          style={styles.bioInput}
          value={formData.bio}
          onChangeText={(text) => setFormData({ ...formData, bio: text })}
          placeholder="Bio"
          multiline
        />
      </View>
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate} disabled={updating}>
        <Text style={styles.updateButtonText}>{updating ? 'Updating...' : 'Update Profile'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  profileDetails: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F5A623',
    width: '20%',
  },
  value: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  input: {
    fontSize: 16,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
    flex: 1,
  },
  bioInput: {
    fontSize: 16,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
    flex: 1,
  },
  updateButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#F5A623',
    borderRadius: 10,
    alignItems: 'center',
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default ProfileForm;
