import {ANPR_REQUEST, ANPRSUCCESS, ANPRERROR, ANPR_GET_REPORT_SUCCESS, ANPR_STATUS, ANPR_DOWNLOAD_REQUEST} from './../Actions/ANPRAction';

const initialState = {
    dataList:[],
    loader:false,
    status:'waiting',
    error:null,
    filterData:[]
}

const ANPRReducer = (state=initialState, action) => {
    switch(action.type){
        case ANPR_REQUEST:
            return{
                ...state,
                loader:true,
                status:'waiting',
            }
        break;

        case ANPR_DOWNLOAD_REQUEST:
            return{
                ...state,
                status:'loading',
            }
        break;

        case ANPRSUCCESS:
            return {
                ...state,
                loader:false,
                dataList:action.payload,
                status:'waiting',
            }
        break;

        case ANPRERROR:
            return{
                ...state,
                loader:false,
                status:'waiting',
                error:action.payload
            }
        break;

        case ANPR_GET_REPORT_SUCCESS:
            return{
                ...state,
                loader:false,
                filterData:action.payload,
                status:'success',
            }
        break;

        case ANPR_STATUS :
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

export default ANPRReducer