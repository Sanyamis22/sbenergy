import Dashboard from '../../pages/Dashboard';
import {DASHBOARD_REQUEST, GET_VEHICLE_DATA_ERROR, GET_VEHICLE_DATA_SUCCESS} from './../Actions/DashboardAction';

const initialState = {
    loader:false,
    error:null,
    vehicleData:[],
}

const DashboardReducer = (state=initialState, action) => {
    switch(action.type){
        case DASHBOARD_REQUEST:
            return{
                ...state,
                loader:true
            }
        break;

        case GET_VEHICLE_DATA_SUCCESS:
            
            return {
                ...state,
                loader:false,
                vehicleData:action.payload
            }
        break;

        case GET_VEHICLE_DATA_ERROR:
            return{
                ...state,
                loader:false,
                error:action.payload
            }
        break;

        default:
            return{
                ...state
            }
    }    
}

export default DashboardReducer