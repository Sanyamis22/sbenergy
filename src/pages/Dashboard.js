import React, { useEffect } from 'react';
import { ScrollView, Alert, Dimensions, Image, StyleSheet, View, BackHandler, Text, TouchableOpacity } from 'react-native';
import { Appbar, Modal, Badge } from 'react-native-paper';
import { getVehicleData } from './../redux/Actions/DashboardAction';
import { useSelector, useDispatch } from 'react-redux';
import { fetchData as getUserInfo } from './../redux/Actions/UserInfoAction';
import { fetchData as FaceRecogCount } from './../redux/Actions/FaceRecognitionAction';
import { fetchData as fetchANPRData } from './../redux/Actions/ANPRAction';
import { fetchData as vehicleAnalysisData } from './../redux/Actions/VehicleEntryExitAnalysisAction';
import NetInfo from "@react-native-community/netinfo";
import { Bubbles } from 'react-native-loader';
import { useBackHandler } from "@react-native-community/hooks"
import OfflinePopup from '../components/OfflinePopup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AlarmModal from '../components/AlarmModel';
import { alarmNotice } from './../redux/Actions/AlarmAction';
const Dashboard = (props) => {
    const [check, setCheck] = React.useState('1');

    const dispatch = useDispatch()
    useEffect(async () => {
        dispatch(getUserInfo());
        dispatch(FaceRecogCount());
        dispatch(getVehicleData())
        BackHandler.addEventListener("hardwareBackPress", backAction);
    }, [])


    const backAction = () => {
        if (props.navigation.isFocused()) {
            Alert.alert("Hold on!", "Are you sure you want to exit app?", [
                {
                    text: "Cancel",
                    onPress: () => null,
                    style: "cancel"
                },
                { text: "YES", onPress: () => BackHandler.exitApp() }
            ]);
            return true;
        }

    }


    const loader = useSelector((reduxState) => {
        return reduxState.FaceRecognition.loader
    })


    let resarray = [];

    const FR = useSelector((reduxState) => {
        return reduxState.FaceRecognition.FaceRecogList
    });


    if (Array.isArray(FR)) {
        FR.map((item) => {
            let i = resarray.findIndex(x => x.UserID == item.userID)
            if (i <= -1) {
                resarray.push({ UserID: item.userID, Time: item.recDateTime.substring(10, 19) });
            }
        })
    }

    let latecommers = 0;
    let FRCount = resarray.length;


    resarray.map((row) => {
        let pieces = row.Time.split(':')
        let hour, minute, second;
        if (pieces.length === 3) {
            hour = parseInt(pieces[0], 10);
            minute = parseInt(pieces[1], 10);
            second = parseInt(pieces[2], 10);
        }
        if (hour === 10) {
            if (minute > 30) {
                latecommers++;
            }
        }
        else if (hour > 10) {
            latecommers++;
        }
    })

    const TotalEmployee = useSelector((reduxState) => {
        return reduxState.UserInfoList.dataList.length;
    });



    const vehicleData = useSelector((reduxState) => {
        return reduxState.Dashboard.vehicleData;
    });

    let car = 0;
    let car_inPercent = 0;
    let bike = 0;
    let bike_inPercent = 0;
    let truck = 0;
    let truck_inPercent = 0;
    let tractor = 0;
    let tractor_inPercent = 0;
    let cycle = 0;
    let cycle_inPercent = 0;
    let van = 0;
    let van_inPercent = 0;
    let train = 0;
    let train_inPercent = 0;
    let bus = 0;
    let bus_inPercent = 0;

    vehicleData.map((row) => {
        if (row.name === 'car') {
            car = car + 1;
        }

        else if (row.name === 'motorbike') {
            bike = bike + 1;
        }

        else if (row.name === 'bicycle') {
            cycle = cycle + 1;
        }

        else if (row.name === 'truck') {
            truck = truck + 1;
        }



        else if (row.name === 'bus') {
            van = van + 1
        }

        else if (row.name === 'train') {
            train = train + 1
        }

        else if (row.name === 'tractor') {
            tractor = tractor + 1;
        }
    });

    car_inPercent = parseFloat(car * 100 / vehicleData.length).toFixed(2)
    bike_inPercent = parseFloat(bike * 100 / vehicleData.length).toFixed(2)
    cycle_inPercent = parseFloat(cycle * 100 / vehicleData.length).toFixed(2)
    truck_inPercent = parseFloat(truck * 100 / vehicleData.length).toFixed(2)
    tractor_inPercent = parseFloat(tractor * 100 / vehicleData.length).toFixed(2)
    train_inPercent = parseFloat(train * 100 / vehicleData.length).toFixed(2)
    van_inPercent = parseFloat(van * 100 / vehicleData.length).toFixed(2)
    bus_inPercent = parseFloat(bus * 100 / vehicleData.length).toFixed(2)

    const logout = () => {
        AsyncStorage.clear();
        props.navigation.navigate('AuthNavigation')
    }

    const alarmDisable = () => {
        props.navigation.navigate('Alarm');
        dispatch(alarmNotice());
    }

    const vehicleMap = () => {
        dispatch(fetchANPRData());
        props.navigation.navigate('VehicleMapping')
    }

    const vehicleAnalysis = () => {
        dispatch(vehicleAnalysisData());
        props.navigation.navigate('VehicleEntryExitAnalysis')
    }


    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.appbar}>
                <TouchableOpacity onPress={() => props.navigation.openDrawer()} style={{ marginTop: 5 }}>
                    <Image source={require('./../assets/images/bar.png')} style={{ width: 30, height: 30 }} />
                </TouchableOpacity>

                <Text style={{ fontSize: 15, marginLeft: 5, fontWeight: "bold" }}>Dashboard</Text>
                <TouchableOpacity onPress={() => props.navigation.navigate('Alarm')} style={{ alignSelf: "flex-end", position: "absolute", right: 50, top: 21 }}>
                    {/* <Badge style={{position:'absolute', top:-10, left:8, zIndex:5}}>1</Badge>
            <Image source={require('./../assets/images/bell.png')} style={{width:20, height:22}} /> */}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => logout()} style={{ alignSelf: "flex-end", position: "absolute", right: 15, top: 20 }}>
                    <Image source={{ uri: "https://image.flaticon.com/icons/png/512/18/18183.png" }} style={{ width: 20, height: 20 }} />
                </TouchableOpacity>
            </Appbar.Header>

            <View >
                {/* <Image source={require('./../assets/images/logo.png')} style={styles.bannerImg} /> */}
                <Image source={require('./../assets/images/logo_new.png')} style={styles.bannerImg} />
            </View>

            <ScrollView style={{ paddingHorizontal: 0 }}>

                <>
                    <View style={{...styles.Shadowbox_row, marginHorizontal:10}}>
                        <TouchableOpacity style={styles.Shadowbox}>
                            <View style={styles.Shadowbox_under}>
                                <View >
                                    <Image source={require('./../assets/images/group_icon.jpg')} style={{ height: 50, width: 55, borderRadius: 10 }} />
                                </View>
                                <View style={{ paddingLeft: 10 }}>
                                    <Text style={styles.number}>
                                        {
                                            TotalEmployee

                                        }
                                    </Text>
                                    <Text style={styles.employee}>Employee</Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.Shadowbox}>
                            <View style={styles.Shadowbox_under}>
                                <View >
                                    <Image source={require('./../assets/images/right_icon.jpg')} style={{ height: 50, width: 55, borderRadius: 10 }} />
                                </View>
                                <View style={{ paddingLeft: 10 }}>
                                    <Text style={styles.number}>
                                        {
                                            FRCount

                                        }
                                    </Text>
                                    <Text style={styles.employee}>Present</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{...styles.Shadowbox_row, marginHorizontal:10}}>
                        <TouchableOpacity style={styles.Shadowbox}>
                            <View style={styles.Shadowbox_under}>
                                <View >
                                    <Image source={require('./../assets/images/xross_icon.jpg')} style={{ height: 50, width: 55, borderRadius: 10 }} />
                                </View>
                                <View style={{ paddingLeft: 10 }}>
                                    <Text style={{ ...styles.number, color: "black" }}>
                                        {
                                            TotalEmployee - FRCount

                                        }
                                    </Text>
                                    <Text style={styles.employee}>Absent</Text>
                                </View>
                            </View>
                        </TouchableOpacity>


                        <TouchableOpacity style={styles.Shadowbox}>
                            <View style={styles.Shadowbox_under}>
                                <View >
                                    <Image source={require('./../assets/images/group_icon2.jpg')} style={{ height: 50, width: 55, borderRadius: 10 }} />
                                </View>
                                <View style={{ paddingLeft: 10 }}>
                                    <Text style={styles.number}>
                                        {
                                            latecommers

                                        }
                                    </Text>
                                    <Text style={styles.employee}>Late commer</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </>


                <View style={{ ...styles.Shadowbox2, flexDirection: "row", justifyContent: "space-between", marginHorizontal:10 }}>
                    <View style={{ width: "24%" }}>
                        <TouchableOpacity onPress={() => props.navigation.navigate('FaceRecognitionSolution')}>
                            <View style={{ alignItems: "center" }}>
                                <Image source={require('./../assets/images/man_icon.jpg')} style={{ height: 45, width: 50, borderRadius: 10 }} />
                            </View>
                            <TouchableOpacity onPress={() => props.navigation.navigate('FaceRecognitionSolution')} style={{ paddingLeft: 10 }}>
                                <Text style={styles.employee2}>Employee Attendance</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </View>

                    <View style={{ width: "24%" }}>
                        <TouchableOpacity onPress={() => props.navigation.navigate('ANPRSolution')}>
                            <View style={{ alignItems: "center" }}>
                                <Image source={require('./../assets/images/anpr_icon.jpg')} style={{ height: 45, width: 50, borderRadius: 10 }} />
                            </View>
                            <View style={{ paddingLeft: 10 }}>
                                <Text style={styles.employee2}>ANPR</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{ width: "24%" }}>
                        <TouchableOpacity onPress={() => vehicleMap()}>
                            <View style={{ alignItems: "center" }}>
                                <Image source={require('./../assets/images/vehiclemap.jpg')} style={{ height: 45, width: 45, marginLeft: 5, padding: 10, borderRadius: 10 }} />
                            </View>
                            <View style={{ paddingLeft: 10 }}>
                                <Text style={styles.employee2}>Vehicle Mapping</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{ width: "24%" }}>
                        <TouchableOpacity onPress={() => vehicleAnalysis()}>
                            <View style={{ alignItems: "center" }}>
                                <Image source={require('./../assets/images/vehicleanalysis.jpg')} style={{ height: 45, marginLeft: 5, width: 45, borderRadius: 10 }} />
                            </View>
                            <View style={{ paddingLeft: 10, marginTop: -5 }}>
                                <Text style={styles.employee2}>Vehicle Analysis</Text>
                            </View>
                        </TouchableOpacity>
                    </View>


                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal:10}}>
                    <TouchableOpacity 
                    onPress={()=> props.navigation.navigate('FireAndSmoke')}
                    style={{ ...styles.Shadowbox3, height:100, alignItems: 'center', justifyContent:'flex-start' }}>
                        <Image
                            source={require('./../assets/images/FireSmoke.png')}
                            style={{ width: 50, height: 50, marginBottom: 5 }} />
                        <Text style={styles.h3}>{'Fire & Smoke'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={()=> props.navigation.navigate('CrowdDetection')}
                       style={{ ...styles.Shadowbox3, height:100, alignItems: 'center', justifyContent:'flex-start' }}>
                        <Image
                            source={require('./../assets/images/CrowdDetection.png')}
                            style={{ width: 50, height: 50, marginBottom: 5 }} />
                        <Text style={styles.h3}>Crowd Analysis</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                     onPress={()=> props.navigation.navigate('VegetationDetection')}
                     style={{ ...styles.Shadowbox3, justifyContent:'flex-start', alignItems: 'center', height:100 }}>
                        <Image
                            source={require('./../assets/images/Vegetation.png')}
                            style={{ width: 50, height: 50, marginBottom: 5 }} />
                        <Text style={styles.h3}>Vegetation Analysis</Text>
                    </TouchableOpacity>

                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal:10 }}>
                    <TouchableOpacity 
                       onPress={()=> props.navigation.navigate('IntrusionDetection')}
                       style={{ ...styles.Shadowbox3, height:100, alignItems: 'center', justifyContent:'flex-start' }}>
                        <Image
                            source={require('./../assets/images/Intrusion.png')}
                            style={{ width: 50, height: 50, marginBottom: 5 }} />
                        <Text style={styles.h3}>Intrusion Detection</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                     onPress={()=> props.navigation.navigate('ModuleCleaning')}
                      style={{ ...styles.Shadowbox3, height:100, alignItems: 'center', justifyContent:'flex-start' }}>
                        <Image
                            source={require('./../assets/images/Module_Cleaning.png')}
                            style={{ width: 50, height: 50, marginBottom: 5 }} />
                        <Text style={styles.h3}>Cleaning Alerts</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={()=> props.navigation.navigate('DefectAnalytics')}
                        style={{ ...styles.Shadowbox3, height:100, alignItems: 'center', justifyContent:'flex-start' }}>
                        <Image
                            source={require('./../assets/images/Module_Defect.png')}
                            style={{ width: 50, height: 50, marginBottom: 5 }} />
                        <Text style={styles.h3}>Defect Alerts</Text>
                    </TouchableOpacity>

                </View>



                <View style={{ flexDirection: "row", justifyContent: "space-between",marginHorizontal:10 }}>
                    <View style={styles.Shadowbox3}>
                        <TouchableOpacity>
                            <View style={{ alignItems: "center" }}>
                                <Image source={require('./../assets/images/car.png')} style={{ height: 30, width: 60, borderRadius: 10, }} />
                            </View>
                            <View style={{ paddingLeft: 10, alignItems: "center" }}>
                                <Text style={{ ...styles.employee, marginTop: 2, marginLeft: -5 }}>Car <Text style={{ color: "black" }}>{car_inPercent}%</Text></Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.Shadowbox3}>
                        <TouchableOpacity>
                            <View style={{ alignItems: "center" }}>
                                <Image source={require('./../assets/images/motocross.png')} style={{ height: 50, width: 50, borderRadius: 10, marginTop: -10 }} />
                            </View>
                            <View style={{ paddingLeft: 10, alignItems: "center" }}>
                                <Text style={{ ...styles.employee, marginLeft: -5, }}>Bike <Text style={{ color: "black" }}>{bike_inPercent}%</Text></Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.Shadowbox3}>
                        <TouchableOpacity>
                            <View style={{ alignItems: "center" }}>
                                <Image source={require('./../assets/images/truck.png')} style={{ height: 50, width: 50, borderRadius: 10, marginTop: -10 }} />
                            </View>
                            <View style={{ paddingLeft: 10, alignItems: "center" }}>
                                <Text style={{ ...styles.employee, marginLeft: -5 }}>Truck <Text style={{ color: "black" }}>{truck_inPercent}%</Text></Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>



                <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal:10, marginBottom:10 }}>
                    <View style={styles.Shadowbox3}>
                        <TouchableOpacity>
                            <View style={{ alignItems: "center" }}>
                                <Image source={require('./../assets/images/van.png')} style={{ height: 50, width: 50, borderRadius: 10, marginTop: -10 }} />
                            </View>
                            <View style={{ paddingLeft: 10, alignItems: "center" }}>
                                <Text style={{ ...styles.employee, marginLeft: -5 }}>Van <Text style={{ color: "black" }}>{van_inPercent}%</Text></Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.Shadowbox3}>
                        <TouchableOpacity>
                            <View style={{ alignItems: "center" }}>
                                <Image source={require('./../assets/images/bike.png')} style={{ height: 50, width: 50, borderRadius: 10, marginTop: -10 }} />
                            </View>
                            <View style={{ paddingLeft: 10, alignItems: "center" }}>
                                <Text style={{ ...styles.employee, marginLeft: -5 }}>Cycle <Text style={{ color: "black" }}>{cycle_inPercent}%</Text></Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.Shadowbox3}>
                        <TouchableOpacity>
                            <View style={{ alignItems: "center" }}>
                                <Image source={require('./../assets/images/tractorr.png')} style={{ height: 50, width: 50, borderRadius: 10, marginTop: -10 }} />
                            </View>
                            <View style={{ paddingLeft: 10, alignItems: "center" }}>
                                <Text style={{ ...styles.employee, marginLeft: -5, fontSize: 10 }}>Tractor <Text style={{ color: "black" }}>{tractor_inPercent}%</Text></Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <AlarmModal AlarmokBtn={<TouchableOpacity onPress={() => alarmDisable()}
                style={{ width: 100, height: 30, borderWidth: 1, borderColor: "#446DFF", borderRadius: 5, marginTop: 10, alignSelf: 'center' }}>
                <Text style={{ color: '#446DFF', alignSelf: 'center', marginTop: 5 }}>Ok</Text>

            </TouchableOpacity>} />
            <OfflinePopup />
        </View>
    )
}

export default Dashboard

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FBFBFB",
        flex: 1,
    },

    appbar: {
        backgroundColor: "white",
        color: "black"
    },

    banner: {
        width: "100%",
        height: 150,
        paddingTop: 20,
        backgroundColor: "#F5F5F5",
        borderBottomLeftRadius: 10
    },

    bannerImg: {
        width: 230,
        alignSelf: "center",
        height: 60,
        marginTop: 10,
    },

    Shadowbox_row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },

    Shadowbox: {
        backgroundColor: "white",
        justifyContent: "center",
       // shadowColor: '#FFFFFF',
       // shadowOpacity: 0.26,
       // shadowOffset: { width: 0, height: 2 },
       // shadowRadius: 10,
       // elevation: 5,
        width: "48%",
        padding: 15,
        borderRadius: 10,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },

    Shadowbox_under: {
        flexDirection: "row"
    },

    number: {
        fontSize: 30,
        marginTop: -4,
        color: "black",
        fontWeight: "bold",
    },

    employee: {
        color: "#8D8D8D",
        marginTop: -5,
        fontSize: 11,
        fontWeight: "bold"
    },

    employee2: {
        color: "#8D8D8D",
        marginTop: 5,
        marginLeft: -10,
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 11,
    },

    Shadowbox2: {
        backgroundColor: "white",
        justifyContent: "center",
     //   shadowColor: '#FFFFFF',
      //  shadowOpacity: 0.26,
      //  shadowOffset: { width: 0, height: 2 },
      //  shadowRadius: 10,
      //  elevation: 5,
      //  width: "100%",
        marginTop: 10,
        padding: 15,
        borderRadius: 10,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },

    Shadowbox3: {
        backgroundColor: "white",
        justifyContent: "center",
        shadowColor: '#FFFFFF',
        // shadowOpacity: 0.26,
        //  shadowOffset: { width: 0, height: 2},
        //     shadowRadius: 10,
        //   elevation: 5,
        width: "32%",
        marginTop: 10,
        padding: 12,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    h3: {
        fontSize: 10,
        fontWeight: 'bold',
        color: "#8D8D8D",
        textAlign: "center",
    }
});