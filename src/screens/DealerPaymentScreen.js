import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useState, useContext } from 'react';
import { DealerContext } from '../context/DealerContext';

export default function DealerPaymentScreen({ route, navigation }) {
  const { dealerId, dealerName } = route.params;
  const { addDealerLedgerEntry, getDealerPendingAmount } =
    useContext(DealerContext);

  const pending = getDealerPendingAmount(dealerId);
  const [amount, setAmount] = useState('');

  const handlePay = () => {
    const payAmount = Number(amount);

    if (!payAmount || payAmount <= 0) {
      Alert.alert('Invalid amount');
      return;
    }

    if (payAmount > pending) {
      Alert.alert('Amount exceeds pending');
      return;
    }

    addDealerLedgerEntry({
      dealerId,
      type: 'CREDIT',
      amount: payAmount,
      reference: 'PAYMENT',
      note: 'Dealer payment',
    });

    Alert.alert('Payment recorded');
    navigation.goBack();
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontWeight: '700' }}>
        Pay Dealer: {dealerName}
      </Text>

      <Text>Pending: ₹{pending}</Text>

      <TextInput
        placeholder="Payment amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />

      <Button title="Confirm Payment" onPress={handlePay} />
    </View>
  );
}
