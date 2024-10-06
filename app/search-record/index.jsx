import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
  Alert,
  Switch,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { FormDataContext } from "../../hooks/FormDataConextApi";
import NoData from "../../assets/images/noData.jpg";
import Toast from "../../components/Toast";
import RNPickerSelect from "react-native-picker-select";
import { Button } from "react-native-paper";

const SearchRecord = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const { formData, deleteData } = useContext(FormDataContext);
  const [filteredData, setFilteredData] = useState(formData);
  const [toast, setToast] = useState({ visible: false, message: "", type: "" });

  const [orderType, setOrderType] = useState(null); // Initially null for 'All'
  const [isService, setIsService] = useState(false);
  const [isTodayFilter, setIsTodayFilter] = useState(false); // State for "Today" filter

  useEffect(() => {
    setFilteredData(formData); // Display all data initially
  }, [formData]);

  // Function to handle filtering based on search text, order type, service, and date
  const handleSearch = () => {
    const today = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format

    const filtered = formData.filter((item) => {
      const matchesSearchText =
        item.orderDetails.toLowerCase().includes(searchText.toLowerCase()) ||
        item.customerDetails?.customerList[0]?.name
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        false;

      const matchesOrderType = orderType
        ? item.orderDetails === orderType
        : true; // If orderType is null, show all records

      const matchesService = isService
        ? item.isService === isService // Assuming you have an 'isService' field in your data
        : true; // If isService is false, don't filter by this

      const matchesToday = isTodayFilter
        ? item.date?.split("T")[0] === today // Check if order date matches today's date
        : true; // If 'Today' filter is active, check if date matches

      return matchesSearchText && matchesOrderType && matchesService && matchesToday;
    });

    setFilteredData(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [orderType, isService, isTodayFilter]);

  // Function to get styles for different order statuses
  const getOrderStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return styles.pendingStatus;
      case "Repaired":
        return styles.repairedStatus;
      case "Delivered":
        return styles.deliveredStatus;
      case "Canceled":
        return styles.canceledStatus;
      default:
        return {}; // Return empty object if no match is found
    }
  };

  // Function to handle deletion of a record
  const handleDelete = (id) => {
    Alert.alert(
      "Delete Record",
      "Are you sure you want to delete this record?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Deletion cancelled"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              console.log("id", id);
              await deleteData(id);
              setToast({
                visible: true,
                message: "Record deleted successfully!",
                type: "success",
              });
            } catch (error) {
              setToast({
                visible: true,
                message: "Failed to delete record!",
                type: "error",
              });
            }

            // Hide the toast after 3 seconds
            setTimeout(() => {
              setToast({ visible: false, message: "", type: "" });
            }, 3000);
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#DE3163",
          padding: 10,
        }}
      >
        <TouchableOpacity
          style={{ marginTop: 40, marginLeft: 10 }}
          onPress={() => router.back()}
        >
          <Icon name="arrow-back" size={25} color="#ffffff" />
        </TouchableOpacity>
        <Text
          style={{
            color: "#ffffff",
            fontFamily: "outfit-medium",
            fontSize: 20,
            flex: 1,
            textAlign: "center",
            marginTop: 40,
          }}
        >
          SEARCH RECORDS
        </Text>
      </View>

      {/* Search Input with Icon */}
      <View style={styles.searchContainer}>
        <Icon
          name="search"
          size={20}
          color="#cccccc"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Search Customer Name."
          placeholderTextColor="#cccccc"
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <View style={{ borderWidth: 1, borderRadius: 10, width: 150 }}>
          <RNPickerSelect
            onValueChange={(value) => setOrderType(value)}
            items={[
              { label: "All", value: null },
              { label: "Pending", value: "Pending" },
              { label: "Repaired", value: "Repaired" },
              { label: "Delivered", value: "Delivered" },
              { label: "Canceled", value: "Canceled" },
            ]}
            placeholder={{ label: "Select Order Type", value: null }}
          />
        </View>

        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: 10,
          }}
        >
          <Text style={{ fontSize: 16 }}>Service</Text>
          <Switch
            value={isService}
            onValueChange={(value) => setIsService(value)}
          />
        </View>

        <Button
          style={{ backgroundColor: isTodayFilter ? "#DE3163" : "#E5E4E2" }} // Highlight if active
          onPress={() => {
            setIsTodayFilter((prev) => !prev); // Toggle the 'Today' filter
            handleSearch(); // Reapply the search filter
          }}
        >
          Today
        </Button>
      </View>

      {/* List of Items */}
      <View style={styles.listContainer}>
        {filteredData.length === 0 ? (
          <View style={styles.noDataContainer}>
            <Image source={NoData} style={styles.noDataImage} />
            <Text style={styles.noDataText}>No records found</Text>
          </View>
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/records",
                    params: { OldFormData: JSON.stringify(item) },
                  })
                }
              >
                <View style={styles.listItem}>
                  <View
                    style={[
                      styles.titleValueContainer,
                      {
                        flex: 1,
                        direction: "row",
                        justifyContent: "flex-end",
                        margin: 5,
                        marginBottom: 10,
                        backgroundColor: "#ccc",
                        padding: 5,
                        alignItems: "center",
                        borderRadius: 10,
                      },
                    ]}
                  >
                    <Text style={styles.titleText}>Customer Details</Text>
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#D3D3D3",
                        padding: 2,
                        borderRadius: 30,
                      }}
                      onPress={() => handleDelete(item.id)}
                    >
                      <Icon name="close" size={20} color="#ff0000" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.titleValueContainer}>
                    <Text style={styles.titleText}>Order Status:</Text>
                    <Text
                      style={[
                        styles.valueText,
                        getOrderStatusStyle(item?.orderDetails),
                      ]}
                    >
                      {item?.orderDetails}
                    </Text>
                  </View>
                  {item?.customerDetails?.customerList?.length > 0 && (
                    <View>
                      <View style={styles.titleValueContainer}>
                        <Text style={styles.titleText}>Customer Name:</Text>
                        <Text style={styles.valueText}>
                          {item.customerDetails.customerList[0].name}
                        </Text>
                      </View>
                      <View style={styles.titleValueContainer}>
                        <Text style={styles.titleText}>Email:</Text>
                        <Text style={styles.valueText}>
                          {item.customerDetails.customerList[0].email}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {toast.visible && (
        <Toast message={toast.message} type={toast.type} visible={toast.visible} />
      )}
    </View>
  );
};

export default SearchRecord;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  searchIcon: {
    position: "absolute",
    left: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#cccccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 40,
  },
  searchButton: {
    backgroundColor: "#DE3163",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontFamily: "outfit-medium",
  },
  listContainer: {
    flex: 1,
    padding: 10,
  },
  noDataContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  noDataImage: {
    width: 200,
    height: 200,
  },
  noDataText: {
    fontSize: 20,
    fontFamily: "outfit-medium",
    color: "#cccccc",
    marginTop: 20,
  },
  listItem: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal:10,
    // shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 10,
  },
  titleValueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleText: {
    fontFamily: "outfit-medium",
    fontSize: 16,
  },
  valueText: {
    fontFamily: "outfit-regular",
    fontSize: 16,
  },
  pendingStatus: {
    color: "#ffcc00", // yellow
  },
  repairedStatus: {
    color: "#00cc00", // green
  },
  deliveredStatus: {
    color: "#0000ff", // blue
  },
  canceledStatus: {
    color: "#ff0000", // red
  },
});
