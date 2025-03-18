import { Button, Text, View, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native";
import { useEffect, useState, useRef} from 'react';
import { Link } from 'expo-router'


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFFFED',
  },
  input: {
    width: '60%', // Input will take 75% of the screen width
    alignSelf: 'center', // Centers the input horizontally
    borderColor: '#888', 
    borderWidth: 1,
    padding: 12, 
    marginVertical: 10,
    borderRadius: 15, // More rounded corners for a sleek look
    backgroundColor: '#fff', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, 
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    width: '30%',
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 25, // Add rounded corners
    overflow: 'hidden', // Ensure the border radius is applied
    backgroundColor: '#2196F3', // Default button color
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  title: {
    fontSize: 25, // Larger font for Known Allergies
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold', // Bold to make it stand out
  },
  subtitle: {
    fontSize: 20, // Medium font for Known Allergies
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold', // Bold to make it stand out
  },
  previewText: {
    fontSize: 24,
    marginBottom: 20,
  },
  previewImage: {
    width: 300,
    height: 400,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  allergyItem: {
    borderColor: '#ccc', // Border around each allergy item
    borderWidth: 1,
    padding: 10,
    marginVertical: 5,
    borderRadius: 10, // Rounded corners
    backgroundColor: '#f9f9f9', // Light background color
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  allergyListContainer: {
    alignItems: 'center', // Center the list
    marginBottom: 20, // Space at the bottom
  },
});

export default function HomeScreen() {
  const [email, setEmail] = useState('');

  const handleLoginWithOtp = () => {
    console.log("Login with OTP");
  }
  
  return (
    <View style={styles.container}>
        <Text style={styles.title}>Login to Banana Ai</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleLoginWithOtp}>
            <Button title="Send Magic Link" onPress={handleLoginWithOtp} />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <Link href="/(tabs)/camera" asChild>
            <TouchableOpacity>
              <Button title="Bypass Login" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>
  )
}


