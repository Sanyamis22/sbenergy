import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {fetchData as getUserInfo} from './../redux/Actions/UserInfoAction';
import {fetchData as FaceRecogCount} from './../redux/Actions/FaceRecognitionAction';
import {alarmNotice} from './../redux/Actions/AlarmAction';
import {fetchData} from './../redux/Actions/IdentificationAction'
import {getVehicleData} from './../redux/Actions/DashboardAction';
import {fetchData as FaceRecogData} from './../redux/Actions/FaceRecognitionAction';
import {fetchData as ANPRData} from './../redux/Actions/ANPRAction';
import {fetchData as AlarmData} from './../redux/Actions/AlarmAction';
import {fetchData as VehicleEntryData} from './../redux/Actions/VehicleEntryExitAnalysisAction';
import {fetchDataMonthly} from './../redux/Actions/MonthlyReportAction';
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Image,
  Text,
  Linking,
  TouchableOpacity,
} from 'react-native';

import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import DashboardNavigation from '../DashboardNavigation';
import MonthlyReport from '../pages/MonthlyReport';
import { MONTHLY_REPORT_SUCCESS } from '../redux/Actions/MonthlyReportAction';

const DrawerContent = (props) => {
    const dispatch = useDispatch();
    const DashboardNav = () => {
        dispatch(getUserInfo());
        dispatch(FaceRecogCount());
        dispatch(getVehicleData());
        props.navigation.navigate('Dashboard');
    }

    const FacialNav = () => {
        dispatch(FaceRecogData());
        props.navigation.navigate('FaceRecognitionSolution')
    }

    
    const Identification = () => {
        dispatch(fetchData());
        props.navigation.navigate('Identification')
    }

    const ANPR = () => {
        dispatch(ANPRData());
        props.navigation.navigate('ANPRSolution')
    }

    const Alarm = () => {
        dispatch(AlarmData())
        props.navigation.navigate('Alarm')
    }

    const VehicleMap = () => {
        dispatch(ANPRData());
        props.navigation.navigate('VehicleMapping')
    }

    const VehicleEntry = () => {
        dispatch(VehicleEntryData());
        props.navigation.navigate('VehicleEntryExitAnalysis')
    }

    const FireAndSmoke = () => {
        // dispatch(FaceRecogData());
         props.navigation.navigate('FireAndSmoke')
     }

     const CrowdDetection = () => {
        // dispatch(FaceRecogData());
         props.navigation.navigate('CrowdDetection')
     }

     const ModuleCleaning = () => {
        // dispatch(FaceRecogData());
         props.navigation.navigate('ModuleCleaning')
     }

     const IntrusionDetection = () => {
        // dispatch(FaceRecogData());
         props.navigation.navigate('IntrusionDetection')
     }

     const DefectAnalytics = () => {
        // dispatch(FaceRecogData());
         props.navigation.navigate('DefectAnalytics')
     }

     const VegetationDetection = () => {
        // dispatch(FaceRecogData());
         props.navigation.navigate('VegetationDetection')
     }



    const MonthlyReport = () => {
        dispatch(fetchDataMonthly());
        props.navigation.navigate('MonthlyReport')
    }
    
  return (
    <SafeAreaView style={{flex: 1}}>
        <View style={{height:100, backgroundColor:"#F8F8F8", paddingTop:40, alignItems:"center"}}>
        <Image source={require('./../assets/images/logo_new.png')} style={{width:230, height:60, marginTop:-15}} />
        </View>
        <ScrollView>
            <TouchableOpacity style={styles.btn} onPress={()=>DashboardNav()}>
                <Image source={require('./../assets/images/home.png')} style={{width:25, height:25}} />
                <Text style={{fontWeight:"bold", marginLeft:20, marginTop:4}}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={()=>FacialNav()}>
            <Image source={require('./../assets/images/facial_analytics.png')} style={{width:25, height:25}} />
                <Text style={{fontWeight:"bold", marginLeft:20, marginTop:4}}>Facial Analytics</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={()=>MonthlyReport()}>
            <Image source={require('./../assets/images/download_report_icon.png')} style={{width:25, height:26}} />
                <Text style={{fontWeight:"bold", marginLeft:20, marginTop:4}}>Monthly Report</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={()=>Identification()}>
            <Image source={require('./../assets/images/identification_icon.png')} style={{width:32, marginLeft:-4, height:32}} />
                <Text style={{fontWeight:"bold", marginLeft:18, marginTop:4}}>Identifications</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={()=>ANPR()}>
            <Image source={require('./../assets/images/anpr.png')} style={{width:25, height:20}} />
                <Text style={{fontWeight:"bold", marginLeft:20, marginTop:4}}>ANPR Solution</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={()=>VehicleMap()}>
            <Image source={require('./../assets/images/map_search.png')} style={{width:23, height:23}} />
                <Text style={{fontWeight:"bold", marginLeft:20, marginTop:4}}>Vehicle Mapping</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={()=>VehicleEntry()}>
            <Image source={require('./../assets/images/dashboard.png')} style={{width:23, height:23}} />
                <Text style={{fontWeight:"bold", marginLeft:20, marginTop:4}}>Vehicle Entry-Exit Analysis</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={()=>FireAndSmoke()}>
            <Image source={require('./../assets/greyIcons/FireSmoke.png')} style={{width:25, height:25}} />
                <Text style={{fontWeight:"bold", marginLeft:20, marginTop:4}}>{'Fire & Smoke'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={()=>CrowdDetection()}>
            <Image source={require('./../assets/greyIcons/CrowdDetection.png')} style={{width:25, height:25}} />
                <Text style={{fontWeight:"bold", marginLeft:20, marginTop:4}}>Crowd Analysis</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={()=>ModuleCleaning()}>
            <Image source={require('./../assets/greyIcons/Module_Cleaning.png')} style={{width:25, height:25}} />
                <Text style={{fontWeight:"bold", marginLeft:20, marginTop:4}}>Module Cleaning</Text>
            </TouchableOpacity>


            <TouchableOpacity style={styles.btn} onPress={()=>IntrusionDetection()}>
            <Image source={require('./../assets/greyIcons/Intrusion.png')} style={{width:25, height:25}} />
                <Text style={{fontWeight:"bold", marginLeft:20, marginTop:4}}>Intrusion Detection</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={()=>DefectAnalytics()}>
            <Image source={require('./../assets/greyIcons/Module_Defect.png')} style={{width:25, height:25}} />
                <Text style={{fontWeight:"bold", marginLeft:20, marginTop:4}}>Defect Analytics</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={()=>VegetationDetection()}>
            <Image source={require('./../assets/greyIcons/Vegetation.png')} style={{width:25, height:25}} />
                <Text style={{fontWeight:"bold", marginLeft:20, marginTop:4}}>Vegetation Analysis</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={()=>Alarm()}>
            <Image source={require('./../assets/images/bell.png')} style={{width:22, height:24}} />
                <Text style={{fontWeight:"bold", marginLeft:20, marginTop:4}}>Alarm</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={()=>props.navigation.navigate('DownloadReport')}>
            <Image source={require('./../assets/images/download_report_icon.png')} style={{width:25, height:26}} />
                <Text style={{fontWeight:"bold", marginLeft:20, marginTop:4}}>Download Report</Text>
            </TouchableOpacity>
            
            
            

            <View style={{marginBottom:40}}></View>
        </ScrollView>
            <View style={{ paddingHorizontal:20, marginTop:50, position:"absolute", backgroundColor:"white", bottom:"0%", paddingBottom:10, paddingTop:10}}>
                <View>
                <Text style={{ fontSize:13, textAlign:"center"}}>Powered by CamfyVision Innovations Pvt. Ltd.</Text>
                </View>
            </View>            
    </SafeAreaView>
  );
};

export default DrawerContent;

const styles = StyleSheet.create({
    btn:{
        width:"100%",
        height:50,
        paddingTop:10,
        paddingBottom:10,
        paddingLeft:20,
        flexDirection:"row",
        borderBottomWidth:1,
        borderColor:"#e6e6e6"
    },  
})