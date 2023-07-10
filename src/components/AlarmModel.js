import React from 'react';
import {TouchableOpacity, Text, Image} from 'react-native';
import {Modal, Badge} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector, useDispatch} from 'react-redux';
import {alarmNotice} from './../redux/Actions/AlarmAction';

const AlarmModal = (props) => {
    const EmployeeList = useSelector((reduxState)=>{
        return reduxState.Alarm.alarmList
    });

    const AlarmNotify = useSelector((reduxState)=>{
        return reduxState.Alarm.alarm_notify
    });

    const [visible, setVisible] = React.useState(false);

    const dispatch = useDispatch();

    let v = false

    if(Array.isArray(EmployeeList)){
        const localStorage = async() => {
            if(AlarmNotify=='true'){
                v=true
            }
            else{
                v=false
            }
        }
        localStorage()
    }
    
    return(
        <Modal visible={v} style={{backgroundColor:'white', height:200, width:300, borderRadius:5, 
        justifyContent:'center', position:'absolute', top:'30%',left:'8%', padding:20 }}>
            <Badge style={{position:'absolute', top:0, left:'50%', zIndex:5}}>1</Badge>
            <Image source={require('./../assets/images/bell.png')} style={{width:40, height:50, alignSelf:'center'}}/>
          <Text style={{fontWeight:'bold', alignSelf:'center', marginTop:10}}>Suspect got detected</Text>
          {props.AlarmokBtn}
        </Modal>
    );
}

export default AlarmModal