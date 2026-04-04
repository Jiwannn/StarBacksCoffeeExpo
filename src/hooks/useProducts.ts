import { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { Product } from '../types';

export const useProducts = (category?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, [category]);

  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await productService.getProducts(category);
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getProductById = async (id: string): Promise<Product | null> => {
    try {
      return await productService.getProductById(id);
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  return { products, isLoading, error, refreshProducts: loadProducts, getProductById };
};

export const useAdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await productService.getAllProductsForAdmin();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>, imageUri?: string) => {
    const productId = await productService.addProduct(product);
    if (imageUri) {
      const imageUrl = await productService.uploadProductImage(imageUri, productId);
      await productService.updateProduct(productId, { imageUrl });
    }
    await loadProducts();
    return productId;
  };

  const updateProduct = async (id: string, data: Partial<Product>, imageUri?: string) => {
    if (imageUri) {
      const imageUrl = await productService.uploadProductImage(imageUri, id);
      data.imageUrl = imageUrl;
    }
    await productService.updateProduct(id, data);
    await loadProducts();
  };

  const deleteProduct = async (id: string) => {
    await productService.deleteProduct(id);
    await loadProducts();
  };

  return { products, isLoading, loadProducts, addProduct, updateProduct, deleteProduct };
};