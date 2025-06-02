import React, { useRef, useMemo, useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  Image,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const MpesaStatementScreen = ({ navigation }) => {
  const statements = useMemo(
    () => [
      {
        id: '1',
        date: '8 MAY 2025',
        transactions: [
          { id: '1-1', type: 'EA', name: 'EVANS AMDANY', number: '568900', amount: '-KSH. 130.00', time: '02:30 PM', transactionId: 'T0U4A2EIS' },
          { id: '1-2', type: 'RC', name: 'RHODAH CHOI', number: '011***107', amount: '-KSH. 100.00', time: '12:42 PM', transactionId: 'T0U4A2EIT' },
          { id: '1-3', type: 'KP', name: 'KPLC PREPAID', number: '888880', amount: '-KSH. 150.00', time: '12:11 PM', transactionId: 'T0U4A2EIU' },
          { id: '1-4', type: 'HO', name: 'HANFON ONDIEKI', number: '254794***604', amount: '-KSH. 50.00', time: '05:23 PM', transactionId: 'T0U4A2EIV' },
        ],
      },
      {
        id: '2',
        date: '7 MAY 2025',
        transactions: [
          { id: '2-1', type: 'EA', name: 'EQUITY ACCOUNT', number: '300600', amount: '+KSH. 225.00', time: '09:25 PM', transactionId: 'T0U4A2EIW' },
          { id: '2-2', type: 'EA', name: 'EQUITY ACCOUNT', number: '247247', amount: '-KSH. 1,000.00', time: '09:14 PM', transactionId: 'T0U4A2EIX' },
          { id: '2-3', type: 'BN', name: 'BONFACE NYANGOTO', number: '254725***205', amount: '-KSH. 50.00', time: '07:10 PM', transactionId: 'T0U4A2EIY' },
          { id: '2-4', type: 'GG', name: 'GAUDENCIA GIKARO', number: '254793***906', amount: '+KSH. 750.00', time: '04:55 PM', transactionId: 'T0U4A2EIZ' },
          { id: '2-5', type: 'NL', name: 'NICHOLAS LABATT', number: '254713***180', amount: '-KSH. 2,000.00', time: '04:22 PM', transactionId: 'T0U4A2EJ0' },
          { id: '2-6', type: 'HC', name: 'HEMAN CHIRCHIR', number: '254791***133', amount: '- KSH. 4,000.00', time: '04:45 PM', transactionId: 'T0U4A2EJ1' },
          { id: '2-7', type: 'HO', name: 'HANFON ONDIEKI', number: '254733***256', amount: '-KSH. 800.00', time: '04:56 PM', transactionId: 'T0U4A2EJ2' },
        ],
      },
    ],
    []
  );

  const scrollY = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);
  const isScreenFocused = useRef(true);
  const hasAutoRefreshed = useRef(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      console.log('Data refreshed');
    }, 1500);
  }, []);

  useFocusEffect(
    useCallback(() => {
      isScreenFocused.current = true;
      if (!hasAutoRefreshed.current) {
        onRefresh();
        hasAutoRefreshed.current = true;
      }
      return () => {
        isScreenFocused.current = false;
      };
    }, [onRefresh])
  );

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  const buttonScale = scrollY.interpolate({
    inputRange: [0, 10],
    outputRange: [1, 0.95],
    extrapolate: 'clamp',
  });

  const buttonBorderRadius = scrollY.interpolate({
    inputRange: [0, 10],
    outputRange: [30, 30],
    extrapolate: 'clamp',
  });

  const buttonWidth = scrollY.interpolate({
    inputRange: [0, 10],
    outputRange: [200, 60],
    extrapolate: 'clamp',
  });

  const textOpacity = scrollY.interpolate({
    inputRange: [0, 10],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const iconScale = scrollY.interpolate({
    inputRange: [0, 10],
    outputRange: [1, 1.2],
    extrapolate: 'clamp',
  });

  const iconPosition = scrollY.interpolate({
    inputRange: [0, 10],
    outputRange: [16, 18],
    extrapolate: 'clamp',
  });

  const textPosition = scrollY.interpolate({
    inputRange: [0, 10],
    outputRange: [44, 0],
    extrapolate: 'clamp',
  });

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

  const renderTransaction = ({ item, section }) => {
    const { textColor, backgroundColor } = getTransactionTypeStyles(item.type);

    return (
      <TouchableOpacity
        style={styles.transactionItem}
        activeOpacity={1}
        onPress={() => navigation.navigate('TransactionDetailsScreen', { transaction: item, date: section.date })}
      >
        <View style={[styles.transactionIcon, { backgroundColor }]}>
          <Text style={[styles.iconText, { color: textColor }]}>{item.type}</Text>
        </View>
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionName}>{item.name}</Text>
          {item.number && <Text style={styles.transactionNumber}>{item.number}</Text>}
        </View>
        <View style={styles.transactionAmountContainer}>
          <Text
            style={[styles.transactionAmount, { color: item.amount.startsWith('+') ? '#ffffff' : '#ffffff' }]}
          >
            {item.amount}
          </Text>
          <Text style={styles.transactionTime}>{item.time}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSection = ({ item: section }) => (
    <View style={styles.section}>
      <Text style={styles.dateHeader}>{section.date}</Text>
      <FlatList
        data={section.transactions}
        renderItem={({ item }) => renderTransaction({ item, section })}
        keyExtractor={(item) => item.id}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../../assets/backbtn.png')}
            style={styles.backButton}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>M-PESA STATEMENTS</Text>
        <TouchableOpacity>
          <Image
            source={require('../../assets/searchbtn.png')}
            style={styles.searchIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.monthSelector}>
        <Text style={styles.monthText}>MAY</Text>
      </View>

      {statements && statements.length > 0 ? (
        <FlatList
          data={statements}
          renderItem={renderSection}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#F8F7F6"
              colors={["#4CAF50"]}
              progressBackgroundColor="#F8F7F6"
              title="Loading..."
              titleColor="#4CAF50"
              progressViewOffset={0}
            />
          }
        />
      ) : (
        <Text style={styles.noDataText}>No statements available</Text>
      )}
      <Animated.View
        style={[
          styles.exportButton,
          {
            transform: [{ scale: buttonScale }],
            borderRadius: buttonBorderRadius,
            width: buttonWidth,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.exportButtonTouchable}
          onPress={() => {
            console.log('Navigating to StatementGenerationScreen');
            navigation.navigate('StatementGenerationScreen');
          }}
          activeOpacity={1}
        >
          <Animated.View
            style={[
              styles.exportIconContainer,
              {
                left: iconPosition,
                transform: [{ scale: iconScale }],
              },
            ]}
          >
            <Image
              source={require('../../assets/export-icon.png')}
              style={styles.exportIcon}
              resizeMode="contain"
            />
          </Animated.View>
          <Animated.Text
            style={[
              styles.exportText,
              {
                opacity: textOpacity,
                left: textPosition,
              },
            ]}
          >
            EXPORT STATEMENT
          </Animated.Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#121212',
  },
  backButton: {
    width: 18,
    height: 18,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Barlow-Regular',
  },
  searchIcon: {
    width: 18,
    height: 18,
  },
  monthSelector: {
    alignItems: 'center',
    marginVertical: -1,
  },
  monthText: {
    color: '#ffffff',
    backgroundColor: '#4CAF50',
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: 13,
    fontSize: 10,
    fontFamily: 'Barlow-Bold',
  },
  listContent: {
    paddingBottom: 80,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  dateHeader: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: 'Barlow-SemiBold',
    marginVertical: 10,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
  },
  transactionIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 14,
    fontFamily: 'Barlow-SemiBold',
  },
  transactionDetails: {
    flex: 1,
  },
  transactionName: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: 'Barlow-SemiBold',
  },
  transactionNumber: {
    color: '#AAAAAA',
    fontSize: 12,
    fontFamily: 'Barlow-Regular',
    marginTop: -2,
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 12,
    fontFamily: 'Barlow-Bold',
  },
  transactionTime: {
    color: '#AAAAAA',
    fontSize: 12,
    fontFamily: 'Barlow-Regular',
    marginTop: -2,
  },
  exportButton: {
    position: 'absolute',
    bottom: 20,
    right: 26,
    height: 60,
    backgroundColor: '#292929',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderRadius: 50,
  },
  exportButtonTouchable: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exportIconContainer: {
    position: 'absolute',
    width: 24,
    height: 24,
    top: 16,
    right: 15,
  },
  exportIcon: {
    width: '100%',
    height: '100%',
  },
  exportText: {
    position: 'absolute',
    top: 18,
    fontSize: 14,
    fontFamily: 'Barlow-Bold',
    color: '#4CAF50',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  noDataText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Barlow-Regular',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default MpesaStatementScreen;