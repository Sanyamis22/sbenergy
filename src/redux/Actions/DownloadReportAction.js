import axios from 'axios';
import {API_URL} from './../../config/API_URL';
export const DOWNLOAD_REPORT_SUCCESS = 'DOWNLOAD_REPORT_SUCCESS';
export const DOWNLOAD_REPORT_ERROR = 'DOWNLOAD_REPORT_ERROR';
export const DOWNLOAD_REPORT_REQUEST = 'DOWNLOAD_REPORT_REQUEST';
export const REPORT_STATUS_OFF = 'REPORT_STATUS_OFF';


export const getReport = (payload) => dispatch => {
    dispatch({type:DOWNLOAD_REPORT_REQUEST})
    axios.get(`${API_URL}Employee/GetReportByFilter?filterType=${payload.FilterType}&startdate=${payload.StartDate}&enddate=${payload.EndDate}`)
    .then(res=>{
        
        dispatch({
            type:DOWNLOAD_REPORT_SUCCESS,
            payload:res.data
        })
    })
    .catch(error=>{
        alert(error)
        dispatch({
            type:DOWNLOAD_REPORT_ERROR,
            payload:'error'+ error
        })
    })  
}

export const statusOff = () => dispatch => {
    dispatch({type:REPORT_STATUS_OFF});
}