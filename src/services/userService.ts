import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { User, Address } from '../types';

export const userService = {
  async getUserById(userId: string): Promise<User | null> {
    const docSnap = await getDoc(doc(db, 'users', userId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as User;
    }
    return null;
  },

  async addAddress(userId: string, address: Omit<Address, 'id'>): Promise<void> {
    const addressId = Date.now().toString();
    const newAddress = { ...address, id: addressId };
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data() as User;
    const currentAddresses = userData.address || [];
    await updateDoc(userRef, {
      address: [...currentAddresses, newAddress],
      updatedAt: new Date(),
    });
  },

  async updateAddress(userId: string, addressId: string, addressData: Partial<Address>): Promise<void> {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data() as User;
    const updatedAddresses = userData.address?.map(addr =>
      addr.id === addressId ? { ...addr, ...addressData } : addr
    );
    await updateDoc(userRef, { address: updatedAddresses, updatedAt: new Date() });
  },

  async deleteAddress(userId: string, addressId: string): Promise<void> {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data() as User;
    const updatedAddresses = userData.address?.filter(addr => addr.id !== addressId);
    await updateDoc(userRef, { address: updatedAddresses, updatedAt: new Date() });
  },

  async setDefaultAddress(userId: string, addressId: string): Promise<void> {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data() as User;
    const updatedAddresses = userData.address?.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId,
    }));
    await updateDoc(userRef, { address: updatedAddresses, updatedAt: new Date() });
  }
};