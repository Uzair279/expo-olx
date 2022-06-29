import { View, Text,StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react'
import { getAuth } from 'firebase/auth';
import { Button } from 'react-native-paper';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
const AccountScreen = () => {
  const auth = getAuth();
  return (
    <View style={styles.container}>
      <EvilIcons name='user' size={100} />
      <Text>Email:{auth.currentUser?.email}</Text>
      <TouchableOpacity style={styles.logOutBtn} onPress={() => auth.signOut()}>
        <Text style={styles.text}>LOGOUT</Text>
        </TouchableOpacity>
    </View>
  )
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    logOutBtn: {
      width: "50%",
      borderRadius: 5,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 20,
      backgroundColor: "#a9b900",
    },
    text: {
      color: 'black',
      fontWeight: '600'
    }
})
export default AccountScreen