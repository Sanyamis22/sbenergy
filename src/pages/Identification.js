import React,{useEffect} from 'react';
import {ScrollView, Alert, Dimensions, Image, StyleSheet, View, BackHandler, Text, TextInput, TouchableOpacity} from 'react-native';
import {Appbar, Badge} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import {fetchData} from './../redux/Actions/IdentificationAction'
import { Bubbles } from 'react-native-loader';
import {alarmNotice} from './../redux/Actions/AlarmAction';
import OfflinePopup from '../components/OfflinePopup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AlarmModal from '../components/AlarmModel';

const Identification = (props) => {
   
      const dispatch = useDispatch()
      useEffect(()=>{
        
        dispatch(fetchData());

      },[])

      console.log(props.navigation.isFocused())

      const identificationData = useSelector((reduxStatus)=>{
          return reduxStatus.Identification.dataList;
      });

      const loader = useSelector((reduxState)=>{
        return reduxState.Identification.loader
    })

    const logout = () => {
        AsyncStorage.clear();
        props.navigation.navigate('AuthNavigation')
    }


    const alarmDisable = () => {
        props.navigation.navigate('Alarm');
        dispatch(alarmNotice());
    }
    return(
        <View style={styles.container}>
        <Appbar.Header style={styles.appbar}>
        <TouchableOpacity onPress={()=> props.navigation.openDrawer()} style={{marginTop:5}}>
            <Image source={require('./../assets/images/bar.png')} style={{width:30, height:30}} />
            </TouchableOpacity>
        
        <Text style={{fontSize:15, marginLeft:5, fontWeight:"bold"}}>Identifications</Text>
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
            <View style={styles.TableHead}>
                <Text style={{...styles.th, width:"25%", textAlign:"center"}}>User ID</Text>
                <Text style={{...styles.th, width:"25%", textAlign:"center"}}>Name</Text>
                <Text style={{...styles.th, width:"25%", textAlign:"center"}}>Camera</Text>
                <Text style={{...styles.th, width:"25%", textAlign:"center"}}>Date</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
            {
            loader===true ? 
            <View style={{alignItems:"center", marginTop:"20%"}}>
            <Bubbles size={10} color="black" />
            </View>
            :
            identificationData!='undefined' ?
            identificationData.map((row)=>(
                <View style={styles.TableBody}>
                <Text style={{...styles.td}}>{row.userID}</Text>
                <Text style={{...styles.td}}>{row.empName}</Text>
                <Text style={{...styles.td}}>{row.cameraName}</Text>
                <Text style={{...styles.td}}>{row.recDateTime}</Text>
                </View>
             )):null}
            </ScrollView>
        </View>
        </View>
        <AlarmModal AlarmokBtn={<TouchableOpacity onPress={()=>alarmDisable()}
          style={{width:100, height:30, borderWidth:1, borderColor:"#446DFF", borderRadius:5, marginTop:10, alignSelf:'center'}}>
              <Text style={{color:'#446DFF', alignSelf:'center', marginTop:5}}>Ok</Text>
              
            </TouchableOpacity>} />
        <OfflinePopup />
        </View>
    )
}

export default Identification

const styles = StyleSheet.create({
    container:{
        backgroundColor:"#F4F4F4",
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
        backgroundColor:"white",
        width:"49%",
        alignItems:"center",
        justifyContent:"center",
        shadowColor: 'white',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2},
        shadowRadius: 10,
        elevation: 3,
        backgroundColor: 'white'
    },

    Shadowbox_under:{
        flexDirection:"row"
    },
    
    container_box:{
        paddingHorizontal:10,
        backgroundColor:"white",
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
        marginLeft:10,
        height:20
    },

    download:{
        height:20,
        width:20,
        marginTop:5
    },

    downloadBtn:{
        width:"100%",
        height:50,
        paddingTop:10,
        borderRadius:5,
        justifyContent:"center",
        borderWidth:1,
        borderColor:"#446DFF",
        flexDirection:"row",
        marginTop:10
    },
    
    TableHead:{
        flexDirection:"row",
        justifyContent:"space-between",
        marginTop:10,
        alignItems:"center",

        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2},
        shadowRadius: 10,
        elevation: 3,
        paddingVertical:15,
        backgroundColor: '#F0F3FF',
        paddingHorizontal:5
    },

    th:{
        color:"black",
        fontWeight:"bold",
        fontSize:11,
        
        width:"25%",
        alignSelf:"center"
    },

    TableBody:{
        flexDirection:"row",
        justifyContent:"space-between",
        paddingVertical:15,
        paddingHorizontal:5,
        borderBottomWidth:1,
        borderColor:"#e6e6e6"
    },

    td:{
        color:"gray",
        fontWeight:"bold",
        width:"25%",
        textAlign:"center",
        fontSize:10
    },
});