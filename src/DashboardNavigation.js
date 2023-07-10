import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Dashboard from './pages/Dashboard';
import ANPRSolution from './pages/ANPRSolution';
import FaceRecognitionSolution from './pages/FaceRecognitionSolution';
import Identification from './pages/Identification';
import DownloadReport from './pages/DownloadReport';
import DrawerContent from './components/DrawerContent';
import Alarm from './pages/Alarm';
import VehicleMapping from './pages/VehicleMapping';
import VehicleEntryExitAnalysis from './pages/VehicleEntryExitAnalysis'
import MonthlyReport from './pages/MonthlyReport';
import FireAndSmoke from './pages/FireAndSmoke'
import CrowdDetection from './pages/CrowdDetection'
import ModuleCleaning from './pages/ModuleCleaning'
import IntrusionDetection from './pages/IntrusionDetection'
import VegetationDetection from './pages/VegetationDetection'
import DefectAnalytics from './pages/DefectAnalytics'


const Drawer = createDrawerNavigator();

const DashboardNavigation = (props) => {
    return(
      <Drawer.Navigator drawerContentOptions={{
        activeTintColor: '#e91e63',
        itemStyle: {marginVertical: 5},
      }}
      // Here we are setting our custom sidebar menu 
      drawerContent={props=><DrawerContent {...props} />} initialRouteName="Dashboard">
        <Drawer.Screen name="Dashboard" component={Dashboard} />
        <Drawer.Screen name="ANPRSolution" component={ANPRSolution} />
        <Drawer.Screen name="VehicleMapping" component={VehicleMapping} />
        <Drawer.Screen name="FaceRecognitionSolution" component={FaceRecognitionSolution} />
        <Drawer.Screen name="VehicleEntryExitAnalysis" component={VehicleEntryExitAnalysis} />
        <Drawer.Screen name="FireAndSmoke" component={FireAndSmoke} />
        <Drawer.Screen name="CrowdDetection" component={CrowdDetection} />
        <Drawer.Screen name="ModuleCleaning" component={ModuleCleaning} />
        <Drawer.Screen name="IntrusionDetection" component={IntrusionDetection} />
        <Drawer.Screen name="DefectAnalytics" component={DefectAnalytics} />
        <Drawer.Screen name="VegetationDetection" component={VegetationDetection} />
        <Drawer.Screen name="Identification" component={Identification} />
        <Drawer.Screen name="DownloadReport" component={DownloadReport} />
        <Drawer.Screen name="MonthlyReport" component={MonthlyReport} />
        <Drawer.Screen name="Alarm" component={Alarm} />
        
      </Drawer.Navigator>
    )
}

export default DashboardNavigation