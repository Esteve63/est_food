import BarcodeScanner from "../../components/BarcodeScanner";
import { View } from "../../components/Themed";
import { StyleSheet } from 'react-native';

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