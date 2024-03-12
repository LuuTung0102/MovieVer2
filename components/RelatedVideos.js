// Import necessary libraries
import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, Image } from 'react-native';
import { useFonts, Montserrat_400Regular } from '@expo-google-fonts/montserrat';
import { db } from '../firebase';
import { useNavigation } from '@react-navigation/native';

const Container = styled.View`
  margin-top: 20px;
  padding: 10px;
`;

const BannerWrapper = styled.View`
  flex-direction: row;
  overflow: hidden;
`;

const Banner = styled(TouchableOpacity)`
  margin-right: 10px;
`;

const BannerImage = styled(Image)`
  width: 120px;
  height: 180px;
  border-radius: 5px;
`;

const BannerTitle = styled.Text`
  color: white;
  font-family: "Montserrat_400Regular";
  font-size: 14px;
  margin-top: 5px;
`;

const RelatedVideos = ({ tags, currentVideoId }) => {
  const [relatedVideos, setRelatedVideos] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRelatedVideos = async () => {
      try {
        if (tags && tags.length > 0) {
          const snapshot = await db
            .collection('movie')
            .where('tap', 'array-contains-any', tags)
            .limit(5)
            .get();

          const videos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          const filteredVideos = videos.filter(movie => movie.id !== currentVideoId);
          setRelatedVideos(filteredVideos);
        } else {
          setRelatedVideos([]);
        }
      } catch (error) {
        console.error('Lỗi tìm video liên quan', error);
      }
    };

    fetchRelatedVideos();
  }, [tags, currentVideoId]);

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
  });

  const handleBannerPress = (videoId) => {
    navigation.navigate('ViewMovie', { id: videoId });
  };

  return fontsLoaded ? (
    <Container>
      {relatedVideos.length > 0 && (
        <>
          <BannerTitle>Video liên quan</BannerTitle>
          <BannerWrapper>
            {relatedVideos.map(movie => (
              <Banner key={movie.id} onPress={() => handleBannerPress(movie.id)}>
                <BannerImage source={{ uri: movie.banner }}/>
              </Banner>
            ))}
          </BannerWrapper>
        </>
      )}
    </Container>
  ) : null;
};

export default RelatedVideos;