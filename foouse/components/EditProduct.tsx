import React, { useEffect, useState } from 'react';
import { Button, StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import { useLocalSearchParams } from 'expo-router';
import { Formik } from 'formik';
import { TextInput } from 'react-native-paper';
import Product from '../models/Product';
import { router } from 'expo-router';
import * as Yup from 'yup';

const ProductSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  stock: Yup.number().required('Required')
});


const EditProduct = () => {
  const { slug } = useLocalSearchParams();
  
  // Initialize the state with a default product
  const [product, setProduct] = useState<Product>({
    id: Array.isArray(slug) ? slug[0] : slug,
    name: 'Unknown',
    stock: 0
  });
  // Use local state for form fields
  const [formValues, setFormValues] = useState({ name: '', stock: '' });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/products/${slug}`);
        const data = await response.json();
        setProduct(data);
        setFormValues({ name: data.name, stock: data.stock.toString() });
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, []);

  const handleChange = (fieldName: string, value: string) => {
    setFormValues(currentValues => ({
      ...currentValues,
      [fieldName]: value
    }));
  };

  const submit = async () => {
    product.name = formValues.name;
    product.stock = Number(formValues.stock);
    await save();
    router.replace('/(tabs)')
  }

  const save = async () => {
    try {
      await fetch(`${process.env.EXPO_PUBLIC_API_URL}/product`, {
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

  return (
    <View style={styles.container}>
      <Text>EAN-13: {product.id}</Text>
      <Formik
        initialValues={{name: product.name, stock: product.stock}}
        validationSchema={ProductSchema}
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
  }
});

export default EditProduct;