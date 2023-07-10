import axios from 'axios';
import {API_URL} from './../../config/API_URL';
export const DASHBOARD_REQUEST = 'DASHBOARD_REQUEST';
export const GET_VEHICLE_DATA_SUCCESS = 'GET_VEHICLE_DATA_SUCCESS';
export const GET_VEHICLE_DATA_ERROR = 'GET_VEHICLE_DATA_ERROR';


export const getVehicleData = () => dispatch => {
    dispatch({type:DASHBOARD_REQUEST})
    
    console.log('waiting')
    axios.get(`${API_URL}Employee/GetVehicleData`)
    .then(res=>{
        dispatch({
            type:GET_VEHICLE_DATA_SUCCESS,
            payload:res.data
        })
    })
    .catch(error=>{
        dispatch({
            type:GET_VEHICLE_DATA_ERROR,
            payload:'error'+ error
        })
    })
}