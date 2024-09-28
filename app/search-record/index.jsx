import { View, Text, TextInput, FlatList, StyleSheet } from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const SearchRecord = () => {
    const router = useRouter()
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([
    "Apple",
    "Banana",
    "Cherry",
    "Date",
    "Grape",
    "Kiwi",
    "Mango",
    "Orange",
    "Pineapple",
    "Strawberry",
    "Apple",
    "Banana",
    "Cherry",
    "Date",
    "Grape",
    "Kiwi",
    "Mango",
    "Orange",
    "Pineapple",
    "Strawberry",
  ]);

  // Filtered list based on search input
  const filteredData = data.filter((item) =>
    item.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#4C516D" }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#002244',
          padding: 10,
        }}
      >
        {/* Back Button */}
        <TouchableOpacity style={{marginTop: 40,marginLeft:10 }} onPress={() => router.back()}>
          <Icon name="arrow-back" size={25} color="#ffffff" />
        </TouchableOpacity>

        {/* Header Text */}
        <Text
          style={{
            color: '#ffffff',
            fontFamily: 'outfit-medium',
            fontSize: 20,
            flex: 1,  
            textAlign: 'center', 
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
          data={filteredData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.itemText}>{item}</Text>
            </View>
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
    backgroundColor: "#002244",
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
