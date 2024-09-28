// components/Toast.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Toast = ({ message, visible, type }) => {
  if (!visible) return null; // Return null if not visible

  return (
    <View style={styles.toast}>
      <Text style={[styles.toastText, type === 'success' ? styles.successText : styles.errorText]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 50, // Position at the top of the screen
    left: '50%',
    transform: [{ translateX: -150 }],
    padding: 10,
    borderRadius: 5,
    zIndex: 1000,
    width: '80%', // Optional: adjust width
    backgroundColor: '#ffffff', // Set a consistent background color
  },
  toastText: {
    fontFamily:"outfit-medium",
    fontSize: 16,
    textAlign: 'center', // Center text
  },
  successText: {
    color: 'green', // Text color for success
  },
  errorText: {
    color: 'red', // Text color for error
  },
});

export default Toast;
