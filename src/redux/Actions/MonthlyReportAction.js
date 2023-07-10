import axios from 'axios';
import {API_URL} from './../../config/API_URL';
import moment from 'moment';
export const MONTHLY_REPORT_REQUEST = 'MONTHLY_REPORT_REQUEST';
export const MONTHLY_REPORT_SUCCESS = 'MONTHLY_REPORT_SUCCESS';
export const MONTHLY_REPORT_ERROR = 'MONTHLY_REPORT_ERROR';


export const fetchDataMonthly = () => dispatch => {
    dispatch({type:MONTHLY_REPORT_REQUEST})
    
    var date = new Date();
    var lastDay = moment(new Date(date.getFullYear(), date.getMonth() + 1, 0)).format('YYYY-MM-DD');
    var firstDay = moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD');
    

    axios.get(`${API_URL}Employee/GetReocgReportMonthlyReport`)
    .then(res=>{
        if(Array.isArray(res.data)){
        dispatch({
            type:MONTHLY_REPORT_SUCCESS,
            payload:res.data
        })
    }
    else{
        dispatch({
            type:MONTHLY_REPORT_SUCCESS,
            payload:[]
        })
    }
    })
    .catch(error=>{
        dispatch({
            type:MONTHLY_REPORT_ERROR,
            payload:'error'+ error
        })
    })
    
}