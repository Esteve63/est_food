import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, Pressable } from 'react-native';
import localItems from '../db/local_items.json'; // Adjust the path as needed
import { Link } from 'expo-router';
import Product from '../models/Product'

// Get the full width of the device
const fullWidth = Dimensions.get('window').width;

const TableList: React.FC = () => {
  // const items: Product[] = localItems;
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://192.168.0.16:8004/products`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching product name:', error);
      }
    };

    fetchProducts();

  }, []);

  // Render each item as a table row
  const renderRow = (item: Product, index: number) => (
    <Link href={{pathname: '/productEdit', params: {...item}}} asChild key={index} >
      <Pressable style={styles.row}>
        <Text style={styles.cell}>{item.name}</Text>
        <Text style={styles.cell}>{item.stock}</Text>
      </Pressable>
    </Link>
  );

  return (
    <View style={styles.container}>
      {/* Table Header */}
      <View style={styles.header}>
        <Text style={styles.headerCell}>Name</Text>
        <Text style={styles.headerCell}>Stock</Text>
      </View>

      {/* Table Rows */}
      <ScrollView>
        {products.map((item, index) => renderRow(item, index))}
      </ScrollView>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    padding: 10,
    width: fullWidth, // Set the width to the full width of the device
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: fullWidth, // Set the width to the full width of the device
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  scrollView: {
    paddingBottom: 120
  },
  pressedRow: {
    backgroundColor: '#e6e6e6', // Slightly different color when pressed
  },
});

export default TableList;
