import React,{useEffect, useState} from 'react';
import {ScrollView, Vibration, Alert, Dimensions, Image, StyleSheet, View, BackHandler, Text, TextInput, TouchableOpacity} from 'react-native';
import {Appbar, Badge} from 'react-native-paper';
import {fetchData} from './../redux/Actions/AlarmAction';
import {useDispatch, useSelector} from 'react-redux';
import Moment from 'moment';
import { Bubbles } from 'react-native-loader';
import OfflinePopup from '../components/OfflinePopup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {alarmNotice_true} from './../redux/Actions/AlarmAction'
import AlarmModal from '../components/AlarmModel';

const Alarm = (props) => {
    const [btnLoader, setBtnLoader] = useState(false);
    const [timer, setTimer] = React.useState(1800);
    const id = React.useRef(null);
    const clear=()=>{
    window.clearInterval(id.current)
    }

    const handleThrottledShake = () => {
        Vibration.vibrate(500);
        console.log('ran vibration');
      }

    const dispatch = useDispatch();
        
      useEffect(()=>{        
        dispatch(fetchData());  
        id.current=window.setInterval(()=>{
            setTimer((time)=>time-1)
          },1000)
          return ()=>clear();
      },[])

      console.log(timer)
      if(timer==0){
          setTimer(1800)
          handleThrottledShake()
          dispatch(fetchData());  
      }

    const loader = useSelector((reduxState)=>{
        return reduxState.Alarm.loader
    });


    const EmployeeList = useSelector((reduxState)=>{
        return reduxState.Alarm.alarmList
    });

    const logout = () => {
        AsyncStorage.clear();
        props.navigation.navigate('AuthNavigation')
    }

    if(Array.isArray(EmployeeList)){
        const localStorage = async() => {
            setTimeout(() => {
                AsyncStorage.setItem('alarm', JSON.stringify(EmployeeList))
            }, 1000);
            const data  = await AsyncStorage.getItem('alarm');
            if(JSON.parse(data).length!=EmployeeList.length){
                AsyncStorage.setItem('alarm', JSON.stringify(EmployeeList))
                dispatch(alarmNotice_true());
            }
        }
        localStorage()
    }
    
    
    
    return(
        <View style={styles.container}>
        <Appbar.Header style={styles.appbar}>
        <TouchableOpacity onPress={()=> props.navigation.openDrawer()} style={{marginTop:5}}>
            <Image source={require('./../assets/images/bar.png')} style={{width:30, height:30}} />
            </TouchableOpacity>
            <Text style={{fontSize:15, marginLeft:5, fontWeight:"bold"}}>Alarm</Text>
        
            <TouchableOpacity onPress={()=>props.navigation.navigate('Alarm')} style={{alignSelf:"flex-end", position:"absolute", right:50, top:21}}>
            {/* <Badge style={{position:'absolute', top:-10, left:8, zIndex:5}}>1</Badge>
            <Image source={require('./../assets/images/bell.png')} style={{width:20, height:22}} /> */}
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>logout()} style={{alignSelf:"flex-end", position:"absolute", right:15, top:20}}>
            <Image source={{uri:"https://image.flaticon.com/icons/png/512/18/18183.png"}} style={{width:20, height:20}} />
        </TouchableOpacity>
        </Appbar.Header>

        <View style={styles.container_box}>
    
        <View>
            <ScrollView showsVerticalScrollIndicator={false}>
            {loader ?
            <View style={{alignItems:"center", marginTop:"20%"}}>
            <Bubbles size={10} color="black" />
            </View>
            :
            EmployeeList.map((row, i)=>(
                <View style={styles.Shadowbox} key={i}>
                    <View style={styles.profile}>
                        <View>
                            <Text style={styles.name}>{row.userName}</Text>
                            <Text style={styles.email}>User ID : <Text style={{fontWeight:"bold"}}>{row.userID}</Text></Text>
                        </View>
                    </View>

                    <View style={styles.description}>
                        <View style={styles.desc_part}>
                            <Text style={styles.label}>RecDateTime</Text>
                            <Text style={styles.label_data}>
                                {
                                row.recDateTime==null ?
                                '--:--:----'
                                :
                                row.recDateTime
                                }
                            </Text>
                        </View>

                        <View style={styles.desc_part}>
                            <Text style={styles.label}>Company ID</Text>
                            <Text style={styles.label_data}>
                                {
                                row.companyID
                                }
                            </Text>
                        </View>
                    </View>
                </View>
                ))}
            </ScrollView>
        </View>
        </View>

        <OfflinePopup />
        </View>
    )
}

export default Alarm

const styles = StyleSheet.create({
    container:{
        backgroundColor:"#e6e6e6",
        flex:1,
    },

    appbar:{
        backgroundColor:"white",
        color:"black"
    },

    banner:{
        width:"100%",
        height:150,
        paddingTop:20,
        backgroundColor:"white"
    },

    bannerImg:{
        width: Dimensions.get('window').width,
        height:100,
    },

    Shadowbox_row:{
        flexDirection:"row"
    },

    Shadowbox:{
        backgroundColor:"#FFFFFF",
        justifyContent:"center",
        shadowColor: '#e6e6e6',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2},
        shadowRadius: 10,
        elevation: 2,
        width:"100%",
        marginTop:10,
        padding:15,
        borderRadius:10,
    },

    Shadowbox_under:{
        flexDirection:"row"
    },
    
    container_box:{
        paddingHorizontal:10,
        backgroundColor:"#F8F8F8",
        flex:1
    },

    Search:{
    borderWidth:1,
    borderColor:"#e6e6e6",
    marginTop:10,
    borderRadius:5,
    paddingLeft:40
    },

    SearchIcon:{
        position:"absolute",
        width:20,
        marginTop:26,
        marginLeft:15,
        height:20
    },

    download:{
        height:30,
        width:30
    },

    downloadBtn:{
        width:"100%",
        height:50,
        paddingTop:10,
        justifyContent:"center",
        borderWidth:1,
        borderColor:"#446DFF",
        flexDirection:"row",
        marginTop:10
    },
    
    profile:{
        flexDirection:"row",
        borderBottomWidth:1,
        paddingBottom:5,
        borderColor:"#e6e6e6"
    },

    name:{
        fontWeight:"bold",
        fontSize:13,
        marginTop:5
    },

    email:{
      fontSize:12  
    },

    description:{
        flexDirection:"row",
        justifyContent:"space-between"
    },

    desc_part:{
        width:"48%",
        paddingTop:5,
        
    },
    
    label:{
        color:"gray",
        fontSize:11
    },

    label_data:{
        fontWeight:"bold",
        color:"#232323",
        fontSize:12,
        marginTop:1
    }
});