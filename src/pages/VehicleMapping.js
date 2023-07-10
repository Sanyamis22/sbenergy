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

const VehicleMapping = (props) => {
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

    const distinctItems1 = [...new Map(filterData.map(item => [item["name"], item])).values()];

    const dup1 = [];

    filterData.map((row)=>(
        dup1.unshift({'name':row.name, 'camera':row.camera, 'time':row.time})
    ))

    const todayDate = Moment(new Date()).format('DD-MM-YYYY');
      const dynamicData = distinctItems1.map((row,i)=>(
        
        `
        <div style="background:white; margin-top: 150px;">
        <p style="font-weight: bold; color:#2b2b2b; margin-bottom: 10px">${row.name}</p>
        <div style="border-top: 1px solid #e6e6e6">
        ${dup1.map((d_row)=>(
            d_row.name==row.name ?
          '<div style="width: 120px; height:100px; text-align: center; padding-top: 20px; border-right: 2px dashed #b5b5b5; float: left;"><img src="http://camfyvisionweb-001-site1.itempurl.com/newtemplate/assets/img/location.png" style="width:50px; height:50px"><p style="color:#2b2b2b; font-weight:bold; font-size: 14px; margin-top:5px">'+d_row.camera+'</p><p style="color:#2b2b2b; font-weight:bold; font-size:14px;  margin-top:-17px">'+d_row.time+'</p></div>'
          :null
        ))}
        </div>
        </div> 
        `
         
      ))
      const html = `
      <html>
<body style="padding:0px; margin:0px; font-family:Poppins, sans-serif !important; padding-left: 50px; padding-right:50px">
<div>
<p style="position: absolute; top:15; font-size: 12px">${Moment(todayDate).format('DD-MM-YYYY')}</p> 
<center>
      <h3 style="text-align:center; padding-top: 20px; font-weight: normal;">Vehicle Analytics-Vehicle Mapping</h3>
      <h3 style="font-weight: bold; margin-top: -20px">(Ayana, Karnataka, India)</h3>
</center>
      <p style="margin-bottom:0px; font-size: 14px">From : ${Moment(startdate).format('DD-MM-YYYY')} <br>
            To : ${Moment(enddate).format('DD-MM-YYYY')}</p>
     <div style="margin-top: -130px">
        ${dynamicData}
      </div>
</div>
</body>
</html>
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

    
    const distinctItems = [...new Map(anprData.map(item => [item["name"], item])).values()];
    const dup = [];
    
    anprData.map((row)=>(
        dup.unshift({'name':row.name, 'camera':row.camera, 'time':row.time})
    ))

    let appendANPRData = distinctItems.map((row, i)=>(              
            <View>
            <Text style={{marginTop:5, marginBottom:5, fontWeight:"bold"}}>{row.name} (Ayana)</Text>
                <ScrollView horizontal={true}  >
                <View style={{flexDirection:"row"}}>
                {dup.map((d_row)=>(
                d_row.name==row.name ?
                <View style={styles.box}>
                    <Image source={require('./../assets/images/map.jpg')} style={{width:45, height:45}} />
                    <Text style={{fontWeight:"bold", fontSize:12}}>{d_row.camera}</Text>
                    <Text style={{fontWeight:"bold", fontSize:11}}>{d_row.time}</Text>
                </View>
                :null
                ))}
                </View>
                </ScrollView>
            </View>
    

        // <View style={styles.TableBody} key={i}>
        // <Text style={{...styles.td, width:"25%"}}>{row.name}</Text>
        // <View style={{...styles.td, width:"15%", height:20}}>
        //     <TouchableOpacity onPress={()=>viewImage(`data:image/webp;base64,${row.imagedata}`)}>
        //     <Image source={{uri:`data:image/webp;base64,${row.imagedata}`}} style={{width:"100%", height:15, borderRadius:5}} />
        //     </TouchableOpacity>
        // </View>
        // <Text style={{...styles.td, backgroundColor:"#CF2929", width:"20%", paddingHorizontal:5, height:15, borderRadius:5, color:"white"}}>{row.camera}</Text>
        // <Text style={{...styles.td}}>{row.date}</Text>
        // <Text style={styles.td}>{row.time}</Text>
        // </View>
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
            <Text style={{fontSize:15, marginLeft:5, fontWeight:"bold"}}>Vehicle Mapping</Text>
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

export default VehicleMapping

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
        backgroundColor:"#F9FAFB",
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

    box:{
        backgroundColor:"white",
        height:100,
        width:100,
        borderRightWidth:1,
        borderStyle: 'dashed',
        borderRadius:1,
        borderColor:"#e6e6e6",
        shadowColor: '#e6e6e6',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2},
        shadowRadius: 10,
        elevation: 2,
        alignItems:"center",
        paddingTop:10
    }
});