import {ALARM_REQUEST, ALARM_SUCCESS, ALARM_ERROR, ALARM_NOTIFY, ALARM_NOTIFY_TRUE} from './../Actions/AlarmAction';

const initialState = {
    alarmList:[],
    loader:false,
    error:null,
    alarm_notify:'false'
}

const AlarmReducer = (state=initialState, action) => {
    switch(action.type){
        case ALARM_REQUEST:
            return{
                ...state,
                loader:true
            }
        break;

        case ALARM_SUCCESS:
            return {
                ...state,
                loader:false,
                alarmList:action.payload
            }
        break;

        case ALARM_ERROR:
            return{
                ...state,
                loader:false,
                error:action.payload
            }
        break;

        case ALARM_NOTIFY:
            return{
                ...state,
                loader:false,
                alarm_notify:'false'
            }

        case ALARM_NOTIFY_TRUE:
            return{
                ...state,
                loader:false,
                alarm_notify:'true'
            }

        default:
            return{
                ...state,
                loader:false
            }
    }    
}

export default AlarmReducer