import {FACE_RECOGNITION_REQUEST, FACE_RECOGNITION_SUCCESS, FACE_RECOGNITION_ERROR} from './../Actions/FaceRecognitionAction';

const initialState = {
    FaceRecogList:[],
    loader:false,
    error:null
}

const FaceRecognitionReducer = (state=initialState, action) => {
    switch(action.type){
        case FACE_RECOGNITION_REQUEST:
            return{
                ...state,
                loader:true
            }
        break;

        case FACE_RECOGNITION_SUCCESS:
            return {
                ...state,
                loader:false,
                FaceRecogList:action.payload
            }
        break;

        case FACE_RECOGNITION_ERROR:
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