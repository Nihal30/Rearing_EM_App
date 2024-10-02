import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  FlatList,
} from "react-native";

const SelectModelDialog = ({
  visible,
  onClose,
  onSelectModel,
  customerDetails,
  setCustomerList,
  customerList
}) => {
  // console.log(customerDetails, "nvhg");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
//   const Details = [
//     { name: "John Doe", phone: "12345", address: "123 Main St" },
//     { name: "Jane Smith", phone: "67890", address: "456 Elm St" },
//     // Add more customer objects
//   ];

  // Update search results whenever customerDetails or searchQuery changes
  useEffect(() => {
    if (customerList.length > 0) {
      setSearchResults(customerDetails);
    }
  }, [customerDetails]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      // Filter the search results based on query
      const filteredResults = customerList.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredResults);
    } else {
      // Reset to initial data if query is empty
      setSearchResults(customerDetails);
    }
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.dialogBox}>
          {/* Modal Header */}
          <Text style={styles.dialogTitle}>Select Customer Model</Text>

          {/* Search Input */}
          <TextInput
            value={searchQuery}
            onChangeText={handleSearch}
            style={styles.searchInput}
            placeholder="Search Customer."
          />

          {/* Search Results */}
          <FlatList
            data={customerDetails} // Use searchResults for filtering to display only relevant results
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => {
                  onSelectModel(item);
                  onClose();
                }}
              >
                <Text style={styles.resultText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />

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
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dialogBox: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  searchInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  resultItem: {
    width: "100%",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  resultText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#DE3163",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
});

export default SelectModelDialog;
