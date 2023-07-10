import axios from 'axios';
import {API_URL} from './../../config/API_URL';
export const FACE_RECOGNITION_REQUEST = 'FACE_RECOGNITION_REQUEST';
export const FACE_RECOGNITION_SUCCESS = 'FACE_RECOGNITION_SUCCESS';
export const FACE_RECOGNITION_ERROR = 'FACE_RECOGNITION_ERROR';

export const fetchData = () => dispatch => {
    dispatch({type:FACE_RECOGNITION_REQUEST})
    axios.get(`${API_URL}Employee/GetReportRecog`)
    .then(res=>{
        if(Array.isArray(res.data)){
        dispatch({
            type:FACE_RECOGNITION_SUCCESS,
            payload:res.data
        })
    }
    else{
        dispatch({
            type:FACE_RECOGNITION_SUCCESS,
            payload:[]
        })
    }
    })
    .catch(error=>{
        dispatch({
            type:FACE_RECOGNITION_ERROR,
            payload:'error'+ error
        })
    })
    
}