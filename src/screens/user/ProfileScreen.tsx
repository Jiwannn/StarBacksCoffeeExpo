import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Ionicons } from '@expo/vector-icons';
import { formatPhoneNumber } from '../../utils/helpers';

// ========== Cloudinary Configuration ==========
// Replace with your own values:
const CLOUDINARY_CLOUD_NAME = 'ds3k3thy2';      // e.g., 'dxm3q4r5t'
const CLOUDINARY_UPLOAD_PRESET = 'expo_uploads';      // the unsigned preset you created

// Function to upload image to Cloudinary
const uploadToCloudinary = async (uri: string): Promise<string> => {
  const formData = new FormData();
  formData.append('file', {
    uri,
    type: 'image/jpeg',
    name: 'profile.jpg',
  } as any);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'Upload failed');
  return data.secure_url;
};

const ProfileScreen = ({ navigation }: any) => {
  const { user, updateUser, logout } = useAuth();
  const { colors } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '+63',
  });

  const handlePhoneChange = (text: string) => {
    setFormData({ ...formData, phone: formatPhoneNumber(text) });
  };

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to change your profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0].uri) {
      setUploading(true);
      try {
        const imageUrl = await uploadToCloudinary(result.assets[0].uri);
        await updateUser({ photoURL: imageUrl });
        Alert.alert('Success', 'Profile picture updated!');
      } catch (error: any) {
        console.error('Upload error:', error);
        Alert.alert('Upload Failed', error.message || 'Could not upload image. Check your Cloudinary settings.');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateUser(formData);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={handleImagePick} disabled={uploading} style={styles.avatarContainer}>
          {uploading ? (
            <ActivityIndicator size="large" color={colors.primary} style={styles.avatar} />
          ) : user?.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </Text>
            </View>
          )}
          <View style={styles.editIconContainer}>
            <Ionicons name="camera" size={16} color="#FFF" />
          </View>
        </TouchableOpacity>

        {!isEditing && (
          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
            <Ionicons name="pencil" size={20} color={colors.primary} />
          </TouchableOpacity>
        )}

        {!isEditing ? (
          <>
            <Text style={[styles.name, { color: colors.text }]}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={[styles.email, { color: colors.textSecondary }]}>{user?.email}</Text>
          </>
        ) : (
          <View style={styles.editForm}>
            <Input
              label="First Name"
              value={formData.firstName}
              onChangeText={(text) => setFormData({ ...formData, firstName: text })}
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              onChangeText={(text) => setFormData({ ...formData, lastName: text })}
            />
            <Input
              label="Phone Number"
              value={formData.phone}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
              placeholder="9123456789"
            />
            <View style={styles.editButtons}>
              <Button title="Cancel" onPress={() => setIsEditing(false)} variant="outline" style={styles.editButtonHalf} />
              <Button title="Save" onPress={handleSave} loading={loading} style={styles.editButtonHalf} />
            </View>
          </View>
        )}
      </View>

      <View style={[styles.menuSection, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.getParent()?.navigate('Orders')}
        >
          <Ionicons name="receipt-outline" size={24} color={colors.textSecondary} />
          <Text style={[styles.menuText, { color: colors.text }]}>My Orders</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.getParent()?.navigate('Home', { screen: 'About' })}
        >
          <Ionicons name="information-circle-outline" size={24} color={colors.textSecondary} />
          <Text style={[styles.menuText, { color: colors.text }]}>About Us</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <Button
        title="Logout"
        onPress={handleLogout}
        variant="danger"
        style={styles.logoutButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: 'center', padding: 24, marginBottom: 16 },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 40, fontWeight: 'bold', color: '#FFF' },
  editIconContainer: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#FF6600', borderRadius: 15, padding: 5 },
  editButton: { position: 'absolute', top: 20, right: 20 },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  email: { fontSize: 14 },
  editForm: { width: '100%', marginTop: 16 },
  editButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  editButtonHalf: { flex: 1, marginHorizontal: 4 },
  menuSection: { margin: 16, padding: 16, borderRadius: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  menuText: { flex: 1, fontSize: 16, marginLeft: 12 },
  logoutButton: { margin: 16, marginBottom: 30 },
});

export default ProfileScreen;