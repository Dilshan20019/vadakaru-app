import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ReviewRatingScreen } from './src/screens/ReviewRatingScreen';
import { PaymentVerificationScreen } from './src/screens/PaymentVerificationScreen';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, Text } from 'react-native';

type AuthenticatedTab = 'home' | 'reviews' | 'payments';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login');
  const [currentTab, setCurrentTab] = useState<AuthenticatedTab>('home');

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
        <StatusBar style="dark" />
        {authScreen === 'login' ? (
          <LoginScreen onNavigateToRegister={() => setAuthScreen('register')} />
        ) : (
          <RegisterScreen onNavigateToLogin={() => setAuthScreen('login')} />
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar style="dark" />

      {/* Main Screen Content */}
      <View style={styles.screenWrapper}>
        {currentTab === 'home' && (
          <HomeScreen
            onNavigateToReviews={() => setCurrentTab('reviews')}
            onNavigateToPayments={() => setCurrentTab('payments')}
          />
        )}
        {currentTab === 'reviews' && (
          <ReviewRatingScreen onBack={() => setCurrentTab('home')} />
        )}
        {currentTab === 'payments' && (
          <PaymentVerificationScreen onBack={() => setCurrentTab('home')} />
        )}
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setCurrentTab('home')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={currentTab === 'home' ? 'home' : 'home-outline'}
            size={22}
            color={currentTab === 'home' ? '#4F46E5' : '#94A3B8'}
          />
          <Text
            style={[
              styles.tabItemLabel,
              currentTab === 'home' && styles.tabItemLabelActive,
            ]}
          >
            Dashboard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setCurrentTab('reviews')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={currentTab === 'reviews' ? 'star' : 'star-outline'}
            size={22}
            color={currentTab === 'reviews' ? '#4F46E5' : '#94A3B8'}
          />
          <Text
            style={[
              styles.tabItemLabel,
              currentTab === 'reviews' && styles.tabItemLabelActive,
            ]}
          >
            Reviews
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setCurrentTab('payments')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={
              currentTab === 'payments'
                ? 'shield-checkmark'
                : 'shield-checkmark-outline'
            }
            size={22}
            color={currentTab === 'payments' ? '#4F46E5' : '#94A3B8'}
          />
          <Text
            style={[
              styles.tabItemLabel,
              currentTab === 'payments' && styles.tabItemLabelActive,
            ]}
          >
            Payments
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  screenWrapper: {
    flex: 1,
  },
  bottomTabBar: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 6,
  },
  tabItemLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 3,
  },
  tabItemLabelActive: {
    color: '#4F46E5',
    fontWeight: '700',
  },
});
