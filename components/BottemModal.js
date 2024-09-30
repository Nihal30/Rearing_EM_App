// components/BottomSheetModal.js

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";

const BottomSheetModal = ({ visible, onClose, headerText, setCustomerDetails }) => {
  // State for customer details
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  // Handler for the "Add" button
  const handleAddDetails = () => {
    const newCustomer = {
      name: customerName,
      phone: customerPhone,
      address: customerAddress,
    };
    
    setCustomerDetails((prevDetails) => [...prevDetails, newCustomer]);
    onClose(); // Close the modal after adding
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.bottomSheet}>
          {/* Header Text */}
          <View style={styles.header}>
            <Text style={styles.headerText}>{headerText}</Text>
          </View>

          {/* Input Fields */}
          <TextInput
            value={customerName}
            onChangeText={setCustomerName}
            style={styles.input}
            placeholder="Customer Name"
          />
          <TextInput
            value={customerPhone}
            onChangeText={setCustomerPhone}
            style={styles.input}
            placeholder="Customer Phone No"
            keyboardType="phone-pad"
          />
          <TextInput
            value={customerAddress}
            onChangeText={setCustomerAddress}
            style={styles.input}
            placeholder="Customer Address"
          />

          {/* Add Button */}
          <TouchableOpacity style={styles.addButton} onPress={handleAddDetails}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>

          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  bottomSheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
    maxHeight: "50%",
  },
  header: {
    alignItems: "center",
    marginBottom: 15,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "#DE3163",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
  },
});

export default BottomSheetModal;
