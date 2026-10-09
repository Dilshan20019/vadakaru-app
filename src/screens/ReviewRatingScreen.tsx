import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { Review } from '../types/reviews';

interface ReviewRatingScreenProps {
  onBack?: () => void;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    workerId: 'w-101',
    workerName: 'Kamal Perera',
    workerCategory: 'Master Electrician',
    clientId: 'c-user-1',
    clientName: 'Dilshan Silva (You)',
    jobTitle: 'Main DB Box & Circuit Breaker Setup',
    rating: 5,
    comment:
      'Excellent work! Kamal came on time, inspected the short circuit issue thoroughly, and replaced the breaker safely. Highly recommended for electrical work in Colombo area.',
    createdAt: 'Today, 2:30 PM',
    isCurrentUser: true,
  },
  {
    id: 'rev-2',
    workerId: 'w-101',
    workerName: 'Kamal Perera',
    workerCategory: 'Master Electrician',
    clientId: 'c-202',
    clientName: 'Nimal Jayawardena',
    jobTitle: 'Solar Inverter Wiring & Earthing',
    rating: 5,
    comment:
      'Very professional service. Explained everything clearly before starting the work. Fair pricing and clean work.',
    createdAt: 'Yesterday',
    isCurrentUser: false,
  },
  {
    id: 'rev-3',
    workerId: 'w-101',
    workerName: 'Kamal Perera',
    workerCategory: 'Master Electrician',
    clientId: 'c-203',
    clientName: 'Sanduni Fernando',
    jobTitle: 'Ceiling Fan & Wall Light Installation',
    rating: 4,
    comment:
      'Neat wiring job for the entire living room. Finished within 2 hours. Very polite and brought all necessary tools.',
    createdAt: '2 days ago',
    isCurrentUser: false,
  },
  {
    id: 'rev-4',
    workerId: 'w-101',
    workerName: 'Kamal Perera',
    workerCategory: 'Master Electrician',
    clientId: 'c-204',
    clientName: 'Kasun Wickramasinghe',
    jobTitle: 'Emergency Power Tripping Repair',
    rating: 5,
    comment:
      'Solved the tripping problem that two other electricians could not fix. Trustworthy and skilled craftsman.',
    createdAt: '5 days ago',
    isCurrentUser: false,
  },
];

const RATING_LABELS: Record<number, string> = {
  1: 'Poor (1/5)',
  2: 'Fair (2/5)',
  3: 'Good (3/5)',
  4: 'Very Good (4/5)',
  5: 'Excellent (5/5)',
};

export const ReviewRatingScreen: React.FC<ReviewRatingScreenProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [selectedFilter, setSelectedFilter] = useState<'all' | '5' | '4' | 'mine'>('all');

  // Modal State for Create / Edit
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [modalRating, setModalRating] = useState<number>(5);
  const [modalJobTitle, setModalJobTitle] = useState('House Wiring & Socket Installation');
  const [modalComment, setModalComment] = useState('');

  // Calculate statistics
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : '0.0';

  const count5 = reviews.filter((r) => r.rating === 5).length;
  const count4 = reviews.filter((r) => r.rating === 4).length;
  const count3 = reviews.filter((r) => r.rating === 3).length;
  const count2 = reviews.filter((r) => r.rating === 2).length;
  const count1 = reviews.filter((r) => r.rating === 1).length;

  // Filtered list
  const filteredReviews = reviews.filter((r) => {
    if (selectedFilter === '5') return r.rating === 5;
    if (selectedFilter === '4') return r.rating === 4;
    if (selectedFilter === 'mine') return r.isCurrentUser;
    return true;
  });

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingReviewId(null);
    setModalRating(5);
    setModalJobTitle('House Wiring & Socket Installation');
    setModalComment('');
    setIsModalVisible(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (review: Review) => {
    setEditingReviewId(review.id);
    setModalRating(review.rating);
    setModalJobTitle(review.jobTitle);
    setModalComment(review.comment);
    setIsModalVisible(true);
  };

  // Submit Create or Update
  const handleSaveReview = () => {
    if (!modalComment.trim()) {
      Alert.alert('Missing Feedback', 'Please provide a comment describing your experience.');
      return;
    }

    if (editingReviewId) {
      // Update existing review
      setReviews((prev) =>
        prev.map((r) =>
          r.id === editingReviewId
            ? {
                ...r,
                rating: modalRating,
                jobTitle: modalJobTitle,
                comment: modalComment.trim(),
                createdAt: 'Updated just now',
              }
            : r
        )
      );
      Alert.alert('Review Updated', 'Your review and rating have been updated successfully!');
    } else {
      // Create new review
      const newReview: Review = {
        id: `rev-${Date.now()}`,
        workerId: 'w-101',
        workerName: 'Kamal Perera',
        workerCategory: 'Master Electrician',
        clientId: user?.id || 'c-user-1',
        clientName: `${user?.name || 'Client'} (You)`,
        jobTitle: modalJobTitle,
        rating: modalRating,
        comment: modalComment.trim(),
        createdAt: 'Just now',
        isCurrentUser: true,
      };
      setReviews([newReview, ...reviews]);
      Alert.alert('Review Submitted', 'Thank you! Your feedback has been published.');
    }

    setIsModalVisible(false);
  };

  // Delete review
  const handleDeleteReview = (id: string) => {
    Alert.alert(
      'Delete Review',
      'Are you sure you want to delete this review? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setReviews((prev) => prev.filter((r) => r.id !== id));
            Alert.alert('Deleted', 'Review deleted successfully.');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Review & Rating</Text>
          <Text style={styles.headerSubtitle}>Trust & Reputation System</Text>
        </View>
        <TouchableOpacity
          style={styles.addReviewHeaderBtn}
          onPress={handleOpenCreateModal}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Worker Summary Profile Card */}
        <View style={styles.workerProfileCard}>
          <View style={styles.workerProfileTop}>
            <View style={styles.workerAvatar}>
              <Text style={styles.workerAvatarText}>KP</Text>
              <View style={styles.verifiedTick}>
                <Ionicons name="checkmark" size={10} color="#FFFFFF" />
              </View>
            </View>
            <View style={styles.workerInfo}>
              <View style={styles.workerNameRow}>
                <Text style={styles.workerName}>Kamal Perera</Text>
                <View style={styles.badgePill}>
                  <Text style={styles.badgeText}>Verified Pro</Text>
                </View>
              </View>
              <Text style={styles.workerCategory}>Licensed Master Electrician • Colombo</Text>
              <Text style={styles.workerCompletedJobs}>
                <Ionicons name="briefcase-outline" size={13} color="#4F46E5" /> 84 Jobs Completed
              </Text>
            </View>
          </View>

          {/* Rating Breakdown Section */}
          <View style={styles.ratingStatsBox}>
            <View style={styles.scoreCol}>
              <Text style={styles.scoreNumber}>{avgRating}</Text>
              <View style={styles.starRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons key={star} name="star" size={16} color="#F59E0B" />
                ))}
              </View>
              <Text style={styles.totalReviewsLabel}>{totalReviews} total ratings</Text>
            </View>

            <View style={styles.breakdownBarsCol}>
              {[
                { star: 5, count: count5 },
                { star: 4, count: count4 },
                { star: 3, count: count3 },
                { star: 2, count: count2 },
                { star: 1, count: count1 },
              ].map((item) => {
                const percent = totalReviews > 0 ? (item.count / totalReviews) * 100 : 0;
                return (
                  <View key={item.star} style={styles.barRow}>
                    <Text style={styles.barStarText}>{item.star}★</Text>
                    <View style={styles.barTrack}>
                      <View style={[styles.barFill, { width: `${percent}%` }]} />
                    </View>
                    <Text style={styles.barCountText}>{item.count}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Action button to Add Review */}
          <TouchableOpacity
            style={styles.postReviewActionBtn}
            onPress={handleOpenCreateModal}
            activeOpacity={0.85}
          >
            <Ionicons name="create-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.postReviewActionText}>Rate This Worker (Create Review)</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Chips */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionHeaderTitle}>Client Feedback ({reviews.length})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <TouchableOpacity
              style={[styles.filterChip, selectedFilter === 'all' && styles.filterChipActive]}
              onPress={() => setSelectedFilter('all')}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilter === 'all' && styles.filterChipTextActive,
                ]}
              >
                All ({reviews.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterChip, selectedFilter === 'mine' && styles.filterChipActive]}
              onPress={() => setSelectedFilter('mine')}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilter === 'mine' && styles.filterChipTextActive,
                ]}
              >
                My Reviews ({reviews.filter((r) => r.isCurrentUser).length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterChip, selectedFilter === '5' && styles.filterChipActive]}
              onPress={() => setSelectedFilter('5')}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilter === '5' && styles.filterChipTextActive,
                ]}
              >
                5 Stars ({count5})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterChip, selectedFilter === '4' && styles.filterChipActive]}
              onPress={() => setSelectedFilter('4')}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilter === '4' && styles.filterChipTextActive,
                ]}
              >
                4 Stars ({count4})
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Reviews List (READ, UPDATE, DELETE) */}
        {filteredReviews.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubble-ellipses-outline" size={44} color="#94A3B8" />
            <Text style={styles.emptyText}>No reviews found in this filter.</Text>
          </View>
        ) : (
          filteredReviews.map((item) => (
            <View
              key={item.id}
              style={[styles.reviewCard, item.isCurrentUser && styles.reviewCardUserHighlight]}
            >
              {/* Review Card Header */}
              <View style={styles.reviewHeaderRow}>
                <View style={styles.clientAvatar}>
                  <Text style={styles.clientAvatarText}>
                    {item.clientName.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.clientMeta}>
                  <View style={styles.clientNameBadgeRow}>
                    <Text style={styles.clientNameText}>{item.clientName}</Text>
                    {item.isCurrentUser && (
                      <View style={styles.myPillBadge}>
                        <Text style={styles.myPillText}>You</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.reviewDate}>{item.createdAt}</Text>
                </View>

                {/* Rating Stars Badge */}
                <View style={styles.starsBadge}>
                  <Ionicons name="star" size={14} color="#F59E0B" />
                  <Text style={styles.starsBadgeText}>{item.rating}.0</Text>
                </View>
              </View>

              {/* Job Title Tag */}
              <View style={styles.jobTagContainer}>
                <Ionicons name="checkmark-done" size={13} color="#059669" />
                <Text style={styles.jobTagText}>{item.jobTitle}</Text>
              </View>

              {/* Review Comment Content */}
              <Text style={styles.reviewComment}>{item.comment}</Text>

              {/* Actions for User's own review (UPDATE & DELETE) */}
              {item.isCurrentUser && (
                <View style={styles.reviewActionsRow}>
                  <TouchableOpacity
                    style={styles.editActionBtn}
                    onPress={() => handleOpenEditModal(item)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="create-outline" size={16} color="#4F46E5" />
                    <Text style={styles.editActionText}>Edit Review</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteActionBtn}
                    onPress={() => handleDeleteReview(item.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash-outline" size={16} color="#EF4444" />
                    <Text style={styles.deleteActionText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* CREATE & UPDATE MODAL */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>
                  {editingReviewId ? 'Edit Your Review' : 'Write Worker Review'}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {editingReviewId ? 'Edit Review' : 'New Review'} • Kamal Perera (Electrician)
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={styles.closeModalBtn}
              >
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalBody}>
              {/* Star Rating Picker */}
              <Text style={styles.modalLabel}>Select Star Rating</Text>
              <View style={styles.starPickerRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setModalRating(star)}
                    style={styles.starTouchItem}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={star <= modalRating ? 'star' : 'star-outline'}
                      size={36}
                      color="#F59E0B"
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.ratingDescriptor}>{RATING_LABELS[modalRating]}</Text>

              {/* Job Reference */}
              <Text style={styles.modalLabel}>Job / Task Completed</Text>
              <TextInput
                style={styles.modalInput}
                value={modalJobTitle}
                onChangeText={setModalJobTitle}
                placeholder="e.g. Fixed Circuit Breaker"
                placeholderTextColor="#94A3B8"
              />

              {/* Feedback Text Input */}
              <Text style={styles.modalLabel}>Your Feedback & Experience</Text>
              <TextInput
                style={[styles.modalInput, styles.modalTextArea]}
                value={modalComment}
                onChangeText={setModalComment}
                placeholder="Share how the worker performed, punctuality, quality of work, and pricing..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.modalSubmitButton}
                onPress={handleSaveReview}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={editingReviewId ? 'checkmark-circle-outline' : 'paper-plane-outline'}
                  size={18}
                  color="#FFFFFF"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.modalSubmitText}>
                  {editingReviewId ? 'Save Changes (Update)' : 'Publish Review (Create)'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  addReviewHeaderBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  workerProfileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  workerProfileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  workerAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  workerAvatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  verifiedTick: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#10B981',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  workerInfo: {
    marginLeft: 14,
    flex: 1,
  },
  workerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  workerName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  badgePill: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4F46E5',
  },
  workerCategory: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  workerCompletedJobs: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '600',
    marginTop: 4,
  },
  ratingStatsBox: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreCol: {
    alignItems: 'center',
    paddingRight: 16,
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    width: 100,
  },
  scoreNumber: {
    fontSize: 34,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 38,
  },
  starRow: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  totalReviewsLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  breakdownBarsCol: {
    flex: 1,
    paddingLeft: 14,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  barStarText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    width: 22,
  },
  barTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  barFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 3,
  },
  barCountText: {
    fontSize: 11,
    color: '#94A3B8',
    width: 16,
    textAlign: 'right',
  },
  postReviewActionBtn: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 14,
  },
  postReviewActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  filterSection: {
    marginBottom: 14,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  reviewCardUserHighlight: {
    borderColor: '#C7D2FE',
    backgroundColor: '#FAFAFF',
  },
  reviewHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clientAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clientAvatarText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4F46E5',
  },
  clientMeta: {
    marginLeft: 12,
    flex: 1,
  },
  clientNameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clientNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  myPillBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  myPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4F46E5',
  },
  reviewDate: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  starsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  starsBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
    marginLeft: 4,
  },
  jobTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 10,
  },
  jobTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#047857',
    marginLeft: 4,
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
    color: '#334155',
    marginTop: 10,
  },
  reviewActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginTop: 14,
    paddingTop: 10,
  },
  editActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 10,
  },
  editActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
    marginLeft: 4,
  },
  deleteActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  deleteActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 36,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 14,
    color: '#94A3B8',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  closeModalBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    padding: 20,
  },
  modalLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  starPickerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  starTouchItem: {
    paddingHorizontal: 8,
  },
  ratingDescriptor: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: '#D97706',
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 16,
  },
  modalTextArea: {
    height: 100,
  },
  modalSubmitButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
