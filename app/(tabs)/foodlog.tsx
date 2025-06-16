import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Button, Text, View, TouchableOpacity, Image as RNImage, TextInput, Alert} from "react-native";
import { Link } from 'expo-router';
import { styles } from './index';

export default function FoodLog() {
  const router = useRouter();
  const { ingredientList, image, allergyString } = useLocalSearchParams<{ ingredientList: string, image: string, allergyString: string}>();
  const allergyList = allergyString.split(',');
  const [foodIngredientList, setFoodIngredientList] = useState(ingredientList.split(','));
  const imageUri = image;
  const [highlightedIngredients, setHighlightedIngredients] = useState<{ name: string; isAllergenic: boolean }[]>([]);
  const [feeling, setFeeling] = useState('Great');
  const [newIngredient, setNewIngredient] = useState('');

//Connect to supabase and validate against known allergies for user.

  useEffect(() => {
    if (ingredientList) {
        const highlighted = foodIngredientList?.map(ingredient => ({
            name: ingredient,
            isAllergenic: allergyList.includes(ingredient)
        }));
        console.log(highlighted);
        setHighlightedIngredients(highlighted);
    }
  }, [foodIngredientList, ingredientList]);

  function submitLog() {
    const message = 'Your food log has been submitted ' + JSON.stringify(foodIngredientList) + ' ' + JSON.stringify(feeling); 
    // add to db the current users feelings in FoodDiary table
    Alert.alert('FoodLog', message);
    // router.push({ pathname: '/analytics' });
  }

  function removeIngredient(ingredient: string) {
    setFoodIngredientList(foodIngredientList.filter(item => item !== ingredient));
  }

  function addIngredient() {
    setFoodIngredientList([...foodIngredientList, newIngredient]);
    setNewIngredient('');
  }

  return (
    <View>
        <Text>
        Ingredients: {highlightedIngredients.map((ingredient, index) => (
          <TouchableOpacity key={index} onPress={() => removeIngredient(ingredient.name)}>
            <Text style={ingredient.isAllergenic ? { color: 'red' } : {}}>{ingredient.name}{index < highlightedIngredients.length - 1 ? ', ' : ''}</Text>
          </TouchableOpacity>
        ))}
        </Text>
        <TextInput
            style={styles.input}
            placeholder="Enter new allergy"
            value={newIngredient}
            onChangeText={text => setNewIngredient(text)}
          />
  <Button title="Add Ingredient" onPress={addIngredient} />
        <RNImage source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />
        <Text style={styles.subtitle}> How are you feeling? </Text>
        <Button title='Great' onPress={() => setFeeling('Great')} />
        <Button title='Nausea' onPress={() => setFeeling('Nausea')} /> 
        <Button title='Chest Pain' onPress={() => setFeeling('Chest Pain')} />
        <Button title='Bloating' onPress={() => setFeeling('Bloating')} />
        <Button title='Log Food' onPress={submitLog} />
        <Button title='View Analytics' onPress={() =>router.push({ pathname: '/analytics' })} />
    </View>
  );
}