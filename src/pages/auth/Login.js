import React from 'react';
import {View, BackHandler, Alert, StyleSheet, TextInput, Image, TouchableOpacity, useRef, Text} from 'react-native';
import {attemptLogin, offLoginStatus} from './../../redux/Actions/AuthAction';
import {useDispatch, useSelector} from 'react-redux';
import FlashMessage from "react-native-flash-message";
import { Bubbles } from 'react-native-loader';
import { showMessage, hideMessage } from "react-native-flash-message";
import AsyncStorage from '@react-native-async-storage/async-storage';
const Login = (props) => {
    const dispatch = useDispatch();
    const [state, setState] = React.useState({
        UserName:'',
        PassWord:''
    });


      React.useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", backAction);
      }, []);


      const backAction = () => {
        if(props.navigation.isFocused()){
                Alert.alert("Hold on!", "Are you sure you want to exit app?", [
                  {
                    text: "Cancel",
                    onPress: () => null,
                    style: "cancel"
                  },
                  { text: "YES", onPress: () => BackHandler.exitApp() }
                ]);
                return true;
              }
            
        }


    const LoginAttempt = () => {
        if(state.UserName===''){
            showMessage({
                message: "Please Provide Valid UserName",
                type: "danger",
              });
            return;
        }

        
        if(state.PassWord===''){
            showMessage({
                message: "Please Provide Password",
                type: "danger",
              });
            return;
        }

        dispatch(attemptLogin(state))
    }

    
    const loader = useSelector((reduxState)=>{
        return reduxState.Authentication.loader
    });

    const result = useSelector((reduxState)=>{
        return reduxState.Authentication.loginStatus
    });


    if(result==='invalid'){
        showMessage({
            message: "UserName or Password is Incorret",
            type: "danger",
          });
        dispatch(offLoginStatus())
    }

    else if(result==='success'){
        showMessage({
            message: "login successfully",
            type: "success",
          });
        
        let token = Math.random().toString(36);
        AsyncStorage.setItem('token', token);
        setTimeout(() => {
          props.navigation.navigate('DashboardNavigation');
        }, 1000);
        dispatch(offLoginStatus())
    }
    
    if(loader)
    return(
        <View style={{marginTop:10, flex:1, alignItems:"center", width:"100%", justifyContent:"center", backgroundColor:"white"}}>
            <Bubbles size={10} color="black" />
        </View>
    );

    return(
        <View style={styles.container}>
            <FlashMessage position="top" useRef="myLocalFlashMessage" /> 
             <Image source={require('./../../assets/images/logo_new.png')} style={styles.logo} />      
             <Text style={styles.welcome}>Welcome</Text>
             <Text style={styles.subheading}>Login in to your account of Ayana</Text>
             <View>
            <Image source={require('./../../assets/images/user.png')} style={styles.input_icon} />
            <TextInput placeholder="UserName" style={styles.input} onChangeText={(txt)=>setState({...state, UserName:txt})} value={state.UserName} />
            </View>
            <View>
            <Image source={require('./../../assets/images/lock.png')} style={styles.input_icon} />
            <TextInput secureTextEntry={true} placeholder="Password" style={styles.input} onChangeText={(txt)=>setState({...state, PassWord:txt})} value={state.PassWord} />
            </View>
            <TouchableOpacity style={styles.loginBtn} onPress={()=>LoginAttempt()}>
                <Text style={{color:"white", alignSelf:"center", fontWeight:"bold", fontSize:20}}>Login</Text>
            </TouchableOpacity>

            {/* <View style={{flexDirection:"row", justifyContent:"center"}}>
            <Text style={styles.signup}>Don't have account? </Text>
            <TouchableOpacity onPress={()=>props.navigation.navigate('Signup')} style={{marginTop:10}}>
                <Text style={{fontWeight:"bold"}}>Signup</Text>
            </TouchableOpacity>
            </View> */}
        </View>
    )
}

export default Login;

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        backgroundColor:"white",
        paddingHorizontal:10
    },

    logo:{
        width:230,
        height:60,
        alignSelf:"center"
    },

    welcome:{
        fontSize:28,
        fontWeight:"bold",
        color:"black",
        alignSelf:"center",
        marginTop:10
    },

    subheading:{
        alignSelf:"center",
        fontSize:15,
        marginBottom:20
    },

    input:{
        borderWidth:1,
        marginTop:5,
        borderColor:"#F5F5F5",
        paddingLeft:40,
        height:55
    },

    loginBtn:{
        backgroundColor:"#393939",
        padding:13,
        marginTop:10,
        borderRadius:5,
        width:"100%",
    },

    signup:{
        alignSelf:"center",
        marginTop:10,
    },

    input_icon:{
        position:"absolute",
        width:25,
        height:25,
        marginLeft:10,
        marginTop:18
    }

})