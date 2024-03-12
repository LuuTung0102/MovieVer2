import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { db } from '../firebase';

const Container = styled.View`
  flex: 1;
  background-color: #000;
  padding: 20px;
`;

const MovieItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`;

const MovieBanner = styled.Image`
  width: 100px;
  height: 150px;
  border-radius: 10px;
  margin-right: 15px;
`;

const MovieDetails = styled.View`
  flex: 1;
`;

const MovieTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #fff;
`;

const LikesCount = styled.Text`
  color: #fff;
`;

const MovieNumber = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  margin-right: 10px;
`;

const Taps = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 5px;
`;

const Tap = styled.Text`
  background-color: #f2f2f2;
  padding: 5px 10px;
  border-radius: 10px;
  margin-right: 5px;
  margin-bottom: 5px;
`;

const Rating = ({ navigation }) => {
  const [topMovies, setTopMovies] = useState([]);

  useEffect(() => {
    db.collection('movie')
      .get()
      .then(querySnapshot => {
        const movies = [];
        querySnapshot.forEach(doc => {
          const movieData = doc.data();
          const movieLikes = movieData.likes.length; // Lấy số lượng like
          movies.push({ id: doc.id, ...movieData, likesCount: movieLikes });
        });
  
        // Sắp xếp mảng theo số lượng like giảm dần
        movies.sort((a, b) => b.likesCount - a.likesCount);
  
        setTopMovies(movies.slice(0, 10)); // Chỉ lấy 10 phim đầu tiên
      })
      .catch(error => {
        console.error('Lỗi lấy phim top:', error);
      });
  }, []);
  
  return (
    <Container>
      <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 25, color: '#fff' }}>
        Top 10 bộ phim hay nhất
      </Text>
      <FlatList
        data={topMovies}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              navigation.navigate("ViewMovie", {
                id: item.id,
              });
            }}
          >
            <MovieItem>
              <MovieNumber>{index + 1}</MovieNumber>
              <MovieBanner resizeMode='cover' source={{ uri: item.banner }} />
              <MovieDetails>
                <MovieTitle>{item.name}</MovieTitle>
                <LikesCount>{item.likes.length} likes</LikesCount>
                <Taps>
                  {item.tap.map((tap, index) => (
                    <Tap key={index}>{tap}</Tap>
                  ))}
                </Taps>
              </MovieDetails>
            </MovieItem>
          </TouchableOpacity>
        )}
      />
    </Container>
  );
};

export default Rating;