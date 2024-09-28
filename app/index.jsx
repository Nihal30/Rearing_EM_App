import { Link, useRouter } from "expo-router";
import { Text, View, TouchableOpacity, Image, StyleSheet } from "react-native";
import Hero from '../assets/images/Bg-Hero.jpg'

export default function Index() {
  const router = useRouter()
  return (
    <View style={{ flex: 1, backgroundColor: "#4C516D" }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "#002244",
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
          marginTop:-200
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
            backgroundColor: "#002244",
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
            backgroundColor: "#002244",
            paddingVertical: 15,
            paddingHorizontal: 30,
            borderRadius: 10,

            alignItems: "center",
          }}
        >
          <Text style={{ color: "#ffffff", fontSize: 16 }}>Search Record</Text>
        </TouchableOpacity>
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
    backgroundColor: "#002244",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
  },
});
