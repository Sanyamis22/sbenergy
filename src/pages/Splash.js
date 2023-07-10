import React, {useEffect} from 'react';
import {View, StyleSheet, Dimensions, Image, Alert, BackHandler} from 'react-native';
import { Bubbles } from 'react-native-loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Splash = (props) => {
    
    const AuthVerification = async() => {
        const token = await AsyncStorage.getItem('token');
        setTimeout(() => {  
            if(token){
                props.navigation.navigate('DashboardNavigation');
            }
            else{
                props.navigation.navigate('AuthNavigation');
            }
           }, 3000);
    }
    
    AuthVerification();
    return(
        <View style={styles.container}>
            <Image source={require('./../assets/images/logo_new.png')} style={styles.SplashImage} />
            <View style={{alignSelf:"center", marginTop:10}}>
            <Bubbles size={10} color="black" />
            </View>
        </View>
    )
}

export default Splash;

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"white",
        justifyContent:"center"
    },
    
    SplashImage:{
        width: 230,
        height:60,
        alignSelf:"center",
        resizeMode: 'cover',
        justifyContent:'center'
    },

})