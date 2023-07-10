import {MONTHLY_REPORT_REQUEST, MONTHLY_REPORT_SUCCESS, MONTHLY_REPORT_ERROR} from './../Actions/MonthlyReportAction';

const initialState = {
    list:[],
    loader:false,
    error:null
}

const MonthlyReportReducer = (state=initialState, action) => {
    switch(action.type){
        case MONTHLY_REPORT_REQUEST:
            return{
                ...state,
                loader:true
            }
        break;

        case MONTHLY_REPORT_SUCCESS:
            return {
                ...state,
                loader:false,
                list:action.payload
            }
        break;

        case MONTHLY_REPORT_ERROR:
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

export default MonthlyReportReducer