import React from 'react';
import {View, StyleSheet, TextInput, Image, TouchableOpacity, Text} from 'react-native';

const Signup = (props) => {
    return(
        <View style={styles.container}>
             <Image source={require('./../../assets/images/logo.png')} style={styles.logo} />      
             <Text style={styles.welcome}>Let's Get Started!</Text>
             <Text style={styles.subheading}>Login in to your account of Ayana</Text>
             <View>
            <Image source={require('./../../assets/images/user.png')} style={styles.input_icon} />
            <TextInput placeholder="Name" style={styles.input} />
            </View>
            <View>
            <Image source={require('./../../assets/images/lock.png')} style={styles.input_icon} />
            <TextInput placeholder="Email" style={styles.input} />
            </View>
            <View>
            <Image source={require('./../../assets/images/lock.png')} style={styles.input_icon} />
            <TextInput placeholder="Phone" style={styles.input} />
            </View>
            <View>
            <Image source={require('./../../assets/images/lock.png')} style={styles.input_icon} />
            <TextInput placeholder="Password" style={styles.input} />
            </View>
            <View>
            <Image source={require('./../../assets/images/lock.png')} style={styles.input_icon} />
            <TextInput placeholder="Confirm Password" style={styles.input} />
            </View>
            
            <TouchableOpacity style={styles.loginBtn}>
                <Text style={{color:"white", alignSelf:"center", fontWeight:"bold", fontSize:20}}>Signup</Text>
            </TouchableOpacity>

            <View style={{flexDirection:"row", justifyContent:"center"}}>
            <Text style={styles.signup}>Already Registered? </Text>
            <TouchableOpacity onPress={()=>props.navigation.navigate('Login')} style={{marginTop:10}}>
                <Text style={{fontWeight:"bold"}}>Login</Text>
            </TouchableOpacity>
            </View>
        </View>
    )
}

export default Signup;

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        backgroundColor:"white",
        paddingHorizontal:10
    },

    logo:{
        width:220,
        height:80,
        alignSelf:"center"
    },

    welcome:{
        fontSize:28,
        color:"black",
        fontWeight:"bold",
        alignSelf:"center",
        marginTop:20
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