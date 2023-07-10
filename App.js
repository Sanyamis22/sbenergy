import React from 'react';
import {Text, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import AuthNavigation from './src/AuthNavigation';
import DashboardNavigation from './src/DashboardNavigation';
import Splash from './src/pages/Splash';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {store} from './src/redux/index';
const Stack = createStackNavigator();
const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};
const App = () => {
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
  return (
    // <Provider store={store}>
    //   <NavigationContainer>
    //     <Stack.Navigator>
    //       {/* <Stack.Screen
    //         name="Splash"
    //         options={{headerShown: false}}
    //         component={Splash}
    //       /> */}
    //       <Stack.Screen
    //         name="AuthNavigation"
    //         options={{headerShown: false}}
    //         component={AuthNavigation}
    //       />
    //       <Stack.Screen
    //         name="DashboardNavigation"
    //         options={{headerShown: false}}
    //         component={DashboardNavigation}
    //       />
    //     </Stack.Navigator>
    //   </NavigationContainer>
    // </Provider>
    <View>
      <Text>hiiiusdhiuhuh</Text>
    </View>
  );
};

export default App;
