import {VEHICLE_ENTRY_REQUEST, VEHICLE_ENTRY_SUCCESS, VEHICLE_ENTRY_ERROR, 
    VEHICLE_ENTRY_REPORT_SUCCESS, VEHICLE_ENTRY_STATUS, VEHICLE_ENTRY_DOWNLOAD_REQUEST, 
    VEHICLE_ENTRY_INSERT_REQUEST, VEHICLE_ENTRY_INSERT_SUCCESS, 
    VEHICLE_ENTRY_INSERT_SUCCESS_STATUS_OFF, VEHICLE_ENTRY_GET_REPORT_SUCCESS} from './../Actions/VehicleEntryExitAnalysisAction';

const initialState = {
    dataList:[],
    loader:false,
    status:'waiting',
    error:null,
    filterData:[],
    insertLoader:false,
    insertStatus:false
}

const VehicleEntryExitReducer = (state=initialState, action) => {
    switch(action.type){
        case VEHICLE_ENTRY_REQUEST:
            return{
                ...state,
                loader:true,
                status:'waiting',
            }
        break;

        case VEHICLE_ENTRY_INSERT_REQUEST:
            return{
                ...state,
                insertLoader:true,
            }
        break;

        case VEHICLE_ENTRY_INSERT_SUCCESS:
            return{
                ...state,
                insertStatus:true,
                insertLoader:false
            }
        break;

        case VEHICLE_ENTRY_INSERT_SUCCESS_STATUS_OFF:
            return{
                ...state,
                insertStatus:false
            }
        break;

        case VEHICLE_ENTRY_DOWNLOAD_REQUEST:
            return{
                ...state,
                status:'loading',
            }
        break;

        case VEHICLE_ENTRY_SUCCESS:
            return {
                ...state,
                loader:false,
                dataList:action.payload,
                status:'waiting',
            }
        break;

        case VEHICLE_ENTRY_ERROR:
            return{
                ...state,
                loader:false,
                status:'waiting',
                error:action.payload
            }
        break;

        case VEHICLE_ENTRY_GET_REPORT_SUCCESS:
            return{
                ...state,
                loader:false,
                filterData:action.payload,
                status:'success',
            }
        break;

        case VEHICLE_ENTRY_STATUS :
            return{
                ...state,
                loader:false,
                status:'waiting'
            }
        
        default:
            return{
                ...state,
                status:'waiting',
                loader:false
            }
    }    
}

export default VehicleEntryExitReducer;