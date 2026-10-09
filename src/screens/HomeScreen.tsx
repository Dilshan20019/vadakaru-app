import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

interface HomeScreenProps {
  onNavigateToReviews?: () => void;
  onNavigateToPayments?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToReviews,
  onNavigateToPayments,
}) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  const handleActionClick = (title: string) => {
    Alert.alert(title, `This feature is connected to your active session (${user?.email}).`);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Header Bar */}
      <View style={styles.topBar}>
        <View style={styles.userInfo}>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name || 'Member'}</Text>
        </View>
        <TouchableOpacity
          style={styles.logoutIconButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={22} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {/* User Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.profileRow}>
          {user?.avatarUrl ? (
            <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarText}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
          )}

          <View style={styles.profileDetails}>
            <View style={styles.nameBadgeRow}>
              <Text style={styles.profileName}>{user?.name}</Text>
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#4F46E5" />
              </View>
            </View>
            <Text style={styles.profileEmail}>{user?.email}</Text>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{user?.role || 'Member'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.accountMetaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Member Since</Text>
            <Text style={styles.metaValue}>{user?.createdAt || 'Today'}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Session Status</Text>
            <View style={styles.statusIndicatorRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Active</Text>
            </View>
          </View>
        </View>
      </View>

      {/* App Stats Overview */}
      <Text style={styles.sectionTitle}>Overview</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={[styles.statIconBadge, { backgroundColor: '#EEF2FF' }]}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#4F46E5" />
          </View>
          <Text style={styles.statTitle}>Security</Text>
          <Text style={styles.statSubtitle}>Protected</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIconBadge, { backgroundColor: '#ECFDF5' }]}>
            <Ionicons name="flash-outline" size={20} color="#10B981" />
          </View>
          <Text style={styles.statTitle}>Sync</Text>
          <Text style={styles.statSubtitle}>Live</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIconBadge, { backgroundColor: '#FDF4FF' }]}>
            <Ionicons name="ribbon-outline" size={20} color="#A855F7" />
          </View>
          <Text style={styles.statTitle}>Access</Text>
          <Text style={styles.statSubtitle}>Verified</Text>
        </View>
      </View>

      {/* Member 4: Trust & Payment System Module */}
      <View style={styles.memberModuleHeader}>
        <View style={styles.memberBadge}>
          <Text style={styles.memberBadgeText}>Member 4</Text>
        </View>
        <Text style={styles.memberModuleTitle}>Trust & Payment System</Text>
      </View>

      <View style={styles.memberFeatureCards}>
        {/* Review & Rating */}
        <TouchableOpacity
          style={styles.moduleCard}
          onPress={onNavigateToReviews}
          activeOpacity={0.8}
        >
          <View style={[styles.moduleIconBox, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="star" size={24} color="#D97706" />
          </View>
          <View style={styles.moduleCardContent}>
            <Text style={styles.moduleCardTitle}>Review & Rating System</Text>
            <Text style={styles.moduleCardDesc}>
              Rate completed jobs, manage reviews, calculate ratings & feedback
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
        </TouchableOpacity>

        {/* Payment Proof & Worker Verification */}
        <TouchableOpacity
          style={styles.moduleCard}
          onPress={onNavigateToPayments}
          activeOpacity={0.8}
        >
          <View style={[styles.moduleIconBox, { backgroundColor: '#EEF2FF' }]}>
            <Ionicons name="shield-checkmark" size={24} color="#4F46E5" />
          </View>
          <View style={styles.moduleCardContent}>
            <Text style={styles.moduleCardTitle}>Payment & Verification</Text>
            <Text style={styles.moduleCardDesc}>
              Upload bank slips, check receipt status & Admin worker NIC verification
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      {/* Quick Menu Options */}
      <Text style={styles.sectionTitle}>Account Actions</Text>
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => handleActionClick('Account Settings')}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemLeft}>
            <Ionicons name="person-circle-outline" size={22} color="#4F46E5" />
            <Text style={styles.menuItemText}>Personal Profile</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => handleActionClick('Security & Privacy')}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemLeft}>
            <Ionicons name="lock-closed-outline" size={22} color="#4F46E5" />
            <Text style={styles.menuItemText}>Security & Password</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => handleActionClick('App Notifications')}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemLeft}>
            <Ionicons name="notifications-outline" size={22} color="#4F46E5" />
            <Text style={styles.menuItemText}>Notifications</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      {/* Main Sign Out Button */}
      <TouchableOpacity
        style={styles.signOutButton}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Ionicons name="log-out-outline" size={18} color="#EF4444" style={styles.signOutIcon} />
        <Text style={styles.signOutButtonText}>Sign Out of Vadakaru</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  logoutIconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EEF2FF',
  },
  avatarFallback: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileDetails: {
    marginLeft: 16,
    flex: 1,
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  verifiedBadge: {
    marginLeft: 4,
  },
  profileEmail: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 6,
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4F46E5',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 16,
  },
  accountMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  statusIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10B981',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  statsGrid: {
    flexDirection: 'row',
    columnGap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  statSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginLeft: 12,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    borderRadius: 14,
    height: 50,
  },
  signOutIcon: {
    marginRight: 6,
  },
  signOutButtonText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '700',
  },
  memberModuleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  memberBadge: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 8,
  },
  memberBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  memberModuleTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  memberFeatureCards: {
    marginBottom: 24,
  },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  moduleIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleCardContent: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },
  moduleCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  moduleCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  moduleCardDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
});
