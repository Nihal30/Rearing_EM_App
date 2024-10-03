import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";

const BottomSheetModal = ({
  visible,
  onClose,
  headerText,
  setCustomerDetails,
}) => {
  // State for customer details
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [phoneError, setPhoneError] = useState(false); // New error state

  // Handler for the "Add" button
  const handleAddDetails = () => {
    if (customerName.trim() === "" || customerPhone.trim() === "") {
      Alert.alert("Error", "Name and Phone Number are required fields.");
      return;
    }

    if (customerPhone.length !== 10) {
      setPhoneError(true); // Set error state if phone number is not 10 digits
      return;
    }

    const newCustomer = {
      name: customerName,
      phone: customerPhone,
      address: customerAddress,
    };

    setCustomerDetails((prevDetails) => [...prevDetails, newCustomer]);

    // Reset input fields
    setCustomerName("");
    setCustomerPhone("");
    setCustomerAddress("");
    setPhoneError(false); // Reset phone error state

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
            onChangeText={(text) => {
              setCustomerPhone(text);
              if (text.length === 10) {
                setPhoneError(false); // Reset error when valid
              }
            }}
            style={[styles.input, phoneError && styles.errorInput]} // Apply error style
            placeholder="Customer Phone No"
            keyboardType="phone-pad"
          />
          {phoneError && <Text style={{marginTop:-10,marginBottom:10 ,color:"red"}}>Add 10 digits number</Text>}

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
  errorInput: {
    borderColor: "red", // Red border for error
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
