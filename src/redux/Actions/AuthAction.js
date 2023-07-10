import axios from 'axios';
import {API_URL} from './../../config/API_URL';
export const AUTH_REQUEST = 'AUTH_REQUEST';
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const AUTH_ERROR = 'AUTH_ERROR';
export const OFF_LOGIN_STATUS = 'OFF_LOGIN_STATUS';

export const attemptLogin = (payload) => dispatch => {
    dispatch({type:AUTH_REQUEST});
    if(payload.UserName==='Ayana' && payload.PassWord==='Ayana@123'){
        dispatch({type:AUTH_SUCCESS})
    }
    else{
        dispatch({type:AUTH_ERROR})
    }
}

export const offLoginStatus = (payload) => dispatch => {
    dispatch({type:OFF_LOGIN_STATUS})
}