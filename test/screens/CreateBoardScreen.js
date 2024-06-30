import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import UserContext from '../UserContext'; // Adjust the path as necessary
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { ColorPicker } from 'react-native-color-picker';
import Slider from '@react-native-community/slider';

const CreateBoardScreen = ({ navigation }) => {
  const { userData } = useContext(UserContext);
  const [themeType, setThemeType] = useState(null);
  const [imageUri, setImageUri] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Board name is required'),
    description: Yup.string().required('Description is required'),
    startdate: Yup.date().required('Start date is required'),
    expiredate: Yup.date().required('Expire date is required'),
    themeid: Yup.string().required('Theme ID is required'),
    displaycolor: Yup.string().when('themeType', {
      is: 'color',
      then: Yup.string().required('Display color is required'),
    }),
  });

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.uri);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post('http://172.28.3.238:3000/api/board/create', {
        uid: userData.id,
        ...values,
        startdate: startDate,
        expiredate: endDate,
        themeImage: imageUri,
      });

      if (response.status === 201) {
        navigation.navigate('BoardsScreen');
      } else {
        console.error('Error creating board:', response.data.message);
      }
    } catch (error) {
      console.error('Error creating board:', error);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Formik
          initialValues={{
            name: '',
            description: '',
            themeid: '',
            displaycolor: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.formContainer}>
              <Text style={styles.title}>Create a New Board</Text>

              <View style={styles.inputGroup}>
                <Ionicons name="clipboard-outline" size={24} color="#888" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Board Name"
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                />
              </View>
              {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}

              <View style={styles.inputGroup}>
                <Ionicons name="document-text-outline" size={24} color="#888" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Description"
                  onChangeText={handleChange('description')}
                  onBlur={handleBlur('description')}
                  value={values.description}
                />
              </View>
              {touched.description && errors.description && <Text style={styles.error}>{errors.description}</Text>}

              <View style={styles.inputGroup}>
                <Ionicons name="calendar-outline" size={24} color="#888" style={styles.inputIcon} />
                <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.datePickerButton}>
                  <Text style={styles.datePickerButtonText}>{startDate.toDateString()}</Text>
                </TouchableOpacity>
                {showStartDatePicker && (
                  <DateTimePicker
                    value={startDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowStartDatePicker(false);
                      if (selectedDate) {
                        setStartDate(selectedDate);
                        handleChange('startdate')(selectedDate);
                      }
                    }}
                  />
                )}
              </View>
              {touched.startdate && errors.startdate && <Text style={styles.error}>{errors.startdate}</Text>}

              <View style={styles.inputGroup}>
                <Ionicons name="calendar-outline" size={24} color="#888" style={styles.inputIcon} />
                <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.datePickerButton}>
                  <Text style={styles.datePickerButtonText}>{endDate.toDateString()}</Text>
                </TouchableOpacity>
                {showEndDatePicker && (
                  <DateTimePicker
                    value={endDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowEndDatePicker(false);
                      if (selectedDate) {
                        setEndDate(selectedDate);
                        handleChange('expiredate')(selectedDate);
                      }
                    }}
                  />
                )}
              </View>
              {touched.expiredate && errors.expiredate && <Text style={styles.error}>{errors.expiredate}</Text>}

              <View style={styles.themeTypeContainer}>
                <TouchableOpacity
                  style={[styles.themeTypeButton, themeType === 'color' && styles.themeTypeButtonActive]}
                  onPress={() => setThemeType('color')}
                >
                  <Ionicons name="color-palette-outline" size={24} color="#fff" />
                  <Text style={styles.themeTypeButtonText}>Use Color</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.themeTypeButton, themeType === 'image' && styles.themeTypeButtonActive]}
                  onPress={() => setThemeType('image')}
                >
                  <Ionicons name="image-outline" size={24} color="#fff" />
                  <Text style={styles.themeTypeButtonText}>Use Image</Text>
                </TouchableOpacity>
              </View>

              {themeType === 'color' && (
                <View style={styles.inputGroup}>
                  <Ionicons name="color-palette-outline" size={24} color="#888" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Display Color"
                    onChangeText={handleChange('displaycolor')}
                    onBlur={handleBlur('displaycolor')}
                    value={values.displaycolor}
                  />
                  <ColorPicker
                    onColorSelected={color => handleChange('displaycolor')(color)}
                    style={{ flex: 1, height: 200 }}
                  />
                </View>
              )}

              {themeType === 'image' && (
                <View style={styles.inputGroup}>
                  <Ionicons name="image-outline" size={24} color="#888" style={styles.inputIcon} />
                  <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePick}>
                    <Text style={styles.imagePickerButtonText}>Pick an Image</Text>
                  </TouchableOpacity>
                  {imageUri ? <Image source={{ uri: imageUri }} style={styles.imagePreview} /> : null}
                </View>
              )}

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                  <Text style={styles.submitButtonText}>Create Board</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#F5A623',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginLeft: 10,
    backgroundColor: '#888',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  themeTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#888',
    marginHorizontal: 5,
  },
  themeTypeButtonActive: {
    backgroundColor: '#F5A623',
  },
  themeTypeButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
  imagePickerButton: {
    backgroundColor: '#F5A623',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  imagePickerButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  imagePreview: {
    marginTop: 10,
    width: '100%',
    height: 200,
    borderRadius: 5,
  },
});

export default CreateBoardScreen;
