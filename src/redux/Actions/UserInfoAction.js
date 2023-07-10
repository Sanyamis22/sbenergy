import axios from 'axios';
import {API_URL} from './../../config/API_URL';
export const USER_INFO_REQUEST = 'USER_INFO_REQUEST';
export const USER_INFO_SUCCESS = 'USER_INFO_SUCCESS';
export const USER_INFO_ERROR = 'USER_INFO_ERROR';

export const fetchData = () => dispatch => {
    dispatch({type:USER_INFO_REQUEST})
    axios.get(`${API_URL}Employee/GetUserInfoData`)
    .then(res=>{
        dispatch({
            type:USER_INFO_SUCCESS,
            payload:res.data
        })
    })
    .catch(error=>{
        dispatch({
            type:USER_INFO_ERROR,
            payload:'error'+ error
        })
    })   
}