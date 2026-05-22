import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, deleteDoc, query, where } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<User | null> {
    try {
      console.log('🔐 Login attempt with email:', email.toLowerCase());
      const userCredential = await signInWithEmailAndPassword(auth, email.toLowerCase(), password);
      const uid = userCredential.user.uid;
      console.log('✅ Auth success, UID:', uid);

      const userRef = doc(db, 'users', uid);
      let userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        console.log('⚠️ Creating missing user document...');
        const userData = {
          firstName: '',
          lastName: '',
          email: email.toLowerCase(),
          phone: '',
          role: 'user',
          address: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await setDoc(userRef, userData);
        userDoc = await getDoc(userRef);
        console.log('✅ User document created');
      }

      return { id: uid, ...userDoc.data() } as User;
    } catch (error: any) {
      console.error('❌ Login error:', error.code, error.message);
      throw error;
    }
  },

  async signup(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
  }): Promise<User | null> {
    try {
      console.log('📝 Signup attempt:', userData.email);
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email.toLowerCase(), userData.password);
      const uid = userCredential.user.uid;
      const user: Omit<User, 'id'> = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email.toLowerCase(),
        phone: userData.phone,
        role: 'user',
        address: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await setDoc(doc(db, 'users', uid), user);
      console.log('✅ Signup successful, UID:', uid);
      return { id: uid, ...user } as User;
    } catch (error: any) {
      console.error('❌ Signup error:', error.code, error.message);
      throw error;
    }
  },

  async logout(): Promise<void> {
    await signOut(auth);
    console.log('🔓 Logged out');
  },

  async getCurrentUser(): Promise<User | null> {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;
    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
    if (userDoc.exists()) return { id: userDoc.id, ...userDoc.data() } as User;
    return null;
  },

  async updateUserProfile(userId: string, data: Partial<User>): Promise<void> {
    await updateDoc(doc(db, 'users', userId), { ...data, updatedAt: new Date() });
  },

  async getAllUsers(): Promise<User[]> {
    const snapshot = await getDocs(collection(db, 'users'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
  },

  async updateUserRole(userId: string, role: 'user' | 'admin'): Promise<void> {
    await updateDoc(doc(db, 'users', userId), { role, updatedAt: new Date() });
  },

  async deleteUser(userId: string): Promise<void> {
    await deleteDoc(doc(db, 'users', userId));
    // Also delete user's cart
    try { await deleteDoc(doc(db, 'carts', userId)); } catch {}
    // Also delete user's notifications
    try {
      const notifSnap = await getDocs(query(collection(db, 'notifications'), where('userId', '==', userId)));
      await Promise.all(notifSnap.docs.map(d => deleteDoc(d.ref)));
    } catch {}
  }
};