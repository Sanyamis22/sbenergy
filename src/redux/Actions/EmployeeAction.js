import axios from 'axios';
import {API_URL} from './../../config/API_URL';
export const EMPLOYEE_REQUEST = 'EMPLOYEE_REQUEST';
export const EMPLOYEE_SUCCESS = 'EMPLOYEE_SUCCESS';
export const EMPLOYEE_ERROR = 'EMPLOYEE_ERROR';

export const fetchData = () => dispatch => {
    dispatch({type:EMPLOYEE_REQUEST})
    axios.get(`${API_URL}Employee/GetEmployees`)
    .then(res=>{
        
        dispatch({
            type:EMPLOYEE_SUCCESS,
            payload:res.data
        })
    })
    .catch(error=>{
        dispatch({
            type:EMPLOYEE_ERROR,
            payload:'error'+ error
        })
    })   
}