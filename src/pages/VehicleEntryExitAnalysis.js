import React,{useEffect, useState} from 'react';
import {ScrollView, Modal, Linking, Alert, PDFReader, TextInput, Platform, Dimensions, PermissionsAndroid, Image, StyleSheet, View, BackHandler, Text,  TouchableOpacity} from 'react-native';
import {Appbar, Avatar, Badge} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import {fetchData, statusOff, getANPRReport} from './../redux/Actions/VehicleEntryExitAnalysisAction';
import { Bubbles } from 'react-native-loader';
import OfflinePopup from '../components/OfflinePopup';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OpenPdf from 'react-native-open-pdf';
import ImageViewer from 'react-native-image-zoom-viewer';
import AlarmModal from '../components/AlarmModel';
import {Modal as PaperModal} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import {alarmNotice} from './../redux/Actions/AlarmAction';
// import Spinner from 'react-native-loading-spinner-overlay';
import Moment from 'moment';
import DocumentPicker from 'react-native-document-picker';
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";
import {addVehicle, statusOff_2, getVehicleEntryReport} from './../redux/Actions/VehicleEntryExitAnalysisAction'


const VehicleEntryExitAnalysis = (props) => {
    const[startdate, setStartdate] = useState(new Date());
    const[enddate, setEnddate] = useState(new Date());
    const [inputData, setInputData] = useState({
        Owner:"",
        Number:"",
        Type:"",
        file:null,
        Error:false
    })
    const [visibleStartDatePicker, setVisibleStartDatePicker] = useState(false);
    const [visibleEndDatePicker, setVisibleEndDatePicker] = useState(false);
    const [filePath, setFilePath] = useState('');
    const [filter, setFilter] = useState([]);
    const [SearchInput, setSearchInput] = useState();
    const [pdfFileView, setpdfFileView] = useState(false);
    const [btnLoader, setBtnLoader] = useState(false);
    const [zoomImage, setZoomImage] = useState('');
    const [filename, setFilename] = useState('');
    const [modelVisible, setModelVisible] = useState(false);
    const [visiblePopup, setVisiblePopup] = useState(false);
    const [visible, setVisible] = useState(false);
    const [imageName, setimageName] = useState('');
    const [imageUri, setimageUri] = useState(null)
    
    
    const isPermitted = async () => {
        if (Platform.OS === 'android') {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
              {
                title: 'External Storage Write Permission',
                message: 'App needs access to Storage data',
              },
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
          } catch (err) {
            alert('Write permission err', err);
            return false;
          }
        } else {
          return true;
        }
      };

      const loader = useSelector((reduxState)=>{
        return reduxState.VehicleEntry.loader
      });

      const insertloader = useSelector((reduxState)=>{
        return reduxState.VehicleEntry.insertLoader
      });

      const sucessMsg = useSelector((reduxState)=>{
        return reduxState.VehicleEntry.insertStatus
      });

      const download_request = useSelector((reduxState)=>{
          return reduxState.VehicleEntry.status
      })

        const check_status = useSelector((reduxState)=>{
            return reduxState.VehicleEntry.status
        });


      const dispatch = useDispatch()
      const VehicleEntry = useSelector((reduxStatus)=>{
          return reduxStatus.VehicleEntry.dataList;
      });

      const filterData = useSelector((reduxStatus)=>{
        return reduxStatus.VehicleEntry.filterData;
    });

      const dynamicData = filterData.map((row,i)=>(
        `<tr style="padding:20px; height:40px; color:black; font-weight:bold;  height:50px; width:100%; text-align:center">
        <td style="width:5%; border-right:1px solid #272727; border-bottom: 1px solid #272727; padding:10px"">${i+1}</td>
        <td style="width:15%; border-right:1px solid #272727; border-bottom: 1px solid #272727; padding:0px""><img src="data:image/webp;base64,${row.photo}" style="width:100%;"></td>
        <td style="width:10%; border-right:1px solid #272727; border-bottom: 1px solid #272727; padding:10px"">${row.empName}</td>
        <td style="width:10%; border-right:1px solid #272727; border-bottom: 1px solid #272727; padding:10px"">${row.cameraName}</td>
        <td style="width:10%; border-right:1px solid #272727; border-bottom: 1px solid #272727; padding:10px"">${
            row.timeIn==null ?
            '--:--:----'
            :
            row.timeIn
            }</td>
        <td style="width:10%; border-right:1px solid #272727; border-bottom: 1px solid #272727; padding:10px"">${
            row.timeOut==null ?
            '--:--:----'
            :
            row.timeOut
            }</td>
        <td style="width:10%; border-right:1px solid #272727; border-bottom: 1px solid #272727; padding:10px"">${row.duration}</td>
        <td style="width:10%; border-right:1px solid #272727; border-bottom: 1px solid #272727; padding:10px"">${row.recDateTime}</td>
        <td style="width:10%; border-right:1px solid #272727; border-bottom: 1px solid #272727; padding:10px"">${row.empType}</td>
        </tr>`
      ))
      const todayDate = Moment(new Date()).format('DD-MM-YYYY');
      const html = `
      <div><p style="float:left; margin-top:-2px">${todayDate}</p><center><h4 style="text-align:center; margin-left:-20px">Vehicle Analytics-Vehicle Detail</h4></center></div>
          <center><h4 style="text-align:center; margin-top:-10px">(Ayana, Karnataka, India)</h4></center>
          <p style="margin-bottom:-20px; background-color:white; height:50px; width:200px">From : ${Moment(startdate).format('DD-MM-YYYY')} <br> to: ${Moment(enddate).format('DD-MM-YYYY')}</p>
          <table style="width:100%; border-top:1px solid #272727; border-left: 1px solid #272727;">
      <tr style="height:50px; padding:20px; color:#272727; font-weight:bold; width:100%; text-align:center;">
      <th style="width:5%; border-right:1px solid #272727; border-bottom: 1px solid #272727; padding:10px">S.No.</th>
      <th style="width:15%; border-right:1px solid #272727; border-bottom: 1px solid #272727; padding:10px">Photo</th>
      <th style="width:10%; border-right:1px solid #272727; border-bottom: 1px solid #272727; padding:10px">Owner</th>
      <th style="width:10%; border-right:1px solid #272727; border-bottom: 1px solid #272727; padding:10px">LP Number</th>
      <th style="width:10%; border-right:1px solid #272727; border-bottom: 1px solid #272727; padding:10px">Time In</th>
      <th style="width:10%; border-right:1px solid #272727; border-bottom: 1px solid #272727; padding:10px">Time Out</th>
      <th style="width:10%; border-right:1px solid #272727; border-bottom: 1px solid #272727; padding:10px">Duration</th>
      <th style="width:10%; border-right:1px solid #272727; border-bottom: 1px solid #272727; padding:10px">Date</th>
      <th style="width:10%; border-right:1px solid #272727; border-bottom: 1px solid #272727; padding:10px"">Vehicle Type</th>
      </tr>
      ${dynamicData}
      </table>
      `;

      const t_time = Moment(new Date()).format('DD-MM-YYYY-hh-mm-ss');
      
      const createpdf = async () => {
        setFilename('Vehicle Analytics-Vehicle Detail-'+ t_time)    
        if (await isPermitted()) {
          let options = {
            //Content to print
            html:html,
            //File Name
            fileName: 'Vehicle Analytics-Vehicle Detail-'+ t_time,
            //File directory
            directory: 'docs',
          };
          let file = await RNHTMLtoPDF.convert(options);
          
          setBtnLoader(false)
          setVisiblePopup(false)
          setFilePath(file.filePath);
          setpdfFileView(true);
          setTimeout(() => {
            setpdfFileView(false)
          }, 5000);
        }
      };

     
      useEffect(()=>{
        setVisiblePopup(false)
        setpdfFileView(false)
        dispatch(fetchData());
      },[]);      

      if(check_status=='success') {
        createpdf();
        dispatch(statusOff());
      }

      
      const fileUpload = async() => {
        try {
            const res = await DocumentPicker.pick({
              type: [DocumentPicker.types.images],
            });
            setimageName(res.name)
            setInputData({...inputData, file:res})
            console.log(
              res,
              'd',
              res.type, // mime type
              'd',
              res.name,
              'd',
              res.size
            );
          } catch (err) {
            if (DocumentPicker.isCancel(err)) {
              // User cancelled the picker, exit any dialogs or menus and move on
            } else {
              throw err;
            }
          }
      }
    
    let appendANPRData = VehicleEntry.map((row, i)=>(
        <View style={styles.Shadowbox}>
                    <View style={styles.profile}>
                        <Image style={{width:150, height:31, borderRadius:5, marginTop:20}} source={{uri:`data:image/png;base64,${row.photo}`}} />
                        <View style={{paddingLeft:10}}>
                            <Text style={styles.name}>Owner : {row.empName}</Text>
                            <Text style={styles.email}>LP Number : <Text style={{fontWeight:"bold"}}> {row.cameraName}</Text></Text>
                            <Text style={styles.email}>Vehicle Type : <Text style={{fontWeight:"bold"}}>{row.empType}</Text></Text>
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
                            <Text style={styles.label_data}>
                                {row.duration}
                            </Text>
                        </View>

                        <View style={styles.desc_part}>
                            <Text style={styles.label}>Date</Text>
                            <Text style={styles.label_data}>
                                {row.recDateTime}
                            </Text>
                        </View>
                    </View>
                </View>
     ));
    
    
 

    const logout = () => {
        AsyncStorage.clear();
        props.navigation.navigate('AuthNavigation')
    }


    const images = [{
        // Simplest usage.
        url: zoomImage,
     
    }]

    const viewImage = (imgData) => {
        setZoomImage(imgData)
        setModelVisible(true)
    }



    const onchangeStart = (event, selectedDate) => {
        const currentDate = selectedDate || startdate;
        setStartdate(currentDate);
        setVisibleStartDatePicker(false)
      };
    
      const onChangeEnd = (event, selectedDate) => {
        const currentDate = selectedDate || enddate;
        setEnddate(currentDate);
        setVisibleEndDatePicker(false)
      };

const getReport = () => {
    dispatch(getVehicleEntryReport({StartDate:Moment(startdate).format('DD/MM/YYYY'), EndDate:Moment(enddate).format('DD/MM/YYYY')}))
    setBtnLoader(true)
}

const alarmDisable = () => {
    props.navigation.navigate('Alarm');
    dispatch(alarmNotice());
}

    
const submitData = () => {
    if(inputData.Owner==''){
        showMessage({
            message: "Owner field is required",
            type: "default",
            backgroundColor: "#DC3345",
            color: "white",
          });        
        return;
    }

    if(inputData.Number==''){
        showMessage({
            message: "Number field is required",
            type: "default",
            backgroundColor: "#DC3345",
            color: "white",
          });        
        return;
    }

    if(inputData.Type==''){
        showMessage({
            message: "Type field is required",
            type: "default",
            backgroundColor: "#DC3345",
            color: "white", 
          });        
        return;
    }

    dispatch(addVehicle(inputData))
}

var stateset = false;
    if(sucessMsg){
        showMessage({
            message: "Vehicle Added Successfully",
            type: "default",
            backgroundColor: "#2BC87D",
            color: "white", 
          });  
      
        dispatch(statusOff_2())

        if(!stateset){
            setInputData({Owner:"", Number:"", Type:"", file:null})
            setVisible(false);
            stateset = true
            setTimeout(() => {
                stateset = false
            }, 3000);
        }

    }



    return(
        <View style={styles.container}>
         
        <Appbar.Header style={styles.appbar}>
        <FlashMessage position="top" style={styles.flashMsg} />
        <TouchableOpacity onPress={()=> props.navigation.openDrawer()} style={{marginTop:5}}>
            <Image source={require('./../assets/images/bar.png')} style={{width:30, height:30}} />
            </TouchableOpacity>
            <Text style={{fontSize:15, marginLeft:5, fontWeight:"bold"}}>Vehicle Entry Exit Analysis</Text>
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
            {/* <View style={styles.TableHead}>
                <Text style={styles.th}>LP Number</Text>
                <Text style={styles.th}>LP Image</Text>
                <Text style={styles.th}>Camera</Text>
                <Text style={styles.th}>Date</Text>
                <Text style={styles.th}>Time</Text>
            </View> */}

            <ScrollView showsVerticalScrollIndicator={false}>
            {
            loader===true ? 
            <View style={{alignItems:"center", marginTop:"20%"}}>
            <Bubbles size={10} color="black" />
            </View>
            :
            filter.length===0 ?
            appendANPRData
            :
            filter
            }

    
        

            <View style={{marginBottom:50}}></View>
            </ScrollView>
        </View>
        </View>
        {pdfFileView ?
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        position:"absolute",
        zIndex:10000,
        bottom:0,
        height:50,
        borderTopWidth:1,
        borderColor:"#e6e6e6",
        width:"100%",
        flexDirection:"row"
      }}
    >
   
    
      <Text>File is Downloaded</Text>
      <TouchableOpacity onPress={()=>OpenPdf.open(`file:///storage/emulated/0/docs/${filename}.pdf`)} tyle={{paddingLeft:20}}><Text style={{color:"green", marginTop:2}}> Open </Text></TouchableOpacity>
      
    </View>
:null}


<View style={{flexDirection:"row", paddingHorizontal:5, justifyContent:"space-between", backgroundColor:"white"}}>
        <TouchableOpacity onPress={()=>setVisiblePopup(true)} style={{...styles.downloadBtn, width:"100%"}}>
            {btnLoader ?
            <View style={{alignItems:"center", }}>
            <Bubbles size={10} color="black" />
            </View>
            :
            <>
            <Text style={{color:"#446DFF", fontSize:12, marginTop:5}}>DOWNLOAD REPORT </Text>
            <Image source={require('./../assets/images/download.png')} style={styles.download} />
            </>
            }
            
        </TouchableOpacity>
        </View>
        <AlarmModal AlarmokBtn={<TouchableOpacity onPress={()=>alarmDisable()}
          style={{width:100, height:30, borderWidth:1, borderColor:"#446DFF", borderRadius:5, marginTop:10, alignSelf:'center'}}>
              <Text style={{color:'#446DFF', alignSelf:'center', marginTop:5}}>Ok</Text>
              
            </TouchableOpacity>} />
        <OfflinePopup />



            <Modal visible={modelVisible} transparent={true} onRequestClose={()=>setModelVisible(false)}>
                <ImageViewer imageUrls={images}/>
            </Modal>


            <Modal visible={visiblePopup}>
                <View style={{alignItems:"flex-end"}}>
                <TouchableOpacity style={{justifyContent:"flex-end", width:30, borderRadius:20, height:30, backgroundColor:"white"}} onPress={()=>setVisiblePopup(false)}>
                    <Text style={{alignSelf:"center", fontSize:20, fontWeight:"bold" }}>X</Text>
                </TouchableOpacity>
                </View>
                <View style={{width:"100%", flex:1, justifyContent:"center", paddingHorizontal:10}}>
            <View style={styles.card_header}>
                <Text style={{color:"#446DFF", textAlign:"center", marginTop:15}}>Download Report</Text>
            </View>

        <View style={styles.card_body}>
            <TouchableOpacity style={styles.dateField} onPress={()=>setVisibleStartDatePicker(true)}>
                <Text>{Moment(startdate).format('YYYY-MM-DD')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{...styles.dateField, marginTop:10}} onPress={()=>setVisibleEndDatePicker(true)}>
                <Text>{Moment(enddate).format("YYYY-MM-DD")}</Text>
            </TouchableOpacity>
           
                {download_request=='loading' ? 
                <TouchableOpacity style={styles.downloadBtn}>
                    <View style={{alignItems:"center"}}>
                    <Bubbles size={10} color="black" />
                    </View>
                </TouchableOpacity>
                : 
                <TouchableOpacity style={styles.downloadBtn} onPress={()=>getReport()}>
                <Text style={{color:"#446DFF", marginTop:5}}>Get Report</Text>
                </TouchableOpacity>
                }

                
           
            {visibleStartDatePicker ?
                <DateTimePicker
                testID="dateTimePicker"
                value={startdate}
                mode={'date'}
                date={startdate}
                is24Hour={true}
                display="default"
                onChange={onchangeStart}
                />
                :null
                }

                {visibleEndDatePicker ?
                <DateTimePicker
                testID="dateTimePicker"
                value={enddate}
                mode={'date'}
                is24Hour={true}
                display="default"
                onChange={onChangeEnd}
                />
                :null
                }
            </View>
        </View>
            </Modal>

            <TouchableOpacity onPress={()=>setVisible(true)}
            style={{backgroundColor:"#446DFF", position:"absolute", zIndex:999999999999999999999999999999999999, bottom:60, right:10, width:50, height:50, borderRadius:50}}>
                <Text style={{color:"white", fontSize:30, alignSelf:"center", marginTop:2}}>+</Text>
            </TouchableOpacity>

        <PaperModal visible={visible} style={styles.paperModal} onDismiss={()=>setVisible(false)}>
            <TouchableOpacity onPress={()=>alert('d')}
            style={{position:"absolute", top:"-10%", right:"-10%", backgroundColor:"#0A0A0A", width:30, height:30, borderRadius:20}}>
                <Text style={{color:"white", fontWeight:"bold", alignSelf:"center", marginTop:5}}>X</Text>
            </TouchableOpacity>

                <View style={{marginTop:10}}>
                    <Text>Owner:</Text>
                    <TextInput style={{...styles.input}} onChangeText={(txt)=>setInputData({...inputData, Owner:txt})} value={inputData.Owner} />
                </View>
                <View style={{marginTop:10}}>
                    <Text>Number:</Text>
                    <TextInput style={styles.input} onChangeText={(txt)=>setInputData({...inputData, Number:txt})} value={inputData.Number} />
                </View>
                <View style={{marginTop:10}}>
                    <Text>Type:</Text>
                    <TextInput style={styles.input} onChangeText={(txt)=>setInputData({...inputData, Type:txt})} value={inputData.Type} />
                </View>

                <View>
                
                <TouchableOpacity onPress={()=>fileUpload()} style={{backgroundColor:"white", borderWidth:2, borderColor:"#446DFF", marginTop:20, height:45, marginBottom:20, borderRadius:5,}}>
                    <Text style={{color:"#446DFF", alignSelf:"center", marginTop:-1,}}>Upload File
                    <Image source={{uri:"https://i.pinimg.com/originals/04/54/7c/04547c2b354abb70a85ed8a2d1b33e5f.png"}} style={{width:25, height:25}} />
                    </Text>
                    <Text style={{marginTop:15, marginBottom:-10}}>{imageName}</Text>    
                </TouchableOpacity>
                </View>

                {insertloader ?
                <TouchableOpacity style={{backgroundColor:"#446DFF", marginTop:20, height:45, marginBottom:20, borderRadius:5}}>
                     <View style={{alignItems:"center", marginTop:"5%"}}>
                        <Bubbles size={10} color="white" />
                        </View>
                </TouchableOpacity>
                :

               <TouchableOpacity onPress={()=>submitData()} style={{backgroundColor:"#446DFF", marginTop:20, height:45, marginBottom:20, borderRadius:5}}>
                    <Text style={{color:"white", alignSelf:"center", marginTop:12,}}>Add Vehicle</Text>
                </TouchableOpacity>
            }
        </PaperModal>
        </View>
    )
}

export default VehicleEntryExitAnalysis

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
        backgroundColor:"#F5F5F5",
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

    searchBtn:{
        alignItems:"center",
        backgroundColor:"#FD9A13",
        marginTop:10,
        padding:15,
        borderRadius:5
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
        fontSize:11
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
        fontSize:10
    },

    reportPopup:{
        backgroundColor:"black",
        
    },

    dateField:{
        borderWidth:1,
        borderColor:"#e6e6e6",
        alignItems:"center",
        padding:15,
        borderRadius:5
    },

    card_header:{
        backgroundColor:"white",
        elevation:3,
        paddingHorizontal:10,
        borderRadius:5,
        borderWidth:1,
        borderColor:"#446DFF",
        width:"100%",
        height:50,
        marginTop:20,
        zIndex:10000
    },

    card_body:{
        backgroundColor:"white",
        elevation:1,
        borderRadius:5,
        width:"100%",
        height:260,     
        paddingTop:30,
        paddingHorizontal:20,
    },

    paperModal:{
        backgroundColor:'white', 
        height:440, 
        width:300, 
        borderRadius:5,         
        justifyContent:'center', 
        position:'absolute', 
        top:'15%',
        left:'8%', 
        padding:20
    },

    input:{
        borderWidth:1,
        borderColor:"#5C748B",
        height:45,
        borderRadius:5,
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
});