import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ImageBackground, KeyboardAvoidingView, Dimensions, StatusBar, Alert } from 'react-native';
import { db, auth } from '../firebase';
import styled from 'styled-components/native';
import Header from '../components/Header';

const Container = styled.View`
  flex: 1;
  background-color: #000;
`;

const FormWrapper = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
  height: 80%;
`;

const Form = styled.View`
  width: 90%;
  background-color: black;
  flex-direction: column;
  border-radius: 20px;
  padding: 20px;
  justify-content: center;
`;

const SubmitForm = styled.TouchableOpacity`
  width: 95%;
  height: 50px;
  background-color: #e50914;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`;

const ButtonText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: white;
`;

const MovieTitle = styled.Text`
  font-size: 24px;
  color: white;
  font-weight: bold;
`;

const Share = ({ navigation, route }) => {
    const [email, setEmail] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null); 
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [movie, setMovie] = useState(null);
    const movieId = route.params.movieId;
  
    useEffect(() => {
      const fetchUsers = async () => {
        const usersSnapshot = await db.collection('users').get();
        setUsers(usersSnapshot.docs.map(doc => doc.data()));
      };
  
      fetchUsers();
    }, []);

    useEffect(() => {
      const fetchMovie = async () => {
        const movieSnapshot = await db.collection('movie').doc(movieId).get();
        setMovie(movieSnapshot.data());
      };
  
      fetchMovie();
    }, []);
  
    useEffect(() => {
        setFilteredUsers(
          users.filter(user => user.email.includes(email) && user.email !== auth.currentUser.email)
        );
      }, [email, users]);
      
  
      const handleShare = async () => {
        if (email) {
          const userSnapshot = await db.collection('users').doc(email).get();
          const userData = userSnapshot.data();
      
          const movieSnapshot = await db.collection('movie').doc(movieId).get();
          const movieData = movieSnapshot.data();
      
          if (userData && movieData) {
            if (movieData.isVip) {
              if (!userData.isVip) {
                Alert.alert(
                  "Gói Quà VIP",
                  "Tài khoản chưa được nâng cấp. Bạn có muốn tặng gói VIP cho bạn bè của mình không?",
                  [
                    {
                      text: "Cancel",
                      onPress: () => sendNotification(userData, "Cùng nhau xem nhé"),
                      style: "cancel"
                    },
                    { text: "OK", onPress: () => navigation.navigate('Gift', { email: email }) }
                  ]
                );
              } else {
                sendNotification(userData, "Cùng nhau xem nhé");
              }
            } else {
              sendNotification(userData, "Cùng nhau xem nhé");
            }
          } else {
            alert('Không tìm thấy người dùng nào với email này.');
          }
        } else {
          alert('Vui lòng nhập email để chia sẻ phim.');
        }
      };
      
      const sendNotification = async (userData, title) => {
        await db.collection('users').doc(email).update({
          notifications: [
            ...userData.notifications,
            {
              sharedBy: auth.currentUser.email,
              movieId: movieId,
              status: false,
              title: title
            }
          ]
        });
      
        alert('Phim được chia sẻ thành công!');
        navigation.goBack();
      };

    return (
      <>
        <StatusBar style="light" />
       
        <Container>
        
          <ImageBackground
           source={{ uri: movie ? movie.banner : '' }}
            resizeMode="cover"
            style={{ flex: 1, height: Dimensions.get("window").height }}
          >
             <Header login={true} goBack={navigation.goBack} />
            <FormWrapper>
              <Form>
                {movie && <MovieTitle>{movie.name}</MovieTitle>}
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter email of the user"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  color ="white"
                />
                  {filteredUsers.map((user, index) => (
                    <TouchableOpacity key={index} onPress={async () => {
                      setEmail(user.email);
                      const userSnapshot = await db.collection('users').doc(user.email).get();
                      setSelectedUser(userSnapshot.data());
                    }}>
                        <Text style={{ color: 'white' }}>Email :{user.email}</Text>
                    </TouchableOpacity>
                  ))}
                  {selectedUser && (
                    <View>
                      <Text style={{ color: 'white' }}>Họ: {selectedUser.firstName}</Text>
                      <Text style={{ color: 'white' }}>Tên: {selectedUser.lastName}</Text>
                    </View>
                  )}
                <SubmitForm onPress={handleShare}>
                  <ButtonText>Share</ButtonText>
                </SubmitForm>
              </Form>
            </FormWrapper>
          </ImageBackground>
        </Container>
      </>
    );
  };
  
  export default Share;