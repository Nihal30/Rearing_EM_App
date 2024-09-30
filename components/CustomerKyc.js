import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
// Import RadioButton if using react-native-paper
import { RadioButton } from "react-native-paper";

const CustomerKyc = ({ visible, onClose }) => {
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [openNote, setOpenNote] = useState(false);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      setImages((prevImages) => [...prevImages, result.assets[0]]);
    }
  };

  const handleVideoPick = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });

    if (!result.canceled) {
      setVideo(result.assets[0]);
    }
  };

  const handleTermsOpen = () => {
    setOpenNote(true);
  };

  const handleAcceptTerms = () => {
    setTermsAccepted(true);
    setOpenNote(false); // Close the modal after accepting terms
  };

  const handleDone = () => {
    if (termsAccepted) {
      console.log("Images:", images);
      console.log("Video:", video);
      onClose();
    } else {
      Alert.alert("Error", "You must accept the terms and conditions.");
    }
  };

  return (
    <View>
      <Modal
        transparent={true}
        visible={visible}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalBackground}>
          <View style={styles.dialogBox}>
            <Text style={styles.dialogTitle}>Customer KYC</Text>

            <View style={styles.buttonContainer}>
              {/* First Row of Buttons */}
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={handleImagePick}
                >
                  <Text style={styles.buttonText}>Camera 1</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={handleImagePick}
                >
                  <Text style={styles.buttonText}>Camera 2</Text>
                </TouchableOpacity>
              </View>
              {/* Third Row of Buttons */}
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={handleImagePick}
                >
                  <Text style={styles.buttonText}>Camera 3</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={handleImagePick}
                >
                  <Text style={styles.buttonText}>Camera 4</Text>
                </TouchableOpacity>
              </View>

              {/* Second Row of Buttons */}
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={handleVideoPick}
                >
                  <Text style={styles.buttonText}>Video</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={handleTermsOpen}
                >
                  <Text style={styles.buttonText}>Note</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* <View style={styles.termsContainer}>
              <Text>Accept Terms and Conditions</Text>
              <TouchableOpacity onPress={handleAcceptTerms}>
                <Text style={styles.acceptButton}>I Agree</Text>
              </TouchableOpacity>
            </View> */}

            {/* Done and Cancel buttons */}
            <View style={styles.actionContainer}>
              <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
                <Text style={[styles.buttonText, { color: "#ffffff" }]}>
                  Done
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={openNote}
        animationType="slide"
        onRequestClose={() => setOpenNote(false)} // Close the modal when pressing back
      >
        <View style={styles.modalBackground}>
          <View
            style={[
              styles.dialogBox,
              { height: "80%", justifyContent: "space-between" },
            ]}
          >
            <View>
              <Text style={styles.dialogTitle}>Terms and Conditions</Text>
              <Text>Please read and accept the terms.</Text>
              <RadioButton.Group
                onValueChange={handleAcceptTerms}
                value={termsAccepted ? "accepted" : "notAccepted"}
              >
                <View style={styles.radioContainer}>
                  <RadioButton value="accepted" />
                  <Text>I Accept</Text>
                </View>
                {/* <View style={styles.radioContainer}>
                  <RadioButton value="notAccepted" />
                  <Text>I Do Not Accept</Text>
                </View> */}
              </RadioButton.Group>
            </View>
            <View style={{ height: 50 }}>
              <TouchableOpacity
                style={[styles.doneButton, { height: 50 }]} // Set a fixed height for the button
                onPress={handleAcceptTerms}
              >
                <Text style={[styles.buttonText, { color: "#ffffff" }]}>
                  Accept
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
  buttonContainer: {
    width: "100%",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  iconButton: {
    width: "48%", // Set width to nearly half for two buttons
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  buttonText: {
    fontSize: 24,
  },
  termsContainer: {
    marginBottom: 20,
  },
  acceptButton: {
    color: "#DE3163",
    fontWeight: "bold",
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  doneButton: {
    backgroundColor: "#DE3163",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
});

export default CustomerKyc;
