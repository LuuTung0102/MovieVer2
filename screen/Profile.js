import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { auth, db } from '../firebase';
import Header from '../components/Header';
import { Ionicons } from '@expo/vector-icons';

const Container = styled.View`
    flex: 1;
    background-color: #000;
    align-items: center;
    justify-content: center;
`;

const ProfileItem = styled.TouchableOpacity`
    width: 80%;
    height: 50px;
    background-color: #FF0000; /* Màu đỏ */
    margin: 10px 0;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    border: 1px solid #fff;
`;

const ProfileItemText = styled.Text`
    color: white;
    font-size: 18px;
    font-weight: bold;
`;

const IconWrapper = styled.View`
    position: absolute;
    left: 10px;
`;

const Profile = ({ navigation }) => {
    const [unreadNotifications, setUnreadNotifications] = useState(0);

    useEffect(() => {
        const userRef = db.collection('users').doc(auth.currentUser.email);
        const unsubscribe = userRef.onSnapshot(doc => {
            if (doc.exists) {
                const userData = doc.data();
                const unreadCount = userData.notifications.filter(notification => !notification.status).length;
                setUnreadNotifications(unreadCount);
            }
        });

        return () => unsubscribe();
    }, []);

    const checkVipStatus = () => {
        const user = auth.currentUser;
        if (user) {
            db.collection('users').doc(user.email).get()
                .then(doc => {
                    if (doc.exists) {
                        const userData = doc.data();
                        if (userData.isVip) {
                            alert('Bạn đã nâng cấp tài khoản!');
                        } else {
                            navigation.navigate('PaymentScreen');
                        }
                    }
                })
                .catch(error => {
                    console.log("Error getting user data:", error);
                });
        }
    };

    const handleLogout = () => {
        auth.signOut()
            .then(() => {
                navigation.replace('Login');
            })
            .catch(error => {
                console.log("Error logging out:", error);
            });
    };

    return (
        <Container>
            <Header login={false} />

            <ProfileItem onPress={() => navigation.navigate('Individual')}>
                <IconWrapper>
                    <Ionicons name="person" size={24} color="white" />
                </IconWrapper>
                <ProfileItemText>Hồ sơ</ProfileItemText>
            </ProfileItem>

            <ProfileItem onPress={checkVipStatus}>
                <IconWrapper>
                    <Ionicons name="star" size={24} color="white" />
                </IconWrapper>
                <ProfileItemText>Nâng cấp</ProfileItemText>
            </ProfileItem>

            <ProfileItem onPress={() => navigation.navigate('Notifications')}>
                 <IconWrapper>
          <Ionicons name="notifications" size={24} color="white" />
        </IconWrapper>
        <ProfileItemText>Thông báo {unreadNotifications > 0 && `(${unreadNotifications})`}</ProfileItemText>
      </ProfileItem>

            <ProfileItem onPress={() => navigation.navigate('MyList')}>
                <IconWrapper>
                    <Ionicons name="list" size={24} color="white" />
                </IconWrapper>
                <ProfileItemText>Danh sách</ProfileItemText>
            </ProfileItem>

            <ProfileItem onPress={() => navigation.navigate('History')}>
                <IconWrapper>
                    <Ionicons name="time" size={24} color="white" />
                </IconWrapper>
                <ProfileItemText>Lịch sử giao dịch</ProfileItemText>
            </ProfileItem>

            <ProfileItem onPress={handleLogout}>
                <IconWrapper>
                    <Ionicons name="log-out" size={24} color="white" />
                </IconWrapper>
                <ProfileItemText>Đăng xuất</ProfileItemText>
            </ProfileItem>
        </Container>
    );
};

export default Profile;
