import AsyncStorage from "@react-native-async-storage/async-storage"

export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value)
  } catch (e) {
    console.log(`Error on storeData: ${e}`)
  }
}

export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key)
    return value
  } catch (e) {
    console.log(`Error on getData: ${e}`)
  }
}