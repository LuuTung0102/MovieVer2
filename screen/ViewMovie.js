import React, { useState, useEffect } from 'react';
import { StatusBar, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useFonts, Montserrat_300Light, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { Video } from 'expo-av';
import { Ionicons, Feather, AntDesign } from '@expo/vector-icons';
import { db, auth } from '../firebase';
import Header from '../components/Header'
import firebase from 'firebase/compat/app';


const Container = styled.ScrollView`
	flex: 1;
	background-color: #000;
`

const HeaderIcons = styled.View`
	flex-direction: row;
	justify-content: center;
	align-items: center;
`

const Title = styled.Text`
    color: white;
    font-size: 24px;
    margin: 10px;
    font-family: "Montserrat_700Bold"
`

const MovieBadge = styled.Text`
    color: #a2a2a2;
    background-color: #373737;
    padding: 2px;
    border-radius: 5px;
    width: 38px;
    text-align: center;
    margin: 15px;
`

const Subtitle = styled.Text`
    color: #a2a2a2;
    margin: 5px;
`

const MovieSubDetails = styled.View`
    flex-direction: row;
    align-items: center;
    margin-top: -17px;
`

const Play = styled.TouchableOpacity`
	flex-direction: row;
	background-color: #fff;
	width: 95%;
	height: 32px;
	border-radius: 2px;
	align-items: center;
    justify-content: center;
    margin: 10px;
`

const TextButtonPlay = styled.Text`
	font-size: 15px;
	font-weight: bold;
	padding-left: 5px;
`

const Download = styled.TouchableOpacity`
	flex-direction: row;
	background-color: #262626;
	width: 95%;
	height: 32px;
	border-radius: 2px;
	align-items: center;
	justify-content: center;
`

const TextButtonDownload = styled.Text`
	font-size: 15px;
    font-weight: 700;
    color: white;
    padding-left: 5px;
`

const ActionButtons = styled.View`
    flex-direction: column;
    width: 100%;
    align-items: center;
`

const MovieDescription = styled.Text`
    color: white;
    width: 98%;
    margin-left: 10px;
    margin: 10px;
    font-weight: 100;
    font-family: "Montserrat_300Light";
    line-height: 20px;
    margin-top: 25px;
`

const Tag = styled.Text`
    color: #fff;
    font-family: "Montserrat_400Regular";
`

const TagDot = styled.View`
    margin: 10px;
    background-color: white;
    height: 2px;
    width: 2px;
`

const Tags = styled.View`
flex-direction: row;
justify-content: center;
margin: 10px 0 5px 3px;
align-items: center;
flex-wrap: wrap;
width: 99%;
`

const TagWrapper = styled.View`
    flex-direction: row;
    align-items: center;
`

const ActionButtons2 = styled.View`
    flex-direction :row;
    justify-content: center;
    margin: 20px;
    align-items: center;
`

const ActionButton = styled.TouchableOpacity`
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 30px;
    margin-top: 20px;
`

const ActionButtonLabel = styled.Text`
    color: white;
    font-family: "Montserrat_300Light";
    font-size: 15px;
`



const ViewMovie = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    db.collection('users').doc(auth.currentUser.email).onSnapshot(doc => {
      if (doc.exists) {
        setUser(doc.data());
      }
    });
  }, []);

  useEffect(() => {
    db.collection('movie').doc(route.params.id).onSnapshot(doc => {
      setMovie(doc.data());
      setLoading(false);
    });
  }, [route]);

  let [fontsLoaded] = useFonts({
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_700Bold
  });

  return fontsLoaded && !loading ? (
    <>
      <StatusBar
        translucent
        backgroundColor='transparent'
        barStyle='light-content'
      />

      <Container>
      <Header login={true} goBack={navigation.goBack} />
        <Video
          source={{ uri: movie?.videoURL }}
          isMuted={false}
          useNativeControls={true}
          shouldPlay={true}
          style={{ height: 225, marginTop: 15 }}
          resizeMode="contain"
          usePoster={true}
          posterSource={{ uri: movie?.banner }}
          shouldCorrectDeviceOrientation={true} 
        />
        <Title>{movie?.name}</Title>
        <MovieSubDetails>
            <MovieBadge>13+</MovieBadge>
            <Subtitle>{movie?.yearOfRelease}</Subtitle>
        </MovieSubDetails>
        <ActionButtons>
          <Play activeOpacity={0.5}>
              <Ionicons name='ios-play' size={26} />
              <TextButtonPlay>Play</TextButtonPlay>
            </Play>
          <Download activeOpacity={0.5}>
              <Feather name='download' size={24} style={{ color: 'white', margin: 4 }} />
              <TextButtonDownload>Download</TextButtonDownload>
          </Download>
        </ActionButtons>
        <MovieDescription>
           {movie?.description}
        </MovieDescription>
        <Tags>
          {movie?.tap?.map((tap, i) => (
            <TagWrapper key={i}>
              <Tag>{tap}</Tag>
              {i + 1 === movie?.tap.length ? null : <TagDot />}
            </TagWrapper>
          ))}
        </Tags>
        <ActionButtons2>
        {
          user && user.list && user.list.includes(movie.id) ? (
            <ActionButton activeOpacity={0.5} onPress={() => {
              db.collection('users').doc(firebase.auth().currentUser.email).set({
              list: user.list.filter(item => item !== movie.id)
              }, { merge: true })
              .catch((error) => {
              console.error("Error removing movie from list:", error);
              });
            }}>
            <Feather name="check" size={35} color="white" />
            <ActionButtonLabel>Danh sách</ActionButtonLabel>
          </ActionButton>
          ) : (
            <ActionButton activeOpacity={0.5} onPress={() => {
              db.collection('users').doc(firebase.auth().currentUser.email).set({
              list: [...(user?.list || []), movie.id]
              }, { merge: true })
              .catch((error) => {
              console.error("Error adding movie to list:", error);
            });
          }}>
              <Ionicons name="add-outline" size={35} color="white" />
              <ActionButtonLabel>Danh sách</ActionButtonLabel>
            </ActionButton>
          )
        }
          <ActionButton activeOpacity={0.5}>
            <AntDesign name="like2" size={30} color="white" style={{ marginBottom: 7 }} />
            <ActionButtonLabel>Thích</ActionButtonLabel>
          </ActionButton>
        </ActionButtons2>
      </Container>
    </>
  ) : (
    <Container />
  );
};

export default ViewMovie;
