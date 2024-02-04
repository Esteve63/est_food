import { StyleSheet } from 'react-native';
import { View, Text } from './Themed';
import { useEffect, useState } from 'react';
import Product from '../models/Product';
import { useLocalSearchParams } from 'expo-router';
import { CategoryStock } from '../models/Category';
import { Formik } from 'formik';
import { ActivityIndicator, TextInput } from 'react-native-paper';
import SubmitButton from './SubmitButton';

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
        const product_fetch = fetchProduct();
        const categories_fetch = fetchCategories();

        const product_data = await product_fetch;
        const categories_data = await categories_fetch;

        setProduct(product_data);
        setCategories(categories_data);

      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [])

  if (loading) {
    return (
      <View style={{...styles.container, justifyContent: 'center'}}>
        <ActivityIndicator />
      </View>
    )  
  }
  
  return (
    <View style={styles.container}>
      <Text>EAN-13: {product.ean_code}</Text>
      <Formik
        initialValues={{category_name: categories.find(category => category.id === product.category_id)?.name ?? '', stock: product.stock}}
        onSubmit={values => console.log(values)}
      >
        {({handleChange, handleSubmit, values}) => (
          <>
            <TextInput
              onChangeText={handleChange('category_name')}
              value={values.category_name}
              style={styles.form}
            />

            <SubmitButton onPress={() => handleSubmit()}/>
          </>
        )}
      </Formik>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 5
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
  form: {
    width: '80%',
    margin: 10
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 90,
    width: '80%',
    backgroundColor: 'white',
    zIndex: 1, // Make sure it overlays other content
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    color: 'black'
  },
  suggestionText: {
    color: 'black'
  },
  newCategoryItem: {
    backgroundColor: '#f0f0f0'
  }
});

export default EditProduct;