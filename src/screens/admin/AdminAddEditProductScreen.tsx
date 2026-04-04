import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useTheme } from '../../context/ThemeContext';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import { PRODUCT_CATEGORIES } from '../../utils/constants';

const AdminAddEditProductScreen = ({ route, navigation }: any) => {
  const product = route.params?.product as Product | undefined;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price?.toString() || '',
    description: product?.description || '',
    category: product?.category || 'hot',
    stock: product?.stock?.toString() || '',
    isAvailable: product?.isAvailable ?? true,
    imageUrl: product?.imageUrl || '',
  });
  const { colors } = useTheme();

  const categories = Object.entries(PRODUCT_CATEGORIES).map(([key, value]) => ({
    id: key,
    name: value.name,
  }));

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.description || !formData.stock) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        category: formData.category as any,
        stock: parseInt(formData.stock),
        isAvailable: formData.isAvailable,
        imageUrl: formData.imageUrl || 'https://via.placeholder.com/300',
      };

      if (product) {
        await productService.updateProduct(product.id, productData);
        Alert.alert('Success', 'Product updated successfully');
      } else {
        await productService.addProduct(productData);
        Alert.alert('Success', 'Product added successfully');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.form, { backgroundColor: colors.surface }]}>
        <Input
          label="Product Name"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Enter product name"
        />

        <Input
          label="Price (₱)"
          value={formData.price}
          onChangeText={(text) => setFormData({ ...formData, price: text })}
          keyboardType="numeric"
          placeholder="0.00"
        />

        <Input
          label="Description"
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          multiline
          numberOfLines={4}
          placeholder="Enter product description"
          style={styles.textArea}
        />

        <Input
          label="Stock Quantity"
          value={formData.stock}
          onChangeText={(text) => setFormData({ ...formData, stock: text })}
          keyboardType="numeric"
          placeholder="0"
        />

        <Input
          label="Image URL"
          value={formData.imageUrl}
          onChangeText={(text) => setFormData({ ...formData, imageUrl: text })}
          placeholder="https://example.com/coffee.jpg"
        />

        <Text style={[styles.label, { color: colors.textSecondary }]}>Category</Text>
        <View style={styles.categoryContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryButton,
                { backgroundColor: colors.background },
                formData.category === cat.id && { borderColor: colors.primary, backgroundColor: colors.primary + '10' },
              ]}
              onPress={() => setFormData({ ...formData, category: cat.id as any })}
            >
              <Text
                style={[
                  styles.categoryText,
                  { color: formData.category === cat.id ? colors.primary : colors.textSecondary },
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.switchContainer}>
          <Text style={[styles.switchLabel, { color: colors.text }]}>Available for sale</Text>
          <TouchableOpacity
            style={[styles.switch, formData.isAvailable && { backgroundColor: colors.primary }]}
            onPress={() => setFormData({ ...formData, isAvailable: !formData.isAvailable })}
          >
            <View style={[styles.switchKnob, formData.isAvailable && styles.switchKnobActive]} />
          </TouchableOpacity>
        </View>

        <Button
          title={product ? 'Update Product' : 'Add Product'}
          onPress={handleSubmit}
          loading={loading}
          style={styles.submitButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryText: {
    fontSize: 14,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  switchLabel: {
    fontSize: 16,
  },
  switch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#CCC',
    padding: 2,
  },
  switchKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFF',
  },
  switchKnobActive: {
    transform: [{ translateX: 22 }],
  },
  submitButton: {
    marginTop: 16,
  },
});

export default AdminAddEditProductScreen;