import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const OTPScreen = ({ route, navigation }) => {
  const { email } = route.params;

  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const validationSchema = Yup.object().shape({
    otp: Yup.string().length(6, 'OTP must be 6 digits').required('OTP is required'),
  });

  const handleVerifyOTP = async (values) => {
    try {
      const response = await axios.post('http://192.168.43.60:3000/api/auth/otp', { email, otp: values.otp });
      if (response.status === 200) {
        navigation.navigate('ResetPassword', { email });
      }
    } catch (error) {
      console.error('OTP Verification error', error);
    }
  };

  const handleResendOTP = async () => {
    try {
      await axios.post('http://192.168.43.60:3000/api/auth/forgot-password', { email });
      setTimer(60);
      setIsResendDisabled(true);
    } catch (error) {
      console.error('Resend OTP error', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/otp.png')} style={styles.image} />
      <Text style={styles.welcomeText}>Enter OTP</Text>
      <Formik
        initialValues={{ otp: '' }}
        validationSchema={validationSchema}
        onSubmit={handleVerifyOTP}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View>
            <Text style={styles.label}>OTP</Text>
            <TextInput
              style={styles.input}
              placeholder="OTP"
              onChangeText={handleChange('otp')}
              onBlur={handleBlur('otp')}
              value={values.otp}
              keyboardType="numeric"
              autoCapitalize="none"
            />
            {touched.otp && errors.otp && <Text style={styles.errorText}>{errors.otp}</Text>}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Verify OTP</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.resendButton, isResendDisabled ? styles.buttonDisabled : styles.buttonEnabled]}
              onPress={handleResendOTP}
              disabled={isResendDisabled}
            >
              <Text style={[styles.resendButtonText, isResendDisabled ? styles.resendButtonText : styles.buttonEnabled]}>Resend OTP ({timer})</Text>
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
  label: {
    fontSize: 14,
    color: '#F5A623',
    marginBottom: 5,
    marginLeft: 5,
  },
  image: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    marginBottom: 20,
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
  resendButton: {
    height: 50,
    backgroundColor: '#fff',
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
  resendButtonText: {
    color: '#1f1f1f',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#fff',
  },
  buttonEnabled: {
    color: '#F5A623',
  },
  forgotPassword: {
    color: 'gray',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default OTPScreen;
