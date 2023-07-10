import axios from 'axios';
import {API_URL} from './../../config/API_URL';
export const IDENTIFICATION_REQUEST = 'IDENTIFICATION_REQUEST';
export const IDENTIFICATION_SUCCESS = 'IDENTIFICATION_SUCCESS';
export const IDENTIFICATION_ERROR = 'IDENTIFICATION_ERROR';

export const fetchData = () => dispatch => {
    dispatch({type:IDENTIFICATION_REQUEST})
    axios.get(`${API_URL}Employee/GetReportRecog`)
    .then(res=>{
        dispatch({
            type:IDENTIFICATION_SUCCESS,
            payload:res.data
        })
    })
    .catch(error=>{
        alert(error)
        dispatch({
            type:IDENTIFICATION_ERROR,
            payload:'error'+ error
        })
    })
}