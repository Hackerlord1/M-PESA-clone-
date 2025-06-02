import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';

const TransactionDetailsScreen = ({ route, navigation }) => {
  // Example transaction object with dynamic type
  const transaction = {
    type: 'HO', // Transaction code
    transactionType: 'Pay Bill', // 'Send Money' or 'Pay Bill'
    name: 'HANFON ONDIEKI',
    amount: '- KSH. 50.00',
    transactionId: 'TOU4JAZEIS',
    number: '254794***604', // Paybill number for 'Pay Bill'
    accountNumber: '40026156', // Only for 'Pay Bill'
  };
  const date = '30 APR 2025, 05:23 PM';

  const transactionTypeLabel = transaction.transactionType.toUpperCase();
  const showFamilyFriendsTag = true; // Show tag for both Send Money and Pay Bill

  const getTransactionTypeStyles = (type) => {
    const typeColors = {
      EA: { textColor: '#FF4040', backgroundColor: '#FFE6E6' },
      RC: { textColor: '#2AB7A9', backgroundColor: '#E0F7F9' },
      KP: { textColor: '#1E90FF', backgroundColor: '#D6F0F8' },
      HO: { textColor: '#FFC107', backgroundColor: '#FEF5E7' },
      BN: { textColor: '#8E44AD', backgroundColor: '#F4E1F8' },
      GG: { textColor: '#27AE60', backgroundColor: '#E8F5E9' },
      NL: { textColor: '#2980B9', backgroundColor: '#E1F5FE' },
      HC: { textColor: '#E63946', backgroundColor: '#FDECEA' },
    };
    return typeColors[type] || { textColor: '#333333', backgroundColor: '#EEF9FD' };
  };

  const { textColor, backgroundColor } = getTransactionTypeStyles(transaction.type);

  // Define actions based on transaction type
  const actions = transaction.transactionType === 'Pay Bill'
    ? [
        { key: 'fav', text: 'ADD TO FAVOURITES', icon: require('../../assets/fav.png') },
        { key: 'download', text: 'DOWNLOAD RECEIPT', icon: require('../../assets/download.png') },
        { key: 'share', text: 'SHARE DETAILS', icon: require('../../assets/share.png') },
      ]
    : [
        { key: 'fav', text: 'ADD TO FAVOURITES', icon: require('../../assets/fav.png') },
        { key: 'rev', text: 'REVERSE TRANSACTION', icon: require('../../assets/rev.png') },
        { key: 'download', text: 'DOWNLOAD RECEIPT', icon: require('../../assets/download.png') },
        { key: 'share', text: 'SHARE DETAILS', icon: require('../../assets/share.png') },
      ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel="Go back"
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.dateTime}>{date}</Text>
      </View>

      {/* Middle Content - Takes remaining space */}
      <View style={styles.mainContent}>
        <View style={styles.detailsContainer}>
          <View style={styles.topBackground} />
          <View style={styles.bottomBackground} />
          <View style={styles.contentContainer}>
            <Text style={styles.transactionType}>{transactionTypeLabel}</Text>
            <View style={[styles.iconCircle, { backgroundColor }]}>
              <Text style={[styles.iconText, { color: textColor }]}>
                {transaction.type}
              </Text>
            </View>
            <Text style={styles.recipientName}>{transaction.name}</Text>
            <Text style={styles.amount}>{transaction.amount}</Text>
            {/* Transaction ID with Custom Icon */}
            <View style={styles.transactionIdContainer}>
              <Text style={styles.transactionId}>ID: {transaction.transactionId}</Text>
              <Image
                source={require('../../assets/copy.png')}
                style={styles.transactionIdIcon}
              />
            </View>
            {showFamilyFriendsTag && (
              <View style={styles.tagContainer}>
                <Image
                  source={require('../../assets/familyfriends.png')}
                  style={styles.tagIcon}
                />
              </View>
            )}
            <View style={styles.phoneContainer}>
              <Text style={styles.phoneLabel}>
                {transaction.transactionType === 'Pay Bill' ? 'PAYBILL NUMBER' : 'PHONE NUMBER'}
              </Text>
              <Text style={styles.phoneNumber}>{transaction.number}</Text>
              {transaction.transactionType === 'Pay Bill' && (
                <>
                  <Text style={[styles.phoneLabel, { marginTop: 8 }]}>ACCOUNT NUMBER</Text>
                  <Text style={styles.phoneNumber}>{transaction.accountNumber}</Text>
                </>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Actions Container - Pinned to Bottom */}
      <View style={[styles.actionsContainer, transaction.transactionType === 'Pay Bill' ? styles.actionsContainerPayBill : null]}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.key}
            style={[styles.actionButton, transaction.transactionType === 'Pay Bill' ? styles.actionButtonPayBill : null]}
          >
            <Image
              source={action.icon}
              style={styles.actionIcon}
            />
            <Text style={styles.actionText}>{action.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginTop: 8,
  },
  backButton: {
    marginRight: 16,
    marginTop: -119,
  },
  backIcon: {
    color: '#ffffff',
    fontSize: 24,
  },
  dateTime: {
    color: '#ffffff',
    fontSize: 13,
    textAlign: 'center',
    flex: 1,
    marginRight: 39,
    fontFamily: 'Barlow-Medium',
    marginBottom: 120,
  },
  mainContent: {
    flex: 1,
  },
  detailsContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: -13,
    borderRadius: 13,
    overflow: 'hidden',
  },
  topBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '39%',
    backgroundColor: '#474747',
  },
  bottomBackground: {
    position: 'absolute',
    top: '25%',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#424242',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  transactionType: {
    color: '#E4E4E4',
    fontSize: 11,
    marginTop: 10,
    marginBottom: 30,
    fontFamily: 'Barlow-Medium',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  iconText: {
    fontSize: 24,
    fontFamily: 'Barlow-Medium',
  },
  recipientName: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Barlow-SemiBold',
    marginBottom: 6,
  },
  amount: {
    fontSize: 24,
    fontFamily: 'Barlow-Regular',
    marginBottom: 7,
    color: '#ffffff',
  },
  transactionIdContainer: {
    width: 160,
    height: 33,
    borderRadius: 22,
    backgroundColor: '#3F4A44',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },
  transactionId: {
    color: '#45B873',
    fontSize: 16,
    fontFamily: 'Barlow-Bold',
    textAlign: 'center',
  },
  transactionIdIcon: {
    width: 16,
    height: 16,
    marginLeft: 4,
  },
  phoneContainer: {
    width: '110%',
    paddingLeft: 16,
    marginBottom: 14,
    alignItems: 'flex-start',
  },
  phoneLabel: {
    color: '#AAAAAA',
    fontSize: 12,
    fontFamily: 'Barlow-Medium',
    marginTop: 2,
  },
  phoneNumber: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Barlow-Medium',
  },
  tagIcon: {
    width: 200,
    height: 33,
    marginRight: 7,
    resizeMode: 'contain',
    marginTop: -5,
    marginBottom: 9,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 54,
    paddingVertical: 35,
    paddingHorizontal: 12,
    backgroundColor: '#121212',
  },
  actionsContainerPayBill: {
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  actionButton: {
    alignItems: 'center',
    paddingHorizontal: 7,
    width: 80,
  },
  actionButtonPayBill: {
    paddingHorizontal: 1,
    width: 80,
  },
  actionIcon: {
    width: 35,
    height: 35,
  },
  actionText: {
    color: '#646464',
    fontSize: 10,
    fontFamily: 'Barlow-Medium',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 12,
  },
});

export default TransactionDetailsScreen;