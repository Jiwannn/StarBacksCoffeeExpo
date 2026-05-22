import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const AboutScreen = () => {
  const { colors } = useTheme();

  const teamMembers = [
    {
      name: 'Jarnel Jay Alngog',
      role: 'Lead Designer & Developer',
      image: require('../../assets/images/jarnel.jpg'),
      facebook: 'https://www.facebook.com/Jwnzxc',
      instagram: 'https://www.instagram.com/jwnzxcd',
    },
    {
      name: 'Jeff Daren Rebote',
      role: 'UI/UX Designer',
      image: require('../../assets/images/jeff.png'),
      facebook: 'https://www.facebook.com/MonerAnggay21',
      instagram: 'https://www.instagram.com/yacooo0',
    },
    {
      name: 'Diether Capadugan',
      role: 'Frontend Developer',
      image: require('../../assets/images/diether.png'),
      facebook: 'https://www.facebook.com/miggy.limbaga.5',
      instagram: null,
    },
  ];

  const values = [
    { icon: '🏆', title: 'Quality', desc: 'We never compromise on the quality of our coffee and service.' },
    { icon: '🤝', title: 'Integrity', desc: 'We conduct our business with honesty and transparency.' },
    { icon: '👥', title: 'Community', desc: 'We build and nurture relationships with our customers.' },
    { icon: '🌿', title: 'Sustainability', desc: 'We are committed to environmentally responsible practices.' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
        <Text style={[styles.title, { color: colors.primary }]}>About StarBacks</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Where passion meets perfection in every cup
        </Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Our Story</Text>
        <Text style={[styles.text, { color: colors.textSecondary }]}>
          StarBacks Coffee was founded in 2024 with a simple mission: to serve the finest coffee in Mindanao. 
          What started as a small coffee shop in Davao City has grown into a beloved local brand, 
          known for our commitment to quality, community, and sustainability.
        </Text>
        <Text style={[styles.text, { color: colors.textSecondary, marginTop: 12 }]}>
          We source our beans directly from local farmers, ensuring fair trade practices and the highest quality 
          standards. Every cup tells a story of dedication, from farm to your hands.
        </Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Our Values</Text>
        <View style={styles.valuesGrid}>
          {values.map((value, index) => (
            <View key={index} style={[styles.valueCard, { backgroundColor: colors.background }]}>
              <Text style={styles.valueIcon}>{value.icon}</Text>
              <Text style={[styles.valueTitle, { color: colors.text }]}>{value.title}</Text>
              <Text style={[styles.valueDesc, { color: colors.textSecondary }]}>{value.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Meet the Team</Text>
        {teamMembers.map((member, index) => (
          <View key={index} style={styles.teamCard}>
            <Image source={member.image} style={styles.teamImage} />
            <View style={styles.teamInfo}>
              <Text style={[styles.teamName, { color: colors.text }]}>{member.name}</Text>
              <Text style={[styles.teamRole, { color: colors.textSecondary }]}>{member.role}</Text>
              <View style={styles.socialLinks}>
                {member.facebook && (
                  <TouchableOpacity onPress={() => Linking.openURL(member.facebook)}>
                    <Ionicons name="logo-facebook" size={24} color={colors.primary} />
                  </TouchableOpacity>
                )}
                {member.instagram && (
                  <TouchableOpacity onPress={() => Linking.openURL(member.instagram)}>
                    <Ionicons name="logo-instagram" size={24} color={colors.primary} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 32,
    marginBottom: 16,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  section: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
  },
  valuesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  valueCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  valueIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  valueTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  valueDesc: {
    fontSize: 12,
    textAlign: 'center',
  },
  teamCard: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  teamImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  teamInfo: {
    flex: 1,
    marginLeft: 16,
  },
  teamName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  teamRole: {
    fontSize: 12,
    marginBottom: 8,
  },
  socialLinks: {
    flexDirection: 'row',
    gap: 12,
  },
});

export default AboutScreen;