import React, { useEffect, useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, ScrollView, Platform, Button, TextInput ,Image,TouchableOpacity} from 'react-native';
import { db } from '../../firebase';
import { collection, addDoc } from "firebase/firestore";
import { storage } from '../../firebase';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes } from 'firebase/storage'
import * as Notifications from 'expo-notifications';
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const CreateAdScreen = () => {

  const [name, setName] = useState('');
  const [des, setDes] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [phone, setPhone] = useState('');
  const [uid, setUid] = useState('')
  const [images, setImages] = useState('');
  const [progress, setProgress] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const uploadFile = async () => {
    setProgress(true);
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });



    if (!result.cancelled) {
      const refs = ref(storage, `/items/${Date.now()}`)
      const img = await fetch(result.uri);
      const bytes = await img.blob();
      await uploadBytes(refs, bytes);
      setImages(result.uri)
      setProgress(false)
      alert('Image Uploaded')
    }
    if (result.cancelled) {
      alert('No iamge selected')
    }
    setProgress(false)
  };

  const schedulePushNotification = async () => {
    if (name == '' && des == '' && year == '' && phone == '' && price == '') {
      alert('Please Fill all the Required Field')
    }
    else if (images == '') {
      alert('Plesae Upload the Image')
    }
    else
      try {
        await addDoc(collection(db, "ads"), {
          first_name: name,
          descryption: des,
          years: year,
          phone_number: phone,
          image: images,
          price: price,
          uid: uid,
        });
        alert('Ad has been posted')
        await Notifications.scheduleNotificationAsync({
          content: {
            sound: Platform.OS === "android" ? null : "default",
            title: "Your Ad has been posted",
            body: 'Thank you',
            data: { data: 'goes here' },
          },
          trigger: { seconds: 2 },
        });
      }
      catch (e) {
        console.error("Error adding document: ");
      }

  }

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',

      });
    }

    return token;
  }

  return (
    <ScrollView>
      <View style={styles.container}>
     
        <StatusBar style="auto" />

        {/* <Image source={require("../assets/OLX.jpg")}
      style={styles.imageStyle}></Image> */}

        <View style={styles.textView}>
          <Text style={styles.textColor}>Title</Text>
        </View>
        <View style={styles.inputView}>

          <TextInput
            value={name}
            style={styles.TextInput}
            placeholder='Title of your product'
            placeholderTextColor="grey"
            onChangeText={(text) => setName(text)}
          />
        </View>

        <View style={styles.textView}>
          <Text style={styles.textColor} >Description</Text>
        </View>
        <View style={[styles.inputView, { height: 90 }]}>
          <TextInput
            style={styles.TextInput}
            placeholder="Write Description"
            value={des}
            multiline
            numberOfLines={3}
            Outlined='focused'
            placeholderTextColor="grey"
            onChangeText={(text) => setDes(text)}
          />
        </View>
        <View style={styles.textView}>
          <Text style={styles.textColor} >Year</Text>
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            value={year}
            placeholder="Purchasing year"
            placeholderTextColor="grey"
            keyboardType='numeric'
            onChangeText={(text) => setYear(text)}
          />
        </View>
        <View style={styles.textView}>
          <Text style={styles.textColor}>Price</Text>
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            value={price}
            placeholder="Price"
            placeholderTextColor="grey"
            keyboardType='numeric'
            onChangeText={(text) => setPrice(text)}
          />
        </View>
        <View style={styles.textView}>
          <Text style={styles.textColor} >Phone Number</Text>
        </View>

        <View style={styles.inputView}>

          <TextInput
            style={styles.TextInput}
            value={phone}
            placeholder="Phone Number"
            placeholderTextColor="grey"
            keyboardType='numeric'
            onChangeText={(text) => setPhone(text)}
          />
        </View>



        <TouchableOpacity style={styles.loginBtn} onPress={() => uploadFile()}>
          <Text style={styles.loginText}>Upload Image</Text>
        </TouchableOpacity>
        {/* {
          uri && (
            <Image source={{ uri }} style=
              {{ height: 200, width: 200, margin: 20 }}>
            </Image>
          )
        } */}
        <TouchableOpacity style={styles.loginBtn} onPress={()=>schedulePushNotification()}>
          <Text style={styles.loginText}>Post</Text>
        </TouchableOpacity>

      </View>

    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    paddingTop:70

},
textView: {

    alignSelf: 'flex-start',
    paddingLeft: 22
},
textColor: {
    color: 'black'
},
imageStyle: {
    marginBottom: 10,
    height: 40,
    width: 40,
    marginTop: 10
},

inputView: {
    backgroundColor: "white",
    borderRadius: 5,
    width: "90%",
    height: 45,
    marginBottom: 20,
    borderWidth: 1,



},

TextInput: {
    height: 50,
    flex: 1,
    padding: 10,

    width: '100%',

},

forgot_button: {
    height: 30,
    marginBottom: 30,
},

loginBtn: {
    width: "90%",
    borderRadius: 5,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#a9b900",
},
loginText: {
    color: 'white'
},
accountStyle: {
    flexDirection: 'row',
    paddingTop: 20
}
});
export default CreateAdScreen;