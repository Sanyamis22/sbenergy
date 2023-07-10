import {DOWNLOAD_REPORT_ERROR, DOWNLOAD_REPORT_SUCCESS, REPORT_STATUS_OFF, DOWNLOAD_REPORT_REQUEST} from './../Actions/DownloadReportAction';

const initialState = {
    loader:false,
    reportData:[],
    status:'waiting'
}

const DownloadReportReducer = (state=initialState, action) => {
    switch(action.type){
        case DOWNLOAD_REPORT_SUCCESS:
        return{
            ...state,
            loader:false,
            status:'success',
            reportData:action.payload
        }
        case DOWNLOAD_REPORT_REQUEST:
            return{
                ...state,
                loader:true
            }

        case REPORT_STATUS_OFF:
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

export default DownloadReportReducer;