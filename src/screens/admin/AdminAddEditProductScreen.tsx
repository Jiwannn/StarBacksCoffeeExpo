import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useTheme } from '../../context/ThemeContext';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import { PRODUCT_CATEGORIES } from '../../utils/constants';

const CLOUDINARY_CLOUD_NAME = 'ds3k3thy2';
const CLOUDINARY_UPLOAD_PRESET = 'starbacks_products';

const AdminAddEditProductScreen = ({ route, navigation }: any) => {
  const product = route.params?.product as Product | undefined;
  const [loading, setLoading] = useState(false);
  const [imageSource, setImageSource] = useState<'url' | 'local'>('url');
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price?.toString() || '',
    description: product?.description || '',
    category: product?.category || 'hot',
    isAvailable: product?.isAvailable ?? true,
    imageUrl: product?.imageUrl || '',
  });
  const { colors } = useTheme();

  const categories = Object.entries(PRODUCT_CATEGORIES).map(([key, value]) => ({
    id: key,
    name: value.name,
  }));

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to your photo library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setLocalImageUri(result.assets[0].uri);
    }
  };

  const uploadImageToCloudinary = async (uri: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`);
      xhr.onload = () => {
        const data = JSON.parse(xhr.responseText);
        if (data.secure_url) resolve(data.secure_url);
        else reject(new Error(data.error?.message || 'Cloudinary upload failed'));
      };
      xhr.onerror = () => reject(new Error('Network error during upload'));
      const formData = new FormData();
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('file', { uri, type: 'image/jpeg', name: `product_${Date.now()}.jpg` } as any);
      xhr.send(formData);
    });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    if (imageSource === 'url' && !formData.imageUrl) {
      Alert.alert('Error', 'Please enter an image URL');
      return;
    }
    if (imageSource === 'local' && !localImageUri) {
      Alert.alert('Error', 'Please pick an image from your library');
      return;
    }

    setLoading(true);
    try {
      let finalImageUrl = formData.imageUrl;
      if (imageSource === 'local' && localImageUri) {
        finalImageUrl = await uploadImageToCloudinary(localImageUri);
      }

      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        category: formData.category as any,
        isAvailable: formData.isAvailable,
        imageUrl: finalImageUrl || 'https://via.placeholder.com/300',
      };

      if (product) {
        await productService.updateProduct(product.id, productData);
        Alert.alert('Success', 'Product updated successfully');
      } else {
        await productService.addProduct(productData);
        Alert.alert('Success', 'Product added successfully');
      }
      navigation.goBack();
    } catch (error: any) {
      console.error('Save product error:', error);
      Alert.alert('Error', error?.message || 'Failed to save product');
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

        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Description</Text>
          <TextInput
            style={[
              styles.textArea,
              {
                color: colors.text,
                borderColor: colors.border,
                backgroundColor: colors.surface,
              },
            ]}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            placeholder="Enter product description"
            placeholderTextColor={colors.placeholder}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Image Source Toggle */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>Image Source</Text>
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              { borderColor: colors.border },
              imageSource === 'url' && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
            onPress={() => { setImageSource('url'); setLocalImageUri(null); }}
          >
            <Text style={[styles.toggleText, { color: imageSource === 'url' ? '#fff' : colors.textSecondary }]}>
              URL
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              { borderColor: colors.border },
              imageSource === 'local' && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
            onPress={() => setImageSource('local')}
          >
            <Text style={[styles.toggleText, { color: imageSource === 'local' ? '#fff' : colors.textSecondary }]}>
              Local File
            </Text>
          </TouchableOpacity>
        </View>

        {imageSource === 'url' ? (
          <Input
            label="Image URL"
            value={formData.imageUrl}
            onChangeText={(text) => setFormData({ ...formData, imageUrl: text })}
            placeholder="https://example.com/coffee.jpg"
          />
        ) : (
          <View style={styles.fieldContainer}>
            <TouchableOpacity
              style={[styles.pickImageButton, { borderColor: colors.primary }]}
              onPress={pickImage}
            >
              <Text style={[styles.pickImageText, { color: colors.primary }]}>
                {localImageUri ? 'Change Image' : 'Pick from Library'}
              </Text>
            </TouchableOpacity>
            {localImageUri && (
              <Image source={{ uri: localImageUri }} style={styles.previewImage} />
            )}
          </View>
        )}

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
  container: { flex: 1 },
  form: { margin: 16, padding: 16, borderRadius: 16 },
  fieldContainer: { marginBottom: 16 },
  label: { fontSize: 14, marginBottom: 8, fontWeight: '500' },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
  },
  toggleRow: { flexDirection: 'row', marginBottom: 16, gap: 8 },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  toggleText: { fontSize: 14, fontWeight: '500' },
  pickImageButton: {
    borderWidth: 1,
    borderRadius: 12,
    borderStyle: 'dashed',
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  pickImageText: { fontSize: 14, fontWeight: '500' },
  previewImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryText: { fontSize: 14 },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  switchLabel: { fontSize: 16 },
  switch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#CCC',
    padding: 2,
  },
  switchKnob: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#FFF' },
  switchKnobActive: { transform: [{ translateX: 22 }] },
  submitButton: { marginTop: 16 },
});

export default AdminAddEditProductScreen;
