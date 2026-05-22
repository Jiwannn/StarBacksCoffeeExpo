import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { reviewService } from '../../services/reviewService';

const ReviewScreen = ({ route, navigation }: any) => {
  const { orderId, productId, productName } = route.params;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }
    if (!comment.trim()) {
      Alert.alert('Error', 'Please write a review');
      return;
    }

    setLoading(true);
    try {
      const alreadyReviewed = await reviewService.hasUserReviewedProduct(user!.id, productId, orderId);
      if (alreadyReviewed) {
        Alert.alert('Already Reviewed', 'You have already reviewed this product.');
        navigation.goBack();
        return;
      }

      await reviewService.addReview({
        userId: user!.id,
        productId,
        orderId,
        userName: `${user!.firstName} ${user!.lastName}`,
        rating,
        comment: comment.trim(),
      });

      Alert.alert('Thank you!', 'Your review has been submitted.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.productName, { color: colors.primary }]}>{productName}</Text>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Your Rating</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map(star => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <Ionicons
                name={star <= rating ? 'star' : 'star-outline'}
                size={40}
                color={star <= rating ? '#FFC107' : colors.border}
              />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { color: colors.textSecondary }]}>Your Review</Text>
        <TextInput
          style={[styles.textArea, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
          value={comment}
          onChangeText={setComment}
          placeholder="Share your experience..."
          placeholderTextColor={colors.placeholder}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <Button
          title="Submit Review"
          onPress={handleSubmit}
          loading={loading}
          style={styles.button}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: { margin: 16, padding: 20, borderRadius: 16 },
  productName: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 10 },
  starsRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 24 },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    minHeight: 100,
    marginBottom: 20,
  },
  button: { marginTop: 8 },
});

export default ReviewScreen;
