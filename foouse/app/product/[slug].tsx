import React, { useEffect, useState } from 'react';
import { Button, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { useLocalSearchParams } from 'expo-router';
import { Formik, Field, Form, FormikHelpers } from 'formik';
import { TextInput } from 'react-native-paper';
import Product from '../../models/Product';
import { router } from 'expo-router';
import * as Yup from 'yup';

const ProductSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  stock: Yup.number().required('Required')
});


export default function ModalScreen() {
  const { slug } = useLocalSearchParams();
  
  // Initialize the state with a default product
  const [product, setProduct] = useState<Product>({
    id: Array.isArray(slug) ? slug[0] : slug,
    name: 'Unknown',
    stock: 0
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://192.168.0.16:8004/products/${slug}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, []);

  const nameChange = (name: string) => {
    setProduct(currentProduct => ({
      ...currentProduct,
      name: name
    }))
  }

  const stockChange = (stock: string) => {
    setProduct(currentProduct => ({
      ...currentProduct,
      stock: Number(stock)
    }))
  }

  const submit = async (product: Product) => {
    console.log(product);
    await save(product);
    // router.back();
    router.replace('/(tabs)')
  }

  const save = async (product: Product) => {
    try {
      await fetch(`http://192.168.0.16:8004/product/`, {
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
        onSubmit={() => submit(product)}
      >
        {({ handleSubmit, values, errors, touched }) => (
          <>
            <TextInput
              label="Name"
              value={product.name}
              onChangeText={nameChange}
              error={touched.name && !!errors.name}
              style={styles.form}
            />
            {touched.name && errors.name && (
              <Text style={{ color: 'red' }}>{errors.name}</Text>
            )}

            <TextInput
              label="Stock"
              value={product.stock.toString()}
              onChangeText={stockChange}
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
