import axios from 'axios';
import Moment from 'moment';
import {API_URL} from './../../config/API_URL';
export const ALARM_REQUEST = 'ALARM_REQUEST';
export const ALARM_SUCCESS = 'ALARM_SUCCESS';
export const ALARM_ERROR = 'ALARM_ERROR';
export const ALARM_NOTIFY = 'ALARM_NOTIFY';
export const ALARM_NOTIFY_TRUE = 'ALARM_NOTIFY_TRUE';

export const fetchData = () => dispatch => {
    dispatch({type:ALARM_REQUEST})
    const StartDate = Moment(new Date()).format('YYYY-MM-DD');
    const EndDate = Moment(new Date()).format('YYYY-MM-DD');
    axios.get(`${API_URL}Employee/GetReportByFilter_Alarm?filterType=Alarm&startdate=${StartDate}&enddate=${EndDate}`)
    .then(res=>{
        dispatch({
            type:ALARM_SUCCESS,
            payload:res.data
        })
    })
    .catch(error=>{
        dispatch({
            type:ALARM_ERROR,
            payload:'error'+ error
        })
    })
}

export const alarmNotice = () => dispatch => {
    dispatch({type:ALARM_NOTIFY})
}

export const alarmNotice_true = () => dispatch => {
    dispatch({type:ALARM_NOTIFY_TRUE})
}