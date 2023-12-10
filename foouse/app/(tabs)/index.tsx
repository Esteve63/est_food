import { StyleSheet } from 'react-native';

import TableList from '../../components/TableList';
import { View } from '../../components/Themed';
import { useEffect } from 'react';
import { Camera } from 'react-native-vision-camera';

const InventoryScreen = () => {
  useEffect(() => {
    (async () => {
      const cameraPermissionStatus = await Camera.requestCameraPermission();
    })();
  }, []);
  
  return (
    <View style={styles.container}>
      <TableList></TableList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

export default InventoryScreen;