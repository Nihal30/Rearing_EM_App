import { Link, useRouter } from "expo-router";
import { Text, View, TouchableOpacity, Image, StyleSheet, Button } from "react-native";
import Hero from '../assets/images/Bg-Hero.jpg'
import NotificationComponent, { triggerNotification } from "../components/NotificationConfig";
import { useState } from "react";

export default function Index() {
  const router = useRouter()
  // const [message, setMessage] = useState(null);

  // const triggerNotification = () => {
  //   setMessage('Notification is working now !');

  //   setTimeout(() => {
  //     setMessage(null);  // Reset the state after notification
  //   }, 1000); 
  // };
  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "#DE3163",
          padding: 10,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#ffffff",
            fontFamily: "outfit-medium",
            fontSize: 20,
            marginTop: 40,
          }}
        >
          COMPUTER EMPIRE
        </Text>
      </View>

      

      {/* Body */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginTop:-200,
        
        }}
      >
         {/* Hero Image */}
       <Image
          source={Hero} // Replace with your image path
          style={styles.heroImage}
          resizeMode="contain" // Adjusts the image to fit while maintaining aspect ratio
        />
        {/* New Record Button */}
        <TouchableOpacity
        onPress={() => router.push("/records")}
          style={{
            width: 200,
            marginTop: 20,
            backgroundColor: "#DE3163",
            paddingVertical: 15,
            paddingHorizontal: 30,
            borderRadius: 10,

            alignItems: "center",
          }}
        >
          <Text style={{ color: "#ffffff", fontSize: 16 }}>New Record</Text>
        </TouchableOpacity>

        {/* Search Record Button */}
        <TouchableOpacity
        onPress={() => router.push("/search-record")}

          style={{
            width: 200,
            marginTop: 20,
            backgroundColor: "#DE3163",
            paddingVertical: 15,
            paddingHorizontal: 30,
            borderRadius: 10,

            alignItems: "center",
          }}
        >
          <Text style={{ color: "#ffffff", fontSize: 16 }}>Search Record</Text>
        </TouchableOpacity>

         {/* Search Record Button */}
         <TouchableOpacity
        onPress={() => router.push("/service-operator")}

          style={{
            width: 200,
            marginTop: 20,
            backgroundColor: "#DE3163",
            paddingVertical: 15,
            paddingHorizontal: 30,
            borderRadius: 10,

            alignItems: "center",
          }}
        >
          <Text style={{ color: "#ffffff", fontSize: 16 }}>Service Operator</Text>
        </TouchableOpacity>
        {/* <Button
        title="notification"
        onPress={triggerNotification}
      />
       <NotificationComponent message={message} /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroImage: {
    width: 300, // Adjust width as needed
    height: 200, // Adjust height as needed
    marginBottom: 20, // Space between the image and buttons
  },
  button: {
    width: 200,
    marginTop: 20,
    backgroundColor: "#DE3163",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
  },
});
