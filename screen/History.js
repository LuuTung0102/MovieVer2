import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { db, auth } from '../firebase';
import styled from 'styled-components/native';
import Header from '../components/Header';

const Container = styled.View`
  flex: 1;
  background-color: #000;
`;

const TransactionItem = styled.View`
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #333;
`;

const AmountText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #fff;
`;

const DateText = styled.Text`
  color: #999;
  color: #fff;
`;

const History = () => {
  const [transactionHistory, setTransactionHistory] = useState([]);

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      const userRef = db.collection('users').doc(auth.currentUser.email);
      const userDoc = await userRef.get();
      if (userDoc.exists) {
        const userOrders = userDoc.data().orders || [];
        const sortedOrders = userOrders.sort((a, b) => b.transactionDate - a.transactionDate);
        setTransactionHistory(sortedOrders);
      }
    };

    fetchTransactionHistory();
  }, []);

  const renderTransactionItem = ({ item }) => (
    <TransactionItem>
      <AmountText>Số tiền: {item.amount}</AmountText>
      <DateText>Ngày giao dịch: {item.transactionDate.toDate().toLocaleDateString()}</DateText>
      <DateText>Ngày hết hạn: {item.expiryDate.toDate().toLocaleDateString()}</DateText>
    </TransactionItem>
  );

  return (
    <Container>
        <Header login={false} />
      <FlatList
        data={transactionHistory}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderTransactionItem}
      />
    </Container>
  );
};

export default History;
