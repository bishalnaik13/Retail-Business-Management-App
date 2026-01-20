import {
    View, Text, Button,
    TextInput, FlatList, KeyboardAvoidingView,
    Alert, TouchableOpacity, ScrollView
} from 'react-native';
import { useContext, useState } from 'react';

import { InventoryContext } from '../context/InventoryContext';
import {
    CGST_RATE,
    SGST_RATE,
    IGST_RATE,
} from '../constants/tax';
import { InvoiceContext } from '../context/InvoiceContext';
import Invoice from '../models/Invoice';
import { PaymentStatus } from '../constants/paymentStatus';
import { generateInvoiceNumber } from '../utils/invoiceUtils';

export default function BillingScreen() {

    const toNumber = (value) => {
        const num = Number(value);
        return isNaN(num) ? 0 : num;
    };
    const { items } = useContext(InventoryContext);

    const [selectedItem, setSelectedItem] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [invoiceItems, setInvoiceItems] = useState([]);
    const [invoiceDiscount, setInvoiceDiscount] = useState('');
    const [isInterState, setIsInterState] = useState(false);

    // Future enhancement: integrate smart item suggestion and voice input here
    const handleSelectItem = (item) => {
        setSelectedItem(item);
        setQuantity('');
    };



    const handleAddItem = () => {
        if (!selectedItem) {
            Alert.alert('Select an item');
            return;
        }

        const qty = Number(quantity);

        if (!qty || qty <= 0) {
            Alert.alert('Invalid quantity');
            return;
        }

        if (qty > selectedItem.quantity) {
            Alert.alert('Insufficient stock');
            return;
        }

        const alreadyAdded = invoiceItems.find(
            (item) => item.id === selectedItem.id
        );

        if (alreadyAdded) {
            Alert.alert('Item already added to invoice');
            return;
        }

        setInvoiceItems((prev) => [
            ...prev,
            {
                ...selectedItem,
                billedQty: qty,
                rate: selectedItem.rate,
                itemDiscount: 0, //per-item discount can be added later
            },
        ]);

        setSelectedItem(null);
        setQuantity('');
    };

    const subtotal = invoiceItems.reduce(
        (sum, item) => {
            const qty = toNumber(item.billedQty);
            const rate = toNumber(item.rate);
            const discount = toNumber(item.itemDiscount);

            const base = qty * rate;
            const discounted = Math.max(base - discount, 0);
            return sum + discounted;
        },
        0
    );

    const handleRemoveItem = (itemId) => {
        setInvoiceItems((prev) =>
            prev.filter((i) => i.id !== itemId)
        );
    };

    const invoiceDiscountValue = toNumber(invoiceDiscount);
    const safeInvoiceDiscount = Math.min(invoiceDiscountValue, toNumber(subtotal));
    const taxableAmount = Math.max(toNumber(subtotal) - safeInvoiceDiscount, 0);

    // GST calculation
    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    if (taxableAmount > 0) {
        if (isInterState) {
            // IGST applies for inter-state sales
            igst = (taxableAmount * IGST_RATE) / 100;
        } else {
            // CGST + SGST apply for intra-state sales
            cgst = (taxableAmount * CGST_RATE) / 100;
            sgst = (taxableAmount * SGST_RATE) / 100;
        }
    }

    const totalTax = toNumber(cgst) + toNumber(sgst) + toNumber(igst);
    const grandTotal = toNumber(taxableAmount) + totalTax;


    const isInvoiceEmpty = invoiceItems.length === 0;

    const { addInvoice } = useContext(InvoiceContext);

    const handleSaveInvoice = () => {
        if (isInvoiceEmpty) {
            Alert.alert('Invoice is empty');
            return;
        }
        const invoice = new Invoice({
            invoiceNo: generateInvoiceNumber(),
            date: new Date().toISOString(),
            dueDate: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
            ).toISOString(), // 7 days credit
            customerId: null, // will be linked later
            items: invoiceItems,
            subtotal,
            tax: totalTax,
            total: grandTotal,
            paymentStatus: PaymentStatus.PENDING,
        });

        addInvoice(invoice);

        Alert.alert('Invoice Saved');

        // Reset draft
        setInvoiceItems([]);
        setInvoiceDiscount('');
        setSelectedItem(null);
    };

    return (
        //<View>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            <ScrollView
                contentContainerStyle={{ padding: 16, paddingBottom: 500 }}
                keyboardShouldPersistTaps="handled">

                <View
                    style={{
                        padding: 12,
                        borderRadius: 10,
                        backgroundColor: '#eef2ff',
                        marginBottom: 12,
                    }}
                >
                    {/* New Invoice header */}
                    <Text style={{ fontWeight: '700', fontSize: 16 }}>
                        New Invoice
                    </Text>
                    <Text style={{ color: '#6b7280', fontSize: 12 }}>
                        Select items and build the bill
                    </Text>
                </View>


                <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 8, marginTop: 25 }}>
                    Items
                </Text>
                {/* Display: No items added yet */}
                {items.length === 0 && (
                    <Text style={{ marginTop: 20, textAlign: 'center', color: 'gray' }}>
                        No stock items available.
                        {'\n'}Please add items before billing.
                    </Text>
                )}


                {/* Item List */}
                {items.length > 0 && (
                    <>
                        {items.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => handleSelectItem(item)}
                                style={{
                                    padding: 14,
                                    borderRadius: 10,
                                    marginBottom: 10,
                                    backgroundColor:
                                        selectedItem?.id === item.id ? '#e6f0ff' : '#ffffff',
                                    borderWidth: selectedItem?.id === item.id ? 2 : 1,
                                    borderColor: selectedItem?.id === item.id ? '#3b82f6' : '#e5e7eb',
                                }}
                            >
                                <Text style={{ fontWeight: '600' }}>{item.name}</Text>
                                <Text style={{ color: 'gray' }}>
                                    ₹{item.rate} | Stock: {item.quantity}
                                </Text>
                            </TouchableOpacity>

                        ))
                        }
                    </>

                )}

                {selectedItem && (
                    <View style={{
                        marginTop: 20,
                        padding: 12,
                        borderRadius: 8,
                        backgroundColor: '#f1f5f9',
                    }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{ fontWeight: '600' }}>
                                Selected Item: {selectedItem.name}
                            </Text>

                            <Text
                                style={{ color: '#ef4444', fontWeight: '600' }}
                                onPress={() => setSelectedItem(null)}
                            >
                                Cancel
                            </Text>
                        </View>

                        <TextInput
                            placeholder="Enter Quantity"
                            keyboardType="numeric"
                            value={quantity}
                            onChangeText={setQuantity}
                            maxLength={5}
                            style={{
                                borderWidth: 1,
                                padding: 10,
                                borderRadius: 6,
                                marginVertical: 10,
                            }}
                        />
                        {quantity && (
                            <Text style={{ color: '#374151', marginTop: 4 }}>
                                Amount: ₹{Number(quantity) * selectedItem.rate}
                            </Text>
                        )}

                        <Text style={{ fontSize: 12, color: 'gray' }}>
                            Max available: {selectedItem.quantity}
                        </Text>

                        <Button
                            title="Add to Invoice"
                            onPress={handleAddItem}
                            disabled={!quantity}
                        />
                    </View>
                )}

                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontWeight: 'bold' }}>Invoice Items</Text>
                    {invoiceItems.length === 0 ? (
                        <Text style={{ color: 'gray' }}>No items added</Text>
                    ) : (
                        invoiceItems.map((item) => {
                            const itemBaseAmount = item.billedQty * item.rate;
                            const discountedAmount = itemBaseAmount - item.itemDiscount;
                            return (

                                <View
                                    key={item.id}
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingVertical: 8,
                                        backgroundColor: '#fafafa',
                                        borderRadius: 8,
                                        padding: 10,
                                        marginVertical: 6,
                                    }}
                                >
                                    <View>
                                        <Text style={{ fontWeight: '500' }}>{item.name}</Text>
                                        <Text style={{ color: 'gray', fontSize: 12 }}>
                                            {item.billedQty} × ₹{item.rate}
                                        </Text>
                                        {/* Item Discount Input */}
                                        <Text style={{ fontSize: 11, color: '#6b7280' }}>
                                            Item Discount
                                        </Text>
                                        <TextInput
                                            placeholder="Item Discount (₹)"
                                            keyboardType="numeric"
                                            value={String(item.itemDiscount)}
                                            onChangeText={(text) => {
                                                const discount = Number(text) || 0;
                                                setInvoiceItems((prev) =>
                                                    prev.map((i) =>
                                                        i.id === item.id
                                                            ? { ...i, itemDiscount: discount }
                                                            : i
                                                    )
                                                );
                                            }}
                                            style={{
                                                borderWidth: 1,
                                                borderColor: '#d1d5db',
                                                padding: 6,
                                                borderRadius: 6,
                                                marginTop: 6,
                                                width: 110,
                                                fontSize: 12,
                                            }}

                                        />
                                    </View>

                                    {/* Invoice Items - Right Side*/}
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <Text style={{ fontWeight: '600' }}>₹{discountedAmount}</Text>
                                        {/* Remove Button */}
                                        <Text
                                            style={{ color: 'red', marginTop: 4 }}
                                            onPress={() =>
                                                Alert.alert(
                                                    'Remove Item',
                                                    'Are you sure you want to remove this item?',
                                                    [
                                                        { text: 'Cancel', style: 'cancel' },
                                                        {
                                                            text: 'Remove',
                                                            style: 'destructive',
                                                            onPress: () => handleRemoveItem(item.id),
                                                        },
                                                    ]
                                                )
                                            }

                                        >
                                            Remove
                                        </Text>
                                    </View>
                                </View>

                            );
                        })
                    )}
                    <View
                        style={{
                            marginTop: 16,
                            padding: 12,
                            borderRadius: 8,
                            backgroundColor: '#f9fafb',
                        }}
                    >
                        <Text style={{ fontWeight: '600', marginBottom: 6 }}>
                            Invoice Discount
                        </Text>

                        <TextInput
                            placeholder="Enter invoice discount (₹)"
                            keyboardType="numeric"
                            value={invoiceDiscount}
                            onChangeText={setInvoiceDiscount}
                            style={{
                                borderWidth: 1,
                                padding: 10,
                                borderRadius: 6,
                            }}
                        />
                    </View>

                    <View
                        style={{
                            marginTop: 16,
                            padding: 12,
                            borderRadius: 8,
                            backgroundColor: '#eef2ff',
                        }}
                    >
                        <Text style={{ fontWeight: '600', marginBottom: 8 }}>
                            Tax Type
                        </Text>
                        <View
                            pointerEvents={isInvoiceEmpty ? 'none' : 'auto'}
                            style={{
                                marginTop: 16,
                                padding: 6,
                                borderRadius: 999,
                                backgroundColor: '#e5e7eb',
                                flexDirection: 'row',
                                opacity: isInvoiceEmpty ? 0.5 : 1,
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => setIsInterState(false)}
                                style={{
                                    flex: 1,
                                    paddingVertical: 10,
                                    borderRadius: 999,
                                    backgroundColor: !isInterState ? '#2563eb' : 'transparent',
                                }}
                            >
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        color: !isInterState ? '#ffffff' : '#374151',
                                        fontWeight: '600',
                                    }}
                                >
                                    CGST + SGST
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setIsInterState(true)}
                                style={{
                                    flex: 1,
                                    paddingVertical: 10,
                                    borderRadius: 999,
                                    backgroundColor: isInterState ? '#2563eb' : 'transparent',
                                }}
                            >
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        color: isInterState ? '#ffffff' : '#374151',
                                        fontWeight: '600',
                                    }}
                                >
                                    IGST
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </ScrollView>

            {/* Bill Summary */}
            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: 16,
                    backgroundColor: '#111827',
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >

                    <View style={{ flex: 1 }}>
                        <Text style={{ color: '#9ca3af' }}>Subtotal</Text>
                        <Text style={{ color: '#ffffff', fontSize: 16 }}>
                            ₹{subtotal}
                        </Text>

                        <Text style={{ color: '#9ca3af', marginTop: 6 }}>
                            Discount
                        </Text>
                        <Text style={{ color: '#ffffff' }}>
                            ₹{invoiceDiscountValue}
                        </Text>

                        <Text style={{ color: '#9ca3af', marginTop: 6 }}>
                            Taxable Amount
                        </Text>
                        <Text style={{ color: '#ffffff' }}>
                            ₹{taxableAmount}
                        </Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <Text style={{ color: '#9ca3af' }}>Tax Details</Text>

                        {!isInterState && (
                            <>
                                <Text style={{ color: '#ffffff', marginTop: 6 }}>
                                    CGST: ₹{cgst}
                                </Text>
                                <Text style={{ color: '#ffffff' }}>
                                    SGST: ₹{sgst}
                                </Text>
                            </>
                        )}

                        {isInterState && (
                            <Text style={{ color: '#ffffff', marginTop: 6 }}>
                                IGST: ₹{igst}
                            </Text>
                        )}

                        <Text style={{ color: '#9ca3af', marginTop: 6 }}>
                            Total Tax
                        </Text>
                        <Text style={{ color: '#ffffff' }}>
                            ₹{totalTax}
                        </Text>
                    </View>


                </View>
                <View
                    style={{
                        height: 1,
                        backgroundColor: '#374151',
                        marginVertical: 12,
                    }}
                />

                <Text
                    style={{
                        color: isInvoiceEmpty ? '#6b7280' : '#ffffff',
                        fontSize: 22,
                        fontWeight: 'bold',
                        textAlign: 'center',
                    }}
                >
                    Grand Total: ₹{isInvoiceEmpty ? 0 : grandTotal}
                </Text>
                <TouchableOpacity
                    onPress={handleSaveInvoice}
                    disabled={isInvoiceEmpty}
                    style={{
                        marginTop: 12,
                        paddingVertical: 14,
                        borderRadius: 10,
                        backgroundColor: isInvoiceEmpty ? '#374151' : '#22c55e',
                    }}
                >
                    <Text
                        style={{
                            color: '#ffffff',
                            textAlign: 'center',
                            fontSize: 16,
                            fontWeight: '700',
                        }}
                    >
                        Save Invoice
                    </Text>
                </TouchableOpacity>



            </View>
        </KeyboardAvoidingView >


        //</View>

    );
}