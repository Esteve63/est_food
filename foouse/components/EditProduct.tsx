import React, { useEffect, useState } from 'react';
import { Button, StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import { useLocalSearchParams } from 'expo-router';
import { Formik } from 'formik';
import { List, TextInput } from 'react-native-paper';
import Product from '../models/Product';
import { router } from 'expo-router';
import * as Yup from 'yup';
import Fuse from 'fuse.js';
import { CategoryStock, FuseSearchCategory } from '../models/Category';

const ProductSchema = Yup.object().shape({
  category_name: Yup.string().required('Required'),
  stock: Yup.number().required('Required')
});

let fuse = new Fuse([]);

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
        const categories_data = await categories_fetch;
        
        setProduct(product_data);
        setCategories(categories_data);

        setFormValues({
          category_name: product_data.category_id.toString(),
          stock: product_data.stock.toString()
        });

        const fuzzyOptions = {
          includeScore: true,
          keys: ['name']
        };
        fuse = new Fuse(categories_data, fuzzyOptions);

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

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
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

  const [suggestions, setSuggestions] = useState<FuseSearchCategory[]>([]);
  const [suggestionsVisible, setSuggestionsVisible] = useState<boolean>(false);

  const handleCategoryChange = (value: string) => {
    handleChange('category_name', value);
    const results = fuse.search(value);

    const mappedResults: FuseSearchCategory[] = results.map(result => {
      return {
        item: result.item,
        refIndex: result.refIndex,
        score: result.score ?? 0
      };
    });

    setSuggestions(mappedResults);

    let visibleSuggestions = false;
    if (mappedResults.length && mappedResults[0].item.name !== value) {
      visibleSuggestions = true;
    }

    setSuggestionsVisible(visibleSuggestions);

  };

  return (
    <View style={styles.container}>
      <Text>EAN-13: {product.ean_code}</Text>
      <Formik
        initialValues={{category_name: '', value: product.value, units: product.units, stock: product.stock}}
        validationSchema={ProductSchema}
        onSubmit={submit}
      >
        {({ handleSubmit, values, errors, touched }) => (
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
                  // title={suggestion}
                  title={<Text style={styles.suggestionText}>{suggestion.item.name}</Text>}
                  onPress={() => handleCategoryChange(suggestion.item.name)}
                  style={styles.suggestionItem}
                />
              ))}
            </View>
            }
            {touched.category_name && errors.category_name && (
              <Text style={{ color: 'red' }}>{errors.category_name}</Text>
            )}

            <TextInput
              label="Stock"
              value={formValues.stock}
              onChangeText={(value) => handleChange('stock', value)}
              error={touched.stock && !!errors.stock}
              keyboardType="numeric"
              style={styles.form}
            />
            {touched.stock && errors.stock && (
              <Text style={{ color: 'red' }}>{errors.stock}</Text>
            )}
            <Button onPress={() => handleSubmit()} title="OK"/>
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
    top: 100,
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
    // Add other text styling here if necessary
  }  
});

export default EditProduct;