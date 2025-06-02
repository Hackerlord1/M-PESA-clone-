import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Platform,
  Dimensions,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

// Sample data
const transactions = [
  {
    id: "1",
    name: "PATRICIA NYARUNI",
    phone: "254712***868",
    amount: "-KSH. 160.00",
    time: "20 Apr, 07:06 PM",
    type: "sent",
  },
];

const services = [
  { id: "1", title: "Zidisha", icon: require("../../assets/ziidi.png") },
  { id: "2", title: "Mali", icon: require("../../assets/mali.png") },
  { id: "3", title: "M-Shwari", icon: require("../../assets/mshwari.png") },
  { id: "4", title: "KCB M-PESA", icon: require("../../assets/kcb.png") },
];

const safaricomBusiness = [
  { id: "1", title: "Safaricom Business", icon: require("../../assets/safaricombusiness.png") },
];

const globalPayments = [
  { id: "1", title: "GlobalPay(M-Pesa Visa Card)", icon: require("../../assets/gpay.png") },
  { id: "2", title: "International Airtime", icon: require("../../assets/inter.png") },
];

const mySafaricom = [
  { id: "1", title: "M-PESA Ratiba", icon: require("../../assets/ratiba.png") },
  { id: "2", title: "Report Fraud", icon: require("../../assets/fraud.png") },
  { id: "3", title: "Safaricom Masoko", icon: require("../../assets/masoko.png") },
  { id: "4", title: "Safaricom Home", icon: require("../../assets/shome.png") },
];

const promoImages = [
  { id: "1", source: require("../../assets/banner8.png") },
  { id: "2", source: require("../../assets/banner9.png") },
  { id: "3", source: require("../../assets/banner6.png") },
  { id: "4", source: require("../../assets/banner7.png") },
];

const { width } = Dimensions.get("window");
// Adjust the width to allow a small part of the next banner to be visible
const PROMO_IMAGE_WIDTH = width * 0.75; // 85% of screen width to show ~15% of the next image
const PROMO_MARGIN_RIGHT = 11; // Consistent margin between images

const HomeScreen = ({ navigation }) => {
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [showBalanceImage, setShowBalanceImage] = useState(false);
  const [showFulizaImage, setShowFulizaImage] = useState(false);
  const flatListRef = useRef(null);
  const isScreenFocused = useRef(true);
  const hasAutoRefreshed = useRef(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      console.log("Data refreshed");
      setShowBalanceImage(true);
      setTimeout(() => {
        setShowBalanceImage(false);
        setShowFulizaImage(true);
        setTimeout(() => {
          setShowFulizaImage(false);
        }, 2000);
      }, 2000);
    }, 1500);
  }, []);

  useFocusEffect(
    useCallback(() => {
      isScreenFocused.current = true;
      if (!hasAutoRefreshed.current) {
        onRefresh();
        hasAutoRefreshed.current = true;
      }
      const interval = setInterval(() => {
        if (isScreenFocused.current && flatListRef.current) {
          setCurrentPromoIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % promoImages.length;
            try {
              flatListRef.current.scrollToIndex({
                index: nextIndex,
                animated: true,
              });
            } catch (error) {
              console.log("Scroll Error:", error);
            }
            return nextIndex;
          });
        }
      }, 5000);
      return () => {
        isScreenFocused.current = false;
        clearInterval(interval);
      };
    }, [onRefresh])
  );

  const handleScrollEnd = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const viewSize = event.nativeEvent.layoutMeasurement.width;
    if (viewSize > 0) {
      const index = Math.round(contentOffset / (PROMO_IMAGE_WIDTH + PROMO_MARGIN_RIGHT));
      setCurrentPromoIndex(index);
    }
  };

  const renderPromoItem = useCallback(
    ({ item }) => (
      <Image
        source={item.source}
        style={[styles.promoImage, { width: PROMO_IMAGE_WIDTH }]}
        onError={(e) => console.log("Image Load Error:", e.nativeEvent.error)}
      />
    ),
    []
  );

  const getItemLayout = useCallback(
    (_, index) => ({
      length: PROMO_IMAGE_WIDTH + PROMO_MARGIN_RIGHT,
      offset: (PROMO_IMAGE_WIDTH + PROMO_MARGIN_RIGHT) * index,
      index,
    }),
    []
  );

  const getTransactionTypeStyles = (type) => {
    const typeColors = {
      sent: { textColor: '#FF4040', backgroundColor: '#FFE6E6' },
      received: { textColor: '#27AE60', backgroundColor: '#E8F5E9' },
    };
    return typeColors[type] || { textColor: '#333333', backgroundColor: '#EEF9FD' };
  };

  const renderServiceItem = ({
    item,
    isSafaricomBusiness = false,
    isGlobalPayments = false,
    isMySafaricom = false,
  }) => (
    <TouchableOpacity
      style={
        isSafaricomBusiness
          ? styles.safaricomBusinessItem
          : isGlobalPayments
          ? styles.globalPaymentsItem
          : isMySafaricom
          ? styles.mySafaricomItem
          : styles.serviceItem
      }
      accessibilityLabel={`View ${item.title} service`}
      accessibilityRole="button"
    >
      <View
        style={
          isSafaricomBusiness
            ? styles.safaricomBusinessIconCircle
            : isGlobalPayments
            ? styles.globalPaymentsIconCircle
            : isMySafaricom
            ? styles.mySafaricomIconCircle
            : styles.serviceIconCircle
        }
      >
        <Image
          source={item.icon}
          style={
            isSafaricomBusiness
              ? styles.safaricomBusinessIcon
              : isGlobalPayments
              ? styles.globalPaymentsIcon
              : isMySafaricom
              ? styles.mySafaricomIcon
              : styles.serviceIcon
          }
          onError={(e) => console.log(`${item.title} Icon Load Error:`, e.nativeEvent.error)}
        />
      </View>
      <Text
        style={
          isSafaricomBusiness
            ? styles.safaricomBusinessText
            : isGlobalPayments
            ? styles.globalPaymentsText
            : isMySafaricom
            ? styles.mySafaricomText
            : styles.serviceText
        }
        numberOfLines={2}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" translucent={false} />
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>Good afternoon,</Text>
            <Text style={styles.username}>
              HEMAN <Image source={require("../../assets/emoji.png")} style={styles.handIcon} />
            </Text>
          </View>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton} accessibilityLabel="Notifications" accessibilityRole="button">
            <Image source={require("../../assets/bell-icon.png")} style={styles.headerIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} accessibilityLabel="Search" accessibilityRole="button">
            <Image source={require("../../assets/search-icon.png")} style={styles.headerIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} accessibilityLabel="Scan QR Code" accessibilityRole="button">
            <Image source={require("../../assets/qr-icon.png")} style={styles.headerIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#F8F7F6"
            colors={["#4CAF50"]}
            progressBackgroundColor="#F8F7F6"
            title="Loading..."
            titleColor="#4CAF50"
            progressViewOffset={-58}
          />
        }
      >
        <View style={styles.balanceContainer}>
          <View style={styles.balanceCard}>
            <View style={styles.balanceLabelRow}>
              <Text style={styles.balanceLabel}>Balance</Text>
              {showBalanceImage && (
                <Image source={require("../../assets/load.png")} style={styles.balanceImage} />
              )}
            </View>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceAmount}>Ksh. 50,058.42</Text>
              <Image source={require("../../assets/eye.png")} style={styles.eyeIcon} />
            </View>
            <View style={styles.fulizaRow}>
              <Text style={styles.fulizaBalance}>Available FULIZA: KSH 5,000.00</Text>
              {showFulizaImage && (
                <Image source={require("../../assets/load.png")} style={styles.fulizaImage} />
              )}
            </View>
          </View>
        </View>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} accessibilityLabel="Send and Request" accessibilityRole="button">
            <View style={styles.iconCircleGreen}>
              <Image source={require("../../assets/send.png")} style={styles.actionIcon} />
            </View>
            <Text style={styles.actionText}>SEND AND</Text>
            <Text style={styles.actionText}>REQUEST</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} accessibilityLabel="Pay" accessibilityRole="button">
            <View style={styles.iconCircleBlue}>
              <Image source={require("../../assets/pay.png")} style={styles.actionIcon} />
            </View>
            <Text style={styles.actionText}>PAY</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} accessibilityLabel="Withdraw" accessibilityRole="button">
            <View style={styles.iconCircleRed}>
              <Image source={require("../../assets/withdraw.png")} style={styles.actionIcon} />
            </View>
            <Text style={styles.actionText}>WITHDRAW</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} accessibilityLabel="Airtime" accessibilityRole="button">
            <View style={styles.iconCircleBlue}>
              <Image source={require("../../assets/airtime.png")} style={styles.actionIcon} />
            </View>
            <Text style={styles.actionText}>AIRTIME</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.transactionSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>M-PESA STATEMENTS</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('MpesaStatementScreen')}
              accessibilityLabel="View All Statements"
              accessibilityRole="button"
              activeOpacity={1}
            >
              <Text style={styles.seeAllText}>SEE ALL</Text>
            </TouchableOpacity>
          </View>
          {transactions.length === 0 ? (
            <Text style={styles.emptyText}>No transactions available</Text>
          ) : (
            transactions.map((transaction) => {
              const { textColor, backgroundColor } = getTransactionTypeStyles(transaction.type);
              return (
                <View key={transaction.id} style={styles.transactionItem}>
                  <View style={[styles.transactionIcon, { backgroundColor }]}>
                    <Text style={[styles.transactionIconText, { color: textColor }]}>
                      {transaction.type === 'sent' ? 'PN' : transaction.type === 'received' ? 'R' : ''}
                    </Text>
                  </View>
                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionName} numberOfLines={1}>
                      {transaction.name}
                    </Text>
                    <Text style={styles.phoneText}>{transaction.phone}</Text>
                  </View>
                  <View style={styles.transactionAmountContainer}>
                    <Text style={styles.transactionAmount}>{transaction.amount}</Text>
                    <Text style={styles.timeText}>{transaction.time}</Text>
                  </View>
                </View>
              );
            })
          )}
        </View>
        <FlatList
          ref={flatListRef}
          data={promoImages}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderPromoItem}
          keyExtractor={(item) => item.id}
          onMomentumScrollEnd={handleScrollEnd}
          style={styles.promoBanner}
          getItemLayout={getItemLayout}
          snapToInterval={PROMO_IMAGE_WIDTH + PROMO_MARGIN_RIGHT}
          snapToAlignment="start"
          decelerationRate="fast"
          contentContainerStyle={{ paddingLeft: 15 }}
          initialScrollIndex={currentPromoIndex}
          scrollEventThrottle={16}
        />
        <View style={styles.dotsContainer}>
          {promoImages.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, index === currentPromoIndex ? styles.activeDot : styles.inactiveDot]}
            />
          ))}
        </View>
        <View style={styles.servicesContainer}>
          <View style={styles.servicesCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Financial Services</Text>
              <TouchableOpacity accessibilityLabel="View All Financial Services" accessibilityRole="button">
                <Text style={styles.seeAllText}>View all</Text>
              </TouchableOpacity>
            </View>
            {services.length === 0 ? (
              <Text style={styles.emptyText}>No services available</Text>
            ) : (
              <FlatList
                data={services}
                renderItem={renderServiceItem}
                keyExtractor={(item) => item.id}
                numColumns={4}
                columnWrapperStyle={styles.serviceRow}
                scrollEnabled={false}
              />
            )}
          </View>
        </View>
        <View style={styles.servicesContainer}>
          <View style={styles.servicesCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Safaricom Business</Text>
              <TouchableOpacity accessibilityLabel="View All Safaricom Business Services" accessibilityRole="button">
                <Text style={styles.seeAllText}>View all</Text>
              </TouchableOpacity>
            </View>
            {safaricomBusiness.length === 0 ? (
              <Text style={styles.emptyText}>No services available</Text>
            ) : (
              <FlatList
                data={safaricomBusiness}
                renderItem={({ item }) => renderServiceItem({ item, isSafaricomBusiness: true })}
                keyExtractor={(item) => item.id}
                numColumns={4}
                columnWrapperStyle={styles.serviceRow}
                scrollEnabled={false}
              />
            )}
          </View>
        </View>
        <View style={styles.globalPaymentsContainer}>
          <View style={styles.globalPaymentsCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Global Payments</Text>
              <TouchableOpacity accessibilityLabel="View All Global Payments" accessibilityRole="button">
                <Text style={styles.seeAllText}>View all</Text>
              </TouchableOpacity>
            </View>
            {globalPayments.length === 0 ? (
              <Text style={styles.emptyText}>No payments available</Text>
            ) : (
              <FlatList
                data={globalPayments}
                renderItem={({ item }) => renderServiceItem({ item, isGlobalPayments: true })}
                keyExtractor={(item) => item.id}
                numColumns={4}
                columnWrapperStyle={styles.globalPaymentsRow}
                scrollEnabled={false}
              />
            )}
          </View>
        </View>
        <View style={styles.mySafaricomContainer}>
          <View style={styles.mySafaricomCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Safaricom</Text>
              <TouchableOpacity accessibilityLabel="View All My Safaricom Services" accessibilityRole="button">
                <Text style={styles.seeAllText}>View all</Text>
              </TouchableOpacity>
            </View>
            {mySafaricom.length === 0 ? (
              <Text style={styles.emptyText}>No services available</Text>
            ) : (
              <FlatList
                data={mySafaricom}
                renderItem={({ item }) => renderServiceItem({ item, isMySafaricom: true })}
                keyExtractor={(item) => item.id}
                numColumns={4}
                columnWrapperStyle={styles.mySafaricomRow}
                scrollEnabled={false}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 4,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#121212",
  },
  scrollContent: {
    paddingTop: 0,
    paddingBottom: Platform.OS === 'ios' ? 80 : 60,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  greetingContainer: {
    flexDirection: "column",
  },
  greeting: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "Barlow-Regular",
    opacity: 0.8,
  },
  username: {
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "Barlow-SemiBold",
    marginTop: -2,
  },
  handIcon: {
    width: 18,
    height: 18,
    marginLeft: 5,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 15,
    padding: 5,
  },
  headerIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
    right: -15,
  },
  actionIcon: {
    width: 39,
    height: 39,
    marginTop: 1,
  },
  balanceContainer: {
    paddingHorizontal: 18,
    paddingBottom: 16,
    marginTop: 9,
  },
  balanceCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    paddingBottom: 13,
    paddingTop: 15,
  },
  balanceLabelRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -5,
  },
  balanceLabel: {
    fontFamily: "Barlow-Regular",
    fontSize: 14,
    color: "#ffffff",
    opacity: 0.8,
    marginRight: 8,
  },
  balanceImage: {
    width: 15,
    height: 15,
    resizeMode: "contain",
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
  },
  balanceAmount: {
    fontSize: 30,
    color: "#ffffff",
    fontFamily: "Barlow-ExtraLight",
    marginTop: -6,
    ...Platform.select({
      ios: { letterSpacing: -0.5 },
      android: { letterSpacing: 0 },
    }),
  },
  eyeIcon: {
    width: 23,
    height: 23,
    resizeMode: "contain",
    marginLeft: 7,
    opacity: 0.8,
  },
  fulizaRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  fulizaBalance: {
    fontFamily: "Barlow-Regular",
    fontSize: 14,
    color: "#389DE6",
    textAlign: "center",
    marginTop: -7,
    marginRight: 8,
  },
  fulizaImage: {
    width: 16,
    height: 16,
    resizeMode: "contain",
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 17,
    paddingVertical: -1,
  },
  actionButton: {
    alignItems: "center",
    width: "22%",
  },
  iconCircleGreen: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  iconCircleBlue: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  iconCircleRed: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F44336",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  actionText: {
    fontSize: 9,
    color: "#ffffff",
    fontFamily: "Barlow-SemiBold",
    textAlign: "center",
  },
  transactionSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: "Barlow-SemiBold",
    fontSize: 13,
    color: "#ffffff",
  },
  seeAllText: {
    fontFamily: "Barlow-Bold",
    fontSize: 13,
    color: "#4CAF50",
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    right: -3,
  },
  transactionIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  transactionIconText: {
    fontFamily: "Barlow-SemiBold",
    fontSize: 14,
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 16,
  },
  transactionName: {
    fontFamily: "Barlow-SemiBold",
    fontSize: 12,
    color: "#ffffff",
  },
  phoneText: {
    fontFamily: "Barlow-Regular",
    fontSize: 12,
    color: "#AAAAAA",
    marginTop: -2,
  },
  transactionAmountContainer: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontFamily: "Barlow-Bold",
    fontSize: 12,
    color: "#ffffff",
  },
  timeText: {
    fontFamily: "Barlow-Regular",
    fontSize: 12,
    color: "#AAAAAA",
    marginTop: -2,
  },
  promoBanner: {
    marginVertical: 10,
    marginLeft: -5,
  },
  promoImage: {
    height: 170,
    borderRadius: 10,
    marginRight: PROMO_MARGIN_RIGHT,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: "#4CAF50",
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  inactiveDot: {
    backgroundColor: "#AAAAAA",
  },
  servicesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  servicesCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
  },
  serviceRow: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  serviceItem: {
    alignItems: "center",
    width: "22%",
  },
  serviceIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 25,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  serviceIcon: {
    width: 38,
    height: 38,
  },
  serviceText: {
    color: "#AAAAAA",
    fontSize: 12,
    fontFamily: "Barlow-Regular",
    textAlign: "center",
  },
  safaricomBusinessItem: {
    alignItems: "center",
    width: "22%",
  },
  safaricomBusinessIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 25,
    backgroundColor: "#333"
  },
  safaricomBusinessIcon: {
    width: 38,
    height: 38,
  },
  safaricomBusinessText: {
    color: "#AAAAAA",
    fontSize: 12,
    fontFamily: "Barlow-Regular",
    textAlign: "center",
  },
  globalPaymentsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  globalPaymentsCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 15,
  },
  globalPaymentsRow: {
    justifyContent: "normal",
    marginBottom: 16,
  },
  globalPaymentsItem: {
    alignItems: "center",
    width: "22%",
  },
  globalPaymentsIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 25,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  globalPaymentsIcon: {
    width: 38,
    height: 38,
  },
  globalPaymentsText: {
    color: "#AAAAAA",
    fontSize: 12,
    fontFamily: "Barlow-Regular",
    textAlign: "center",
  },
  mySafaricomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  mySafaricomCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
  },
  mySafaricomRow: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  mySafaricomItem: {
    alignItems: "center",
    width: "22%",
  },
  mySafaricomIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 25,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  mySafaricomIcon: {
    width: 38,
    height: 38,
  },
  mySafaricomText: {
    color: "#AAAAAA",
    fontSize: 12,
    fontFamily: "Barlow-Regular",
    textAlign: "center",
  },
  emptyText: {
    color: "#AAAAAA",
    fontSize: 14,
    fontFamily: "Barlow-Regular",
    textAlign: "center",
    marginVertical: 10,
  },
});

export default HomeScreen;