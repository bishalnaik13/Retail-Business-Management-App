import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useContext, useState } from 'react';

import { InventoryContext } from '../context/InventoryContext';
import { DealerContext } from '../context/DealerContext';
import { UNITS } from '../constants/units';
import {
  isRequired,
  isPositiveNumber,
} from '../utils/validators';

export default function InventoryFormScreen({ navigation }) {
  const { addItem } = useContext(InventoryContext);
  const { dealers } = useContext(DealerContext);

  const [name, setName] = useState('');
  const [hsn, setHsn] = useState('');
  const [unit, setUnit] = useState(UNITS[0]);
  const [rate, setRate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [minStock, setMinStock] = useState('');
  const [dealerId, setDealerId] = useState('');

  const handleSave = () => {
    if (!isRequired(name)) {
      Alert.alert('Item name is required');
      return;
    }
    if (!isPositiveNumber(rate) || !isPositiveNumber(quantity)) {
      Alert.alert('Rate and Quantity must be positive numbers');
      return;
    }
    if (!dealerId) {
      Alert.alert('Please select a dealer');
      return;
    }

    addItem({
      name,
      hsn,
      unit,
      rate: Number(rate),
      quantity: Number(quantity),
      minStock: Number(minStock) || 0,
      dealerId,
    });

    navigation.goBack();
  };

  return (
    <ScrollView
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      {/* SECTION: ITEM DETAILS */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Item Details</Text>

        <Text style={styles.label}>Item Name *</Text>
        <TextInput
          placeholder="e.g. White Cement"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <Text style={styles.label}>HSN Code</Text>
        <TextInput
          placeholder="Optional"
          keyboardType="numeric"
          value={hsn}
          onChangeText={setHsn}
          style={styles.input}
        />
      </View>

      {/* SECTION: PRICING & STOCK */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Pricing & Stock</Text>

        <View style={styles.row}>
          <View style={styles.flex}>
            <Text style={styles.label}>Rate *</Text>
            <TextInput
              placeholder="₹"
              keyboardType="numeric"
              value={rate}
              onChangeText={setRate}
              style={styles.input}
            />
          </View>

          <View style={styles.flex}>
            <Text style={styles.label}>Quantity *</Text>
            <TextInput
              placeholder="0"
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
              style={styles.input}
            />
          </View>
        </View>

        <Text style={styles.label}>Minimum Stock</Text>
        <TextInput
          placeholder="Alert threshold"
          keyboardType="numeric"
          value={minStock}
          onChangeText={setMinStock}
          style={styles.input}
        />
      </View>

      {/* SECTION: UNIT */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Unit</Text>

        <View style={styles.chipRow}>
          {UNITS.map((u) => (
            <TouchableOpacity
              key={u}
              onPress={() => setUnit(u)}
              style={[
                styles.chip,
                unit === u && styles.chipActive,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  unit === u && styles.chipTextActive,
                ]}
              >
                {u}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* SECTION: DEALER */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Supplier</Text>

        {dealers.length === 0 ? (
          <Text style={{ color: '#6b7280' }}>
            No dealers available. Add a dealer first.
          </Text>
        ) : (
          dealers.map((dealer) => (
            <TouchableOpacity
              key={dealer.id}
              onPress={() => setDealerId(dealer.id)}
              style={[
                styles.dealerItem,
                dealerId === dealer.id && styles.dealerItemActive,
              ]}
            >
              <Text
                style={{
                  fontWeight: '600',
                  color: dealerId === dealer.id ? '#2563eb' : '#111827',
                }}
              >
                {dealer.name}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* SAVE BUTTON */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save Item</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = {
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex: {
    flex: 1,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  chipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  chipText: {
    color: '#374151',
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#ffffff',
  },
  dealerItem: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 8,
  },
  dealerItemActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  saveButton: {
    marginTop: 8,
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    borderRadius: 10,
  },
  saveText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
};
