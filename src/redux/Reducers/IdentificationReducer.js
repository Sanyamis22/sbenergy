import {IDENTIFICATION_REQUEST, IDENTIFICATION_SUCCESS, IDENTIFICATION_ERROR} from './../Actions/IdentificationAction';

const initialState = {
    dataList:[],
    loader:false,
    error:null
}

const IdentificationReducer = (state=initialState, action) => {
    switch(action.type){
        case IDENTIFICATION_REQUEST:
            return{
                ...state,
                loader:true
            }
        break;

        case IDENTIFICATION_SUCCESS:
            return {
                ...state,
                loader:false,
                dataList:action.payload
            }
        break;

        case IDENTIFICATION_ERROR:
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

export default IdentificationReducer