import React, { useState, useEffect } from 'react';
import { StatusBar, TouchableOpacity, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { db, auth } from '../firebase';
import Header from '../components/Header';
import firebase from 'firebase/compat/app';

const Container = styled.ScrollView`
  flex: 1;
  background-color: #000;
`;

const MovieScroll = styled.View`
  padding-left: 10px;
  margin: 30px;
  margin-left: 10px;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
`;

const MoviePoster = styled.Image`
  width: ${Math.round((Dimensions.get('window').width * 0.3))}px;
  height: 200px;
  border-radius: 10px;
`;

const MovieCard = styled.View`
  padding-right: 9px;
`;

const MyList = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    db.collection('users').doc(auth.currentUser.email).onSnapshot(doc => {
      if (doc.exists) {
        setUser(doc.data());
      }
    });
  }, []);

  useEffect(() => {
    if (user) {
      
      const moviesRef = db.collection('movie').where('id', 'in', user.list || []);
      moviesRef.onSnapshot(snapshot => {
        const movieList = [];
        snapshot.forEach(doc => {
          movieList.push({ id: doc.id, ...doc.data() });
        });
        setMovies(movieList);
      });
    }
  }, [user]);

  return (
    <Container>
      <Header login={true} goBack={navigation.goBack} />
      <MovieScroll>
        {movies.map(movie => (
          <MovieCard key={movie.id}>
            <TouchableOpacity onPress={() => navigation.navigate('ViewMovie', { id: movie.id })}>
              <MoviePoster source={{ uri: movie.banner }} />
            </TouchableOpacity>
          </MovieCard>
        ))}
      </MovieScroll>
    </Container>
  );
};

export default MyList;
