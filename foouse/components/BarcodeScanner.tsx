import React from "react";
import { Text, StyleSheet } from "react-native";
import { Camera, CodeScanner, CameraCaptureError } from "react-native-vision-camera";
import { router } from 'expo-router';
import { useIsFocused } from "@react-navigation/native";

const BarcodeScanner = () => {
  const isFocused = useIsFocused();

  const devices = Camera.getAvailableCameraDevices();
  const device = devices.find((d) => d.position === 'back');

  const codeScanner: CodeScanner = {
    codeTypes: ['ean-13'],
    onCodeScanned: (codes) => {

      if (!codes) {
        return;
      }

      if (codes.length === 0) {
        return;
      }

      if (!codes[0].value) {
        return;
      }

      router.push(`/product/${codes[0].value}`);
    }
  }

  if (device == null) return (<Text>NO CAMERA DEVICE</Text>)
  return (
    <Camera
      device={device}
      isActive={isFocused}
      style={StyleSheet.absoluteFill}
      codeScanner={codeScanner}
    />
  );
};

export default BarcodeScanner;
