import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import styled from 'styled-components/native';
import { auth, db } from '../firebase';
import Header from '../components/Header';

const Container = styled.View`
    flex: 1;
    background-color: #000;
    align-items: center;
    justify-content: center;
`;

const InputContainer = styled.View`
    width: 80%;
    margin-bottom: 20px;
`;

const IndividualItemContainer = styled.View`
    width: 80%;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 20px;
`;

const IndividualItem = styled.TouchableOpacity`
    width: 48%;
    height: 100px;
    background-color: #333333;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    border: 1px solid #fff;
`;

const IndividualItemText = styled.Text`
    color: white;
    font-size: 18px;
    font-weight: bold;
`;

const TextInputStyled = styled.TextInput`
    width: 100%;
    height: 40px;
    background-color: #fff;
    margin: 10px 0;
    padding: 5px;
    border-radius: 5px;
`;

const BackToProfileButton = styled.TouchableOpacity`
    width: 48%;
    height: 100px;
    padding: 15px;
    background-color: #4CAF50;
    border-radius: 10px;
    border: 2px solid #fff;
    align-items: center;
    justify-content: center;
`;

const BackToProfileText = styled.Text`
    color: white;
    font-size: 16px;
    font-weight: bold;
`;

const Individual = ({ navigation }) => {
    
    const [user, setUser] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            db.collection('users').doc(currentUser.email).onSnapshot(doc => {
                if (doc.exists) {
                    setUser(doc.data());
                    setFirstName(doc.data().firstName);
                    setLastName(doc.data().lastName);
                }
            });
        }

    }, []);

    const handleUpdateProfile = async () => {
        const currentUser = auth.currentUser;

        try {
            await db.collection('users').doc(currentUser.email).update({
                firstName,
                lastName,
            });

            setUser({
                ...user,
                firstName,
                lastName,
            });

            Alert.alert('Hồ sơ được cập nhật thành công');

        } catch (error) {
            console.error('Lỗi cập nhật hồ sơ:', error.message);
        }

        if (newPassword.trim() !== '') {
            try {
                await currentUser.updatePassword(newPassword);
                setNewPassword('');
                Alert.alert('Đã thay đổi mật khẩu thành công');
            } catch (error) {
                console.error('Lỗi đổi mật khẩu:', error.message);
            }
        }
        
    };

    return (
        <Container>
            <Header login={false} />
            
            <InputContainer>
                <Text>Current First Name: {user?.firstName}</Text>
                <TextInputStyled
                    placeholder="Nhập tên mới"
                    value={firstName}
                    onChangeText={(text) => setFirstName(text)}
                />
            </InputContainer>

            <InputContainer>
                <Text>Current Last Name: {user?.lastName}</Text>
                <TextInputStyled
                    placeholder="Nhập họ mới"
                    value={lastName}
                    onChangeText={(text) => setLastName(text)}
                />
            </InputContainer>

            <InputContainer>
                <Text>Enter New Password</Text>
                <TextInputStyled
                    placeholder="Để trống để giữ mật khẩu hiện tại"
                    secureTextEntry
                    value={newPassword}
                    onChangeText={(text) => setNewPassword(text)}
                />
            </InputContainer>

            <IndividualItemContainer>
                <IndividualItem onPress={handleUpdateProfile}>
                    <IndividualItemText> Update Profile </IndividualItemText>
                </IndividualItem>

                <BackToProfileButton onPress={() => navigation.goBack()}>
                    <BackToProfileText> Back to Profile </BackToProfileText>
                </BackToProfileButton>
            </IndividualItemContainer>
        </Container>
    );
};

export default Individual;