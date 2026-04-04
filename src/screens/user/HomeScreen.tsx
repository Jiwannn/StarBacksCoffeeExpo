import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useTheme } from '../../context/ThemeContext';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import { ProductCard } from '../../components/common/ProductCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { PRODUCT_CATEGORIES } from '../../utils/constants';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }: any) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { colors } = useTheme();

  // Video player setup – adjust the path to your actual video file
  // Place your video at: assets/videos/video.mp4
  const videoSource = require('../../assets/videos/video.mp4');
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.play();
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const products = await productService.getProducts();
      setFeaturedProducts(products.slice(0, 6));
    } catch (error) {
      console.error('Load products error:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = Object.values(PRODUCT_CATEGORIES);

  const renderProductCard = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    />
  );

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      {/* Hero Video Section */}
      <View style={styles.heroContainer}>
        <VideoView
          player={player}
          style={styles.heroVideo}
          contentFit="cover"
        />
        <View style={[styles.heroOverlay, { backgroundColor: 'rgba(0,0,0,0.4)' }]}>
          <Text style={styles.heroTitle}>StarBacks Coffee</Text>
          <Text style={styles.heroSubtitle}>Gusto mo bang mag kape?</Text>
          <Text style={styles.heroTagline}>~~makapeleng~~</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search for your favorite coffee..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[styles.searchBar, { backgroundColor: colors.surface }]}
          iconColor={colors.primary}
          inputStyle={{ color: colors.text }}
          placeholderTextColor={colors.textSecondary}
          onFocus={() => navigation.navigate('ProductList', { title: 'Search Results' })}
        />
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Categories</Text>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.categoryCard, { backgroundColor: item.color }]}
              onPress={() => navigation.navigate('ProductList', { category: item.id, title: item.name })}
            >
              <Text style={styles.categoryIcon}>{item.icon}</Text>
              <Text style={styles.categoryName}>{item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>

      {/* Featured Products */}
      <View style={styles.featuredContainer}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Featured Products</Text>
        <FlatList
          data={featuredProducts}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderProductCard}
          keyExtractor={(item) => item.id}
        />
      </View>

      {/* About Preview */}
      <TouchableOpacity
        style={[styles.aboutPreview, { backgroundColor: colors.surface }]}
        onPress={() => navigation.navigate('About')}
      >
        <Text style={[styles.aboutTitle, { color: colors.primary }]}>About StarBacks</Text>
        <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
          Serving the finest coffee in Mindanao since 2024. Quality beans, expert baristas, and a warm atmosphere.
        </Text>
        <Text style={[styles.aboutLink, { color: colors.primary }]}>Learn More →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroContainer: {
    height: 300,
    position: 'relative',
  },
  heroVideo: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#FFF',
    marginBottom: 5,
  },
  heroTagline: {
    fontSize: 14,
    color: '#FFD700',
    fontStyle: 'italic',
  },
  searchContainer: {
    padding: 16,
  },
  searchBar: {
    elevation: 0,
    borderRadius: 12,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  categoryCard: {
    width: 100,
    height: 100,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  categoryName: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  featuredContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  aboutPreview: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  aboutText: {
    lineHeight: 20,
    marginBottom: 12,
  },
  aboutLink: {
    fontWeight: '600',
  },
});

export default HomeScreen;