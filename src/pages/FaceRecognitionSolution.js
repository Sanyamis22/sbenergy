import React,{useEffect, useState} from 'react';
import {ScrollView, Alert, Dimensions, Image, StyleSheet, View, BackHandler, Text, TextInput, TouchableOpacity, RecyclerViewBackedScrollView} from 'react-native';
import {Appbar, Badge, Avatar} from 'react-native-paper';
import {fetchData} from './../redux/Actions/FaceRecognitionAction';
import {useDispatch, useSelector} from 'react-redux';
import { Bubbles } from 'react-native-loader';
import AlarmModal from '../components/AlarmModel';
import {alarmNotice} from './../redux/Actions/AlarmAction';
import OfflinePopup from '../components/OfflinePopup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const FaceRecognitionSolution = (props) => {
    const [btnLoader, setBtnLoader] = useState(false);
      const dispatch = useDispatch();

      useEffect(()=>{  
        dispatch(fetchData());
      },[])


    const loader = useSelector((reduxState)=>{
        return reduxState.FaceRecognition.loader
    })

    const EmployeeList = useSelector((reduxState)=>{
        return reduxState.FaceRecognition.FaceRecogList
    });


    const distinctItems = [...new Map(EmployeeList.map(item => [item["userID"], item])).values()];


    const logout = () => {
        AsyncStorage.clear();
        props.navigation.navigate('AuthNavigation')
    }


    const createPDF = async () => {
        setBtnLoader(true)
      if (await isPermitted()) {
        let options = {
          //Content to print
          html:html,
          //File Name
          fileName: 'ANPRSolution',
          //File directory
          directory: 'docs',
        };
        let file = await RNHTMLtoPDF.convert(options);
        setpdfFileView(true)
        setBtnLoader(false)
        setTimeout(() => {
            setpdfFileView(false)
        }, 5000);
        setFilePath(file.filePath);
      }
    };

    const gettimeOut = (timeout, duration) => {

        if(timeout.substring(1,2)==':'){
            var hour = parseInt(timeout.substring(0,1));
            var minute = parseInt(timeout.substring(2,4));
            var second = parseInt(timeout.substring(5,7));
        }
        else{
            var hour = parseInt(timeout.substring(0,2));
            var minute = parseInt(timeout.substring(3,5));
            var second = parseInt(timeout.substring(6,8));
        }

        var d_hour = parseInt(duration.substring(0,2));
        var d_minute = parseInt(duration.substring(3,5));
        var d_second = parseInt(duration.substring(6,8));

        return hour;
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
            <Text style={{fontSize:15, marginLeft:5, fontWeight:"bold"}}>Facial Recognition & Analytics</Text>
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
            distinctItems.map((row, i)=>(
                <View style={styles.Shadowbox} key={i}>
                    <View style={styles.profile}>
                        <Avatar.Image size={50} source={{uri:`data:image/webp;base64,${row.photo}`}} style={{backgroundColor:"white"}} />
                        <View style={{paddingLeft:10}}>
                            <Text style={styles.name}>{row.empName}</Text>
                            <Text style={styles.email}>User ID : <Text style={{fontWeight:"bold"}}>{row.userID}</Text></Text>
                        </View>
                    </View>

                    <View style={styles.description}>
                        <View style={styles.desc_part}>
                            <Text style={styles.label}>Time In</Text>
                            <Text style={styles.label_data}>
                                {
                                row.timeIn==null ?
                                '--:--:----'
                                :
                                row.timeIn
                                }
                            </Text>
                        </View>

                        <View style={styles.desc_part}>
                            <Text style={styles.label}>Time Out</Text>
                            <Text style={styles.label_data}>
                                {
                                row.timeOut==null ?
                                '--:--:----'
                                :
                                row.timeOut
                                }
                            </Text>
                        </View>

                        <View style={styles.desc_part}>
                            <Text style={styles.label}> Duration</Text>
                            <Text style={styles.label_data}>{row.duration}</Text>
                        </View>

                        <View style={styles.desc_part}>
                            <Text style={styles.label}>Date</Text>
                            <Text style={styles.label_data}>
                            {moment(row.recDateTime).format('DD:MM:YYYY')}
                            </Text>
                        </View>
                    </View>
                </View>
                ))}
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

export default FaceRecognitionSolution

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
        width:"24%",
        paddingTop:5
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