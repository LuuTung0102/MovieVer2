import React, { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { auth } from '../firebase';

const Container = styled.View`
  flex: 1;
  background-color: #000;
  justify-content: center;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 30px;
  font-weight: bold;
  color: white;
  margin-bottom: 20px;
`;

const InputWrapper = styled.View`
  width: 80%;
  height: 50px;
  border: none;
  padding: 10px;
  border-radius: 15px;
  background-color: #333333;
  color: white;
  margin-top: 10px;
  flex-direction: row;
  align-items: center;
`;

const Input = styled.TextInput`
  flex: 1;
  height: 100%;
  color: white;
`;

const SubmitButton = styled.TouchableOpacity`
  width: 80%;
  height: 50px;
  border-radius: 10px;
  background-color: #E7442E;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const ButtonText = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: white;
`;

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const resetPassword = () => {
    setLoading(true);
    if (!email) {
      alert("Please enter your email");
      setLoading(false);
      return;
    }

    auth.sendPasswordResetEmail(email)
      .then(() => {
        alert("A password reset email has been sent to your email address");
        setEmail('');
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        alert(error.message);
      });
  };

  return (
    <Container>
      <Title>Forgot Password</Title>
      <InputWrapper>
        <Input
          placeholder="Nhập email ... "
          placeholderTextColor="grey"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
      </InputWrapper>
      <SubmitButton onPress={resetPassword} disabled={loading}>
        <ButtonText>{loading ? "Sending..." : "Reset Password"}</ButtonText>
      </SubmitButton>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={{ color: 'white', marginTop: 20 }}>Trở về trang đăng nhập</Text>
      </TouchableOpacity>
    </Container>
  );
};

export default ForgotPassword;
