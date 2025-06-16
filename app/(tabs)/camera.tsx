import { Button, Text, View, TouchableOpacity, Image, Modal, StyleSheet, TextInput } from "react-native";
import { CameraView, CameraType, useCameraPermissions, CameraCapturedPicture } from 'expo-camera';
import type { Camera as ExpoCamera } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import { styles } from './index';
import { useRouter } from 'expo-router';
import { analyzeImageWithOpenAI } from "@/services/openai";

export default function Camera() {
  const userData = {
    name: 'John Doe',
    user_allergies: ['tomato', 'garlic']
  };
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [selectedSize, setSelectedSize] = useState(undefined);
  const [image, setImage] = useState<CameraCapturedPicture | undefined>(undefined);
  const [showPreview, setShowPreview] = useState(false);
  const [allergyList, setAllergyList] = useState(userData.user_allergies);
  const [newAllergy, setNewAllergy] = useState('');


  useEffect(() => {
    async function getSizes() {
      console.log("hi!");
      console.log(permission);
      if (permission?.granted && cameraRef.current) {
        console.log("sized!");
        const sizes = await cameraRef.current.getAvailablePictureSizesAsync();
        console.log(sizes);
      }
    }

    getSizes();
  }, [permission, cameraRef]);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current: "front" | "back") => (current === "back" ? "front" : "back"));
  }

  async function capturePhoto()  {
    const photo = await cameraRef.current?.takePictureAsync(
      {
        base64: true,
      }
    );
    if (photo) {
      setShowPreview(true);
      setImage(photo);
    }
  }

  async function confirmPhoto() {
    try {
      const response = await sendPhotoToServer();
      const { ingredientList } = response;
      router.push({
        pathname:'/foodlog',
        params:{ ingredientList: ingredientList, image: image?.uri, allergyString: allergyList },
      });
      setShowPreview(false);
    } catch (error) {
      console.error('Error sending photo:', error);
    }
  }

  async function sendPhotoToServer() {
    // constant file
    console.log("Photo Confirmed, sending photo to server");

    try {
      if (!image?.uri) throw new Error('No image captured');
      // actual code: 
      //const response = await analyzeImageWithOpenAI(image?.uri);
      // demo code: 
      const response = await analyzeImageWithOpenAI('https://cdn.discordapp.com/attachments/1293645337596137572/1294090911759728650/Shakshuka-main-1.png?ex=6709bf94&is=67086e14&hm=e1083a6546f5c3d2c00ab9ed94f2ba67abee6061aca08e66c92ad91834fbd18c&');
      //const response = `1. Pasta (gluten) 2. Cheese (dairy) 3. Tomatoes 4. Garlic`;
      const processedResponse = processFoodList(response ?? '');
      console.log("Processed response:", processedResponse);
      const uniqueFoods = getUniqueFoods(processedResponse);
      //const uniqueFoods = ['flour', 'butter', 'water', 'milk', 'sugar', 'yeast', 'salt', 'eggs'];
      // actual code
      return ({ ingredientList: uniqueFoods });
    }
    catch (error) {
      console.error('Error sending photo:', error);
      return ({ ingredientList: [] });
    }
    // actual code

    // // demo code
    // const input = `1. Pasta (gluten) 2. Cheese (dairy) 3. Tomatoes 4. Garlic`;
    // const exampleIngredientList = ['pasta', 'cheese', 'tomato']
    // return ({ ingredientList: exampleIngredientList });
  }

  function cancelPreview() {
    setImage(undefined); // Clear the captured photo
    setShowPreview(false); // Close the modal
  }
  
  function processFoodList(input: string): { food: string, allergen: string }[] {
    const lines = input.split('\n');

    const processedList = lines
        .filter((line) => /^\d/.test(line)) // Only process lines that start with a number
        .map((line) => {
            const [foodPart, allergenPart] = line
                .replace(/^\d+\.?\s*/, '') // Remove numbers, dots, and trailing spaces
                .split('('); // Split based on the allergen part in parentheses

            const food = foodPart.trim().toLowerCase(); // Ensure food is lowercase and trimmed
            const allergen = allergenPart ? allergenPart.replace(')', '').trim().toLowerCase() : ''; // Clean allergen by removing ) and ensure lowercase

            return { food, allergen };
        });

    return processedList;
}

function addAllergy() {
  setAllergyList([...allergyList, newAllergy]);
  setNewAllergy('');
}

const getUniqueFoods = (foodList: { food: string, allergen: string }[]): string[] =>
  [...new Set(foodList.map(item => item.food))];

function removeAllergy(allergy: string) {
  setAllergyList(allergyList.filter(a => a !== allergy));
}

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>Looks yum! Let's take a pic</Text>
        <CameraView
          style={styles.camera}
          facing={facing}
          ref={cameraRef}
          pictureSize={selectedSize}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleCameraFacing}
            >
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
      <View style={{ flex: 1 }}>
        <Button
          title="Take Picture"
          onPress={capturePhoto}
        />
        <View
          style={{ height: 1, backgroundColor: "#eee", marginVertical: 20 }}
        />
        {allergyList && (
          <View>
            <Text style={styles.subtitle}>Remind me to avoid:</Text>
            {allergyList.map(allergy => <Button title={allergy} key={allergy} onPress={() => removeAllergy(allergy)} />)}
            <TextInput
    style={styles.input}
    placeholder="Enter new allergy"
    value={newAllergy}
    onChangeText={text => setNewAllergy(text)}
  />
  <Button title="Add Allergy" onPress={addAllergy} />
          </View>
        )}
      </View>
    {image && (
      <Modal visible={showPreview} animationType="slide">
        <View style={styles.previewContainer}>
          <Text style={styles.previewText}>Preview your photo</Text>
          <Image
            source={{ uri: image.uri }}
            style={styles.previewImage}
          />
          <View style={styles.buttonRow}>
            <Button title="Retake" onPress={cancelPreview} />
            <Button title="Use this photo" onPress={confirmPhoto} />
          </View>
        </View>
      </Modal>
    )}
  </View>
);
}
