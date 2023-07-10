import {AUTH_REQUEST, AUTH_ERROR, AUTH_SUCCESS, OFF_LOGIN_STATUS} from './../Actions/AuthAction';

const initialState = {
    loader:false,
    error:null,
    loginStatus:'waiting'
}

const AuthReducer = (state=initialState, action) => {
    switch(action.type){
        case AUTH_REQUEST:
            return{
                ...state,
                loader:true
            }
        break;

        case AUTH_SUCCESS:
            return {
                ...state,
                loader:false,
                loginStatus:'success'
            }
        break;

        case AUTH_ERROR:
            return{
                ...state,
                loader:false,
                error:'error',
                loginStatus:'invalid' 
            }
        break;

        case OFF_LOGIN_STATUS:
            return{
                ...state,
                loginStatus:'waiting',
                loader:false
            }

        default:
            return{
                ...state,
                loader:false
            }
    }    
}

export default AuthReducer