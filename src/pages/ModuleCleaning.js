import React, {useState, useEffect} from 'react';
import {ScrollView, Modal, Linking, Alert, PDFReader, Platform, Dimensions, PermissionsAndroid, Image, StyleSheet, View, BackHandler, Text, TextInput, TouchableOpacity} from 'react-native';

import {API_URL} from './../config/API_URL';
import {Appbar, Badge, Avatar} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import Moment from 'moment';
import axios from 'axios';
import { Bubbles } from 'react-native-loader';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import OpenPdf from 'react-native-open-pdf';

const ModuleCleaning = props => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [visiblePopup, setVisiblePopup] = useState(false);
  const [pdfFileView, setpdfFileView] = useState(false);
  const [filename, setFilename] = useState('');
  const [filePath, setFilePath] = useState('');


  const[startdate, setStartdate] = useState(new Date());
  const[enddate, setEnddate] = useState(new Date());
  const [visibleStartDatePicker, setVisibleStartDatePicker] = useState(false);
  const [visibleEndDatePicker, setVisibleEndDatePicker] = useState(false);



  useEffect(async () => {
    setLoading(true);
    let response = await axios.get(`${API_URL}Fire/GetCleaningRecord_Data`);
    if (response.status) {
      console.log(response.data)
      setData(response.data);
    } else {
    }
    setLoading(false);
  }, []);

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

  const getReport = async () => {
    setLoading(true)
    let response = await axios.get(`http://ayanapower-001-site1.itempurl.com/api/Fire/GetFire_Record_Report?filterType=All&startdate=${Moment(startdate).format('DD/MM/YYYY')}&enddate=${Moment(enddate).format('DD/MM/YYYY')}`)
  
    
    const dynamicData = response.data.map((row,i)=>(
      `<tr style="padding:20px; height:40px; color:black; font-weight:bold;  height:50px; width:100%; text-align:center">
      <td style="width:10%; border:1px solid black;">${i+1}</td>
      <td style="width:18%; border:1px solid black;">${row.camera}</td>
      <td style="width:18%; border:1px solid black;"><img src="data:image/webp;base64,${row.imagedata}" style="width:100%;"></td>
      <td style="width:18%; border:1px solid black;">${row.camera_id}</td>
      <td style="width:18%; border:1px solid black;">${row.datetime}</td>
      <td style="width:18%; border:1px solid black;">${row.detection_type}</td>
      </tr>`
    ))
    const html = `
    <center><h3 style="text-align:center">Module Cleaning Report</h3></center>
    <p style="margin-bottom:0px">${Moment(startdate).format('DD-MM-YYYY')}-${Moment(enddate).format('DD-MM-YYYY')}</p>
    <table style="width:100%;">
    <tr style="padding:20px; height:40px; color:black; height:50px; font-weight:bold; width:100%; text-align:center">
    <th style="width:10%; border:1px solid black;">S.No.</th>
    <th style="width:18%; border:1px solid black;"> Camera Name</th>
    <th style="width:18%; border:1px solid black;"> Image</th>
    <th style="width:18%; border:1px solid black;"> Camera ID</th>
    <th style="width:18%; border:1px solid black;"> RecDateTime</th>
    <th style="width:18%; border:1px solid black;"> Detection Type</th>
    </tr>
    ${dynamicData}
    </table>
    `;

    const t_time = Moment(new Date()).format('DD-MM-YYYY-hh-mm-ss');

    const createpdf = async () => {
      setFilename('module_cleaning-'+ t_time)    
      if (await isPermitted()) {
        let options = {
          //Content to print
          html:html,
          //File Name
          fileName: 'module_cleaning-'+ t_time,
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

    createpdf();

    setLoading(false)
}







  return (
    <View style={styles.container}>

            
      <Appbar.Header style={styles.appbar}>
        <TouchableOpacity
          onPress={() => props.navigation.openDrawer()}
          style={{marginTop: 5}}>
          <Image
            source={require('./../assets/images/bar.png')}
            style={{width: 30, height: 30}}
          />
        </TouchableOpacity>
        <Text style={{fontSize: 15, marginLeft: 5, fontWeight: 'bold'}}>
          Module Cleaning
        </Text>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('Alarm')}
          style={{
            alignSelf: 'flex-end',
            position: 'absolute',
            right: 50,
            top: 21,
          }}>
          {/* <Badge style={{position:'absolute', top:-10, left:8, zIndex:5}}>1</Badge>
            <Image source={require('./../assets/images/bell.png')} style={{width:20, height:22}} /> */}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => logout()}
          style={{
            alignSelf: 'flex-end',
            position: 'absolute',
            right: 15,
            top: 20,
          }}>
          <Image
            source={{
              uri: 'https://image.flaticon.com/icons/png/512/18/18183.png',
            }}
            style={{width: 20, height: 20}}
          />
        </TouchableOpacity>
      </Appbar.Header>


    


      <View style={{flex:1}}>

    

     

      { loading ? <View style={{flex:1, alignItems:"center", justifyContent:'center'}}>
                    <Bubbles size={10} color="black" />
                    </View> 
                    :
                    <ScrollView>
                      
                    {data.map(item => (
                      <View style={styles.Shadowbox}>
                        <View style={styles.profile}>
                          <Avatar.Image
                            size={50}
                            source={{uri: `data:image/webp;base64,${item.photo}`}}
                            style={{backgroundColor: 'white'}}
                          />
                          <View style={{paddingLeft: 10}}>
                          <Text style={styles.email}>
                              Camera Name :{' '}
                            <Text style={styles.name}>{item.camera}</Text></Text>
                            <Text style={styles.email}>
                              Camera ID :{' '}
                              <Text style={{fontWeight: 'bold'}}>{item.camera_id}</Text>
                            </Text>
                          </View>
                        </View>
              
                        <View style={styles.description}>
                          {/* <View style={styles.desc_part}>
                            <Text style={styles.label}> Time</Text>
                            <Text style={styles.label_data}>{item.time}</Text>
                          </View>
              
                          <View style={styles.desc_part}>
                            <Text style={styles.label}>Date</Text>
                            <Text style={styles.label_data}>{item.date}</Text>
                          </View> */}
              
                          <View style={styles.desc_part}>
                            <Text style={styles.label}>RecDateTime</Text>
                            <Text style={styles.label_data}>{item.datetime}</Text>
                          </View>

                          
                          <View style={styles.desc_part}>
                            <Text style={styles.label}> Detection Type</Text>
                            <Text style={styles.label_data}>{item.detection_type}</Text>
                          </View>

                        
                        </View>
                      </View>
                    ))}</ScrollView>

}
      </View>

     
    

      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 5,
          justifyContent: 'space-between',
          backgroundColor: 'white',
        }}>
        <TouchableOpacity
          onPress={() => setVisiblePopup(true)}
          style={{...styles.downloadBtn, width: '100%'}}>
          {btnLoader ? (
            <View style={{alignItems: 'center'}}>
              <Bubbles size={10} color="black" />
            </View>
          ) : (
            <>
              <Text style={{color: '#446DFF', fontSize: 12, marginTop: 5}}>
                DOWNLOAD REPORT{' '}
              </Text>
              <Image
                source={require('./../assets/images/download.png')}
                style={styles.download}
              />
            </>
          )}
        </TouchableOpacity>
      </View>

      
{pdfFileView ?
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        position:"absolute",
        zIndex:1,
        bottom:0,
        height:50,
        borderTopWidth:1,
        borderColor:"#e6e6e6",
        width:"100%",
        flexDirection:"row"
      }}
    >
   
    
      <Text>File is Downloaded</Text>
      <TouchableOpacity onPress={()=>OpenPdf.open(`file:///storage/emulated/0/docs/${filename}.pdf`)} style={{paddingLeft:20}}><Text style={{color:"green", marginTop:2}}> Open </Text></TouchableOpacity>
      
    </View>
:null}



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
           
                {loading  ? 
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
  );
};

export default ModuleCleaning;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appbar: {
    backgroundColor: 'white',
    color: 'black',
  },
  Shadowbox_row: {
    flexDirection: 'row',
  },

  Shadowbox: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    shadowColor: '#e6e6e6',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 10,
    elevation: 2,
    width: '100%',
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
  },

  Shadowbox_under: {
    flexDirection: 'row',
  },

  container_box: {
    paddingHorizontal: 10,
    backgroundColor: '#F8F8F8',
    flex: 1,
  },

  Search: {
    borderWidth: 1,
    borderColor: '#e6e6e6',
    marginTop: 10,
    borderRadius: 5,
    paddingLeft: 40,
  },

  SearchIcon: {
    position: 'absolute',
    width: 20,
    marginTop: 26,
    marginLeft: 15,
    height: 20,
  },

  download: {
    height: 30,
    width: 30,
  },

  downloadBtn: {
    width: '100%',
    height: 50,
    paddingTop: 10,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#446DFF',
    flexDirection: 'row',
    marginTop: 10,
  },

  profile: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingBottom: 5,
    borderColor: '#e6e6e6',
  },

  name: {
    fontWeight: 'bold',
    fontSize: 13,
    marginTop: 5,
  },

  email: {
    fontSize: 12,
  },

  description: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  desc_part: {
    width: '40%',
    paddingTop: 5,
  },

  label: {
    color: 'gray',
    fontSize: 11,
  },

  label_data: {
    fontWeight: 'bold',
    color: '#232323',
    fontSize: 12,
    marginTop: 1,
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
