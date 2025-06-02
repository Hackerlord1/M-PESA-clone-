import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  StatusBar,
  Modal,
  Platform,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { WebView } from 'react-native-webview';

const LOADING_DURATION = 8000;

// JavaScript to inject into WebView to hide page count
const hidePageCountScript = `
  (function() {
    // Function to hide elements containing page count
    function hidePageCount() {
      // Google Drive viewer's page count element (may need adjustment based on DOM inspection)
      const pageCountElements = document.querySelectorAll('[role="status"], [aria-label*="page"], .ndfHFb-c4YZDc-aZjgye');
      pageCountElements.forEach(element => {
        element.style.display = 'none';
      });

      // Also hide any floating UI elements that might show page numbers
      const floatingElements = document.querySelectorAll('.ndfHFb-c4YZDc-Wrql6b');
      floatingElements.forEach(element => {
        element.style.display = 'none';
      });
    }

    // Run immediately and set an interval to ensure it catches dynamic elements
    hidePageCount();
    setInterval(hidePageCount, 1000);
  })();
`;

const StatementGenerationScreen = ({ navigation }) => {
  const [pdfVisible, setPdfVisible] = useState(false);
  const [pdfSource, setPdfSource] = useState(null);
  const [loadingStep, setLoadingStep] = useState('idle');
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const animationRef = useRef(null);
  const webViewRef = useRef(null);

  const [dateRange] = useState({
    start: '01 MAY 2025',
    end: '06 MAY 2025',
  });

  const transactionImage = require('../../assets/img1.png');
  const endDateImage = require('../../assets/enddate.png');
  const profileImage = require('../../assets/masoko.png');
  const backIcon = require('../../assets/closee.png');
  const shareIcon = require('../../assets/dwnl.png');
  const closeIcon = require('../../assets/sharee.png');

  const handleGenerateStatement = useCallback(async () => {
    setLoadingStep('loading');
    setPdfVisible(false);
    setShowSuccessAnimation(false);

    const pdfUrl = 'https://drive.google.com/file/d/18pj9TbcXPCUQuDbQTlZOu3mdMnsKkIG6/preview';
    setPdfSource({ uri: pdfUrl });

    setTimeout(() => {
      setLoadingStep('success');
      setShowSuccessAnimation(true);

      if (animationRef.current) {
        animationRef.current.play();
      }

      setTimeout(() => {
        setPdfVisible(true);
        setLoadingStep('idle');
      }, 2000);
    }, LOADING_DURATION);
  }, []);

  const handleCancelLoading = () => {
    setLoadingStep('idle');
    setShowSuccessAnimation(false);
    setPdfVisible(false);
  };

  const renderHiddenWebView = () => (
    <WebView
      ref={webViewRef}
      source={pdfSource}
      style={{ width: 0, height: 0, opacity: 0 }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      injectedJavaScript={hidePageCountScript} // Inject the script to hide page count
      onLoad={() => {
        if (loadingStep === 'success') {
          setPdfVisible(true);
        }
      }}
      onError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        Alert.alert('Error', `Failed to load PDF: ${nativeEvent.description}`);
      }}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black" />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={backIcon} style={styles.backIcon} />
      </TouchableOpacity>

      <View style={styles.headerSection}>
        <View style={styles.profileCircle}>
          <Image source={profileImage} style={styles.profileImage} />
        </View>
        <View style={styles.phoneLine}>
          <Text style={styles.name}>HEMAN CHIRCHIR</Text>
          <Text style={styles.phone}>
            <Text style={styles.phoneLabel}>PHONE NUMBER </Text>
            <Text>254791220335</Text>
          </Text>
        </View>
      </View>

      <Image source={transactionImage} style={styles.image} />
      <Image source={endDateImage} style={styles.image} />
      <Text style={styles.disclaimer}>Date range can't be more than 6 months</Text>

      <TouchableOpacity
        style={[styles.generateButton, loadingStep !== 'idle' && styles.disabledButton]}
        onPress={handleGenerateStatement}
        disabled={loadingStep !== 'idle'}
        activeOpacity={2}
      >
        <Text style={styles.buttonText}>GENERATE STATEMENT</Text>
      </TouchableOpacity>

      {/* Loading Modal */}
      <Modal
        visible={loadingStep === 'loading' || loadingStep === 'success'}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelLoading}
      >
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingHeader}>DOWNLOAD STATEMENTS</Text>
            {loadingStep === 'success' ? (
              <View style={styles.successContainer}>
                <LottieView
                  ref={animationRef}
                  source={require('../../assets/animation/checkmark.json')}
                  autoPlay={true}
                  loop={false}
                  style={styles.successAnimation}
                />
                <Text style={styles.successText}>Statements downloaded successfully</Text>
              </View>
            ) : (
              <>
                <ActivityIndicator
                  size="large"
                  color="#1EBF74"
                  style={[styles.loader, { transform: [{ scale: 1.5 }] }]}
                />
                <Text style={styles.loadingText}>Statements are being</Text>
                <Text style={styles.loadingText2}>processed</Text>
              </>
            )}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelLoading}
              activeOpacity={0.7}
              accessibilityLabel="Cancel download"
              accessibilityRole="button"
              disabled={loadingStep === 'success'}
            >
              <Text style={styles.cancelText}>CANCEL DOWNLOAD</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* PDF Modal with Custom Header */}
      <Modal
        visible={pdfVisible}
        animationType="slide"
        onRequestClose={() => setPdfVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.pdfHeader}>
            <TouchableOpacity
              style={styles.pdfHeaderButton}
              onPress={() => setPdfVisible(false)}
            >
              <Image source={backIcon} style={styles.pdfHeaderIcon} />
            </TouchableOpacity>
            <View style={styles.pdfHeaderTextContainer}>
              <Text style={styles.pdfHeaderTitle}>STATEMENTS</Text>
              <Text style={styles.pdfHeaderDate}>
                {dateRange.start} TO {dateRange.end}
              </Text>
            </View>
            <View style={styles.pdfHeaderRightIcons}>
              <TouchableOpacity style={styles.pdfHeaderButton}>
                <Image source={shareIcon} style={styles.pdfHeaderIcon} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.pdfHeaderButton}
                onPress={() => setPdfVisible(false)}
              >
                <Image source={closeIcon} style={styles.pdfHeaderIcon} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.pdfContainer}>
            {pdfSource ? (
              <WebView
                source={pdfSource}
                style={{ flex: 1 }}
                startInLoadingState={true}
                renderLoading={() => (
                  <ActivityIndicator size="large" color="#1EBF74" style={{ marginTop: 20 }} />
                )}
                originWhitelist={['*']}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                injectedJavaScript={hidePageCountScript} // Inject the script to hide page count
              />
            ) : (
              <Text style={styles.errorText}>Loading PDF...</Text>
            )}
          </View>
        </View>
      </Modal>

      {pdfSource && renderHiddenWebView()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  backIcon: {
    width: 18,
    height: 18,
  },
  headerSection: {
    marginBottom: 30,
    alignItems: 'center',
  },
  profileCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333',
    marginBottom: 5,
    marginTop: 20,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  phoneLine: {
    alignItems: 'center',
    marginTop: 1,
  },
  name: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Barlow-Regular',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  phone: {
    color: '#D8D8D8',
    fontSize: 12,
    fontFamily: 'Barlow-Regular',
    marginTop: -4,
  },
  phoneLabel: {
    fontFamily: 'Barlow-Bold',
  },
  image: {
    width: '100%',
    height: 175,
    resizeMode: 'contain',
    marginBottom: -16,
    marginTop: 30,
  },
  disclaimer: {
    color: '#D8D8D8',
    fontSize: 14,
    fontFamily: 'Barlow-Regular',
    textAlign: 'center',
    marginTop: -11,
    marginBottom: 20,
  },
  generateButton: {
    backgroundColor: '#2BB061',
    paddingVertical: 15,
    borderRadius: 26,
    alignItems: 'center',
    marginTop: 100,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Barlow-Bold',
    textTransform: 'uppercase',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  pdfHeader: {
    backgroundColor: '#111111',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    paddingTop: Platform.OS === 'ios' ? 50 : 15,
  },
  pdfHeaderTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  pdfHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Barlow-Regular',
    marginBottom: 4,
    paddingHorizontal: 14,
  },
  pdfHeaderDate: {
    color: '#AAAAAA',
    fontSize: 10,
    fontFamily: 'Barlow-Regular',
  },
  pdfHeaderRightIcons: {
    flexDirection: 'row',
  },
  pdfHeaderButton: {
    padding: 8,
    marginLeft: 10,
  },
  pdfHeaderIcon: {
    width: 22,
    height: 22,
  },
  pdfContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  pdf: {
    flex: 1,
    width: '100%',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Barlow-Regular',
    textAlign: 'center',
    marginTop: 20,
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  loadingContainer: {
    backgroundColor: '#1E1E1E',
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  loadingHeader: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Barlow-Medium',
    textTransform: 'uppercase',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  loader: {
    width: '20%',
    alignSelf: 'center',
    marginVertical: 20,
  },
  loadingText: {
    color: '#D8D8D8',
    textAlign: 'center',
    fontFamily: 'Barlow-Regular',
    fontSize: 20,
    marginTop: 10,
    marginBottom: -3,
    paddingHorizontal: 1,
  },
  loadingText2: {
    color: '#D8D8D8',
    textAlign: 'center',
    fontFamily: 'Barlow-Regular',
    fontSize: 20,
    marginTop: 4,
    paddingHorizontal: 1,
  },
  successContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  successAnimation: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  successText: {
    color: '#00B04F',
    textAlign: 'center',
    fontFamily: 'Barlow-Regular',
    fontSize: 23,
    paddingHorizontal: 1,
  },
  cancelButton: {
    backgroundColor: '#8B908C',
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 26,
    marginTop: 30,
  },
  cancelText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Barlow-Bold',
    textTransform: 'uppercase',
  },
});

export default StatementGenerationScreen;