import React, { useContext, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserContext from '../UserContext';
import decodeToken from '../utils/jwtDecoder';


const LoginScreen = ({ navigation }) => {

  const { setUserData } = useContext(UserContext)

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log(token)
        if (token) {
          const decodedToken = decodeToken(token)
          if( decodedToken ){
            setUserData({ email: decodedToken.email, _id: decodedToken._id})
            navigation.navigate('Homes');
          }
          else{
            console.error('Invalid Token Format');
          }
        }
      } catch (error) {
        console.error('Error checking token', error);
      }
    };

    checkToken();
  }, [navigation, setUserData]);

  const handleLogin = async (values) => {
    try {
      const response = await axios.post('http://192.168.43.60:3000/api/auth/login', values);
      if (response.data.token) {
        // Store the token using AsyncStorage
        await AsyncStorage.setItem('token', response.data.token);
        const decodedToken = decodeToken(response.data.token);
        if (decodedToken) {
          setUserData({ email: decodedToken.email, id: decodedToken._id });
          navigation.navigate('Homes');
        } else {
          console.error('Invalid token format');
        }
      }
    } catch (error) {
      console.error('Login error', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../assets/loginimage.png')} style={styles.image} />
      <Text style={styles.welcomeText}>WELCOME</Text>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View>
            <Text style={styles.label}>EMAIL</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            <Text style={styles.label}>PASSWORD</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              secureTextEntry
              autoCapitalize="none"
            />
            {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>LOGIN</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
      <Text style={styles.link} onPress={() => navigation.navigate('Signup')}>
        Don't have an account? Register
      </Text>
      <Text style={styles.forgotPassword} onPress={() => navigation.navigate('ForgotPassword')}>
        Forgot password?
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  image: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1f1f1f',
  },
  label: {
    fontSize: 14,
    color: '#F5A623',
    marginBottom: 5,
    marginLeft: 5,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    marginLeft: 5,
  },
  button: {
    height: 50,
    backgroundColor: '#F5A623',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    color: '#F5A623',
    marginTop: 20,
    textAlign: 'center',
  },
  forgotPassword: {
    color: 'gray',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default LoginScreen;
