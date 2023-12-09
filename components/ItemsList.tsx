import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import localItems from '../db/local_items.json';

// Define the types for your items
interface Item {
  name: string;
  stockUnits: number
}

const MyComponent: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch('https://your-api-endpoint.com/items');
        // const data = await response.json();
        // setItems(data);
        setItems(localItems);
    } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Render each item
  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.name}</Text>
      <Text>Stock units: {item.stockUnits}</Text>
    </View>
  );

  // Main render
  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={item => item.name}
    />
  );
};

// Styles
const styles = StyleSheet.create({
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default MyComponent;
