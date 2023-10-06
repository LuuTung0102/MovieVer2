import React from 'react'
import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import styled from 'styled-components/native';
import {auth} from '../firebase';


const Container = styled.View`
	flex: 1;
    background-color: #000;
    justify-content: center;
    align-items :center;
`

const Splash = () => {
  return (
    <>
      <StatusBar style="light" />
      <Container />
    </>
  )
}

export default Splash