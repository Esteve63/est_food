import React, { useEffect } from "react";
import { Text, StyleSheet } from "react-native";
import { Camera, CodeScanner } from "react-native-vision-camera";
export default function App() {

  useEffect(() => {
    (async () => {
      const cameraPermissionStatus = await Camera.requestCameraPermission();
    })();
  }, []);

  const devices = Camera.getAvailableCameraDevices();
  const device = devices.find((d) => d.position === 'back');

  const codeScanner: CodeScanner = {
    codeTypes: ['ean-13'],
    onCodeScanned: (codes) => {
      console.log(`Scanned ${codes.length} codes!`)
      codes.forEach((code) => {
        console.log(`Code: ${code.value}`)
      })
    }
  }

  if (device == null) return (<Text>CAMERA ERROR</Text>)
  return (
    <Camera
      device={device}
      isActive={true}
      style={StyleSheet.absoluteFill}
      codeScanner={codeScanner}
    />
  );
};
