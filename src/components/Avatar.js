import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { StyleSheet, View, Alert, Image, Button, ActivityIndicator } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Icon } from "@rneui/base";

export default function Avatar({ name, url, size = 150, onUpload }) {
    const [uploading, setUploading] = useState(false)
    const [avatarUrl, setaAvatarUrl] = useState(null)
    const avatarSize = { height: size, width: size}

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
            if(error instanceof Error) console.log(`Error downloading image: ${error.message}`)
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

            await onUpload(filePath)

        } catch (error) {
            if (isCancel(error)) console.warn('cancelled')
            else if (isInProgress(error)) console.warn('multiple pickers were opened, only the last will be considered')
            else if (error instanceof Error) Alert.alert(error.message)
            else throw error
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
          ? <Image source={{ uri: avatarUrl }} accessibilityLabel="Avatar" style={[avatarSize, styles.avatar, styles.image]}/>
          : <View style={[avatarSize, styles.avatar, styles.noImage]} />
        } 
        <View>
          {!uploading ? 
          <Icon
            name={"edit"}
            onPress={uploadAvatar}
            disabled={uploading}/> 
            : 
          <ActivityIndicator size="small" color="#0000ff" />
          }
        </View>
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
    borderRadius: 100,
    maxWidth: "30%",
    maxHeight: "80%",
  },
  noImage: {
    backgroundColor: "#333",
    border: "1px solid rgb(200, 200, 200)",
    borderRadius: 5,
  },
});    