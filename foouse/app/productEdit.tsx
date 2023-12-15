import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import { useLocalSearchParams } from 'expo-router';

export default function ModalScreen() {
  const [productName, setProductName] = useState('');
  const params = useLocalSearchParams();

  useEffect(() => {
    const fetchProductName = async () => {
      try {
        const response = await fetch(`http://192.168.0.16:8004/get_product/?id=${params.id}`);
        const data = await response.json();
        setProductName(data.name);
      } catch (error) {
        console.error('Error fetching product name:', error);
      }
    };

    if (params.id) {
      fetchProductName();
    }
  }, [params.id]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{productName} #{params.id}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
