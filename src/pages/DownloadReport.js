import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  Linking,
  Alert,
  PDFReader,
  Platform,
  Picker,
  Dimensions,
  PermissionsAndroid,
  Image,
  StyleSheet,
  View,
  BackHandler,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableOpacityComponent,
} from 'react-native';
import {Appbar, Badge} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import {fetchData} from './../redux/Actions/ANPRAction';
import {Bubbles} from 'react-native-loader';
import OfflinePopup from '../components/OfflinePopup';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import Moment from 'moment';
import {alarmNotice} from './../redux/Actions/AlarmAction';
import OpenPdf from 'react-native-open-pdf';
import AlarmModal from '../components/AlarmModel';
import {getReport, statusOff} from './../redux/Actions/DownloadReportAction';

const DownloadReport = props => {
  const [filePath, setFilePath] = useState('');
  const [filter, setFilter] = useState([]);
  const [filename, setFilename] = useState('');
  const [btnLoader, setBtnLoader] = useState(false);
  const [selectedValue, setSelectedValue] = useState('All');
  const [pdfFileView, setpdfFileView] = useState(false);
  const [startdate, setStartdate] = useState(new Date());
  const [enddate, setEnddate] = useState(new Date());
  const [visibleStartDatePicker, setVisibleStartDatePicker] = useState(false);
  const [visibleEndDatePicker, setVisibleEndDatePicker] = useState(false);
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

  const dispatch = useDispatch();

  const t_time = Moment(new Date()).format('DD-MM-YYYY-hh-mm-ss');

  const createPDF = async htmll => {
    setFilename('FacialAnalytics-' + t_time);
    if (await isPermitted()) {
      let options = {
        //Content to print
        html: htmll,
        //File Name
        fileName: 'FacialAnalytics-' + t_time,

        //File directory
        directory: 'docs',
      };
      let file = await RNHTMLtoPDF.convert(options);
      setpdfFileView(true);
      setBtnLoader(false);
      setTimeout(() => {
        setpdfFileView(false);
      }, 5000);
      setFilePath(file.filePath);
    }
  };

  useEffect(() => {}, []);

  const dropdownItem = [
    'All',
    'Alarm',
    'Full-Time',
    'Part-Time',
    'Contract Based',
    'Trainee/Internship',
    'Apprentice',
    'Contractor',
    'Sub-contractor',
    'Employment agency staff',
    'Casual employee',
    'Shitft-worker',
    'Daily hire',
    'NoExit',
    'weekly hire',
    'Probation',
    'Black-List',
    'Suspect',
    'Out-worker',
    'Recognition',
  ];

  const logout = () => {
    AsyncStorage.clear();
    props.navigation.navigate('AuthNavigation');
  };

  const loader = useSelector(reduxState => {
    return reduxState.DownloadReport.loader;
  });

  const showDatePicker = () => {
    setVisibleDatePicker(true);
  };

  const onchangeStart = (event, selectedDate) => {
    const currentDate = selectedDate || startdate;
    setStartdate(currentDate);
    setVisibleStartDatePicker(false);
  };

  const onChangeEnd = (event, selectedDate) => {
    const currentDate = selectedDate || enddate;
    setEnddate(currentDate);
    setVisibleEndDatePicker(false);
  };

  const onClickdownloadReport = () => {
    dispatch(
      getReport({
        FilterType: selectedValue,
        StartDate: Moment(startdate).format('YYYY-MM-DD'),
        EndDate: Moment(enddate).format('YYYY-MM-DD'),
      }),
    );
  };

  const getreportData = useSelector(reduxState => {
    return reduxState.DownloadReport.reportData;
  });

  const checkStatus = useSelector(reduxState => {
    return reduxState.DownloadReport.status;
  });

  if (checkStatus === 'success') {
    const todayDate = Moment(new Date()).format('DD-MM-YYYY');
    const dynamicData = getreportData.map(
      (row, i) =>
        `<tr style="padding:20px; height:40px; color:#272727; fontWeight:bold; width:100%; text-align:center">
            <td style="width:7%; border-right:1px solid #272727; border-bottom: 1px solid #272727; padding:10px">${
              i + 1
            }</td>
            <td style="width:7%; border-right:1px solid #272727; border-bottom: 1px solid #272727; padding:10px"><img src="data:image/jpeg;base64,${
              row.photo
            }" style="width:100%"></td>
            <td style="width:7%; border-right:1px solid #272727; font-size:12px; border-bottom: 1px solid #272727; padding:10px">${
              row.userID
            }</td>
            <td style="width:7%; border-right:1px solid #272727; font-size:12px; border-bottom: 1px solid #272727; padding:10px">${
              row.empName
            }</td>
            <td style="width:7%; border-right:1px solid #272727; font-size:12px; border-bottom: 1px solid #272727; padding:10px">${
              row.recDateTime
            }</td>
            <td style="width:7%; border-right:1px solid #272727; font-size:12px; border-bottom: 1px solid #272727; padding:10px">
            ${row.timeIn}
           
            </td>
            <td style="width:7%; border-right:1px solid #272727; font-size:12px; border-bottom: 1px solid #272727; padding:10px">${
              row.timeOut
            }
           </td>
            <td style="width:7%; border-right:1px solid #272727; font-size:12px; border-bottom: 1px solid #272727; padding:10px">${
              row.duration
            }</td>
            <td style="width:7%; border-right:1px solid #272727; font-size:12px; border-bottom: 1px solid #272727; padding:10px">${
              row.empType
            }</td>
            </tr>`,
    );
    const htmll = `
          <div><p style="float:left; margin-top:-2px">${todayDate}</p><center><h4 style="text-align:center; margin-left:-20px">Facial Recognition & Analytics Report</h4></center></div>
          <center><h4 style="text-align:center; margin-top:-10px">(Ayana, Karnataka, India)</h4></center>
          
          <p style="margin-bottom:-20px; background-color:white; height:50px; width:200px">From : ${Moment(
            startdate,
          ).format('DD-MM-YYYY')} <br> to: ${Moment(enddate).format(
      'DD-MM-YYYY',
    )}</p>
          

          <table style="width:100%; border-top:1px solid #272727; border-left: 1px solid #272727;">
          <tr style="height:50px; padding:20px; color:#272727; font-weight:bold; width:100%; text-align:center;">
          <th style="width:7%; border-right:1px solid #272727; border-bottom: 1px solid #272727; padding:10px">SNo.</th>
          <th style="width:15%; border-right:1px solid #272727; border-bottom: 1px solid #272727;">Photo</th>
          <th style="width:10%; border-right:1px solid #272727; border-bottom: 1px solid #272727; padding:10px">ID</th>
          <th style="width:15%; border-right:1px solid #272727; border-bottom: 1px solid #272727; padding:10px">Name</th>
          <th style="width:13%; border-right:1px solid #272727; border-bottom: 1px solid #272727; padding:10px">Date</th>
          <th style="width:13%; border-right:1px solid #272727; border-bottom: 1px solid #272727; padding:10px">In-time</th>
          <th style="width:13%; border-right:1px solid #272727; border-bottom: 1px solid #272727; padding:10px">Out-time</th>
          <th style="width:13%; border-right:1px solid #272727; border-bottom: 1px solid #272727; padding:10px">Duration</th>
          <th style="width:15%; border-right:1px solid #272727; border-bottom: 1px solid #272727; padding:10px">PersonType</th>
          </tr>
          ${dynamicData}
          </table>
          `;
    createPDF(htmll);
    dispatch(statusOff());
  }

  const alarmDisable = () => {
    props.navigation.navigate('Alarm');
    dispatch(alarmNotice());
  };

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
        <Text
          style={{
            fontSize: 15,
            marginLeft: 5,
            color: 'black',
            fontWeight: 'bold',
          }}>
          Download Report
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

      <View style={styles.container_box}>
        <View style={styles.card_header}>
          <Text style={{color: '#446DFF', textAlign: 'center', marginTop: 15}}>
            Download Report
          </Text>
        </View>

        <View style={styles.card_body}>
          <View
            style={{
              borderWidth: 1,
              borderColor: '#e6e6e6',
              borderRadius: 5,
              marginBottom: 10,
            }}>
            <Picker
              selectedValue={selectedValue}
              style={styles.selectInput}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedValue(itemValue)
              }>
              {dropdownItem.map(row => (
                <Picker.Item label={row} value={row} />
              ))}
            </Picker>
          </View>

          <TouchableOpacity
            style={styles.dateField}
            onPress={() => setVisibleStartDatePicker(true)}>
            <Text>{Moment(startdate).format('YYYY-MM-DD')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{...styles.dateField, marginTop: 10}}
            onPress={() => setVisibleEndDatePicker(true)}>
            <Text>{Moment(enddate).format('YYYY-MM-DD')}</Text>
          </TouchableOpacity>

          {loader ? (
            <TouchableOpacity style={styles.searchBtn}>
              <View style={{alignSelf: 'center', marginTop: 10}}>
                <Bubbles size={10} color="black" />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.searchBtn}
              onPress={() => onClickdownloadReport()}>
              <Text style={{color: '#446DFF'}}>Get Report</Text>
            </TouchableOpacity>
          )}

          {visibleStartDatePicker ? (
            <DateTimePicker
              testID="dateTimePicker"
              value={startdate}
              mode={'date'}
              date={startdate}
              is24Hour={true}
              display="default"
              onChange={onchangeStart}
            />
          ) : null}

          {visibleEndDatePicker ? (
            <DateTimePicker
              testID="dateTimePicker"
              value={enddate}
              mode={'date'}
              is24Hour={true}
              display="default"
              onChange={onChangeEnd}
            />
          ) : null}
        </View>
      </View>

      {pdfFileView ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            position: 'absolute',
            zIndex: 10000,
            bottom: 0,
            height: 50,
            borderTopWidth: 1,
            borderColor: '#e6e6e6',
            width: '100%',
            flexDirection: 'row',
          }}>
          <Text>File is Downloaded</Text>
          <TouchableOpacity
            onPress={() =>
              OpenPdf.open(`file:///storage/emulated/0/docs/${filename}.pdf`)
            }
            tyle={{paddingLeft: 20}}>
            <Text style={{color: 'green', marginTop: 2}}> Open </Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <AlarmModal
        AlarmokBtn={
          <TouchableOpacity
            onPress={() => alarmDisable()}
            style={{
              width: 100,
              height: 30,
              borderWidth: 1,
              borderColor: '#446DFF',
              borderRadius: 5,
              marginTop: 10,
              alignSelf: 'center',
            }}>
            <Text style={{color: '#446DFF', alignSelf: 'center', marginTop: 5}}>
              Ok
            </Text>
          </TouchableOpacity>
        }
      />
      <OfflinePopup />
    </View>
  );
};

export default DownloadReport;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F4F4F4',
    flex: 1,
  },

  appbar: {
    backgroundColor: 'white',
    color: 'black',
  },

  banner: {
    width: '100%',
    height: 150,
    paddingTop: 20,
    backgroundColor: 'white',
  },

  bannerImg: {
    width: Dimensions.get('window').width,
    height: 100,
  },

  Shadowbox_row: {
    flexDirection: 'row',
  },

  Shadowbox: {
    backgroundColor: 'white',
    width: '49%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'white',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 10,
    elevation: 1,
    backgroundColor: 'white',
  },

  Shadowbox_under: {
    flexDirection: 'row',
  },

  container_box: {
    paddingHorizontal: 10,
    backgroundColor: 'white',
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
    marginLeft: 10,
    height: 20,
  },

  download: {
    height: 20,
    width: 20,
    marginTop: 5,
  },

  downloadBtn: {
    width: '100%',
    height: 50,
    paddingTop: 10,
    borderRadius: 5,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#446DFF',
    flexDirection: 'row',
    marginTop: 10,
  },
  TableHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 10,
    elevation: 3,
    paddingVertical: 15,
    backgroundColor: '#F0F3FF',
    paddingHorizontal: 5,
  },

  th: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 11,
  },

  TableBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderColor: '#e6e6e6',
  },

  td: {
    color: 'gray',
    fontWeight: 'bold',
    fontSize: 10,
  },

  card_header: {
    backgroundColor: 'white',
    position: 'absolute',
    left: '3%',
    elevation: 3,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#446DFF',
    width: '100%',
    height: 50,
    marginTop: 20,
    zIndex: 10000,
  },

  card_body: {
    backgroundColor: 'white',
    elevation: 1,
    borderRadius: 5,
    width: '100%',
    height: 350,
    position: 'relative',
    marginTop: 20,
    paddingTop: 70,
    paddingHorizontal: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 5,
  },

  dateField: {
    borderWidth: 1,
    borderColor: '#e6e6e6',
    alignItems: 'center',
    padding: 15,
    borderRadius: 5,
  },

  searchBtn: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#446DFF',
    marginTop: 10,
    padding: 15,
    borderRadius: 5,
  },

  selectInput: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
  },
});
