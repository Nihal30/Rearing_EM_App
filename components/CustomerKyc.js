import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { RadioButton } from "react-native-paper";
// import Video from "react-native-video";

const CustomerKyc = ({ visible, onClose, customerKyc, setCustomerKyc }) => {
  const [images, setImages] = useState([null, null, null, null]);
  const [video, setVideo] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [openNote, setOpenNote] = useState(false);

  useEffect(() => {
    if (customerKyc) {
      setImages(Array.isArray(customerKyc?.Images) ? customerKyc.Images : [null, null, null, null]);
      setVideo(customerKyc?.Video || null);
      setTermsAccepted(customerKyc?.termsAccepted || false);
    }
  }, [customerKyc]);

  const handleImagePick = async (index) => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      setImages((prevImages) => {
        const newImages = [...prevImages];
        newImages[index] = result.assets[0];
        return newImages;
      });
    }
  };

  const handleVideoPick = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });

    if (!result.canceled) {
      setVideo(result.assets[0]); // Set the video state
    }
  };

  const handleTermsOpen = () => {
    setOpenNote(true);
  };

  const handleAcceptTerms = () => {
    setTermsAccepted(true);
    setOpenNote(false);
  };

  const handleDone = () => {
    if (termsAccepted) {
      console.log("Images:", images);
      console.log("Video:", video);
      setCustomerKyc({ Images: images, Video: "", Terms: termsAccepted });
      onClose();
    } else {
      Alert.alert("Error", "You must accept the terms and conditions.");
    }
  };

  const handleCancel = () => {
    // Reset all states
    setImages([null, null, null, null]);
    setVideo(null);
    setTermsAccepted(false);
    setOpenNote(false);
    onClose(); // Call the onClose function to close the modal
  };

  return (
    <View>
      <Modal
        transparent={true}
        visible={visible}
        animationType="slide"
        onRequestClose={handleCancel} // Update to reset state on close
      >
        <View style={styles.modalBackground}>
          <View style={styles.dialogBox}>
            <Text style={styles.dialogTitle}>Customer KYC</Text>

            <View style={styles.buttonContainer}>
              {/* First Row of Buttons or Image Previews */}
              <View style={styles.row}>
                {(Array.isArray(images) ? images.slice(0, 2) : []).map((image, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.iconButton}
                    onPress={() => handleImagePick(index)}
                  >
                    {image ? (
                      <Image source={{ uri: image.uri }} style={styles.previewImage} />
                    ) : (
                      <Text style={styles.buttonText}>Camera {index + 1}</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Second Row of Buttons or Image Previews */}
              <View style={styles.row}>
                {(Array.isArray(images) ? images.slice(2, 4) : []).map((image, index) => (
                  <TouchableOpacity
                    key={index + 2}
                    style={styles.iconButton}
                    onPress={() => handleImagePick(index + 2)}
                  >
                    {image ? (
                      <Image source={{ uri: image.uri }} style={styles.previewImage} />
                    ) : (
                      <Text style={styles.buttonText}>Camera {index + 3}</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Video Button or Preview */}
              <View style={styles.row}>
                {/* Uncomment the code below if using the Video component */}
                {/* {video ? (
                  <Video
                    source={{ uri: video.uri }} // Ensure video URI is correctly set
                    style={styles.previewVideo}
                    controls={true} // Allow user to control video playback
                    resizeMode="contain" // Ensure video fits within the bounds
                    onError={(error) => console.log("Video Error:", error)} // Log any video errors
                  />
                ) : (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={handleVideoPick}
                >
                  <Text style={styles.buttonText}>Record Video</Text>
                </TouchableOpacity>
                 )}  */}

                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={handleTermsOpen}
                >
                  <Text style={styles.buttonText}>Note</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Done and Cancel buttons */}
            <View style={styles.actionContainer}>
              <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
                <Text style={[styles.buttonText, { color: "#ffffff" }]}>
                  Done
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
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
        onRequestClose={() => setOpenNote(false)}
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
              </RadioButton.Group>
            </View>
            <View style={{ height: 50 }}>
              <TouchableOpacity
                style={[styles.doneButton, { height: 50 }]}
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
    height: "90%",
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
    width: "48%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  buttonText: {
    fontSize: 24,
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
  previewImage: {
    width: "100%",
    height: 100,
    borderRadius: 10,
  },
  previewVideo: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
});

export default CustomerKyc;
