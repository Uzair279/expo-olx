import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image, ImageBackground } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { StatusBar } from 'react-native-web';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth'
import { LogBox } from 'react-native'

const secImage = { uri: "data:image/png;base64,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" }
function LoginScreen({ navigation }) {

useEffect(()=>{
  LogBox.ignoreLogs(['Warning: Async Storage has been extracted from react-native core']);
})
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [loading, setLoading] = useState(false)
  const userLogin = () => {
    var emailValid = false;
    if (email.length == 0) {
      setEmailError("Email is required");
    }
    else if (email.length < 6) {
      setEmailError("Email should be minimum 6 characters");
    }
    else if (email.indexOf(' ') >= 0) {
      setEmailError('Email cannot contain spaces');
    }
    else if (email.trim().includes("@") == false) {
      setEmailError('Email contains @ in it')
    }
    else if (email.trim().includes(".") == false) {
      setEmailError('Email contains .(dot) in it')
    }
    else {
      setEmailError("")
      emailValid = true
    }

    var passwordValid = false;
    if (password.length == 0) {
      setPasswordError("Password is required");
    }
    else if (password.length < 6) {
      setPasswordError("Password should be minimum 6 characters");
    }
    else if (password.indexOf(' ') >= 0) {
      setPasswordError('Password cannot contain spaces');
    }
    else {
      setPasswordError("")
      passwordValid = true
    }

    if (emailValid && passwordValid) {

    }

    setLoading(true)
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        //
        const user = userCredential.user
alert('Login succesfully')
        setLoading(false)
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    alert('Please Signup if you do not have an account')
        setLoading(false);
      });
     }



  return (




    <View style={styles.container}>

      <View style={styles.firstView}>
        <ImageBackground source={secImage} resizeMode="cover" style={styles.image}>
        </ImageBackground></View>




      <StatusBar style="auto" />
      <Text style={styles.textView}>Username or email</Text>
      <View style={styles.inputView}>
        <View style={styles.inputBox}>
          <Feather name='mail' size={20} color='white' />
          <TextInput value={email} onChangeText={(text) => setEmail(text)} style={styles.TextInput} placeholder='Username or email'
            autoCapitalize='none' keyboardType='email-address' autoComplete='email'
          ></TextInput>
        </View>
      </View>
      <View style={{right:40,bottom:20}}> 
            {emailError.length > 0 &&
                  <Text style={{color:'red'}}>{emailError}</Text>
                }
                </View>
      <Text style={styles.textView}> Password</Text>
      <View style={styles.inputView}>
        <View style={styles.inputBox}>
          <FontAwesome name='lock' size={20} color='white' />
          <TextInput value={password} onChangeText={(e) => setPassword(e)} style={styles.TextInput}
            placeholder='Password' secureTextEntry={true}></TextInput>


        </View>


      </View>

      <View style={{right:40,bottom:20}}> 
            {passwordError.length > 0 &&
                  <Text style={{color:'red'}}>{passwordError}</Text>
                }
                </View>

      <TouchableOpacity title="click me" onPress={() => { }} style={styles.forgot_button}>
        <Text >Forget password?</Text>
      </TouchableOpacity>





      <TouchableOpacity style={styles.loginBtn}
        onPress={() => userLogin()}

      >
        <Text >{loading ? 'Loading...' : 'Login'}</Text>
      </TouchableOpacity>



      <View style={styles.accountStyle}>
        <Text style={styles.forgot_button} >Don't have an account ? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
          <Text style={styles.forgot_buttons}>Signup</Text>
        </TouchableOpacity>


      </View>







    </View>

  );
}





const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: 'center',
    alignItems: 'center',

  },
  newContainter: {

    justifyContent: 'center',
    alignItems: 'center'
  },

  image: {

    height: 40,
    width: 40
  },

  inputView: {
    flexDirection: 'row',
    backgroundColor: "#FFC0CB",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    justifyContent: 'space-around',
    alignItems: "center",
  },

  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,

    width: '100%',
    textAlign: 'center'
  },

  forgot_button: {
    height: 30,
    marginBottom: 10,

  },
  forgot_buttons: {
    height: 30,
    marginBottom: 10,
    color: '#FF1493',
    fontWeight: 'bold'

  },

  loginBtn: {
    width: "70%",
    borderRadius: 25,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#FF1493",
  },
  loginText: {
    color: 'white'
  },
  accountStyle: {
    flexDirection: 'row',
    paddingTop: 20
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    width: "90%",
    paddingHorizontal: 1,



  },
  textView: {

    alignSelf: 'flex-start',
    paddingLeft: 60,

  },
  firstView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 30
  },
  imageAgain: {

    flex: 1,
    justifyContent: "center"
  }
});
export default LoginScreen;