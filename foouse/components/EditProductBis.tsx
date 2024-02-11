import { StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { View, Text } from './Themed';
import { useEffect, useState } from 'react';
import Product from '../models/Product';
import { useLocalSearchParams } from 'expo-router';
import { CategoryStock } from '../models/Category';
import { Formik } from 'formik';
import { ActivityIndicator, TextInput } from 'react-native-paper';
import SubmitButton from './SubmitButton';
import Fuse from 'fuse.js';
import StockAdjuster from './StockAdjuster';

const EditProduct = () => {
  const { slug } = useLocalSearchParams();

  const [product, setProduct] = useState<Product>({
    id: 0,
    ean_code: Array.isArray(slug) ? slug[0] : slug,
    category_id: 0,
    value: 0,
    units: '',
    stock: 0,
  });
  const [categories, setCategories] = useState<CategoryStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState(categories);

  const [fuse, setFuse] = useState<Fuse<CategoryStock> | null>(null);

  const fetchProduct = async () => {
    const product_response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/1/product/${slug}`);
    const product_data = await product_response.json();
    return product_data;
  }

  const fetchCategories = async () => {
    const categories_response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/1/categories`);
    const categories_data = await categories_response.json();
    return categories_data;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const product_data = await fetchProduct();
        const categories_data : CategoryStock[] = await fetchCategories();

        setProduct(product_data);
        setCategories(categories_data);

        const options = {
          includeScore: true,
          keys: ['name']
        };
        const fuseInstance = new Fuse(categories_data, options);
        setFuse(fuseInstance);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (searchText.trim()) {
      const results = fuse?.search(searchText).map(result => result.item) ?? [];
      setSearchResults(results);
    } else {
      setSearchResults(categories);
    }
  }, [searchText, fuse, categories]);

  if (loading) {
    return (
      <View style={{...styles.container, justifyContent: 'center'}}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>EAN-13: {product.ean_code}</Text>
      <Formik
        initialValues={{
          category_name: categories.find(category => category.id === product.category_id)?.name ?? '',
          stock: product.stock
        }}
        onSubmit={values => console.log(values)}
      >
        {({ handleChange, handleSubmit, values, setFieldValue }) => (
          <>
            <TextInput
              placeholder="Search category"
              onChangeText={text => {
                setSearchText(text);
                handleChange('category_name')(text);
              }}
              value={values.category_name}
              style={styles.form}
            />
            <FlatList
              data={searchResults}
              keyExtractor={item => item.id.toString()}
              style={styles.suggestionsContainer}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setFieldValue('category_name', item.name);
                    setSearchText('');
                  }}
                  style={styles.suggestionItem}
                >
                  <Text style={styles.suggestionText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <StockAdjuster initialStock={values.stock} onStockChange={(newStock) => handleChange('stock')(newStock.toString())}/>
            <SubmitButton onPress={() => handleSubmit()} />
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 5,
  },
  form: {
    width: '80%',
    margin: 10,
  },
  suggestionsContainer: {
    maxHeight: 200,
    width: '80%',
    backgroundColor: 'white',
    zIndex: 1,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  suggestionText: {
    color: 'black',
  },
});

export default EditProduct;