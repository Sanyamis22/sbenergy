import React, { useRef } from "react";
import { Image,View, PDF, TouchableOpacity, Text, Button } from "react-native";
import PDFView from 'react-native-view-pdf';
import RNFS from 'react-native-fs';

const PDFViewer = () => {
    
    return(
<View style={{ flex: 1 }}>
  <PDFView
    style={{flex:1}}
    onError={(error) => console.log('onError', error)}
    onLoad={() => console.log('PDF rendered from url')}
    resource="file:///storage/emulated/0/docs/ANPRSolution.pdf"
    resourceType="file"
  />
  
</View>
    )
}

export default PDFViewer