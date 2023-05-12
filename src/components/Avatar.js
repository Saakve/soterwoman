import { useState, useEffect, useContext } from "react"
import { StyleSheet, View, Image, ActivityIndicator } from "react-native"

import * as DocumentPicker from "expo-document-picker"
import { Icon } from "@rneui/base"

import { supabase } from "../services/supabase"
import UserContext from "../context/UserContext"

export default function Avatar({ name, url, size = 100, onUpload = () => { }, editable = true }) {
  const { userData, setUserData } = useContext(UserContext)
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setaAvatarUrl] = useState(null)
  const avatarSize = { height: size, width: size }

  const updateUserIdImage = async (idImage) => {
    const { error } = await supabase.from("profile").update({ idimage: idImage }).eq("id", userData.id)

    if (error) {
      console.log(error)
      return
    }

    setUserData((previusState) => ({ ...previusState, idImage }))
  }

  const donwloadImage = async path => {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path)
      if (error) throw error

      const fr = new FileReader()
      fr.readAsDataURL(data)
      fr.onload = () => {
        setaAvatarUrl(fr.result)
      }
    } catch (error) {
      if (error instanceof Error) console.log(`Error downloading image: ${error.message}`)
    }
  }

  const uploadAvatar = async () => {
    try {
      setUploading(true)

      const file = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
      })

      const photo = {
        uri: file.uri,
        type: file.mimeType,
        name: file.name,
      }

      const formData = new FormData()
      formData.append('file', photo)

      const fileExt = file.name.split('.').pop()
      const filePath = `${Math.random()}.${fileExt}`
      const { error } = await supabase.storage.from('avatars').upload(filePath, formData)
      if (error) throw error

      await updateUserIdImage(filePath)
      onUpload()

    } catch (error) {
      console.log(error)
    } finally {
      setUploading(false)
    }
  }

  useEffect(() => {
    if (url) donwloadImage(url)
  }, [url])

  return (
    <View>
      {
        avatarUrl
          ? <Image source={{ uri: avatarUrl }} accessibilityLabel="Avatar" style={[avatarSize, styles.avatar, styles.image]} />
          : <View style={[avatarSize, styles.avatar, styles.noImage]} />
      }
      {
        editable
          ? <View style={styles.icon}>
            {!uploading
              ? <Icon
                name={"edit"}
                onPress={uploadAvatar}
                disabled={uploading}
              />
              : <ActivityIndicator size="small" color="#0000ff" />
            }
          </View>
          : null
      }
    </View>
  )
}

const styles = StyleSheet.create({
  avatar: {
    overflow: "hidden",
  },
  image: {
    marginTop: 10,
    objectFit: "cover",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#D6D6D6",
  },
  noImage: {
    backgroundColor: "#333",
    border: "1px solid rgb(200, 200, 200)",
    borderRadius: 50,
  },
  icon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FFCDDD",
    borderRadius: 50,
    padding: 2
  }
});    