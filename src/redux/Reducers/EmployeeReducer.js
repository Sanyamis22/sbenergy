import {EMPLOYEE_REQUEST, EMPLOYEE_SUCCESS, EMPLOYEE_ERROR} from './../Actions/EmployeeAction';

const initialState = {
    EmployeeList:[],
    loader:false,
    error:null
}

const FaceRecognitionReducer = (state=initialState, action) => {
    switch(action.type){
        case EMPLOYEE_REQUEST:
            return{
                ...state,
                loader:true
            }
        break;

        case EMPLOYEE_SUCCESS:
            return {
                ...state,
                loader:false,
                EmployeeList:action.payload
            }
        break;

        case EMPLOYEE_ERROR:
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

export default FaceRecognitionReducer