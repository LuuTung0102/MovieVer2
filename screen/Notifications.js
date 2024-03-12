import React, { useState, useEffect } from 'react';
import { Image, View, Text, TouchableOpacity } from 'react-native';
import { db, auth } from '../firebase';
import styled from 'styled-components/native';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook from React Navigation

const Container = styled.View`
  flex: 1;
  background-color: #000;
  padding: 10px;
`;

const NotificationItem = styled.TouchableOpacity`
  padding: 10px;
  margin-vertical: 5px;
  background-color: #4a4a4a;
  border-radius: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const NotificationTitle = styled.Text`
  color: #fff;
  font-size: 18px;
`;

const NotificationMessage = styled.Text`
  color: #fff;
  font-size: 18px;
`;

const NewText = styled.Text`
  color: #f00;
  font-size: 18px;
  font-weight: bold;
`;

const NotificationDetail = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const MovieTitle = styled.Text`
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
`;

const MovieBanner = styled.Image`
  width: 100%;
  height: 250px;
  margin-vertical: 20px;
`;

const SharedBy = styled.Text`
  color: #fff;
  font-size: 20px;
  font-style: italic;
  margin-bottom: 20px;
`;

const CloseButton = styled.TouchableOpacity`
  padding: 15px 30px;
  background-color: #2196F3;
  border-radius: 25px;
  align-self: center;
`;

const CloseButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;

const Amount = styled.Text`
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    margin-top: 10px;
`;

const ExpiryDate = styled.Text`
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    margin-top: 10px;
`;

const Notification = () => {
  const navigation = useNavigation(); 

  const [notifications, setNotifications] = useState([]);
  const [currentNotification, setCurrentNotification] = useState(null);

  useEffect(() => {
    const userRef = db.collection('users').doc(auth.currentUser.email);
    const unsubscribe = userRef.onSnapshot(doc => {
      if (doc.exists) {
        const userData = doc.data();
        setNotifications(userData.notifications || []);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleNotificationPress = async (notification) => {
    if (notification.movieId) {
      const movieRef = db.collection('movie').doc(notification.movieId);
      const movieDoc = await movieRef.get();
      const movieData = movieDoc.data();
  
      setCurrentNotification({
        sharedBy: notification.sharedBy,
        movieTitle: movieData.name,
        movieBanner: movieData.banner,
        movieId: notification.movieId
      });
    } else {
      setCurrentNotification({
        sharedBy: notification.sharedBy,
        title: notification.title,
        message: notification.message,
        amount: notification.amount,
        expiryDate: notification.expiryDate
      });
    }
  
    const updatedNotifications = notifications.map(notif => {
      if (notif.sharedBy === notification.sharedBy && notif.title === notification.title) {
        return { ...notif, status: true };
      } else {
        return notif;
      }
    });
  
    const userRef = db.collection('users').doc(auth.currentUser.email);
    userRef.update({ notifications: updatedNotifications });
  };

  const handleMoviePress = () => {
    if (currentNotification && currentNotification.movieId) {
      navigation.navigate('ViewMovie', { id: currentNotification.movieId });
    }
  };

  return (
    <Container>
      <Header login={true} goBack={navigation.goBack} />
      {currentNotification ? (
        <NotificationDetail>
        {currentNotification.movieId ? (
        <>
            <MovieTitle onPress={handleMoviePress}>{currentNotification.movieTitle}</MovieTitle>
            <MovieBanner source={{ uri: currentNotification.movieBanner }} onPress={handleMoviePress} />
        </>
        ) : (
        <>
        <NotificationTitle>{currentNotification.title}</NotificationTitle>
        <NotificationMessage>{currentNotification.message}</NotificationMessage>
        <Amount>Số tiền: {currentNotification.amount}$</Amount>
        <ExpiryDate>Ngày hết hạn: {new Date(currentNotification.expiryDate.seconds * 1000).toLocaleDateString()}</ExpiryDate>
        </>
        )}
        <SharedBy>Shared by: {currentNotification.sharedBy}</SharedBy>
        <CloseButton onPress={() => setCurrentNotification(null)}>
        <CloseButtonText>Close</CloseButtonText>
        </CloseButton>
        </NotificationDetail>
      ) : (
        <View>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Notifications</Text>
          {notifications.map((notification, index) => (
            <NotificationItem key={index} onPress={() => handleNotificationPress(notification)}>
              <NotificationTitle>{notification.title}</NotificationTitle>
              {!notification.status && <NewText>New</NewText>}
            </NotificationItem>
          ))}
        </View>
      )}
    </Container>
  );
};

export default Notification;
