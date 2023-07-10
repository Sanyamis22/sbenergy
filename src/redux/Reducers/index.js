import DashboardReducer from './DashboardReducer';
import ANPRReducer from './ANPRReducer';
import FaceRecognitionReducer from './FaceRecognitionReducer';
import EmployeeReducer from './EmployeeReducer';
import UserInfoReducer from './UserInfoReducer';
import { combineReducers } from 'redux';
import IdentificationReducer from './IdentificationReducer';
import DownloadReportReducer from './DownloadReportReducer';
import AuthReducer from './AuthReducer';
import AlarmReducer from './AlarmReducer';
import VehicleEntryExitReducer from './VehicleEntryExitAnalysisReducer';
import MonthlyReportReducer from './MonthlyReportReducer';

const RootReducer = combineReducers({
    Dashboard:DashboardReducer,
    ANPR:ANPRReducer,
    FaceRecognition:FaceRecognitionReducer,
    EmployeeList:EmployeeReducer,
    UserInfoList:UserInfoReducer,
    Identification:IdentificationReducer,
    Authentication:AuthReducer,
    DownloadReport:DownloadReportReducer,
    Alarm:AlarmReducer,
    VehicleEntry:VehicleEntryExitReducer,
    MonthlyReport:MonthlyReportReducer
})

export default RootReducer