import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ScrollView,
  Linking,
  Button,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
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
import Checkbox from "expo-checkbox";
import { MaterialIcons } from "@expo/vector-icons";
import { v4 as uuidv4 } from "uuid";
const NewRecord = () => {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState("");
  const [customerModel, setCustomerModel] = useState("");
  const [problems, setProblems] = useState("");
  const [price, setPrice] = useState("");
  const [paid, setPaid] = useState("");
  const [lockCode, setLockCode] = useState("");
  const [pattern, setPattern] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(null);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [dateService, setDateService] = useState(new Date());
  const [timeService, setTimeService] = useState(new Date());
  const [isYesSelected, setIsYesSelected] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success"); // 'success' or 'error'
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Pending", value: "Pending" },
    { label: "Repaired", value: "Repaired" },
    { label: "Delivered", value: "Delivered" },
    { label: "Canceled", value: "Canceled" },
  ]);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [customerDetails, setCustomerDetails] = useState([]);
  const [kycVisible, setKycVisible] = useState(false);

  const [deviceWarranty, setDeviceWarranty] = useState("");
  const [profitAmount, setProfitAmount] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [owner, setOwner] = useState("");

  const [selectedLocation, setSelectedLocation] = useState("inHouse"); // Default selection
  const [serviceCenterName, setServiceCenterName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [contactNoError, setContactNoError] = useState(false);

  const [barcode, setBarcode] = useState("");
  const [isScannerVisible, setScannerVisible] = useState(false);
  const [problemList, setProblemList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [previous, setPrevious] = useState(null);
  const [customerKyc, setCustomerKyc] = useState({});
  const [isPowerSelected, setIsPowerSelected] = useState(false); // For Power Adapter
  const [isKeyboardSelected, setIsKeyboardSelected] = useState(false); // For Keyboard/Mouse
  const [isOtherDeviceSelected, setIsOtherDeviceSelected] = useState(false); // For Other Device
  const [validation, setValidation] = useState({
    orderError: false,
    customerError: false,
    modalError: false,
    problemError: false,
    timeError: false,
    dateError: false,
  });
  const [updateCustomer, setUpdateCustomer] = useState(null);

  // console.log("validation", validation);
  const [model, setModel] = useState("");
  const [toast, setToast] = useState({ visible: false, message: "", type: "" });

  const handlePowerSelection = () => {
    setPowerSelected((prev) => !prev);
  };

  const handleKeyboardSelection = () => {
    setKeyboardSelected((prev) => !prev);
  };

  const handleOtherDeviceSelection = () => {
    setOtherDeviceSelected((prev) => !prev);
  };

  const addProblem = () => {
    if (problems.trim()) {
      setProblemList([...problemList, { text: problems, checked: false }]);
      setProblems("");
    }
  };

  const toggleCheckbox = (index) => {
    const updatedList = [...problemList];
    updatedList[index].checked = !updatedList[index].checked;
    setProblemList(updatedList);
  };

  const [isPatternModalVisible, setIsPatternModalVisible] = useState(false);

  // edit the form
  const { OldFormData } = useLocalSearchParams();

  const handleOpenPatternLock = () => {
    setIsPatternModalVisible(true);
  };

  const handleClosePatternLock = () => {
    setIsPatternModalVisible(false);
  };

  const handleScan = (data) => {
    setBarcode(data); // Set the scanned data in the input
    setScannerVisible(false); // Hide the scanner
  };

  const handleAddCustomer = (details) => {
    setCustomerDetails([...customerDetails, details]);
    // console.log("Customer Details Added:", details);
  };

  const openBottomSheet = () => {
    setBottomSheetVisible(true);
    setUpdateCustomer(null);
  };

  const closeBottomSheet = () => {
    setBottomSheetVisible(false);
  };

  // customer modal open
  const openDialog = () => {
    setDialogVisible(true);
  };

  const closeDialog = () => {
    setDialogVisible(false);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentTime);
  };

  const onDateChangeService = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowDatePicker(false);
    setDateService(currentDate);
  };

  const onTimeChangeService = (event, selectedTime) => {
    const currentTime = selectedTime;
    setShowDatePicker(false);
    setTimeService(currentTime);
  };

  // footer function ---
  const dummyNumber = "1234567890";
  const message = "Hello";

  const handleCall = () => {
    Linking.openURL(`tel:${customerList[0]?.phone}`);
  };

  const handleMessage = () => {
    Linking.openURL(
      `sms:${customerList[0]?.phone}?body=${encodeURIComponent(message)}`
    );
  };

  const handleWhatsApp = () => {
    Linking.openURL(
      `whatsapp://send?text=${encodeURIComponent(message)}&phone=${
        customerList[0]?.phone
      }`
    );
  };

  const handlePrint = async () => {
    try {
      console.log("Preparing to download PDF...");

      //   // Prepare the HTML content for the PDF
      //   const htmlContent = `
      //     <html>
      //       <head>
      //         <style>
      //           body { font-family: Arial, sans-serif; }
      //           h1 { color: #DE3163; }
      //           p { margin: 5px 0; }
      //         </style>
      //       </head>
      //       <body>
      //         <h1>Record Details</h1>
      //         <p><strong>Customer Model:</strong> ${customerModel}</p>
      //         <p><strong>Problems:</strong> ${problems}</p>
      //         <p><strong>Price:</strong> ${price}</p>
      //         <p><strong>Paid:</strong> ${paid}</p>
      //         <p><strong>Lock Code:</strong> ${lockCode}</p>
      //         <p><strong>Barcode:</strong> ${barcode}</p>
      //       </body>
      //     </html>
      //   `;

      //   // Create a PDF from the HTML
      //   const { uri } = await Print.printToFileAsync({ html: htmlContent });

      //   // Log the temporary URI of the generated PDF
      //   console.log('PDF generated at temporary URI:', uri);

      //   // Define the destination file path
      //   const fileUri = `${FileSystem.documentDirectory}record.pdf`;

      //   // Move the generated PDF to the desired location
      //   await FileSystem.moveAsync({
      //     from: uri,
      //     to: fileUri,
      //   });

      //    // Log the final file URI
      // console.log('PDF downloaded to:', fileUri);

      // Show the toast with success message
      setToastMessage("PDF downloaded successfully!");
      setToastType("success"); // Set type to success
      setToastVisible(true);

      // Hide the toast after 3 seconds
      setTimeout(() => {
        setToastVisible(false);
      }, 3000);
      // Optionally, open the PDF file after download (if you want)
      // await Sharing.shareAsync(fileUri); // Uncomment if you want to share the file
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Show the toast with error message
      setToastMessage("Error downloading PDF.");
      setToastType("error"); // Set type to error
      setToastVisible(true);

      // Hide the toast after 3 seconds
      setTimeout(() => {
        setToastVisible(false);
      }, 3000);
    }
  };

  // ----

  // Form submit
  const { formData, setFormData, addData, updateData } =
    useContext(FormDataContext);

  const [formDataId, setFormDataId] = useState(null); // State for managing form data ID

  const generateCustomId = () => {
    const timestamp = Date.now().toString(); // Current timestamp as a string
    const randomNum = Math.floor(Math.random() * 1000).toString();
    // Random number between 0 and 999
    return `ID-${timestamp}-${randomNum}`; // Constructed ID
  };

  const handleSubmit = async () => {
    // Validation: Check for required fields
    if (
      !value ||
      !customerList.length ||
      !problemList.length ||
      !date ||
      !model ||
      !time
    ) {
      const newValidation = {
        orderError: !value && true,
        customerError: !customerList.length && true,
        modalError: !model && true,
        problemError: !problemList.length && true,
        timeError: !time && true,
        dateError: !date && true,
      };

      setValidation(newValidation);
      return; // Exit the function if validation fails
    }

    const newFormData = {
      id: formDataId || generateCustomId(), // Use existing ID if available, otherwise generate a new one
      orderDetails: value,
      customerDetails: {
        customerList: customerList,
        AllCustomerDetails: customerDetails,
      },
      problems: problemList,
      price: price,
      paid: paid,
      lockCode: lockCode,
      barcode: barcode,
      date: date,
      time: time,
      owner: owner,
      isYesSelected: isYesSelected,
      deviceWarranty: deviceWarranty, // Optional
      profitAmount: profitAmount,
      additionalDetails: additionalDetails, // Optional
      customerKyc: customerKyc,
      model: model,
      selectedLocation: selectedLocation,
      pattern: pattern,
      accessories: {
        isPowerSelected: isPowerSelected,
        isKeyboardSelected: isKeyboardSelected,
        isOtherDeviceSelected: isOtherDeviceSelected,
      },
      serviceCenterName:
        selectedLocation === "serviceCenter" ? serviceCenterName : "",
      contactNo: selectedLocation === "serviceCenter" ? contactNo : "",
      serviceDate:dateService,
      serviceTime:timeService


    };

    try {
      // Check if OldFormData is defined
      if (OldFormData) {
        // Parse OldFormData if it's a string
        const previousFormData =
          typeof OldFormData === "string"
            ? JSON.parse(OldFormData)
            : OldFormData;

        // Update existing item if it is found
        console.log("Updating existing entry with ID:", previousFormData.id);
        await updateData(previousFormData.id, newFormData);

        setToast({
          visible: true,
          message: "Data updated successfully!",
          type: "success",
        });
      } else {
        // If OldFormData is undefined, add new item
        console.log("Adding new entry with ID:", newFormData.id);
        await addData(newFormData);

        setToast({
          visible: true,
          message: "Data added successfully!",
          type: "success",
        });
      }

      // Navigate to another screen
      router.push("/");
      resetForm();

      // Hide the toast after 3 seconds
      setTimeout(() => {
        setToast({ visible: false, message: "", type: "" });
      }, 3000);
    } catch (error) {
      console.error("Error saving data", error);

      setToast({
        visible: true,
        message: "Failed to save data!",
        type: "error",
      });

      // Hide the toast after 3 seconds
      setTimeout(() => {
        setToast({ visible: false, message: "", type: "" });
      }, 3000);
    }
  };

  // Function to reset all form values
  const resetForm = () => {
    setFormDataId(""); // Clear the ID
    setOrderDetails("");
    setCustomerModel("");
    setProblems("");
    setPrice("");
    setPaid("");
    setLockCode("");
    setShowDatePicker(false);
    setShowTimePicker(false);
    setDate("");
    setTime("");
    setIsYesSelected(false);
    setToastVisible(false);
    setToastMessage("");
    setToastType("success");
    setOpen(false);
    setValue(null);
    setModel("");
    setItems([
      { label: "Laptop", value: "Laptop" },
      { label: "Hp", value: "Hp" },
      { label: "My", value: "My" },
    ]);
    setDialogVisible(false);
    setBottomSheetVisible(false);
    setCustomerDetails([]);
    setKycVisible(false);
    setDeviceWarranty("");
    setProfitAmount("");
    setAdditionalDetails("");
    setOwner("");
    setSelectedLocation("inHouse");
    setServiceCenterName("");
    setContactNo("");
    setBarcode("");
    setScannerVisible(false);
    setIsPatternModalVisible(false);
  };

  useEffect(() => {
    if (OldFormData !== undefined) {
      if (typeof OldFormData === "string") {
        try {
          // Parse the JSON string
          const previousFormData = JSON.parse(OldFormData);
          console.log("previousFormData", previousFormData);

          if (previousFormData) {
            setValue(previousFormData?.orderDetails);
            setCustomerList(previousFormData?.customerDetails?.customerList);
            setCustomerDetails(
              previousFormData?.customerDetails?.AllCustomerDetails
            );
            setProblemList(previousFormData?.problems);
            setPrice(previousFormData?.price);
            setPaid(previousFormData?.paid);
            setDate(previousFormData?.date);
            setTime(previousFormData?.time);
            setOwner(previousFormData?.owner);
            setAdditionalDetails(previousFormData?.additionalDetails);
            setDeviceWarranty(previousFormData?.deviceWarranty);
            setProfitAmount(previousFormData?.profitAmount);
            setBarcode(previousFormData?.barcode);
            setCustomerKyc(previousFormData?.customerKyc);
            setModel(previousFormData?.model);
            setPattern(previousFormData?.pattern);
            setLockCode(previousFormData?.lockCode);
            // Set accessory selections if available
            setIsPowerSelected(previousFormData?.accessories?.isPowerSelected);
            setIsKeyboardSelected(
              previousFormData?.accessories?.isKeyboardSelected
            );
            setIsOtherDeviceSelected(
              previousFormData?.accessories?.isOtherDeviceSelected
            );
            setSelectedLocation(previousFormData.selectedLocation);


            // Check the selected location
            const location = previousFormData.selectedLocation; // Get selectedLocation
            if (location === "serviceCenter") {
              // Set contact number correctly
              setContactNo(previousFormData?.contactNo || "");
              setServiceCenterName(previousFormData?.serviceCenterName || "");
              console.log('previousFormData?.serviceDate', previousFormData?.serviceDate)
              setTimeService(previousFormData?.serviceTime || new Date())
              setDateService(previousFormData?.serviceDate || new Date())

            } else if (location === "inHouse") {
              // Optionally clear service center details if inHouse is selected
              setContactNo("");
              setServiceCenterName("");
            }
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      } else {
        console.error("OldFormData is not a valid string:", OldFormData);
      }
    }
    console.log("OldFormData", OldFormData);
  }, [OldFormData]);

  const onSelectModel = async (item) => {
    await setCustomerList((prevDetails) => {
      // Check if the item is already in the list
      if (prevDetails.find((detail) => detail.id === item.id)) {
        return prevDetails; // If already selected, do not add again
      }
      return [...prevDetails, item];
    });
    console.log("customerList", customerList);
  };

  const removeItem = (name, phone) => {
    setCustomerList((prevList) =>
      prevList.filter((item) => item.name !== name || item.phone !== phone)
    );
  };

  const removeProblemsItem = (indexToRemove) => {
    setProblemList((prevList) =>
      prevList.filter((item, index) => index !== indexToRemove)
    );
  };
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    // Clean up listeners on unmount
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const openBottomSheetForUpdate = (customer) => {
    console.log("item customer", customer);
    setUpdateCustomer(customer);

    setBottomSheetVisible(true);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#ffffff",
        // display: isScannerVisible ? "none" : "block",
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "#ffffff",
          display: isScannerVisible ? "none" : "block",
        }}
      >
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
            style={[styles.picker, validation.orderError && styles.errorInput]}
            dropDownContainerStyle={styles.dropdownContainer}
          />
          {validation.orderError && (
            <Text style={{ margin: 10, color: "red" }}>
              Please select order type
            </Text>
          )}

          <View
            style={[
              styles.customerDetails,
              { borderRadius: 10, marginTop: 10 },
              validation.customerError && styles.errorInput,
            ]}
          >
            <Text style={styles.label}>Customer Details</Text>

            {/* Buttons for Select and Add */}
            {customerList?.length > 0 &&
              customerList?.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.customerDetails,
                    {
                      margin: 10,
                      borderRadius: 10,
                      justifyContent: "space-between",
                      flexDirection: "row",
                      alignItems: "center",
                    },
                  ]}
                  onPress={() => openBottomSheetForUpdate(item)}
                >
                  <View>
                    <Text style={{ fontFamily: "outfit", borderRadius: 10 }}>
                      Name : {item.name}
                    </Text>
                    {item.phone && (
                      <Text style={{ fontFamily: "outfit", borderRadius: 10 }}>
                        Phone : {item.phone}
                      </Text>
                    )}

                    {item.address && (
                      <Text style={{ fontFamily: "outfit", borderRadius: 10 }}>
                        Address : {item.address}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#D3D3D3",
                      padding: 2,
                      borderRadius: 30,
                    }}
                    onPress={() => removeItem(item.name, item.phone)}
                  >
                    <MaterialIcons name="close" size={24} color="red" />
                  </TouchableOpacity>
                </TouchableOpacity>
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
                editable={false}
                value={customerModel}
                // onChangeText={setCustomerModel}
                style={[styles.input, { width: 190 }]}
                placeholder="Select customers "
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
          {validation.customerError && (
            <Text style={{ margin: 10, color: "red" }}>
              Please select customer
            </Text>
          )}
          <Text style={[styles.label, { marginTop: 10 }]}>Model</Text>

          <TextInput
            value={model}
            onChangeText={setModel}
            style={[
              styles.input,
              { height: 50, marginTop: 2 },
              validation.modalError && styles.errorInput,
            ]} // Adjust height for multiline
            placeholder="Model"
            multiline
          />
          {validation.modalError && (
            <Text style={{ margin: 10, color: "red" }}>Please add model</Text>
          )}

          {/* Multiline Input for Problems */}
          <Text style={[styles.label, { marginTop: 10 }]}>Write Problems:</Text>
          {problemList?.length > 0 && (
            <ScrollView
              style={{
                borderWidth: 0.8,
                margin: 2,
                marginBottom: 5,
                borderRadius: 10,
              }}
            >
              {problemList.map((item, index) => (
                <View
                  key={index}
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    gap: 10,
                    margin: 10,
                    marginLeft: 12,
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      gap: 10,
                      margin: 10,
                      marginLeft: 12,
                      alignItems: "center",
                    }}
                  >
                    <Checkbox
                      value={item.checked}
                      onValueChange={() => toggleCheckbox(index)}
                      style={{ color: "gray" }}
                    />
                    <Text style={item.checked && styles.checkedText}>
                      {item.text}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={{
                      backgroundColor: "#D3D3D3",
                      padding: 1,
                      borderRadius: 30,
                    }}
                    onPress={() => removeProblemsItem(index)}
                  >
                    <MaterialIcons name="close" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
          <View style={{ flex: 1, width: "100%" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                width: "100%",
              }}
            >
              <TextInput
                value={problems}
                onChangeText={setProblems}
                style={[
                  styles.input,
                  { width: "75%" },
                  validation.problemError && styles.errorInput,
                ]}
                placeholder="Describe problems"
              />
              <TouchableOpacity
                style={[
                  styles.button,
                  { height: 50, width: 70, borderRadius: 10 },
                ]}
                onPress={addProblem}
              >
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>

          {validation.problemError && (
            <Text style={{ margin: 10, color: "red" }}>
              Please add problems list
            </Text>
          )}

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
          <Text style={[styles.label, { marginTop: 10 }]}>Lock Code:</Text>
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
                Pattern
              </Text>
            </TouchableOpacity>
          </View>

          {/* Date Picker */}
          <Text style={[styles.label, { marginTop: 10 }]}>Select Date:</Text>
          {date && (
            <View
              style={{
                backgroundColor: "#ffffff",
                padding: 10,
                margin: 10,
                borderWidth: 1,
                borderRadius: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontFamily: "outfit-medium" }}>
                Date: {date ? moment(date).format("DD MMM YYYY") : ""}
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: "#D3D3D3",
                  padding: 2,
                  borderRadius: 30,
                }}
                onPress={() => setDate(new Date())}
              >
                {/* <MaterialIcons name="close" size={24} color="red" /> */}
              </TouchableOpacity>
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
            <View
              style={{
                backgroundColor: "#ffffff",
                padding: 10,
                margin: 10,
                borderWidth: 1,
                borderRadius: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontFamily: "outfit-medium" }}>
                Time: {time ? moment(time).format("HH:mm") : ""}
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: "#D3D3D3",
                  padding: 2,
                  borderRadius: 30,
                }}
                onPress={() => setTime(new Date())}
              >
                {/* <MaterialIcons name="close" size={24} color="red" /> */}
              </TouchableOpacity>
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
                justifyContent: "space-between",
              }}
            >
              <Text style={[styles.label, { marginTop: 10, width: 200 }]}>
                Power Adapter
              </Text>
              <View
                style={[styles.radioGroup, { flex: 1, flexDirection: "row" }]}
              >
                <RadioButton
                  value="yes"
                  status={isPowerSelected === true ? "checked" : "unchecked"}
                  onPress={() => setIsPowerSelected(true)}
                />
                <Text style={[styles.label, { marginTop: 8 }]}>Yes</Text>
                <RadioButton
                  value="no"
                  status={isPowerSelected === false ? "checked" : "unchecked"}
                  onPress={() => setIsPowerSelected(false)}
                />
                <Text style={[styles.label, { marginTop: 8 }]}>No</Text>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={[styles.label, { marginTop: 10, width: 200 }]}>
                Keyboard/Mouse
              </Text>
              <View
                style={[styles.radioGroup, { flex: 1, flexDirection: "row" }]}
              >
                <RadioButton
                  value="yes"
                  status={isKeyboardSelected === true ? "checked" : "unchecked"}
                  onPress={() => setIsKeyboardSelected(true)}
                />
                <Text style={[styles.label, { marginTop: 8 }]}>Yes</Text>
                <RadioButton
                  value="no"
                  status={
                    isKeyboardSelected === false ? "checked" : "unchecked"
                  }
                  onPress={() => setIsKeyboardSelected(false)}
                />
                <Text style={[styles.label, { marginTop: 8 }]}>No</Text>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={[styles.label, { marginTop: 10, width: 200 }]}>
                Other Device
              </Text>
              <View
                style={[styles.radioGroup, { flex: 1, flexDirection: "row" }]}
              >
                <RadioButton
                  value="yes"
                  status={
                    isOtherDeviceSelected === true ? "checked" : "unchecked"
                  }
                  onPress={() => setIsOtherDeviceSelected(true)}
                />
                <Text style={[styles.label, { marginTop: 8 }]}>Yes</Text>
                <RadioButton
                  value="no"
                  status={
                    isOtherDeviceSelected === false ? "checked" : "unchecked"
                  }
                  onPress={() => setIsOtherDeviceSelected(false)}
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
            style={[
              styles.customerDetails,
              { borderRadius: 10, marginTop: 10 },
            ]}
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
                    onChangeText={(text) => {
                      setContactNo(text);
                      if (text.length !== 10) {
                        setContactNoError(true); // Set error if not 10 digits
                      } else {
                        setContactNoError(false); // Clear error if valid
                      }
                    }}
                    style={[
                      styles.input,
                      {
                        height: 50,
                        marginTop: 10,
                        borderColor: contactNoError ? "red" : "gray",
                      },
                    ]}
                    placeholder="Contact No"
                    keyboardType="phone-pad"
                  />

                  {/* Date Picker */}
                  <Text style={[styles.label, { marginTop: 10 }]}>
                    Select Date:
                  </Text>
                  {dateService && (
                    <View
                      style={{
                        backgroundColor: "#ffffff",
                        padding: 10,
                        margin: 10,
                        borderWidth: 1,
                        borderRadius: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={{ fontFamily: "outfit-medium" }}>
                        Date:{" "}
                        {dateService
                          ? moment(dateService).format("DD MMM YYYY")
                          : ""}
                      </Text>
                      <TouchableOpacity
                        style={{
                          backgroundColor: "#D3D3D3",
                          padding: 2,
                          borderRadius: 30,
                        }}
                        onPress={() => dateService(new Date())}
                      >
                        {/* <MaterialIcons name="close" size={24} color="red" /> */}
                      </TouchableOpacity>
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
                      value={dateService}
                      mode="date"
                      display="default"
                      onChange={onDateChangeService}
                    />
                  )}

                  {/* Time Picker */}
                  <Text style={styles.label}>Select Repair Time:</Text>
                  {timeService && (
                    <View
                      style={{
                        backgroundColor: "#ffffff",
                        padding: 10,
                        margin: 10,
                        borderWidth: 1,
                        borderRadius: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={{ fontFamily: "outfit-medium" }}>
                        Time:{" "}
                        {timeService ? moment(timeService).format("HH:mm") : ""}
                      </Text>
                      <TouchableOpacity
                        style={{
                          backgroundColor: "#D3D3D3",
                          padding: 2,
                          borderRadius: 30,
                        }}
                        onPress={() => setTimeService(new Date())}
                      >
                        {/* <MaterialIcons name="close" size={24} color="red" /> */}
                      </TouchableOpacity>
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
                      value={timeService}
                      mode="time"
                      display="default"
                      onChange={onTimeChangeService}
                    />
                  )}

                  {contactNoError && (
                    <Text
                      style={{ marginTop: 5, marginBottom: 10, color: "red" }}
                    >
                      Add 10 digit number
                    </Text>
                  )}
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
                      onPress={() => Linking.openURL(`tel:${contactNo}`)}
                      style={[
                        styles.button,
                        { height: "100%", width: 90, borderRadius: 10 },
                      ]}
                    >
                      <Icon name="call" size={25} color="#ffffff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL(
                          `whatsapp://send?text=${encodeURIComponent(
                            message
                          )}&phone=${contactNo}`
                        )
                      }
                      style={[
                        styles.button,
                        { height: "100%", width: 90, borderRadius: 10 },
                      ]}
                    >
                      <Icon name="logo-whatsapp" size={25} color="#ffffff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL(
                          `sms:${contactNo}?body=${encodeURIComponent(message)}`
                        )
                      }
                      style={[
                        styles.button,
                        { height: "100%", width: 90, borderRadius: 10 },
                      ]}
                    >
                      <Icon name="chatbox-ellipses" size={25} color="#ffffff" />
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
        {!isKeyboardVisible && (
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
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
        )}
      </View>

      {/* Toast component */}
      <Toast
        message={toastMessage}
        visible={toastVisible}
        type={toastType}
        onClose={() => setToastVisible(false)}
      />
      {/* Select Model Dialog */}
      <SelectModelDialog
        visible={isDialogVisible}
        onClose={closeDialog}
        customerDetails={customerDetails}
        onSelectModel={onSelectModel}
        setCustomerList={setCustomerList}
        customerList={customerList}
      />
      {/* Bottom Sheet Modal */}
      <BottomSheetModal
        visible={isBottomSheetVisible}
        onClose={closeBottomSheet}
        headerText="Add Customer Details"
        onAddCustomer={handleAddCustomer}
        setCustomerDetails={setCustomerDetails}
        updateCustomer={updateCustomer}
        setCustomerList={setCustomerList}
      />

      <CustomerKyc
        visible={kycVisible}
        onClose={() => setKycVisible(false)}
        customerKyc={customerKyc}
        setCustomerKyc={setCustomerKyc}
      />

      {isScannerVisible && (
        <BarcodeScanner
          onScan={handleScan}
          onClose={() => setScannerVisible(false)}
        />
      )}

      {/* Pattern Lock Modal */}
      <PatternLock
        visible={isPatternModalVisible}
        onClose={handleClosePatternLock}
        pattern={pattern}
        setPattern={setPattern}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    display: "none",
  },
  errorInput: {
    borderColor: "red",
  },
  formContainer: {
    flex: 1,
    padding: 10,
    // Add any additional styles for the form container
  },
  label: {
    fontFamily: "outfit",
    margin: 5,
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
    backgroundColor: "#DE3163",
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
    backgroundColor: "#DE3163",
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
    backgroundColor: "#DE3163",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    alignItems: "center",
  },
  picker: {
    width: "100%",
    backgroundColor: "#fafafa",
  },
  dropdownContainer: {
    width: "100%",
    marginTop: 5, // Adjust the margin to position it just below the picker
  },
  customerDetails: {
    flex: 1,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#000000",
    padding: 10,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    borderRadius: 10,
  },
  checkedText: {
    textDecorationLine: "line-through",
    color: "gray",
  },
});

export default NewRecord;
