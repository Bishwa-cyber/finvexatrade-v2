import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Switch,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';
import { useAlertContext } from '../components/AlertProvider';

const { width } = Dimensions.get('window');

const ProfileIcons = {
  Edit: ({ size = 24, color = '#9CA3AF' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18.5 2.50023C18.8978 2.10243 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.10243 21.5 2.50023C21.8978 2.89804 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.10243 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),
  
  Security: ({ size = 24, color = '#9CA3AF' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),
  
  Notifications: ({ size = 24, color = '#9CA3AF' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),
  
  Privacy: ({ size = 24, color = '#9CA3AF' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 11H5C3.89543 11 3 11.8954 3 13V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V13C21 11.8954 20.1046 11 19 11Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),
  
  Help: ({ size = 24, color = '#9CA3AF' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
      <Path
        d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 17H12.01"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),
  
  Back: ({ size = 24, color = '#9CA3AF' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 12H5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 19L5 12L12 5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),

  Wallet: ({ size = 24, color = '#9CA3AF' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="18" cy="15" r="2" stroke={color} strokeWidth="2" />
    </Svg>
  ),

  Support: ({ size = 24, color = '#9CA3AF' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 12L11 14L15 10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),

  Language: ({ size = 24, color = '#9CA3AF' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
      <Path
        d="M2 12H22"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),

  Stats: ({ size = 24, color = '#9CA3AF' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 20V10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18 20V4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 20V16"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),

  Logout: ({ size = 24, color = '#9CA3AF' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16 17L21 12L16 7"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21 12H9"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),
};

const ProfilePage: React.FC = () => {
  const { user } = useUser();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { showSuccess, showWarning, showInfo, showLogout, showError } = useAlertContext();
  
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  const [newsletter, setNewsletter] = useState(true);

  const isDark = theme === 'dark';

  const profileStats = [
    { label: 'Total Trades', value: '1,234', color: '#10B981' },
    { label: 'Win Rate', value: '76.5%', color: '#F59E0B' },
    { label: 'Profit/Loss', value: '+$12,456', color: '#10B981' },
    { label: 'Active Days', value: '89', color: '#8B5CF6' },
  ];

  const handleEditProfile = () => {
    showInfo(
      'Edit Profile',
      'Profile editing feature will be available soon. Stay tuned for updates!',
      () => {
        console.log('Profile editing acknowledged');
      }
    );
  };

  const handleSecuritySettings = () => {
    showWarning(
      'Security Settings',
      'Security settings are currently being developed. This feature will include 2FA, password management, and more.',
      () => {
        console.log('Security settings acknowledged');
      }
    );
  };

  const handleWalletSettings = () => {
    showSuccess(
      'Wallet Access',
      'Redirecting to wallet settings...',
      () => {
        router.push('/wallet');
      }
    );
  };

  const handleLanguageSettings = () => {
    showInfo(
      'Language & Region',
      'Multiple language support is coming soon. Currently supporting English only.',
      () => {
        console.log('Language settings acknowledged');
      }
    );
  };

  const handleTradingStats = () => {
    showSuccess(
      'Trading Statistics',
      'Loading your detailed trading performance data...',
      () => {
        console.log('Trading stats viewed');
      }
    );
  };

  const handlePrivacyPolicy = () => {
    showInfo(
      'Privacy Policy',
      'Your privacy is important to us. Our comprehensive privacy policy will be available soon.',
      () => {
        console.log('Privacy policy acknowledged');
      }
    );
  };

  const handleSupport = () => {
    showSuccess(
      'Help & Support',
      '24/7 support is available to assist you with any questions or issues.',
      () => {
        router.push('/support');
      }
    );
  };

  const handleFAQ = () => {
    showInfo(
      'FAQ',
      'Frequently asked questions section is being prepared to help you better.',
      () => {
        console.log('FAQ acknowledged');
      }
    );
  };

  const handleThemeToggle = () => {
    toggleTheme();
    showSuccess(
      'Theme Changed',
      `Successfully switched to ${theme === 'dark' ? 'light' : 'dark'} mode!`
    );
  };

  const handleNotificationToggle = (value: boolean) => {
    setNotifications(value);
    showSuccess(
      'Notifications Updated',
      `Push notifications ${value ? 'enabled' : 'disabled'} successfully.`
    );
  };

  const handleBiometricsToggle = (value: boolean) => {
    setBiometrics(value);
    if (value) {
      showWarning(
        'Biometric Login',
        'Biometric authentication will be enabled. Please ensure your device supports this feature.',
        () => {
          setBiometrics(true);
        }
      );
    } else {
      showInfo(
        'Biometric Login',
        'Biometric authentication has been disabled.'
      );
    }
  };

  const handleNewsletterToggle = (value: boolean) => {
    setNewsletter(value);
    showSuccess(
      'Newsletter Subscription',
      `Newsletter subscription ${value ? 'enabled' : 'disabled'} successfully.`
    );
  };

  const handleLogout = () => {
    showLogout(
      () => {
        router.replace('/(auth)/sign-in');
      }
    );
  };

  const profileOptions = [
    {
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      icon: <ProfileIcons.Edit size={24} color="#10B981" />,
      onPress: handleEditProfile,
    },
    {
      title: 'Security Settings',
      subtitle: 'Manage your security preferences',
      icon: <ProfileIcons.Security size={24} color="#EF4444" />,
      onPress: handleSecuritySettings,
    },
    {
      title: 'Wallet Settings',
      subtitle: 'Manage your wallet and payment methods',
      icon: <ProfileIcons.Wallet size={24} color="#8B5CF6" />,
      onPress: handleWalletSettings,
    },
    {
      title: 'Language & Region',
      subtitle: 'Choose your preferred language',
      icon: <ProfileIcons.Language size={24} color="#06B6D4" />,
      onPress: handleLanguageSettings,
    },
    {
      title: 'Trading Statistics',
      subtitle: 'View your detailed trading performance',
      icon: <ProfileIcons.Stats size={24} color="#F97316" />,
      onPress: handleTradingStats,
    },
    {
      title: 'Privacy Policy',
      subtitle: 'Review our privacy policy',
      icon: <ProfileIcons.Privacy size={24} color="#6B7280" />,
      onPress: handlePrivacyPolicy,
    },
    {
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      icon: <ProfileIcons.Support size={24} color="#10B981" />,
      onPress: handleSupport,
    },
    {
      title: 'FAQ',
      subtitle: 'Frequently asked questions',
      icon: <ProfileIcons.Help size={24} color="#F59E0B" />,
      onPress: handleFAQ,
    },
  ];

  const toggleSettings = [
    {
      title: 'Dark Mode',
      subtitle: 'Use dark theme',
      value: theme === 'dark',
      onToggle: handleThemeToggle,
    },
    {
      title: 'Push Notifications',
      subtitle: 'Receive trading alerts',
      value: notifications,
      onToggle: handleNotificationToggle,
    },
    {
      title: 'Biometric Login',
      subtitle: 'Use fingerprint/face ID',
      value: biometrics,
      onToggle: handleBiometricsToggle,
    },
    {
      title: 'Newsletter',
      subtitle: 'Receive market updates',
      value: newsletter,
      onToggle: handleNewsletterToggle,
    },
  ];

  const renderProfileHeader = () => (
    <View style={[styles.profileHeader, { backgroundColor: isDark ? '#111827' : '#F9FAFB' }]}>
      <View style={styles.profileImageContainer}>
        <Image
          source={{
            uri: user?.imageUrl || "https://drive.google.com/uc?export=view&id=17ZpBAmNPuc7hPF3loQwbafJ79JhCiJ9I",
          }}
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.editImageButton} onPress={handleEditProfile}>
          <ProfileIcons.Edit size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.profileInfo}>
        <Text style={[styles.profileName, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={[styles.profileEmail, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
          {user?.primaryEmailAddress?.emailAddress}
        </Text>
        <View style={styles.profileBadge}>
          <Text style={styles.profileBadgeText}>Pro Trader</Text>
        </View>
      </View>
    </View>
  );

  const renderStatsGrid = () => (
    <View style={styles.statsContainer}>
      <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>Trading Performance</Text>
      <View style={styles.statsGrid}>
        {profileStats.map((stat, index) => (
          <View key={index} style={[styles.statCard, { backgroundColor: isDark ? '#111827' : '#F9FAFB' }]}>
            <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
            <Text style={[styles.statLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderToggleSettings = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>Preferences</Text>
      {toggleSettings.map((setting, index) => (
        <View key={index} style={[styles.toggleItem, { backgroundColor: isDark ? '#111827' : '#F9FAFB' }]}>
          <View style={styles.toggleContent}>
            <Text style={[styles.toggleTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>{setting.title}</Text>
            <Text style={[styles.toggleSubtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>{setting.subtitle}</Text>
          </View>
          <Switch
            value={setting.value}
            onValueChange={setting.onToggle}
            trackColor={{ false: '#374151', true: '#10B981' }}
            thumbColor={setting.value ? '#FFFFFF' : '#9CA3AF'}
          />
        </View>
      ))}
    </View>
  );

  const renderProfileOptions = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>Account Settings</Text>
      {profileOptions.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.optionItem, { backgroundColor: isDark ? '#111827' : '#F9FAFB' }]}
          onPress={option.onPress}
          activeOpacity={0.8}
        >
          <View style={styles.optionIcon}>
            {option.icon}
          </View>
          <View style={styles.optionContent}>
            <Text style={[styles.optionTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>{option.title}</Text>
            <Text style={[styles.optionSubtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>{option.subtitle}</Text>
          </View>
          <View style={styles.optionArrow}>
            <Text style={[styles.arrowText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>›</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const styles = getStyles(isDark);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? '#000000' : '#FFFFFF'} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ProfileIcons.Back size={24} color={isDark ? '#FFFFFF' : '#1F2937'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.headerButton} onPress={handleEditProfile}>
          <ProfileIcons.Edit size={24} color={isDark ? '#FFFFFF' : '#1F2937'} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        {renderProfileHeader()}

        {/* Stats Grid */}
        {renderStatsGrid()}

        {/* Toggle Settings */}
        {renderToggleSettings()}

        {/* Profile Options */}
        {renderProfileOptions()}

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: isDark ? '#1F2937' : '#FEF2F2' }]}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <ProfileIcons.Logout size={24} color="#EF4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: isDark ? '#6B7280' : '#9CA3AF' }]}>Professional Trading v1.0</Text>
          <Text style={[styles.footerSubtext, { color: isDark ? '#6B7280' : '#9CA3AF' }]}>
            Crafted with ❤️ in Bengaluru, India
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#000000' : '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#1F2937' : '#E5E7EB',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: isDark ? '#FFFFFF' : '#1F2937',
  },
  headerButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#374151',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: isDark ? '#111827' : '#F9FAFB',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  profileEmail: {
    fontSize: 16,
    marginBottom: 12,
  },
  profileBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  profileBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 60) / 2,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: isDark ? '#1F2937' : '#E5E7EB',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: isDark ? '#1F2937' : '#E5E7EB',
  },
  toggleContent: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  toggleSubtitle: {
    fontSize: 14,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: isDark ? '#1F2937' : '#E5E7EB',
  },
  optionIcon: {
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
  },
  optionArrow: {
    padding: 4,
  },
  arrowText: {
    fontSize: 20,
    fontWeight: '300',
  },
  logoutSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: isDark ? '#374151' : '#FECACA',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 12,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default ProfilePage;
