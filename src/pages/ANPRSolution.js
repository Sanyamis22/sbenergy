import React,{useEffect, useState} from 'react';
import {ScrollView, Modal, Linking, Alert, PDFReader, Platform, Dimensions, PermissionsAndroid, Image, StyleSheet, View, BackHandler, Text, TextInput, TouchableOpacity} from 'react-native';
import {Appbar, Badge} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import {fetchData, statusOff, getANPRReport} from './../redux/Actions/ANPRAction'
import { Bubbles } from 'react-native-loader';
import OfflinePopup from '../components/OfflinePopup';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OpenPdf from 'react-native-open-pdf';
import ImageViewer from 'react-native-image-zoom-viewer';
import AlarmModal from '../components/AlarmModel';
import DateTimePicker from '@react-native-community/datetimepicker';
import {alarmNotice} from './../redux/Actions/AlarmAction';
import Moment from 'moment';

const ANPRSolution = (props) => {
    const[startdate, setStartdate] = useState(new Date());
    const[enddate, setEnddate] = useState(new Date());
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
        return reduxState.ANPR.loader
      });

      const download_request = useSelector((reduxState)=>{
          return reduxState.ANPR.status
      })

        const check_status = useSelector((reduxState)=>{
            return reduxState.ANPR.status
        });


      const dispatch = useDispatch()
      const anprData = useSelector((reduxStatus)=>{
          return reduxStatus.ANPR.dataList;
      });

      const filterData = useSelector((reduxStatus)=>{
        return reduxStatus.ANPR.filterData;
    });

      const dynamicData = filterData.map((row,i)=>(
        `<tr style="padding:20px; height:40px; color:black; font-weight:bold;  height:50px; width:100%; text-align:center">
        <td style="width:10%; border:1px solid black;">${i+1}</td>
        <td style="width:18%; border:1px solid black;">${row.name}</td>
        <td style="width:18%; border:1px solid black;"><img src="data:image/webp;base64,${row.imagedata}" style="width:100%;"></td>
        <td style="width:18%; border:1px solid black;">${row.camera}</td>
        <td style="width:18%; border:1px solid black;">${row.date}</td>
        <td style="width:18%; border:1px solid black;">${row.time}</td>
        </tr>`
      ))
      const html = `
      <center><h3 style="text-align:center">ANPR Report</h3></center>
      <p style="margin-bottom:0px">${Moment(startdate).format('DD-MM-YYYY')}-${Moment(enddate).format('DD-MM-YYYY')}</p>
      <table style="width:100%;">
      <tr style="padding:20px; height:40px; color:black; height:50px; font-weight:bold; width:100%; text-align:center">
      <th style="width:10%; border:1px solid black;">S.No.</th>
      <th style="width:18%; border:1px solid black;">LP Number</th>
      <th style="width:18%; border:1px solid black;">LP Image</th>
      <th style="width:18%; border:1px solid black;">LP Camera</th>
      <th style="width:18%; border:1px solid black;">LP Date</th>
      <th style="width:18%; border:1px solid black;">LP Time</th>
      </tr>
      ${dynamicData}
      </table>
      `;

      const t_time = Moment(new Date()).format('DD-MM-YYYY-hh-mm-ss');
      
      const createpdf = async () => {
        setFilename('anpr_solution-'+ t_time)    
        if (await isPermitted()) {
          let options = {
            //Content to print
            html:html,
            //File Name
            fileName: 'anpr_solution-'+ t_time,
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

      
    
    let appendANPRData = anprData.map((row, i)=>(
        <View style={styles.TableBody} key={i}>
        <Text style={{...styles.td, width:"25%"}}>{row.name}</Text>
        <View style={{...styles.td, width:"15%", height:20}}>
            <TouchableOpacity onPress={()=>viewImage(`data:image/webp;base64,${row.imagedata}`)}>
            <Image source={{uri:`data:image/webp;base64,${row.imagedata}`}} style={{width:"100%", height:15, borderRadius:5}} />
            </TouchableOpacity>
        </View>
        <Text style={{...styles.td, backgroundColor:"#CF2929", width:"20%", paddingHorizontal:5, height:15, borderRadius:5, color:"white"}}>{row.camera}</Text>
        <Text style={{...styles.td}}>{row.date}</Text>
        <Text style={styles.td}>{row.time}</Text>
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
    dispatch(getANPRReport({StartDate:Moment(startdate).format('DD/MM/YYYY'), EndDate:Moment(enddate).format('DD/MM/YYYY')}))
    setBtnLoader(true)
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
            <Text style={{fontSize:15, marginLeft:5, fontWeight:"bold"}}>ANPR Solution</Text>
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
                <Text style={styles.th}>LP Number</Text>
                <Text style={styles.th}>LP Image</Text>
                <Text style={styles.th}>Camera</Text>
                <Text style={styles.th}>Date</Text>
                <Text style={styles.th}>Time</Text>
            </View>

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

            
        </View>
    )
}

export default ANPRSolution

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

  
});