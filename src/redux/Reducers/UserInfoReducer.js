import {USER_INFO_REQUEST, USER_INFO_SUCCESS, USER_INFO_ERROR} from './../Actions/UserInfoAction';

const initialState = {
    dataList:[],
    loader:false,
    error:null
}

const UserInfoReducer = (state=initialState, action) => {
    switch(action.type){
        case USER_INFO_REQUEST:
            return{
                ...state,
                loader:true
            }
        break;

        case USER_INFO_SUCCESS:
            return {
                ...state,
                loader:false,
                dataList:action.payload
            }
        break;

        case USER_INFO_ERROR:
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

export default UserInfoReducer