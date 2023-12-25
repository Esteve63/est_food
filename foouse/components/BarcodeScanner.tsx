import React, { useRef } from "react";
import { Text, StyleSheet } from "react-native";
import { Camera, CodeScanner } from "react-native-vision-camera";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { router } from 'expo-router';
import { useIsFocused } from "@react-navigation/native";

const BarcodeScanner = () => {
  const isFocused = useIsFocused();
  const cameraRef = useRef<any>(null);

  const devices = Camera.getAvailableCameraDevices();
  const device = devices.find((d) => d.position === 'back');

  if (device == null) {
    return (<Text>NO CAMERA DEVICE</Text>);
  }

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

  const tap = Gesture.Tap()
    .onStart(async ({x, y}) => {
      console.log(x, y);
      cameraRef.current.focus({x, y})
      // if (cameraRef.current && device.supportsFocus) {
      //   try {
      //     await cameraRef.current.focus({ x, y });
      //   } catch (error) {
      //     console.error("Error focusing:", error);
      //   }
      // }
    });

  return (
    <GestureDetector gesture={tap}>
      <Camera
        ref={cameraRef}
        device={device}
        isActive={isFocused}
        style={StyleSheet.absoluteFill}
        codeScanner={codeScanner}
      />
    </GestureDetector>
  );
};

export default BarcodeScanner;
