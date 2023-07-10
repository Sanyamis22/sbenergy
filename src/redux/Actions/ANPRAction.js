import axios from 'axios';
import {API_URL} from './../../config/API_URL';
export const ANPR_REQUEST = 'ANPR_REQUEST';
export const ANPRSUCCESS = 'ANPRSUCCESS';
export const ANPRERROR = 'ANPRERROR';
export const ANPR_GET_REPORT_SUCCESS = 'ANPR_GET_REPORT_SUCCESS';
export const ANPR_GET_REPORT_ERROR = 'ANPR_GET_REPORT_ERROR';
export const ANPR_STATUS = 'ANPR_STATUS';
export const ANPR_DOWNLOAD_REQUEST = 'ANPR_DOWNLOAD_REQUEST';

export const fetchData = () => dispatch => {
    dispatch({type:ANPR_REQUEST})
    axios.get(`${API_URL}Employee/GetAnprData`)
    .then(res=>{
        dispatch({
            type:ANPRSUCCESS,
            payload:res.data
        })
    })
    .catch(error=>{
        alert(error)
        dispatch({
            type:ANPRERROR,
            payload:'error'+ error
        })
    })
}

export const getANPRReport = (payload) => dispatch => {
    dispatch({type:ANPR_DOWNLOAD_REQUEST})
    axios.get(`${API_URL}Employee/GetReportByAnprFilter?filterType=&startdate=${payload.StartDate}&enddate=${payload.EndDate}`)
    .then(res=>{
        console.log(res.data)
        dispatch({
            type:ANPR_GET_REPORT_SUCCESS,
            payload:res.data
        })
    })
    .catch(error=>{
        alert(error)
        dispatch({
            type:ANPR_GET_REPORT_ERROR,
            payload:'error'+ error
        })
    })
}

export const statusOff = () => dispatch => {
    dispatch({type:ANPR_STATUS});
}