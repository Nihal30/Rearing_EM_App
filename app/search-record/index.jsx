import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { FormDataContext } from "../../hooks/FormDataConextApi";
import NoData from "../../assets/images/noData.jpg";
import Toast from "../../components/Toast";

const SearchRecord = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);
  const { formData, deleteData } = useContext(FormDataContext);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [toast, setToast] = useState({ visible: false, message: "", type: "" });

  useEffect(() => {
    setData(formData);
    setFilteredData(formData); // Initialize with all data
  }, [formData]);

  // Filter the data based on the search text and selected status
  const handleSearch = () => {
    const filtered = selectedStatus
      ? data.filter((item) => {
          const matchesSearchText =
            item.orderDetails
              .toLowerCase()
              .includes(searchText.toLowerCase()) ||
            item.customerDetails?.customerList[0]?.name
              .toLowerCase()
              .includes(searchText.toLowerCase()) ||
            false;

          return matchesSearchText && item.orderDetails === selectedStatus;
        })
      : data.filter((item) => {
          const matchesSearchText =
            item.orderDetails
              .toLowerCase()
              .includes(searchText.toLowerCase()) ||
            item.customerDetails?.customerList[0]?.name
              .toLowerCase()
              .includes(searchText.toLowerCase()) ||
            false;

          return matchesSearchText;
        });

    setFilteredData(filtered);
  };

  // Function to get background color based on order status
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
        return styles.defaultStatus; // Optional: Style for unknown status
    }
  };

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

      {/* Order Status Buttons */}
      {/* <View style={styles.buttonContainer}>
        {["Pending", "Repaired", "Delivered", "Canceled"].map((status) => (
          <TouchableOpacity
            key={status}
            style={[styles.statusButton, selectedStatus === status && styles.selectedButton]}
            onPress={() => {
              const newStatus = selectedStatus === status ? null : status;
              setSelectedStatus(newStatus);
              handleSearch(); // Reapply the search with the new status
            }}
          >
            <Text style={styles.buttonText}>{status}</Text>
          </TouchableOpacity>
        ))}
      </View> */}

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
                          {item.customerDetails.customerList[0]?.name || "N/A"}
                        </Text>
                      </View>
                      <View style={styles.titleValueContainer}>
                        <Text style={styles.titleText}>Customer Phone:</Text>
                        <Text style={styles.valueText}>
                          {item.customerDetails.customerList[0]?.phone || "N/A"}
                        </Text>
                      </View>
                    </View>
                  )}

                  <View style={styles.titleValueContainer}>
                    <Text style={styles.titleText}>Model:</Text>
                    <Text style={styles.valueText}>{item?.model}</Text>
                  </View>
                  {item?.problems?.length > 0 && (
                    <View style={styles.titleValueContainer}>
                      <Text style={styles.titleText}>Issues:</Text>
                      <Text style={styles.valueText}>
                        {item.problems.map((problem, index) => (
                          <Text key={index}>
                            {problem.text || "N/A"}
                            {index < item.problems.length - 1 ? ", " : ""}
                          </Text>
                        ))}
                      </Text>
                    </View>
                  )}
                  <View style={styles.titleValueContainer}>
                    <Text style={styles.titleText}>Date:</Text>
                    <Text style={styles.valueText}>
                      {new Date(item.date).toLocaleDateString() || "N/A"}
                    </Text>
                  </View>
                  <View style={styles.titleValueContainer}>
                    <Text style={styles.titleText}>Time:</Text>
                    <Text style={styles.valueText}>
                      {new Date(item.time).toLocaleTimeString() || "N/A"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
      <Toast
        message={toast.message}
        visible={toast?.visible}
        type={toast.type}
        onClose={() => setToastVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    backgroundColor: "#ffffff",
    borderRadius: 5,
    marginVertical: 20,
    paddingHorizontal: 10,
    marginHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: "#DE3163",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  statusButton: {
    backgroundColor: "#DE3163",
    padding: 10,
    borderRadius: 5,
  },
  selectedButton: {
    backgroundColor: "#000000", // Change to desired selected color
  },
  listContainer: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    marginHorizontal: 10,
    height: 640,
  },
  listItem: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#DE3163",
  },
  titleValueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  titleText: {
    color: "#000000",
    fontSize: 16,
    fontFamily: "outfit-medium",
    marginLeft: 10,
    flex: 1,
  },
  valueText: {
    color: "#000000",
    fontSize: 14,
    fontFamily: "outfit-medium",
    marginRight: 10,
    flex: 1,
    padding: 5,
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
  },
  pendingStatus: {
    fontFamily: "outfit-bold",
    backgroundColor: "#FAFA33", // Gold color for pending
  },
  repairedStatus: {
    fontFamily: "outfit-bold",
    backgroundColor: "#00FFFF", // LimeGreen color for repaired
  },
  deliveredStatus: {
    fontFamily: "outfit-bold",
    backgroundColor: "#50C878", // DodgerBlue color for delivered
  },
  canceledStatus: {
    fontFamily: "outfit-bold",
    backgroundColor: "#FF4500", // OrangeRed color for canceled
  },
  noDataContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  noDataImage: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  noDataText: {
    fontSize: 18,
    color: "#666666",
  },
});

export default SearchRecord;
