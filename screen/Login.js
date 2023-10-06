import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react'

const Login = () => {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Text>thanh Tung</Text>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
     
    },
  });
export default Login