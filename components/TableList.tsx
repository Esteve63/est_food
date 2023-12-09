import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, Pressable } from 'react-native';
import localItems from '../db/local_items.json'; // Adjust the path as needed
import { Link } from 'expo-router';
import Product from '../models/Product'

// Get the full width of the device
const fullWidth = Dimensions.get('window').width;

const TableList: React.FC = () => {
  const items: Product[] = localItems;

  // Render each item as a table row
  const renderRow = (item: Product, index: number) => (
    <Link href={{pathname: '/productEdit', params: {...item}}} asChild key={index} >
      <Pressable style={({ pressed }) => [
        styles.row,
        pressed && styles.pressedRow // Add this line
      ]}>
        <View style={styles.row}>
          <Text style={styles.cell}>{item.name}</Text>
          <Text style={styles.cell}>{item.stockUnits}</Text>
        </View>
      </Pressable>
    </Link>
  );

  return (
    <View style={styles.container}>
      {/* Table Header */}
      <View style={styles.header}>
        <Text style={styles.headerCell}>Name</Text>
        <Text style={styles.headerCell}>Stock Units</Text>
      </View>

      {/* Table Rows */}
      <ScrollView>
        {items.map((item, index) => renderRow(item, index))}
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
