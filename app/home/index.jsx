import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ScrollView,
  Linking,
} from "react-native";
import React, { useContext, useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import * as Print from "expo-print"; // Importing Print module
import * as FileSystem from "expo-file-system"; // Importing FileSystem module
// import * as Sharing from 'expo-sharing'
import DropDownPicker from "react-native-dropdown-picker";
import Toast from "../../components/Toast";
import SelectModelDialog from "../../components/SelectModal";
import BottomSheetModal from "../../components/BottemModal";
import CustomerKyc from "../../components/CustomerKyc";
import BarcodeScanner from "../../components/BarcodeScanner";
import { RadioButton } from "react-native-paper";
import PatternLock from "../../components/PatternLock";
import moment from "moment";
import { FormDataContext } from "../../hooks/FormDataConextApi";

const NewRecord = () => {
  const router = useRouter();

  // State for form data
  const [form, setForm] = useState({
    orderDetails: "",
    customerModel: "",
    problems: "",
    price: "",
    paid: "",
    lockCode: "",
    barcode: "",
    date: new Date(),
    time: new Date(),
    isYesSelected: false,
    deviceWarranty: "",
    profitAmount: "",
    additionalDetails: "",
    owner: "",
    selectedLocation: "inHouse",
    serviceCenterName: "",
    contactNo: "",
  });

  // UI states
  const [uiState, setUiState] = useState({
    showDatePicker: false,
    showTimePicker: false,
    isDialogVisible: false,
    isBottomSheetVisible: false,
    kycVisible: false,
    isScannerVisible: false,
    isPatternModalVisible: false,
    toastVisible: false,
    toastMessage: "",
    toastType: "success", // 'success' or 'error'
  });

  const [customerDetails, setCustomerDetails] = useState([]);
  const [dropdown, setDropdown] = useState({
    open: false,
    value: null,
    items: [
      { label: "Laptop", value: "Laptop" },
      { label: "Hp", value: "Hp" },
      { label: "My", value: "My" },
    ],
  });

  // Context for form data
  const { formData, setFormData } = useContext(FormDataContext);

  // Handle form data change
  const handleFormChange = (key, value) => {
    setForm((prevForm) => ({ ...prevForm, [key]: value }));
  };

  // Handle UI state change
  const handleUiStateChange = (key, value) => {
    setUiState((prevState) => ({ ...prevState, [key]: value }));
  };

  // Handle dropdown change
  const handleDropdownChange = (key, value) => {
    setDropdown((prevDropdown) => ({ ...prevDropdown, [key]: value }));
  };

  // Handlers
  const handleScan = (data) => {
    handleFormChange("barcode", data);
    handleUiStateChange("isScannerVisible", false);
  };

  const handleAddCustomer = (details) => {
    setCustomerDetails([...customerDetails, details]);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || form.date;
    handleUiStateChange("showDatePicker", false);
    handleFormChange("date", currentDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || form.time;
    handleUiStateChange("showTimePicker", false);
    handleFormChange("time", currentTime);
  };

  // Footer functions
  const DUMMY_NUMBER = "1234567890";
  const MESSAGE = "Hello, this is a test message.";

  const handleCall = () => {
    Linking.openURL(`tel:${DUMMY_NUMBER}`);
  };

  const handleMessage = () => {
    Linking.openURL(`sms:${DUMMY_NUMBER}?body=${encodeURIComponent(MESSAGE)}`);
  };

  const handleWhatsApp = () => {
    Linking.openURL(`whatsapp://send?text=${encodeURIComponent(MESSAGE)}&phone=${DUMMY_NUMBER}`);
  };

  const handlePrint = async () => {
    try {
      console.log("Preparing to download PDF...");
      handleUiStateChange("toastMessage", "PDF downloaded successfully!");
      handleUiStateChange("toastType", "success");
      handleUiStateChange("toastVisible", true);
      setTimeout(() => handleUiStateChange("toastVisible", false), 3000);
    } catch (error) {
      console.error("Error generating PDF:", error);
      handleUiStateChange("toastMessage", "Error downloading PDF.");
      handleUiStateChange("toastType", "error");
      handleUiStateChange("toastVisible", true);
      setTimeout(() => handleUiStateChange("toastVisible", false), 3000);
    }
  };

  // Form submit
  const handleSubmit = async () => {
    const newFormData = {
      ...form,
      orderDetails: dropdown.value,
    };

    await setFormData((prevFormData) => [...prevFormData, newFormData]);

    // Reset form state
    setForm({
      orderDetails: "",
      customerModel: "",
      problems: "",
      price: "",
      paid: "",
      lockCode: "",
      barcode: "",
      date: new Date(),
      time: new Date(),
      isYesSelected: false,
      deviceWarranty: "",
      profitAmount: "",
      additionalDetails: "",
      owner: "",
      selectedLocation: "inHouse",
      serviceCenterName: "",
      contactNo: "",
    });

    setDropdown({
      open: false,
      value: null,
      items: [
        { label: "Laptop", value: "Laptop" },
        { label: "Hp", value: "Hp" },
        { label: "My", value: "My" },
      ],
    });

    handleUiStateChange("isDialogVisible", false);
    handleUiStateChange("isBottomSheetVisible", false);
    setCustomerDetails([]);
    handleUiStateChange("kycVisible", false);
    handleUiStateChange("isScannerVisible", false);
    handleUiStateChange("isPatternModalVisible", false);

    router.push('/');
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#4C516D" }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#002244",
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
          ADD RECORDS
        </Text>
      </View>

      {/* Form */}
      <ScrollView style={styles.formContainer}>
        {/* Dropdown for Order Details */}
        <Text style={styles.label}>Order Details:</Text>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          placeholder="Select Order"
          style={styles.picker}
          dropDownContainerStyle={styles.dropdownContainer}
        />

        <View
          style={[styles.customerDetails, { borderRadius: 10, marginTop: 10 }]}
        >
          <Text style={styles.label}>Customer Details</Text>

          {/* Buttons for Select and Add */}
          {customerDetails?.length > 0 &&
            customerDetails?.map((item, index) => (
              <View
                style={[styles.customerDetails, { margin: 10 }]}
                key={index}
              >
                <Text style={{ color: "#ffffff" }}>
                  {item.name}/{item.phone}
                </Text>
              </View>
            ))}
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Customer Details */}
            <TextInput
              value={customerModel}
              onChangeText={setCustomerModel}
              style={styles.input}
              placeholder="Enter customer model"
            />
            <TouchableOpacity
              style={[
                styles.button,
                { height: "100%", width: 70, borderRadius: 10 },
              ]}
              onPress={openDialog}
            >
              <Text style={styles.buttonText}>Select</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                { height: "100%", width: 70, borderRadius: 10 },
              ]}
              onPress={openBottomSheet}
            >
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Multiline Input for Problems */}
        <Text style={[styles.label, { marginTop: 10 }]}>Write Problems:</Text>
        <TextInput
          value={problems}
          onChangeText={setProblems}
          style={[styles.input, { height: 100 }]} // Adjust height for multiline
          placeholder="Describe problems"
          multiline
        />

        {/* Button for Customer KYC */}
        <TouchableOpacity
          style={[styles.button, { marginTop: 15 }]}
          onPress={() => setKycVisible(true)}
        >
          <Text style={styles.buttonText}>Customer KYC</Text>
        </TouchableOpacity>

        {/* Price and Paid Inputs */}
        <Text style={styles.label}>Price:</Text>
        <TextInput
          value={price}
          onChangeText={setPrice}
          style={styles.input}
          placeholder="Enter price"
          keyboardType="numeric"
        />

        <Text style={[styles.label, { marginTop: 10 }]}>Paid:</Text>
        <TextInput
          value={paid}
          onChangeText={setPaid}
          style={styles.input}
          placeholder="Enter paid amount"
          keyboardType="numeric"
        />

        {/* Lock Code Input */}
        {/* <Text style={[styles.label, { marginTop: 10 }]}>Lock Code:</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <TextInput
            value={lockCode}
            onChangeText={setLockCode}
            style={[styles.input, { flex: 1 }]}
            placeholder="Enter lock code"
          />
          <TouchableOpacity
            style={[
              styles.button,
              { alignItems: "center", justifyContent: "center", height: 50 },
            ]}
          >
            <Text style={styles.buttonText} onPress={handleOpenPatternLock}>
              Submit
            </Text>
          </TouchableOpacity>
        </View> */}

        {/* Date Picker */}
        <Text style={[styles.label, { marginTop: 10 }]}>Select Date:</Text>
        {date && (
          <View style={{ backgroundColor: "#ffffff", padding: 10, margin: 10 }}>
            <Text style={{ fontFamily: "outfit-medium" }}>
              {moment(date).format("DD MM YYY")}
            </Text>
          </View>
        )}
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Show Date Picker</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        {/* Time Picker */}
        <Text style={styles.label}>Select Repair Time:</Text>
        {time && (
          <View style={{ backgroundColor: "#ffffff", padding: 10, margin: 10 }}>
            <Text style={{ fontFamily: "outfit-medium" }}>
              {moment(time).format("HH:MM")}
            </Text>
          </View>
        )}
        <TouchableOpacity
          onPress={() => setShowTimePicker(true)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Show Time Picker</Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            display="default"
            onChange={onTimeChange}
          />
        )}

        {/* Radio Group for Yes/No */}
        <Text style={[styles.label, { marginTop: 10 }]}>Accessories</Text>
        <View style={{}}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 145,
            }}
          >
            <Text style={[styles.label, { marginTop: 10 }]}>Power Adapter</Text>
            <View
              style={[styles.radioGroup, { flex: 1, flexDirection: "row" }]}
            >
              <RadioButton
                value="yes"
                status={isYesSelected ? "checked" : "unchecked"}
                onPress={() => setIsYesSelected(true)}
              />
              <Text style={[styles.label, { marginTop: 8 }]}>Yes</Text>
              <RadioButton
                value="no"
                status={!isYesSelected ? "checked" : "unchecked"}
                onPress={() => setIsYesSelected(false)}
              />
              <Text style={[styles.label, { marginTop: 8 }]}>No</Text>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 130,
            }}
          >
            <Text style={[styles.label, { marginTop: 10 }]}>
              Keyboard/Mouse
            </Text>
            <View
              style={[styles.radioGroup, { flex: 1, flexDirection: "row" }]}
            >
              <RadioButton
                value="yes"
                status={isYesSelected ? "checked" : "unchecked"}
                onPress={() => setIsYesSelected(true)}
              />
              <Text style={[styles.label, { marginTop: 8 }]}>Yes</Text>
              <RadioButton
                value="no"
                status={!isYesSelected ? "checked" : "unchecked"}
                onPress={() => setIsYesSelected(false)}
              />
              <Text style={[styles.label, { marginTop: 8 }]}>No</Text>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 160,
            }}
          >
            <Text style={[styles.label, { marginTop: 10 }]}>Other Device</Text>
            <View
              style={[styles.radioGroup, { flex: 1, flexDirection: "row" }]}
            >
              <RadioButton
                value="yes"
                status={isYesSelected ? "checked" : "unchecked"}
                onPress={() => setIsYesSelected(true)}
              />
              <Text style={[styles.label, { marginTop: 8 }]}>Yes</Text>
              <RadioButton
                value="no"
                status={!isYesSelected ? "checked" : "unchecked"}
                onPress={() => setIsYesSelected(false)}
              />
              <Text style={[styles.label, { marginTop: 8 }]}>No</Text>
            </View>
          </View>
        </View>

        {/* Barcode Input */}
        <Text style={[styles.label, { marginTop: 10 }]}>Barcode:</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <TextInput
            value={barcode}
            onChangeText={setBarcode}
            style={[styles.input, { flex: 1 }]}
            placeholder="Enter or scan barcode"
          />
          <TouchableOpacity
            onPress={() => setScannerVisible(true)}
            style={[
              styles.button,
              { alignItems: "center", justifyContent: "center", height: 50 },
            ]}
          >
            <Text style={styles.buttonText}>Scan</Text>
          </TouchableOpacity>
        </View>

        {/* Owner/Assistant */}
        <View
          style={[styles.customerDetails, { borderRadius: 10, marginTop: 10 }]}
        >
          <TextInput
            value={owner}
            onChangeText={setOwner}
            style={[styles.input, { height: 50, marginTop: 10 }]} // Adjust height for multiline
            placeholder="Name Of Receiver(Owner/Assistant)"
            multiline
          />
          <View>
            <Text style={[styles.label, { marginTop: 10 }]}>
              Other Location:
            </Text>
            <RadioButton.Group
              onValueChange={setSelectedLocation}
              value={selectedLocation}
            >
              <View style={styles.radioContainer}>
                <RadioButton value="inHouse" />
                <Text>In-house</Text>
              </View>
              <View style={styles.radioContainer}>
                <RadioButton value="serviceCenter" />
                <Text>Service Center</Text>
              </View>
            </RadioButton.Group>

            {selectedLocation === "serviceCenter" && (
              <View>
                <TextInput
                  value={serviceCenterName}
                  onChangeText={setServiceCenterName}
                  style={[styles.input, { height: 50, marginTop: 10 }]}
                  placeholder="Name of the Service Center"
                />
                <TextInput
                  value={contactNo}
                  onChangeText={setContactNo}
                  style={[styles.input, { height: 50, marginTop: 10 }]}
                  placeholder="Contact No"
                  keyboardType="phone-pad"
                />
                <View
                  style={[
                    styles.buttonContainer,
                    {
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-around",
                      marginTop: 10,
                      marginBottom: 10,
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={[
                      styles.button,
                      { height: "100%", width: 150, borderRadius: 10 },
                    ]}
                  >
                    <Text style={styles.buttonText}>Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      { height: "100%", width: 150, borderRadius: 10 },
                    ]}
                  >
                    <Text style={styles.buttonText}>Message</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Additional Details */}
        <TextInput
          value={additionalDetails}
          onChangeText={setAdditionalDetails}
          style={[styles.input, { height: 50, marginTop: 10 }]} // Adjust height for multiline
          placeholder="Additional Details"
          multiline
        />

        <Text style={[styles.label, { marginTop: 10 }]}>
          * Enter Profit Amount Below to Calculate Day-Wise
        </Text>
        <TextInput
          value={profitAmount}
          onChangeText={setProfitAmount}
          style={styles.input}
          placeholder="Profit From Order"
          keyboardType="numeric"
        />

        {/* Device Warranty*/}
        <Text style={[styles.label, { marginTop: 10 }]}>
          * Enter Warranty. This will show to users if he is a user of Mobile
          Solution Application and using the same number or alternative number
          for Mobile Solution App Account. He can see order status, order
          details, order images.
        </Text>
        <TextInput
          value={deviceWarranty}
          onChangeText={setDeviceWarranty}
          style={[styles.input, { height: 50 }]} // Adjust height for multiline
          placeholder="Device Warranty"
          multiline
        />

        <View style={{ marginBottom: 30 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>

        <View style={styles.horizontalButtons}>
          <TouchableOpacity
            style={styles.horizontalButton}
            onPress={handleCall}
          >
            <Text style={styles.buttonText}>
              <Icon name="call" size={25} color="#ffffff" />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.horizontalButton}
            onPress={handleMessage}
          >
            <Text style={styles.buttonText}>
              <Icon name="chatbox-ellipses" size={25} color="#ffffff" />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.horizontalButton}
            onPress={handleWhatsApp}
          >
            <Text style={styles.buttonText}>
              <Icon name="logo-whatsapp" size={25} color="#ffffff" />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.horizontalButton}
            onPress={handlePrint}
          >
            <Text style={styles.buttonText}>
              <Icon name="print" size={25} color="#ffffff" />
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Toast component */}
      <Toast message={toastMessage} visible={toastVisible} type={toastType} />
      {/* Select Model Dialog */}
      <SelectModelDialog
        visible={isDialogVisible}
        onClose={closeDialog}
        customerDetails={customerDetails}
        onSelectModel={(selectedModel) => setCustomerModel(selectedModel)}
      />
      {/* Bottom Sheet Modal */}
      <BottomSheetModal
        visible={isBottomSheetVisible}
        onClose={closeBottomSheet}
        headerText="Add Customer Details"
        onAddCustomer={handleAddCustomer}
        setCustomerDetails={setCustomerDetails}
      />

      <CustomerKyc visible={kycVisible} onClose={() => setKycVisible(false)} />

      {isScannerVisible && (
        <BarcodeScanner
          onScan={handleScan}
          onClose={() => setScannerVisible(false)}
        />
      )}

      {/* Pattern Lock Modal */}
      {/* <PatternLock
        visible={isPatternModalVisible}
        onClose={handleClosePatternLock}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    padding: 10,
    // Add any additional styles for the form container
  },
  label: {
    color: "#ffffff",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 5,
    padding: 10,
    // marginBottom: 10,
  },
  picker: {
    height: 50,
    backgroundColor: "#ffffff",
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#002244",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 5,
    // height:'100%',
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
  },
  footer: {
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 10,
    backgroundColor: "#ffffff",
  },
  submitButton: {
    backgroundColor: "#002244",
    padding: 15,

    borderRadius: 5,
    width: "90%",
    alignItems: "center",
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
  },
  horizontalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
    height: 50,
    marginBottom: 5,
  },
  horizontalButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    backgroundColor: "#002244",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    alignItems: "center",
  },
  picker: {
    width: 360,
    backgroundColor: "#fafafa",
  },
  dropdownContainer: {
    width: 200,
    marginTop: 5, // Adjust the margin to position it just below the picker
  },
  customerDetails: {
    flex: 1,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#ffffff",
    padding: 10,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
});

export default NewRecord;
