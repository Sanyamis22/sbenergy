import React, { useRef } from "react";
import { View, TouchableOpacity, Text, Button } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import RNRestart from 'react-native-restart';
import NetInfo from "@react-native-community/netinfo";

const OfflinePopup = () => {
  const [connection, setConnection] = React.useState(false);
  React.useEffect(()=>{
    NetInfo.fetch().then(state => {
          if(state.isConnected==true){
            setConnection(true)
          }
    });
  },[])


  const refRBSheet = useRef();
  if(connection==false){
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        position:"absolute",
        bottom:0,
        height:50,
        borderTopWidth:1,
        borderColor:"#e6e6e6",
        width:"100%",
        flexDirection:"row"
      }}
    >
      
      
      <Text>Please check your internet connection</Text>
      <TouchableOpacity onPress={()=>RNRestart.Restart()} style={{paddingLeft:20}}><Text style={{color:"green", marginTop:2}}> Relode</Text></TouchableOpacity>
      
    </View>
  );
    }

    else{
      return(
        <></>
      )
    }
}

export default OfflinePopup