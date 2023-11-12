import { View, Text } from 'react-native';
import React, { useLayoutEffect, useEffect, useState} from 'react';
import { StatusBar, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header';
import { auth, db } from '../firebase';
import firebase from 'firebase/compat/app';
import HeaderTabs from '../components/HeaderTabs';
import Movies from '../components/Movies';

const Container = styled.ScrollView`
	flex: 1;
	background-color: #000;
`
const Poster = styled.ImageBackground`
	width: 100%;
	height: ${(Dimensions.get('window').height * 81) / 100}px;
`

const Gradient = styled(LinearGradient)`
	height: 101%;
`

const Home = ({ navigation }) => {

  const [user, setUser] = useState(null);
	const [movies, setMovies] = useState(null);

	useEffect(() => {
		db.collection('users').doc(firebase.auth().currentUser.email).onSnapshot(doc => {
			if (doc.exists) {
				setUser(doc.data())
			}
		})

	}, [firebase.auth().currentUser])

  useLayoutEffect(() => {
		const unsubscribe = db
			.collection("movie")
			.onSnapshot((snapshot) =>
				setMovies(
					snapshot.docs.map((doc) => ({
						id: doc.id,
						data: doc.data(),
					}))
				)
			);
		return unsubscribe;
	}, []);

  return (
    <>
    <StatusBar
      translucent
      backgroundColor='transparent'
      barStyle='light-content'
    />
    <Container>
      <Poster source={{ uri: 'https://cdn.vox-cdn.com/thumbor/9PqzVk9RnfW0g22byhIyRSPDBYM=/1400x0/filters:no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/8832449/strangerthings.jpg' }}>
        <Gradient
          locations={[0, 0.2, 0.5, 0.94]}
          colors={[
            'rgba(0,0,0,0.5)',
            'rgba(0,0,0,0.0)',
            'rgba(0,0,0,0.0)',
            'rgba(0,0,0,1)'
          ]}>
          <Header login={true} navigation={navigation} />
          <HeaderTabs />
        </Gradient>
      </Poster>
      {
        movies && (
          <React.Fragment>
            <Movies label='Phổ biến nhất' item={movies.filter(movie => movie.data && movie.data.tap && movie.data.tap.includes('Phổ biến nhất'))} />
						<Movies label='Phim Mỹ' item={movies.filter(movie => movie.data && movie.data.tap && movie.data.tap.includes('Phim Mỹ'))} />
						<Movies label='Bí ẩn' item={movies.filter(movie => movie.data && movie.data.tap && movie.data.tap.includes('Bí ẩn'))} />
          </React.Fragment>
        )
      }
    </Container>
  </>
  )
}

export default Home