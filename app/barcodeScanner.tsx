import BarcodeScanner from "../components/BarcodeScanner";
import { useEffect } from "react";
import { View } from "../components/Themed";
import { StyleSheet } from 'react-native';
import { Camera } from "react-native-vision-camera";

const BarcodeScannerScreen = () => {

    return(
        <View style={styles.container}>
            <BarcodeScanner></BarcodeScanner>
        </View>

    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})


export default BarcodeScannerScreen;