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
import { PaymentProof, PaymentStatus, WorkerVerification, VerificationStatus } from '../types/payments';

interface PaymentVerificationScreenProps {
  onBack?: () => void;
}

const INITIAL_PAYMENTS: PaymentProof[] = [
  {
    id: 'pay-001',
    transactionRef: 'TXN-COMB-94021',
    jobId: 'JOB-201',
    jobTitle: 'Main DB Box & Breaker Installation',
    clientName: 'Dilshan Silva (Client)',
    workerName: 'Kamal Perera',
    workerCategory: 'Master Electrician',
    amount: 6500,
    bankName: 'Commercial Bank (BOC Transfer)',
    slipUrl: 'bank_slip_comb_94021.png',
    status: 'pending',
    submittedAt: 'Today, 11:20 AM',
  },
  {
    id: 'pay-002',
    transactionRef: 'TXN-SAMP-18302',
    jobId: 'JOB-198',
    jobTitle: 'Kitchen Sink & Waste Pipe Plumbing',
    clientName: 'Dilshan Silva (Client)',
    workerName: 'Sunil Shantha',
    workerCategory: 'Certified Plumber',
    amount: 4200,
    bankName: 'Sampath Bank Vishwa',
    slipUrl: 'sampath_transfer_receipt.png',
    status: 'approved',
    submittedAt: 'Yesterday, 4:15 PM',
  },
  {
    id: 'pay-003',
    transactionRef: 'TXN-BOC-55019',
    jobId: 'JOB-185',
    jobTitle: 'Roof Waterproofing & Sealing',
    clientName: 'Dilshan Silva (Client)',
    workerName: 'Mahesh Bandara',
    workerCategory: 'Masonry Specialist',
    amount: 12000,
    bankName: 'Bank of Ceylon SmartPay',
    slipUrl: 'boc_deposit_slip.png',
    status: 'rejected',
    submittedAt: '3 days ago',
    rejectionReason: 'Deposit slip reference number unreadable. Please re-upload.',
  },
];

const INITIAL_VERIFICATIONS: WorkerVerification[] = [
  {
    id: 'ver-101',
    workerName: 'Kamal Perera',
    workerCategory: 'Master Electrician',
    email: 'kamal.electric@gmail.com',
    phone: '+94 77 452 8901',
    experienceYears: 7,
    nicNumber: '198724103982',
    nicFrontUrl: 'nic_front_kamal.jpg',
    nicBackUrl: 'nic_back_kamal.jpg',
    certificateTitle: 'NVQ Level 4 - Electrical Installation (NAITA)',
    certificateUrl: 'naita_nvq4_cert.pdf',
    status: 'pending',
    submittedAt: 'Yesterday, 09:30 AM',
  },
  {
    id: 'ver-102',
    workerName: 'Sunil Shantha',
    workerCategory: 'Certified Plumber',
    email: 'sunil.plumb@gmail.com',
    phone: '+94 71 883 4412',
    experienceYears: 5,
    nicNumber: '199015802214',
    nicFrontUrl: 'nic_front_sunil.jpg',
    nicBackUrl: 'nic_back_sunil.jpg',
    certificateTitle: 'City & Guilds Plumbing Certificate',
    certificateUrl: 'city_guilds_cert.pdf',
    status: 'verified',
    submittedAt: '4 days ago',
    verifiedAt: '3 days ago by Admin',
  },
  {
    id: 'ver-103',
    workerName: 'Niroshan Dias',
    workerCategory: 'AC Technician & Refrigeration',
    email: 'niro.ac.service@gmail.com',
    phone: '+94 76 991 2304',
    experienceYears: 3,
    nicNumber: '199532104590',
    nicFrontUrl: 'nic_front_niro.jpg',
    nicBackUrl: 'nic_back_niro.jpg',
    certificateTitle: 'Vocational Training Authority (VTA) HVAC',
    certificateUrl: 'vta_hvac_license.pdf',
    status: 'pending',
    submittedAt: 'Today, 08:45 AM',
  },
];

export const PaymentVerificationScreen: React.FC<PaymentVerificationScreenProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'payments' | 'verifications'>('payments');

  // Payments State
  const [payments, setPayments] = useState<PaymentProof[]>(INITIAL_PAYMENTS);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);

  // Form Fields for Payment Slip
  const [formJobTitle, setFormJobTitle] = useState('AC Gas Top-up & Service');
  const [formWorkerName, setFormWorkerName] = useState('Kamal Perera');
  const [formAmount, setFormAmount] = useState('5500');
  const [formBankName, setFormBankName] = useState('Commercial Bank');
  const [formSlipName, setFormSlipName] = useState('slip_bank_transfer_01.jpg');

  // Verifications State
  const [verifications, setVerifications] = useState<WorkerVerification[]>(INITIAL_VERIFICATIONS);
  const [inspectWorker, setInspectWorker] = useState<WorkerVerification | null>(null);

  // View Slip Modal State
  const [viewingSlip, setViewingSlip] = useState<PaymentProof | null>(null);

  // Open Create / Edit Payment Slip Modal
  const handleOpenCreatePayment = () => {
    setEditingPaymentId(null);
    setFormJobTitle('AC Gas Top-up & Service');
    setFormWorkerName('Kamal Perera');
    setFormAmount('5500');
    setFormBankName('Commercial Bank');
    setFormSlipName('bank_transfer_receipt_today.jpg');
    setIsPaymentModalVisible(true);
  };

  const handleOpenEditPayment = (payment: PaymentProof) => {
    setEditingPaymentId(payment.id);
    setFormJobTitle(payment.jobTitle);
    setFormWorkerName(payment.workerName);
    setFormAmount(payment.amount.toString());
    setFormBankName(payment.bankName);
    setFormSlipName(payment.slipUrl);
    setIsPaymentModalVisible(true);
  };

  const handleSavePaymentSlip = () => {
    const parsedAmount = parseFloat(formAmount);
    if (!formJobTitle.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid job title and payment amount.');
      return;
    }

    if (editingPaymentId) {
      // Update Payment
      setPayments((prev) =>
        prev.map((p) =>
          p.id === editingPaymentId
            ? {
                ...p,
                jobTitle: formJobTitle,
                workerName: formWorkerName,
                amount: parsedAmount,
                bankName: formBankName,
                slipUrl: formSlipName,
                status: 'pending',
                rejectionReason: undefined,
                submittedAt: 'Updated just now',
              }
            : p
        )
      );
      Alert.alert('Payment Slip Updated', 'Your updated payment proof has been submitted for review.');
    } else {
      // Create Payment
      const newPayment: PaymentProof = {
        id: `pay-${Date.now()}`,
        transactionRef: `TXN-SLIP-${Math.floor(10000 + Math.random() * 90000)}`,
        jobId: `JOB-${Math.floor(200 + Math.random() * 50)}`,
        jobTitle: formJobTitle.trim(),
        clientName: 'Dilshan Silva (Client)',
        workerName: formWorkerName.trim(),
        workerCategory: 'Service Professional',
        amount: parsedAmount,
        bankName: formBankName,
        slipUrl: formSlipName,
        status: 'pending',
        submittedAt: 'Just now',
      };
      setPayments([newPayment, ...payments]);
      Alert.alert('Payment Proof Uploaded', 'Bank slip submitted! The worker / admin will verify receipt.');
    }

    setIsPaymentModalVisible(false);
  };

  // Delete Payment
  const handleDeletePayment = (id: string) => {
    Alert.alert(
      'Cancel Payment Slip',
      'Are you sure you want to remove this payment slip proof?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setPayments((prev) => prev.filter((p) => p.id !== id));
            Alert.alert('Removed', 'Payment record removed.');
          },
        },
      ]
    );
  };

  // Admin action: Verify worker
  const handleApproveWorker = (workerId: string) => {
    setVerifications((prev) =>
      prev.map((w) =>
        w.id === workerId
          ? {
              ...w,
              status: 'verified',
              verifiedAt: 'Just now by Admin',
            }
          : w
      )
    );
    setInspectWorker(null);
    Alert.alert('Worker Verified! 🛡️', 'Worker has been approved and issued the verified badge.');
  };

  // Admin action: Reject worker
  const handleRejectWorker = (workerId: string) => {
    Alert.alert('Reject Request', 'Reject this worker verification submission?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject',
        style: 'destructive',
        onPress: () => {
          setVerifications((prev) =>
            prev.map((w) =>
              w.id === workerId
                ? {
                    ...w,
                    status: 'rejected',
                  }
                : w
            )
          );
          setInspectWorker(null);
          Alert.alert('Request Rejected', 'The worker has been notified to re-submit clear documents.');
        },
      },
    ]);
  };

  // Admin action: Delete verification record
  const handleDeleteVerification = (workerId: string) => {
    Alert.alert(
      'Delete Application',
      'Are you sure you want to permanently delete this verification application?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setVerifications((prev) => prev.filter((w) => w.id !== workerId));
            if (inspectWorker?.id === workerId) setInspectWorker(null);
            Alert.alert('Deleted', 'Verification record has been removed.');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Payments & Verification</Text>
          <Text style={styles.headerSubtitle}>Proof Upload & Trust Verification</Text>
        </View>
      </View>

      {/* Segmented Tab Controls */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'payments' && styles.tabButtonActive]}
          onPress={() => setActiveTab('payments')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="receipt-outline"
            size={18}
            color={activeTab === 'payments' ? '#FFFFFF' : '#64748B'}
            style={{ marginRight: 6 }}
          />
          <Text
            style={[styles.tabButtonText, activeTab === 'payments' && styles.tabButtonTextActive]}
          >
            Payment Proofs ({payments.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'verifications' && styles.tabButtonActive]}
          onPress={() => setActiveTab('verifications')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="shield-checkmark-outline"
            size={18}
            color={activeTab === 'verifications' ? '#FFFFFF' : '#64748B'}
            style={{ marginRight: 6 }}
          />
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'verifications' && styles.tabButtonTextActive,
            ]}
          >
            Worker Verification ({verifications.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ============================================================== */}
        {/* TAB 1: CLIENT PAYMENT SLIP UPLOAD                              */}
        {/* ============================================================== */}
        {activeTab === 'payments' && (
          <View>
            {/* Top Quick Action & Summary Banner */}
            <View style={styles.summaryBanner}>
              <View style={styles.bannerInfo}>
                <Text style={styles.bannerTitle}>Upload Bank Transfer Slip</Text>
                <Text style={styles.bannerSubtitle}>
                  Submit payment receipt to confirm your booking and release worker funds safely.
                </Text>
              </View>
              <TouchableOpacity
                style={styles.uploadPrimaryBtn}
                onPress={handleOpenCreatePayment}
                activeOpacity={0.85}
              >
                <Ionicons name="cloud-upload-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.uploadPrimaryText}>Upload Slip</Text>
              </TouchableOpacity>
            </View>

            {/* Section Header */}
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Submitted Payments ({payments.length})</Text>
              <Text style={styles.sectionHelp}>Tap slip to preview</Text>
            </View>

            {/* List of Payments (READ, UPDATE, DELETE) */}
            {payments.map((item) => {
              const isPending = item.status === 'pending';
              const isApproved = item.status === 'approved';

              return (
                <View key={item.id} style={styles.paymentCard}>
                  {/* Top card row: Ref and status badge */}
                  <View style={styles.paymentCardTopRow}>
                    <View>
                      <Text style={styles.txnRefText}>{item.transactionRef}</Text>
                      <Text style={styles.paymentDateText}>{item.submittedAt}</Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        isApproved && styles.statusBadgeApproved,
                        isPending && styles.statusBadgePending,
                        item.status === 'rejected' && styles.statusBadgeRejected,
                      ]}
                    >
                      <Ionicons
                        name={
                          isApproved
                            ? 'checkmark-circle'
                            : isPending
                            ? 'time-outline'
                            : 'alert-circle-outline'
                        }
                        size={13}
                        color={
                          isApproved
                            ? '#059669'
                            : isPending
                            ? '#D97706'
                            : '#DC2626'
                        }
                        style={{ marginRight: 4 }}
                      />
                      <Text
                        style={[
                          styles.statusBadgeText,
                          isApproved && styles.statusTextApproved,
                          isPending && styles.statusTextPending,
                          item.status === 'rejected' && styles.statusTextRejected,
                        ]}
                      >
                        {item.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  {/* Job and Worker detail */}
                  <View style={styles.jobDetailBox}>
                    <Text style={styles.cardJobTitle}>{item.jobTitle}</Text>
                    <Text style={styles.cardWorkerName}>
                      <Ionicons name="person-outline" size={13} color="#64748B" /> Worker: {item.workerName} ({item.workerCategory})
                    </Text>
                    <Text style={styles.cardBankName}>
                      <Ionicons name="business-outline" size={13} color="#64748B" /> Bank: {item.bankName}
                    </Text>
                  </View>

                  {/* Rejection notice if any */}
                  {item.rejectionReason && (
                    <View style={styles.rejectionNoticeBox}>
                      <Ionicons name="information-circle" size={16} color="#DC2626" />
                      <Text style={styles.rejectionNoticeText}>{item.rejectionReason}</Text>
                    </View>
                  )}

                  {/* Amount and Slip Preview Container */}
                  <View style={styles.amountSlipRow}>
                    <View>
                      <Text style={styles.amountLabel}>Paid Amount</Text>
                      <Text style={styles.amountValue}>Rs. {item.amount.toLocaleString()}.00</Text>
                    </View>

                    <TouchableOpacity
                      style={styles.slipPreviewChip}
                      onPress={() => setViewingSlip(item)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="image-outline" size={16} color="#4F46E5" />
                      <Text style={styles.slipChipText}>View Slip Proof</Text>
                      <Ionicons name="open-outline" size={14} color="#4F46E5" style={{ marginLeft: 4 }} />
                    </TouchableOpacity>
                  </View>

                  {/* Actions (UPDATE & DELETE) */}
                  <View style={styles.paymentActionsRow}>
                    {isPending && (
                      <TouchableOpacity
                        style={styles.actionBtnSecondary}
                        onPress={() => handleOpenEditPayment(item)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="pencil-outline" size={15} color="#4F46E5" />
                        <Text style={styles.actionBtnSecondaryText}>Edit Slip Details</Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      style={styles.actionBtnDelete}
                      onPress={() => handleDeletePayment(item.id)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="trash-outline" size={15} color="#EF4444" />
                      <Text style={styles.actionBtnDeleteText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* ============================================================== */}
        {/* TAB 2: ADMIN WORKER VERIFICATION                               */}
        {/* ============================================================== */}
        {activeTab === 'verifications' && (
          <View>
            {/* Admin Header Notice */}
            <View style={styles.adminBanner}>
              <Ionicons name="shield-checkmark" size={28} color="#4F46E5" />
              <View style={styles.adminBannerTextCol}>
                <Text style={styles.adminBannerTitle}>Worker Credential Review</Text>
                <Text style={styles.adminBannerSubtitle}>
                  Inspect government National Identity Cards (NIC) and professional trade certificates to certify workers.
                </Text>
              </View>
            </View>

            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Verification Requests ({verifications.length})</Text>
              <Text style={styles.sectionHelp}>Admin Actions</Text>
            </View>

            {/* List of Worker Verification Applications */}
            {verifications.map((worker) => {
              const isVerified = worker.status === 'verified';
              const isPending = worker.status === 'pending';

              return (
                <View key={worker.id} style={styles.workerVerCard}>
                  {/* Top: Worker Profile & Status */}
                  <View style={styles.workerVerHeader}>
                    <View style={styles.workerAvatar}>
                      <Text style={styles.workerAvatarText}>
                        {worker.workerName.charAt(0).toUpperCase()}
                      </Text>
                      {isVerified && (
                        <View style={styles.verifiedBadgeTick}>
                          <Ionicons name="checkmark" size={11} color="#FFFFFF" />
                        </View>
                      )}
                    </View>

                    <View style={styles.workerVerMeta}>
                      <View style={styles.nameAndBadgeRow}>
                        <Text style={styles.workerNameText}>{worker.workerName}</Text>
                        <View
                          style={[
                            styles.statusBadge,
                            isVerified && styles.statusBadgeApproved,
                            isPending && styles.statusBadgePending,
                            worker.status === 'rejected' && styles.statusBadgeRejected,
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusBadgeText,
                              isVerified && styles.statusTextApproved,
                              isPending && styles.statusTextPending,
                              worker.status === 'rejected' && styles.statusTextRejected,
                            ]}
                          >
                            {worker.status.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.workerCategoryText}>{worker.workerCategory}</Text>
                      <Text style={styles.workerContactText}>
                        📞 {worker.phone} • {worker.experienceYears} Years Exp
                      </Text>
                    </View>
                  </View>

                  {/* Documents Section */}
                  <View style={styles.docsContainer}>
                    <Text style={styles.docsSectionHeader}>Uploaded Verification Proofs:</Text>

                    {/* NIC Document Box */}
                    <View style={styles.docItemRow}>
                      <View style={styles.docIconBox}>
                        <Ionicons name="card-outline" size={18} color="#4F46E5" />
                      </View>
                      <View style={styles.docItemMeta}>
                        <Text style={styles.docItemTitle}>National Identity Card (NIC)</Text>
                        <Text style={styles.docItemValue}>NIC: {worker.nicNumber}</Text>
                      </View>
                      <View style={styles.docAttachedTag}>
                        <Ionicons name="attach-outline" size={14} color="#059669" />
                        <Text style={styles.docAttachedText}>2 Images</Text>
                      </View>
                    </View>

                    {/* Certificate Document Box */}
                    <View style={styles.docItemRow}>
                      <View style={styles.docIconBox}>
                        <Ionicons name="ribbon-outline" size={18} color="#D97706" />
                      </View>
                      <View style={styles.docItemMeta}>
                        <Text style={styles.docItemTitle}>Trade Certification</Text>
                        <Text style={styles.docItemValue}>{worker.certificateTitle}</Text>
                      </View>
                      <View style={styles.docAttachedTag}>
                        <Ionicons name="document-text-outline" size={14} color="#059669" />
                        <Text style={styles.docAttachedText}>Verified Doc</Text>
                      </View>
                    </View>
                  </View>

                  {/* Admin Action Buttons */}
                  <View style={styles.adminActionRow}>
                    <TouchableOpacity
                      style={styles.inspectBtn}
                      onPress={() => setInspectWorker(worker)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="eye-outline" size={16} color="#4F46E5" />
                      <Text style={styles.inspectBtnText}>Inspect Documents</Text>
                    </TouchableOpacity>

                    {isPending && (
                      <TouchableOpacity
                        style={styles.approveQuickBtn}
                        onPress={() => handleApproveWorker(worker.id)}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="checkmark-circle-outline" size={16} color="#FFFFFF" />
                        <Text style={styles.approveQuickBtnText}>Verify & Approve</Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      style={styles.deleteWorkerBtn}
                      onPress={() => handleDeleteVerification(worker.id)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="trash-outline" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* ============================================================== */}
      {/* MODAL 1: UPLOAD / EDIT PAYMENT SLIP (CLIENT)                   */}
      {/* ============================================================== */}
      <Modal
        visible={isPaymentModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsPaymentModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>
                  {editingPaymentId ? 'Update Payment Slip' : 'Upload Bank Transfer Slip'}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {editingPaymentId ? 'Update Receipt' : 'New Submission'} • Payment Proof
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsPaymentModalVisible(false)}
                style={styles.closeBtn}
              >
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalForm}>
              <Text style={styles.fieldLabel}>Job / Task Reference</Text>
              <TextInput
                style={styles.inputField}
                value={formJobTitle}
                onChangeText={setFormJobTitle}
                placeholder="e.g. Electrical Main Line Wiring"
                placeholderTextColor="#94A3B8"
              />

              <Text style={styles.fieldLabel}>Worker / Service Provider</Text>
              <TextInput
                style={styles.inputField}
                value={formWorkerName}
                onChangeText={setFormWorkerName}
                placeholder="Worker Name"
                placeholderTextColor="#94A3B8"
              />

              <Text style={styles.fieldLabel}>Amount Paid (LKR)</Text>
              <TextInput
                style={styles.inputField}
                value={formAmount}
                onChangeText={setFormAmount}
                placeholder="e.g. 5000"
                keyboardType="numeric"
                placeholderTextColor="#94A3B8"
              />

              <Text style={styles.fieldLabel}>Bank / Transfer Method</Text>
              <TextInput
                style={styles.inputField}
                value={formBankName}
                onChangeText={setFormBankName}
                placeholder="e.g. Commercial Bank / Sampath Vishwa"
                placeholderTextColor="#94A3B8"
              />

              {/* Mock Slip File Picker Box */}
              <Text style={styles.fieldLabel}>Receipt / Bank Slip Attachment</Text>
              <View style={styles.filePickerBox}>
                <Ionicons name="document-attach-outline" size={28} color="#4F46E5" />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={styles.filePickerName}>{formSlipName}</Text>
                  <Text style={styles.filePickerSize}>Image receipt • 1.2 MB • Ready</Text>
                </View>
                <TouchableOpacity
                  style={styles.changeFileBtn}
                  onPress={() => {
                    const sampleNames = ['boc_transfer_slip_2026.png', 'sampath_receipt_slip.jpg', 'commercial_slip_9941.pdf'];
                    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
                    setFormSlipName(randomName);
                    Alert.alert('Slip Selected', `Selected file: ${randomName}`);
                  }}
                >
                  <Text style={styles.changeFileText}>Change</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.submitModalBtn}
                onPress={handleSavePaymentSlip}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark-done" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.submitModalBtnText}>
                  {editingPaymentId ? 'Save Slip Changes (Update)' : 'Submit Payment Slip (Create)'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ============================================================== */}
      {/* MODAL 2: INSPECT WORKER DOCUMENTS                              */}
      {/* ============================================================== */}
      <Modal
        visible={!!inspectWorker}
        animationType="slide"
        transparent
        onRequestClose={() => setInspectWorker(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Inspect Worker Documents</Text>
                <Text style={styles.modalSubtitle}>
                  {inspectWorker?.workerName} • {inspectWorker?.workerCategory}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setInspectWorker(null)} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {inspectWorker && (
              <ScrollView showsVerticalScrollIndicator={false} style={styles.modalForm}>
                {/* NIC Inspection Card */}
                <Text style={styles.fieldLabel}>1. National Identity Card (NIC)</Text>
                <View style={styles.docInspectCard}>
                  <View style={styles.mockIdImage}>
                    <Ionicons name="id-card" size={40} color="#4F46E5" />
                    <Text style={styles.mockIdText}>NIC FRONT & BACK ATTACHED</Text>
                    <Text style={styles.mockIdSub}>No: {inspectWorker.nicNumber}</Text>
                  </View>
                </View>

                {/* Certificate Inspection Card */}
                <Text style={[styles.fieldLabel, { marginTop: 14 }]}>
                  2. Trade License / Certificate
                </Text>
                <View style={styles.docInspectCard}>
                  <View style={styles.mockIdImage}>
                    <Ionicons name="school-outline" size={40} color="#D97706" />
                    <Text style={styles.mockIdText}>{inspectWorker.certificateTitle}</Text>
                    <Text style={styles.mockIdSub}>Verified Vocational Institute Accredited</Text>
                  </View>
                </View>

                {/* Admin Verification Decision Buttons */}
                <View style={styles.inspectDecisionRow}>
                  <TouchableOpacity
                    style={styles.decisionApproveBtn}
                    onPress={() => handleApproveWorker(inspectWorker.id)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="shield-checkmark" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.decisionApproveText}>Approve & Issue Badge</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.decisionRejectBtn}
                    onPress={() => handleRejectWorker(inspectWorker.id)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="close-circle" size={18} color="#DC2626" style={{ marginRight: 6 }} />
                    <Text style={styles.decisionRejectText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* ============================================================== */}
      {/* MODAL 3: VIEW PAYMENT SLIP FULL PREVIEW                        */}
      {/* ============================================================== */}
      <Modal
        visible={!!viewingSlip}
        animationType="fade"
        transparent
        onRequestClose={() => setViewingSlip(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxHeight: '75%' }]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Payment Receipt Slip</Text>
                <Text style={styles.modalSubtitle}>{viewingSlip?.transactionRef}</Text>
              </View>
              <TouchableOpacity onPress={() => setViewingSlip(null)} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {viewingSlip && (
              <ScrollView style={styles.modalForm}>
                {/* Mock Bank Slip Visual Representation */}
                <View style={styles.receiptPaper}>
                  <View style={styles.receiptTopCircle} />
                  <Ionicons name="business" size={32} color="#4F46E5" style={{ alignSelf: 'center', marginBottom: 6 }} />
                  <Text style={styles.receiptBankName}>{viewingSlip.bankName}</Text>
                  <Text style={styles.receiptStatusText}>TRANSACTION PROOF</Text>

                  <View style={styles.receiptDivider} />

                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Transaction Ref:</Text>
                    <Text style={styles.receiptValue}>{viewingSlip.transactionRef}</Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Amount (LKR):</Text>
                    <Text style={styles.receiptAmount}>Rs. {viewingSlip.amount.toLocaleString()}.00</Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Beneficiary Worker:</Text>
                    <Text style={styles.receiptValue}>{viewingSlip.workerName}</Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>For Service:</Text>
                    <Text style={styles.receiptValue}>{viewingSlip.jobTitle}</Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Submitted Date:</Text>
                    <Text style={styles.receiptValue}>{viewingSlip.submittedAt}</Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>File Name:</Text>
                    <Text style={styles.receiptValue}>{viewingSlip.slipUrl}</Text>
                  </View>

                  <View style={styles.receiptDivider} />

                  <View style={styles.receiptVerifiedStamp}>
                    <Ionicons
                      name={viewingSlip.status === 'approved' ? 'checkmark-circle' : 'time-outline'}
                      size={20}
                      color={viewingSlip.status === 'approved' ? '#059669' : '#D97706'}
                    />
                    <Text
                      style={[
                        styles.receiptStampText,
                        { color: viewingSlip.status === 'approved' ? '#059669' : '#D97706' },
                      ]}
                    >
                      STATUS: {viewingSlip.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.doneBtn}
                  onPress={() => setViewingSlip(null)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.doneBtnText}>Close Receipt</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 4,
  },
  tabButtonActive: {
    backgroundColor: '#4F46E5',
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 40,
  },
  summaryBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  bannerInfo: {
    flex: 1,
    marginRight: 12,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
    lineHeight: 16,
  },
  uploadPrimaryBtn: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  uploadPrimaryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  sectionHelp: {
    fontSize: 12,
    color: '#64748B',
  },
  paymentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  paymentCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  txnRefText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  paymentDateText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeApproved: {
    backgroundColor: '#ECFDF5',
  },
  statusBadgePending: {
    backgroundColor: '#FEF3C7',
  },
  statusBadgeRejected: {
    backgroundColor: '#FEE2E2',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  statusTextApproved: {
    color: '#059669',
  },
  statusTextPending: {
    color: '#D97706',
  },
  statusTextRejected: {
    color: '#DC2626',
  },
  jobDetailBox: {
    marginTop: 10,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 10,
  },
  cardJobTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  cardWorkerName: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  cardBankName: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  rejectionNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  rejectionNoticeText: {
    fontSize: 12,
    color: '#DC2626',
    marginLeft: 8,
    flex: 1,
  },
  amountSlipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  amountLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  amountValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  slipPreviewChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  slipChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
    marginLeft: 4,
  },
  paymentActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  actionBtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  actionBtnSecondaryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
    marginLeft: 4,
  },
  actionBtnDelete: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionBtnDeleteText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 4,
  },
  // ADMIN SECTION STYLES
  adminBanner: {
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
    padding: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  adminBannerTextCol: {
    marginLeft: 12,
    flex: 1,
  },
  adminBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E1B4B',
  },
  adminBannerSubtitle: {
    fontSize: 11,
    color: '#4338CA',
    marginTop: 2,
    lineHeight: 15,
  },
  workerVerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  workerVerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  workerAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  verifiedBadgeTick: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#10B981',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  workerVerMeta: {
    marginLeft: 12,
    flex: 1,
  },
  nameAndBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workerNameText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  workerCategoryText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 1,
  },
  workerContactText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  docsContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  docsSectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8,
  },
  docItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  docIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docItemMeta: {
    marginLeft: 10,
    flex: 1,
  },
  docItemTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
  },
  docItemValue: {
    fontSize: 11,
    color: '#64748B',
  },
  docAttachedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  docAttachedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
    marginLeft: 2,
  },
  adminActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  inspectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  inspectBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
    marginLeft: 4,
  },
  approveQuickBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  approveQuickBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  deleteWorkerBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Modal Common Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
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
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalForm: {
    padding: 20,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  inputField: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 14,
  },
  filePickerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#C7D2FE',
    borderRadius: 14,
    padding: 12,
    marginBottom: 18,
  },
  filePickerName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  filePickerSize: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  changeFileBtn: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  changeFileText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
  },
  submitModalBtn: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 4,
  },
  submitModalBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  // Document Inspection Card
  docInspectCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  mockIdImage: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  mockIdText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 8,
  },
  mockIdSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  inspectDecisionRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  decisionApproveBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 8,
  },
  decisionApproveText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  decisionRejectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    paddingVertical: 12,
    borderRadius: 12,
  },
  decisionRejectText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '700',
  },
  // Receipt Paper Presentation
  receiptPaper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  receiptTopCircle: {
    width: 40,
    height: 4,
    backgroundColor: '#CBD5E1',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 14,
  },
  receiptBankName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  receiptStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
    textAlign: 'center',
    letterSpacing: 1,
    marginTop: 2,
  },
  receiptDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 14,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  receiptLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  receiptValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
  },
  receiptAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: '#059669',
  },
  receiptVerifiedStamp: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 10,
  },
  receiptStampText: {
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 6,
  },
  doneBtn: {
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
