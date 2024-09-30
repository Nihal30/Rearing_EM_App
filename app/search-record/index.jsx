import { View, Text, TextInput, FlatList, StyleSheet } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FormDataContext } from "../../hooks/FormDataConextApi";

const SearchRecord = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const { formData, setFormData } = useContext(FormDataContext);

  const [data, setData] = useState([]);

  useEffect(() => {
    setData(formData);
  }, []);

  // Filtered list based on search input
  // const filteredData = data.filter((item) =>
  //   item.toLowerCase().includes(searchText.toLowerCase())
  // );
  console.log("data", data);

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
        {/* Back Button */}
        <TouchableOpacity
          style={{ marginTop: 40, marginLeft: 10 }}
          onPress={() => router.back()}
        >
          <Icon name="arrow-back" size={25} color="#ffffff" />
        </TouchableOpacity>

        {/* Header Text */}
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
          placeholder="Search..."
          placeholderTextColor="#cccccc"
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
      </View>

      {/* List of Items */}
      <View style={styles.listContainer}>
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/records",
                  params: { formData: JSON.stringify(item) },
                })
              }
            >
              <View style={styles.listItem}>
                <Text style={styles.itemText}>{item?.orderDetails}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 5,
    marginVertical: 20,
    paddingHorizontal: 10,
    marginRight: 10,
    marginLeft: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  listContainer: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,

    height: 640,
    marginBottom: 1,
  },
  listItem: {
    backgroundColor: "#DE3163",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  itemText: {
    color: "#ffffff",
    fontSize: 16,
  },
});

export default SearchRecord;
