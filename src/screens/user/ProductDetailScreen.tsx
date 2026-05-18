import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { Button } from '../../components/common/Button';
import { formatPrice } from '../../utils/helpers';
import { SIZES, SUGAR_LEVELS, MILK_OPTIONS, ADD_ONS } from '../../utils/constants';

const ProductDetailScreen = ({ route, navigation }: any) => {
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(SIZES[1]);
  const [selectedSugar, setSelectedSugar] = useState(SUGAR_LEVELS[2]);
  const [selectedMilk, setSelectedMilk] = useState(MILK_OPTIONS[0]);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const { addToCart } = useCart();
  const { colors } = useTheme();

  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOns(prev =>
      prev.includes(addOnId)
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const getAddOnsTotal = () =>
    ADD_ONS.filter(a => selectedAddOns.includes(a.id))
      .reduce((sum, a) => sum + a.price, 0);

  const getTotalItemPrice = () =>
    product.price + selectedSize.price + selectedMilk.extraPrice + getAddOnsTotal();

  const handleAddToCart = async () => {
    const customization = {
      size: selectedSize.label,
      sizePrice: selectedSize.price,
      sugar: selectedSugar.label,
      milk: selectedMilk.label,
      milkPrice: selectedMilk.extraPrice,
      addOns: ADD_ONS
        .filter(a => selectedAddOns.includes(a.id))
        .map(a => ({ id: a.id, name: a.name, price: a.price })),
      specialInstructions,
    };

    await addToCart({
      product,
      quantity,
      totalPrice: getTotalItemPrice(),
      customization,
    } as any);
    Alert.alert(
      'Added to Cart! ☕',
      `${quantity}x ${product.name} (${selectedSize.label}) added to your cart`,
      [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'View Cart', onPress: () => navigation.navigate('Cart') },
      ]
    );
  };

  const OptionChip = ({ label, selected, onPress, extraLabel }: any) => (
    <TouchableOpacity
      style={[
        styles.chip,
        { backgroundColor: colors.surface, borderColor: colors.border },
        selected && { backgroundColor: colors.primary, borderColor: colors.primary },
      ]}
      onPress={onPress}
    >
      <Text style={[styles.chipText, { color: selected ? '#FFF' : colors.text }]}>
        {label}
      </Text>
      {extraLabel ? (
        <Text style={[styles.chipExtra, { color: selected ? '#D4E9E2' : colors.textSecondary }]}>
          {extraLabel}
        </Text>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Image source={{ uri: product.imageUrl }} style={styles.image} />

      <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.name, { color: colors.text }]}>{product.name}</Text>
        <Text style={[styles.basePrice, { color: colors.primary }]}>
          {formatPrice(product.price)}
        </Text>
        <View style={styles.stockRow}>
          <Text style={[styles.stockLabel, { color: colors.textSecondary }]}>Stock: </Text>
          <Text style={[styles.stockValue, { color: product.stock > 0 ? '#4CAF50' : '#F44336' }]}>
            {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
          </Text>
        </View>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {product.description}
        </Text>
      </View>

      {product.stock > 0 && (
        <>
          {/* Size */}
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Size</Text>
            <View style={styles.chipRow}>
              {SIZES.map(size => (
                <OptionChip
                  key={size.id}
                  label={size.label}
                  extraLabel={size.price > 0 ? `+${formatPrice(size.price)}` : 'Base'}
                  selected={selectedSize.id === size.id}
                  onPress={() => setSelectedSize(size)}
                />
              ))}
            </View>
          </View>

          {/* Sugar Level */}
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Sugar Level</Text>
            <View style={styles.chipRow}>
              {SUGAR_LEVELS.map(sugar => (
                <OptionChip
                  key={sugar.id}
                  label={sugar.label}
                  selected={selectedSugar.id === sugar.id}
                  onPress={() => setSelectedSugar(sugar)}
                />
              ))}
            </View>
          </View>

          {/* Milk Type */}
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Milk Type</Text>
            <View style={styles.chipRow}>
              {MILK_OPTIONS.map(milk => (
                <OptionChip
                  key={milk.id}
                  label={milk.label}
                  extraLabel={milk.extraPrice > 0 ? `+${formatPrice(milk.extraPrice)}` : 'Free'}
                  selected={selectedMilk.id === milk.id}
                  onPress={() => setSelectedMilk(milk)}
                />
              ))}
            </View>
          </View>

          {/* Add-ons */}
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Add-ons</Text>
            <View style={styles.chipRow}>
              {ADD_ONS.map(addOn => (
                <OptionChip
                  key={addOn.id}
                  label={addOn.name}
                  extraLabel={`+${formatPrice(addOn.price)}`}
                  selected={selectedAddOns.includes(addOn.id)}
                  onPress={() => toggleAddOn(addOn.id)}
                />
              ))}
            </View>
          </View>

          {/* Special Instructions */}
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Special Instructions</Text>
            <TextInput
              style={[styles.textInput, {
                color: colors.text,
                borderColor: colors.border,
                backgroundColor: colors.background,
              }]}
              placeholder="e.g. Less ice, extra hot, no foam..."
              placeholderTextColor={colors.textSecondary}
              value={specialInstructions}
              onChangeText={setSpecialInstructions}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Quantity */}
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Quantity</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={[styles.quantityButton, { backgroundColor: colors.border }]}
                onPress={() => quantity > 1 && setQuantity(quantity - 1)}
              >
                <Text style={[styles.quantityButtonText, { color: colors.text }]}>-</Text>
              </TouchableOpacity>
              <Text style={[styles.quantity, { color: colors.text }]}>{quantity}</Text>
              <TouchableOpacity
                style={[styles.quantityButton, { backgroundColor: colors.border }]}
                onPress={() => quantity < product.stock && setQuantity(quantity + 1)}
              >
                <Text style={[styles.quantityButtonText, { color: colors.text }]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Price Breakdown */}
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Price Breakdown</Text>
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>Base Price</Text>
              <Text style={[styles.priceValue, { color: colors.text }]}>{formatPrice(product.price)}</Text>
            </View>
            {selectedSize.price > 0 && (
              <View style={styles.priceRow}>
                <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>Size ({selectedSize.label})</Text>
                <Text style={[styles.priceValue, { color: colors.text }]}>+{formatPrice(selectedSize.price)}</Text>
              </View>
            )}
            {selectedMilk.extraPrice > 0 && (
              <View style={styles.priceRow}>
                <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>{selectedMilk.label}</Text>
                <Text style={[styles.priceValue, { color: colors.text }]}>+{formatPrice(selectedMilk.extraPrice)}</Text>
              </View>
            )}
            {ADD_ONS.filter(a => selectedAddOns.includes(a.id)).map(addOn => (
              <View key={addOn.id} style={styles.priceRow}>
                <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>{addOn.name}</Text>
                <Text style={[styles.priceValue, { color: colors.text }]}>+{formatPrice(addOn.price)}</Text>
              </View>
            ))}
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.priceRow}>
              <Text style={[styles.totalLabel, { color: colors.primary }]}>Total per item</Text>
              <Text style={[styles.totalValue, { color: colors.primary }]}>{formatPrice(getTotalItemPrice())}</Text>
            </View>
          </View>

          <Button
            title={`Add to Cart — ${formatPrice(getTotalItemPrice() * quantity)}`}
            onPress={handleAddToCart}
            style={styles.addButton}
            size="large"
          />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  image: { width: '100%', height: 280, resizeMode: 'cover' },
  infoCard: {
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    marginBottom: 8,
  },
  name: { fontSize: 22, fontWeight: 'bold', marginBottom: 6 },
  basePrice: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  stockRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  stockLabel: { fontSize: 14 },
  stockValue: { fontSize: 14, fontWeight: '600' },
  description: { fontSize: 14, lineHeight: 20 },
  section: { padding: 16, marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: 'center',
    marginBottom: 4,
  },
  chipText: { fontSize: 13, fontWeight: '500' },
  chipExtra: { fontSize: 11, marginTop: 2 },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  quantityContainer: { flexDirection: 'row', alignItems: 'center' },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: { fontSize: 20, fontWeight: 'bold' },
  quantity: { fontSize: 18, fontWeight: '600', marginHorizontal: 20 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  priceLabel: { fontSize: 14 },
  priceValue: { fontSize: 14 },
  divider: { height: 1, marginVertical: 10 },
  totalLabel: { fontSize: 16, fontWeight: 'bold' },
  totalValue: { fontSize: 16, fontWeight: 'bold' },
  addButton: { margin: 16, marginBottom: 32 },
});

export default ProductDetailScreen;