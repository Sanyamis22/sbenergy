import axios from 'axios';
import {API_URL} from './../../config/API_URL';
import RNFetchBlob from 'rn-fetch-blob'
export const VEHICLE_ENTRY_REQUEST = 'VEHICLE_ENTRY_REQUEST';
export const VEHICLE_ENTRY_SUCCESS = 'VEHICLE_ENTRY_SUCCESS';
export const VEHICLE_ENTRY_ERROR = 'VEHICLE_ENTRY_ERROR';
export const VEHICLE_ENTRY_GET_REPORT_SUCCESS = 'VEHICLE_ENTRY_GET_REPORT_SUCCESS';
export const VEHICLE_ENTRY_GET_REPORT_ERROR = 'VEHICLE_ENTRY_GET_REPORT_ERROR';
export const VEHICLE_ENTRY_STATUS = 'VEHICLE_ENTRY_STATUS';
export const VEHICLE_ENTRY_DOWNLOAD_REQUEST = 'VEHICLE_ENTRY_DOWNLOAD_REQUEST';
export const VEHICLE_ENTRY_INSERT_REQUEST = 'VEHICLE_ENTRY_INSERT_REQUEST';
export const VEHICLE_ENTRY_INSERT_SUCCESS = 'VEHICLE_ENTRY_INSERT_SUCCESS';
export const VEHICLE_ENTRY_INSERT_SUCCESS_STATUS_OFF = 'VEHICLE_ENTRY_INSERT_SUCCESS_STATUS_OFF';

export const fetchData = () => dispatch => {
    dispatch({type:VEHICLE_ENTRY_REQUEST})
    axios.get(`${API_URL}Employee/GetAnprVechileDetaildata`)
    .then(res=>{
        dispatch({
            type:VEHICLE_ENTRY_SUCCESS,
            payload:res.data
        })
    })
    .catch(error=>{
        alert(error)
        dispatch({
            type:VEHICLE_ENTRY_ERROR,
            payload:'error'+ error
        })
    })
}

export const getVehicleEntryReport = (payload) => dispatch => {
    dispatch({type:VEHICLE_ENTRY_DOWNLOAD_REQUEST})
    
    axios.get(`${API_URL}Employee/GetAnprVechileDetaildata_Report?startdate=${payload.StartDate}&enddate=${payload.EndDate}`)
    .then(res=>{
        console.log(res.data)
        dispatch({
            type:VEHICLE_ENTRY_GET_REPORT_SUCCESS,
            payload:res.data
        })
    })
    .catch(error=>{
        alert(error)
        dispatch({
            type:VEHICLE_ENTRY_GET_REPORT_ERROR,
            payload:'error'+ error
        })
    })
}

export const addVehicle = (payload) => dispatch => {
    // dispatch({type:VEHICLE_ENTRY_INSERT_REQUEST})
    // axios.get(`${API_URL}Employee/Get?VehicleOwner=${payload.Owner}&VehiclNumber=${payload.Number}&Type=${payload.Type}`)
    // .then(res=>{
    //     console.log(res.data)
    //     dispatch({
    //         type:VEHICLE_ENTRY_INSERT_SUCCESS,
    //         payload:res.data
    //     })
    // })
    // .catch(error=>{
    //     alert(error)
    //     dispatch({
    //         type:VEHICLE_ENTRY_GET_REPORT_ERROR,
    //         payload:'error'+ error
    //     })
    // })


    
    dispatch({type:VEHICLE_ENTRY_INSERT_REQUEST})
    RNFetchBlob.fetch('POST', `${API_URL}Employee/AddVechile`, {
        'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
            'Content-Type': 'application/json',
      }, [
        {name : 'Image', filename : 'avatar-foo.png', data: RNFetchBlob.wrap(payload.file.fileCopyUri)},
        {name : 'VehicleOwner', data:payload.Owner},
        {name : 'VehiclNumber', data:payload.Number},
        {name : 'Type', data:payload.Type},
      ]).then((res) => {
          console.log(res)
            dispatch({
                    type:VEHICLE_ENTRY_INSERT_SUCCESS,
                    payload:res.data
                })
      }).catch((error) => {
        alert(error)
            dispatch({
                type:VEHICLE_ENTRY_GET_REPORT_ERROR,
                payload:'error'+ error
            })
      })
}

export const statusOff = () => dispatch => {
    dispatch({type:VEHICLE_ENTRY_STATUS});
}

export const statusOff_2 = () => dispatch => {
    dispatch({type:VEHICLE_ENTRY_INSERT_SUCCESS_STATUS_OFF})
}