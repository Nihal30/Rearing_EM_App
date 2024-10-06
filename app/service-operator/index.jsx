import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import DropDownPicker from "react-native-dropdown-picker";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import ServiceOperator from "../../components/ServiceOperator";
import AsyncStorage from "@react-native-async-storage/async-storage";

const index = () => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);

  const [openService, setOpenService] = useState(false);
  const getData = async () => {
    try {
      const operators = await AsyncStorage.getItem("operators");
      if (operators !== null) {
        setItems(JSON.parse(operators).map((op) => ({ label: op.name, value: op.id })));
      }
    } catch (error) {
      console.error("Failed to load operators", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <View>
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
          SERVICE OPERATOR
        </Text>
      </View>

      <View
        style={{
          marginVertical: 10,
          marginHorizontal: 10,
          flexDirection: "row",
          gap: 10,
        }}
      >
        <View>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            placeholder="Select Operator"
            style={[styles.picker]}
            dropDownContainerStyle={styles.dropdownContainer}
          />
        </View>
        <View>
          <TouchableOpacity
            style={[styles.button, { height: 50, width: 70, borderRadius: 10 }]}
            onPress={() => setOpenService(true)}
          >
            <Text style={styles.buttonText}>List</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ServiceOperator
        visible={openService}
        onClose={() => setOpenService(false)}
      />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  dropdownContainer: {
    width: 280,
    borderColor: "#ccc",
  },
  picker: {
    width: 280,
    borderColor: "#ccc",
  },
  button: {
    backgroundColor: "#DE3163",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
  },
});
