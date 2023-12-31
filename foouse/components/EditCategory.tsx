import React, { useEffect, useState } from 'react';
import { Button, StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import { useLocalSearchParams } from 'expo-router';
import { Formik } from 'formik';
import { TextInput } from 'react-native-paper';
import { router } from 'expo-router';
import { Category } from '../models/Category';
import * as Yup from 'yup';
import Product from '../models/Product';

const CategorySchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  min_stock: Yup.number().required('Required')
});


const EditCategory = () => {
  const { slug } = useLocalSearchParams();
  
  // Initialize the state with a default product
  const [category, setCategory] = useState<Category>({
    id: 0,
    warehouse_id: 0,
    name: Array.isArray(slug) ? slug[0] : slug,
    min_stock: 0
  });
  const [products, setProducts] = useState<Product[]>([]);

  // Use local state for form fields
  const [formValues, setFormValues] = useState({ name: '', min_stock: '' });

  const fetchCategory = async () => {
    const category_response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/1/category/${slug}`);
    const category_data = await category_response.json();

    return category_data;
  }

  const fetchProducts = async () => {
    const products_response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/1/${slug}/products`);
    const products_data = await products_response.json();

    return products_data;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const category_fetch = fetchCategory();
        const products_fetch = fetchProducts();        
        
        const category_data = await category_fetch;
        const products_data = await products_fetch;

        setCategory(category_data);
        setProducts(products_data);
      
        setFormValues({ name: category_data.name, min_stock: category_data.min_stock.toString() });
      
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
    category.name = formValues.name;
    category.min_stock = Number(formValues.min_stock);
    await save();

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  }

  const save = async () => {
    try {
      await fetch(`${process.env.EXPO_PUBLIC_API_URL}/product`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      });
    } catch (error) {
        console.error('Error in POST request:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{name: category.name, min_stock: category.min_stock}}
        validationSchema={CategorySchema}
        onSubmit={submit}
      >
        {({ handleSubmit, values, errors, touched }) => (
          <>
            <TextInput
              label="Name"
              value={formValues.name}
              onChangeText={(value) => handleChange('name', value)}
              error={touched.name && !!errors.name}
              style={styles.form}
            />
            {touched.name && errors.name && (
              <Text style={{ color: 'red' }}>{errors.name}</Text>
            )}

            <TextInput
              label="Minimum stock"
              value={formValues.min_stock}
              onChangeText={(value) => handleChange('min_stock', value)}
              error={touched.min_stock && !!errors.min_stock}
              keyboardType="numeric"
              style={styles.form}
            />
            {touched.min_stock && errors.min_stock && (
              <Text style={{ color: 'red' }}>{errors.min_stock}</Text>
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
  }
});

export default EditCategory;