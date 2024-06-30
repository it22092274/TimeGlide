import React from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const ResetPasswordScreen = ({ route, navigation }) => {
  const { email } = route.params;

  const validationSchema = Yup.object().shape({
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const handleResetPassword = async (values) => {
    try {
      const response = await axios.post('http://192.168.43.60:3000/api/auth/reset-password', {
        email,
        password: values.password,
      });
      if (response.status == 200) {
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Reset Password error', error);
    }
  };

  return (
    <View style={styles.container}>
              <Image source={require('../assets/rpw.png')} style={styles.image} />
      <Text style={styles.welcomeText}>Reset Password</Text>
      <Formik
        initialValues={{ password: '', confirmPassword: '' }}
        validationSchema={validationSchema}
        onSubmit={handleResetPassword}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View>
            <Text style={styles.label}>NEW PASSWORD</Text>
            <TextInput
              style={styles.input}
              placeholder="New Password"
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              secureTextEntry
              autoCapitalize="none"
            />
            {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            <Text style={styles.label}>CONFIRM PASSWORD</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              value={values.confirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            {touched.confirmPassword && errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Reset Password</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1f1f1f',
  },
  image: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    marginBottom: 20,
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
});

export default ResetPasswordScreen;
