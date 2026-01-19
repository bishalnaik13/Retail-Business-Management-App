import { View, Text, TextInput, Button } from 'react-native';
import { useState, useContext } from 'react';

import { DealerContext } from '../context/DealerContext';
import { isRequired, isValidPhone } from '../utils/validators';

export default function DealerFormScreen({ navigation }) {
  const { addDealer } = useContext(DealerContext);
const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
const handleSave = () => {
    if (!isRequired(name)) {
      alert('Dealer name is required');
      return;
    }
if (!isValidPhone(phone)) {
      alert('Enter a valid phone number');
      return;
    }
addDealer({ name, phone });
    navigation.goBack();
  };
return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
        Add Dealer
      </Text>
<TextInput
        placeholder="Dealer Name"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />
<TextInput
        placeholder="Phone Number"
        keyboardType="numeric"
        value={phone}
        onChangeText={setPhone}
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />
<Button title="Save Dealer" onPress={handleSave} />
    </View>
  );
}
