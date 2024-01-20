import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface StockAdjusterProps {
  initialStock: number;
  onStockChange: (newStock: number) => void;
}

const StockAdjuster: React.FC<StockAdjusterProps> = ({ initialStock, onStockChange }) => {
  const [stock, setStock] = useState(initialStock);

  const handleDecrease = () => {
    const newStock = Math.max(0, stock - 1); // Prevents stock from going negative
    setStock(newStock);
    onStockChange(newStock);
  };

  const handleIncrease = () => {
    const newStock = stock + 1;
    setStock(newStock);
    onStockChange(newStock);
  };

  return (
    <View>
      <Text>Stock</Text>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleDecrease} style={styles.button}>
            <FontAwesome size={30} name='minus-circle' color='red'/>
        </TouchableOpacity>
        <Text style={styles.stockText}>{stock}</Text>
        <TouchableOpacity onPress={handleIncrease} style={styles.button}>
            <FontAwesome size={30} name='plus-circle' color='blue'/>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%'
  },
  button: {
    flex: 1, // 20% of parent's width
    alignItems: 'center',
    margin: 5
  },
  stockText: {
    flex: 1, // 60% of parent's width
    fontSize: 50,
    textAlign: 'center' // Ensures the text is centered
  }
});

export default StockAdjuster;
