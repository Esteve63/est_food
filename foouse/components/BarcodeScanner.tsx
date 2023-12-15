import React from "react";
import { Text, StyleSheet } from "react-native";
import { Camera, CodeScanner, CameraCaptureError } from "react-native-vision-camera";
import { router } from 'expo-router';

const BarcodeScanner = () => {

  const devices = Camera.getAvailableCameraDevices();
  const device = devices.find((d) => d.position === 'back');

  const codeScanner: CodeScanner = {
    codeTypes: ['ean-13'],
    onCodeScanned: (codes) => {
      router.push({pathname: '/productEdit', params: {id: codes[0].value || ''}});
    }
  }

  if (device == null) return (<Text>NO CAMERA DEVICE</Text>)
  return (
    <Camera
      device={device}
      isActive={true}
      style={StyleSheet.absoluteFill}
      codeScanner={codeScanner}
    />
  );
};

export default BarcodeScanner;
