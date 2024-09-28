import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ScrollView,
  Linking
} from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import * as Print from 'expo-print';            // Importing Print module
import * as FileSystem from 'expo-file-system';  // Importing FileSystem module
// import * as Sharing from 'expo-sharing';  
import Toast from '../../components/Toast'

const NewRecord = () => {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState("");
  const [customerModel, setCustomerModel] = useState("");
  const [problems, setProblems] = useState("");
  const [price, setPrice] = useState("");
  const [paid, setPaid] = useState("");
  const [lockCode, setLockCode] = useState("");
  const [barcode, setBarcode] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [isYesSelected, setIsYesSelected] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success'); // 'success' or 'error'

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

  const handleSubmit = () => {
    // Console log all form data
    console.log({
      orderDetails,
      customerModel,
      problems,
      price,
      paid,
      lockCode,
      barcode,
      date,
      time,
      isYesSelected,
    });
  };

  // footer function ---
  const dummyNumber = '1234567890'; // Dummy phone number
  const message = "Hello, this is a test message."; // Dummy message for WhatsApp

  const handleCall = () => {
    Linking.openURL(`tel:${dummyNumber}`);
  };

  const handleMessage = () => {
    Linking.openURL(`sms:${dummyNumber}?body=${encodeURIComponent(message)}`);
  };

  const handleWhatsApp = () => {
    Linking.openURL(`whatsapp://send?text=${encodeURIComponent(message)}&phone=${dummyNumber}`);
  };

 
  const handlePrint = async () => {
    try {
      console.log('Preparing to download PDF...');
  
    //   // Prepare the HTML content for the PDF
    //   const htmlContent = `
    //     <html>
    //       <head>
    //         <style>
    //           body { font-family: Arial, sans-serif; }
    //           h1 { color: #002244; }
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
    setToastType('success'); // Set type to success
    setToastVisible(true);

    // Hide the toast after 3 seconds
    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
      // Optionally, open the PDF file after download (if you want)
      // await Sharing.shareAsync(fileUri); // Uncomment if you want to share the file
  
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Show the toast with error message
      setToastMessage("Error downloading PDF.");
      setToastType('error'); // Set type to error
      setToastVisible(true);
  
      // Hide the toast after 3 seconds
      setTimeout(() => {
        setToastVisible(false);
      }, 3000);
    }
  };
  
  


  // ----

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
        <Picker
          selectedValue={orderDetails}
          onValueChange={(itemValue) => setOrderDetails(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Order" value="" />
          <Picker.Item label="Order 1" value="order1" />
          <Picker.Item label="Order 2" value="order2" />
        </Picker>

        {/* Customer Details */}
        <Text style={styles.label}>Customer Model:</Text>
        <TextInput
          value={customerModel}
          onChangeText={setCustomerModel}
          style={styles.input}
          placeholder="Enter customer model"
        />

        {/* Multiline Input for Problems */}
        <Text style={styles.label}>Write Problems:</Text>
        <TextInput
          value={problems}
          onChangeText={setProblems}
          style={[styles.input, { height: 100 }]} // Adjust height for multiline
          placeholder="Describe problems"
          multiline
        />

        {/* Button for Customer KYC */}
        <TouchableOpacity style={styles.button}>
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

        <Text style={styles.label}>Paid:</Text>
        <TextInput
          value={paid}
          onChangeText={setPaid}
          style={styles.input}
          placeholder="Enter paid amount"
          keyboardType="numeric"
        />

        {/* Lock Code Input */}
        <Text style={styles.label}>Lock Code:</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInput
            value={lockCode}
            onChangeText={setLockCode}
            style={[styles.input, { flex: 1 }]}
            placeholder="Enter lock code"
          />
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>

        {/* Date Picker */}
        <Text style={styles.label}>Select Date:</Text>
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
        <Text style={styles.label}>Is it urgent?</Text>
        {/* <View style={styles.radioGroup}>
          <RadioButton
            value="yes"
            status={isYesSelected ? 'checked' : 'unchecked'}
            onPress={() => setIsYesSelected(true)}
          />
          <Text style={styles.radioLabel}>Yes</Text>
          <RadioButton
            value="no"
            status={!isYesSelected ? 'checked' : 'unchecked'}
            onPress={() => setIsYesSelected(false)}
          />
          <Text style={styles.radioLabel}>No</Text>
        </View> */}

        {/* Barcode Input */}
        <Text style={styles.label}>Barcode:</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInput
            value={barcode}
            onChangeText={setBarcode}
            style={[styles.input, { flex: 1 }]}
            placeholder="Enter or scan barcode"
          />
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Scan</Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginBottom: 30 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>

        <View style={styles.horizontalButtons}>
          <TouchableOpacity style={styles.horizontalButton} onPress={handleCall}>
            <Text style={styles.buttonText}>
              <Icon name="call" size={25} color="#ffffff" />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.horizontalButton} onPress={handleMessage}>
            <Text style={styles.buttonText}>
              <Icon name="chatbox-ellipses" size={25} color="#ffffff" />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.horizontalButton} onPress={handleWhatsApp}>
            <Text style={styles.buttonText}>
              <Icon name="logo-whatsapp" size={25} color="#ffffff" />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.horizontalButton} onPress={handlePrint}>
            <Text style={styles.buttonText}>
              <Icon name="print" size={25} color="#ffffff" />
            </Text>
          </TouchableOpacity>
        </View>
      </View>
        {/* Toast component */}
        <Toast message={toastMessage} visible={toastVisible} type={toastType} />
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
    marginBottom: 10,
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
});

export default NewRecord;
