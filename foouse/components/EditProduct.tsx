import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import { useLocalSearchParams } from 'expo-router';
import { Formik } from 'formik';
import { List, TextInput } from 'react-native-paper';
import Product from '../models/Product';
import { router } from 'expo-router';
import * as Yup from 'yup';
import Fuse, { FuseResult } from 'fuse.js';
import { CategoryStock } from '../models/Category';
import SubmitButton from './SubmitButton';
import StockAdjuster from './StockAdjuster';

const ProductSchema = Yup.object().shape({
  category_name: Yup.string().required('Required'),
  stock: Yup.number().required('Required')
});

let fuse = new Fuse<CategoryStock>([]);

const EditProduct = () => {
  const { slug } = useLocalSearchParams();
  
  // Initialize the state with a default product
  const [product, setProduct] = useState<Product>({
    id: 0,
    ean_code: Array.isArray(slug) ? slug[0] : slug,
    category_id: 0,
    value: 0,
    units: '',
    stock: 0,
  });
  const [categories, setCategories] = useState<CategoryStock[]>([]);

  // Use local state for form fields
  const [formValues, setFormValues] = useState({category_name: '', stock: ''});

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
        const categories_data: CategoryStock[] = await categories_fetch;
        
        setProduct(product_data);
        setCategories(categories_data);

        const category_name = categories_data.find(category => category.id === product_data.category_id)?.name ?? '';
        setFormValues({
          category_name: category_name,
          stock: product_data.stock.toString()
        });

        const fuzzyOptions = {
          includeScore: true,
          keys: ['name']
        };

        fuse = new Fuse<CategoryStock>(categories_data, fuzzyOptions);

      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (fieldName: string, value: string) => {
    setFormValues(currentValues => ({
      ...currentValues,
      [fieldName]: value
    }));
  };

  const submit = async () => {
    // product.name = formValues.name;
    // product.stock = Number(formValues.stock);
    // await save();

    console.log(formValues);

    // if (router.canGoBack()) {
    //   router.back();
    // } else {
    //   router.replace('/(tabs)');
    // }
  }

  const save = async () => {
    try {
      await fetch(`${process.env.EXPO_PUBLIC_API_URL}/1/product`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
    } catch (error) {
        console.error('Error in POST request:', error);
    }
  };

  const [suggestions, setSuggestions] = useState<FuseResult<CategoryStock>[]>([]);
  const [suggestionsVisible, setSuggestionsVisible] = useState<boolean>(false);

  const handleCategoryChange = (value: string, new_category: boolean = false) => {
    handleChange('category_name', value);
    const results = fuse.search(value);

    setSuggestions(results);

    let visibleSuggestions = false;
    if (new_category) {
      // Hide suggestions
    } else if (results.length && results[0].item.name !== value) {
      visibleSuggestions = true;
    } else if (!results.length && value !== "") {
      visibleSuggestions = true;
    }

    setSuggestionsVisible(visibleSuggestions);
  };

  return (
    <View style={styles.container}>
      <Text>EAN-13: {product.ean_code}</Text>
      <Formik
        // initialValues={{category_name: '', value: product.value, units: product.units, stock: product.stock}}
        initialValues={{category_name: categories.find(category => category.id === product.category_id)?.name ?? '', stock: product.stock}}
        validationSchema={ProductSchema}
        onSubmit={submit}
      >
        {({ handleSubmit, setFieldValue, values, errors, touched }) => (
          <>
            <TextInput
              label="Category"
              value={formValues.category_name}
              onChangeText={handleCategoryChange}
              error={touched.category_name && !!errors.category_name}
              style={styles.form}
            />
            {
            suggestionsVisible && <View style={styles.suggestionsContainer}>
              {suggestions.map((suggestion, index) => (
                <List.Item
                  key={index}
                  title={<Text style={styles.suggestionText}>{suggestion.item.name}</Text>}
                  onPress={() => handleCategoryChange(suggestion.item.name)}
                  style={styles.suggestionItem}
                />
              ))}
              {
                <List.Item
                  title={<Text style={styles.suggestionText}>{`Add "${formValues.category_name}"`}</Text>}
                  onPress={() => handleCategoryChange(formValues.category_name, true)}
                  style={[styles.suggestionItem, styles.newCategoryItem]}
                />
              }
            </View>
            }
            {touched.category_name && errors.category_name && (
              <Text style={{ color: 'red' }}>{errors.category_name}</Text>
            )}

            <StockAdjuster 
              initialStock={product.stock}
              onStockChange={(newStock) => handleChange('stock', newStock.toString())}
            />
            <SubmitButton onPress={() => {handleSubmit()}} />
          </>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
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
    color: 'black', // Or any other color you prefer
  },
  newCategoryItem: {
    backgroundColor: '#f0f0f0'
  }
});

export default EditProduct;