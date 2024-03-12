import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, View, Modal, TouchableOpacity, Text } from 'react-native';
import paypalApi from '../apis/paypalApi';
import ButtonComp from '../components/ButtonComp';
import WebView from 'react-native-webview';
import queryString from 'query-string';
import { auth, db } from '../firebase';
import Header from '../components/Header';
import { StatusBar } from 'expo-status-bar';
import styled from 'styled-components/native';
import { AntDesign } from '@expo/vector-icons';


const Container = styled.ScrollView`
  flex: 1;
  background-color: #000;
`;

const PaymentOption = styled.TouchableOpacity`
  width: 90%;
  height: 50px;
  border-radius: 10px;
  border: none;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  background-color: #E7442E;
`;

const OptionText = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: white;
`;

const IntroductionContainer = styled.View`
  background-color: #fff;
  padding: 20px;
  margin: 20px;
  border-radius: 10px;
  align-items: center;
`;

const IntroductionText = styled.Text`
  font-size: 18px;
  color: #E7442E;
  text-align: center;
`;

const VipIcon = styled(AntDesign)`
  color: #E7442E;
  font-size: 24px;
  margin-bottom: 10px;
`;

const Overlay = styled.View`
  background-color: rgba(0, 0, 0, 0.5);
  flex: 1;
`;

const BackToProfileButton = styled.TouchableOpacity`
    width: 100%;
    height: 60px;
    padding: 10px;
    background-color: #4CAF50;
    border-radius: 10px;
    border: 2px solid #fff;
    align-items: center;
    justify-content: center;
`;

const BackToProfileText = styled.Text`
    color: white;
    font-size: 18px;
    font-weight: bold;
`;

const Gift = ({ navigation, route })  => {
    
  const [isLoading, setLoading] = useState(false);
  const [paypalUrl, setPaypalUrl] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const email = route.params.email;
  const [currentAmount, setCurrentAmount] = useState(null);
  const isPaymentProcessed = useRef(false);

  useEffect(() => {
      db.collection('users').doc(auth.currentUser.email).onSnapshot(doc => {
        if (doc.exists) {
          setUser(doc.data());
        }
      });
    }, []);

    const onPressPaypal = async (amount) => {
      setLoading(true);
      setCurrentAmount(amount);
      isPaymentProcessed.current = false;
      try {
          const token = await paypalApi.generateToken();
          const res = await paypalApi.createOrder(token, amount);
          setAccessToken(token);
          setLoading(false);
          if (!!res?.links) {
              const findUrl = res.links.find(data => data?.rel == "approve");
              if (findUrl) {
                  setPaypalUrl(findUrl.href);
              } else {
                  console.log('No link with rel="approve" found');
              }
          }
      } catch (error) {
          console.log("error", error);
          setLoading(false);
      }
  };
  
  const onUrlChange = (webviewState) => {
      console.log("webviewStatewebviewState", webviewState);
      if (webviewState.url.includes('https://example.com/cancel')) {
          clearPaypalState();
          return;
      }
      if (webviewState.url.includes('https://example.com/return') && !isPaymentProcessed.current) {
          const urlValues = queryString.parseUrl(webviewState.url);
          console.log("Url của tôi", urlValues);
          const { token } = urlValues.query;
          if (!!token) {
              isPaymentProcessed.current = true;
              paymentSucess(token, currentAmount); 
          }
      }
  };
  
  const paymentSucess = async (id, amount) => { 
      try {
          const res = await paypalApi.capturePayment(id, accessToken);
          alert("Thanh toán thành công!!!");
  
          const vipDuration = getVipDuration(amount);
          const expiryDate = new Date();
          expiryDate.setMonth(expiryDate.getMonth() + vipDuration);
          
          const transactionDate = new Date();
          const order = {
              amount: amount,
              transactionDate: transactionDate,
              expiryDate: expiryDate,
              description: "Tặng Vip cho bạn bè",
              shareWithEmail: email
          };
          
        const currentUserRef = db.collection('users').doc(auth.currentUser.email);
        const currentUserDoc = await currentUserRef.get();
        let orders = [];
        if (currentUserDoc.exists) {
        orders = currentUserDoc.data().orders || [];
        }
    
        orders.push(order);
    
        currentUserRef.update({
        orders: orders
        });
          
        const sharedUserRef = db.collection('users').doc(email);
        sharedUserRef.update({
          isVip: true,
          isTime: expiryDate
        });

        const sharedUserDoc = await sharedUserRef.get();
    let notifications = [];
    if (sharedUserDoc.exists) {
      notifications = sharedUserDoc.data().notifications || [];
    }

    const notification = {
      title: 'Bạn đã nhận được một món quà!',
      message: `${user.firstName} ${user.lastName} đã tặng bạn Vip!`,
      amount: amount,
      expiryDate: expiryDate,
      sharedBy: `${user.firstName} ${user.lastName}`,
      status: false
    };

    notifications.push(notification);

    sharedUserRef.update({
      notifications: notifications
    });

      
        clearPaypalState();

      } catch (error) {
          console.log("Lỗi xảy ra khi thu thập thanh toán", error);
      }
  };
    
    const getVipDuration = (amount) => {
        if (amount === 10) {
            return 1; 
        } else if (amount === 30) {
            return 5; 
        } else if (amount === 100) {
            return 12; 
        } else {
            return 0;
        }
    };
    
    const clearPaypalState = () => {
        setPaypalUrl(null);
        setAccessToken(null);
    };

    return (
        <>
        <StatusBar style="light" />
        <Container>
          <Overlay>
          <Header login={false}/>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <IntroductionContainer>
                <VipIcon name="star" />
                <IntroductionText>
                  Hãy cùng bạn bè thưởng thức những thược phim hay, hấp dẫn và độc quyền ! 
                </IntroductionText>
              </IntroductionContainer>
              <View style={{ alignItems: 'center', marginTop: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold',color: 'white' }}> {route.params.email}</Text>
              </View>
                <View style={{ padding: 16 }}>
                    <ButtonComp
                        onPress={() => onPressPaypal(10.00)}
                        disabled={false}
                        btnStyle={{ backgroundColor: '#0f4fa3', marginVertical: 16 }}
                        text="Thanh toán 10 USD cho 1 tháng"
                        isLoading={isLoading}
                    />
                    <ButtonComp
                        onPress={() => onPressPaypal(30.00)}
                        disabled={false}
                        btnStyle={{ backgroundColor: '#0f4fa3', marginVertical: 16 }}
                        text="Thanh toán 30 USD cho 6 tháng"
                        isLoading={isLoading}
                    />
                    <ButtonComp
                        onPress={() => onPressPaypal(100.00)}
                        disabled={false}
                        btnStyle={{ backgroundColor: '#0f4fa3', marginVertical: 16 }}
                        text="Thanh toán 100 USD cho 12 tháng"
                        isLoading={isLoading}
                    />

                    <Modal visible={!!paypalUrl}>
                        <TouchableOpacity onPress={clearPaypalState} style={{ margin: 24 }}>
                            <Text >Closed</Text>
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}>
                            <WebView
                                source={{ uri: paypalUrl }}
                                onNavigationStateChange={onUrlChange}
                            />
                        </View>
                    </Modal>
                </View>
                </View>
                <BackToProfileButton onPress={() => navigation.goBack()}>
                    <BackToProfileText> Quay lại </BackToProfileText>
                </BackToProfileButton>
        </Overlay>
      </Container>
    </>
  );
};

export default Gift;
