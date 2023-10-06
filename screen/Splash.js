import React, {useEffect} from 'react'
import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import styled from 'styled-components/native';
import {auth} from '../firebase';


const Container = styled.View`
	flex: 1;
    background-color: #000000;
    justify-content: center;
    align-items :center;
`

const Splash = ({ navigation }) => {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
        if (authUser) {
            navigation.replace("BottomStack")
        } else {
            navigation.replace("Login")
        }
    })
    return () => {
        unsubscribe()
    }
}, [])

return (
    <>
        <StatusBar
            translucent
            backgroundColor='transparent'
            barStyle='light-content'
        />
        <Container />
    </>
)
}

export default Splash