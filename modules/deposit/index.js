import React, {Component} from 'react';
import {View, Text, ScrollView, Dimensions, Alert} from 'react-native';
import {Color, Routes} from 'common';
import Footer from 'modules/generic/Footer';
import {connect} from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faChurch} from '@fortawesome/free-solid-svg-icons';
import IncrementButton from 'components/Form/Button';
import CustomizedHeader from '../generic/CustomizedHeader';
import StripeCard from 'components/Payments/Stripe/Stripe.js';
import Stripe from 'components/Payments/Stripe/index.js';
import {TextInput} from 'react-native-gesture-handler';
import {WebView} from 'react-native-webview';
import Api from 'services/api/index.js';
import {
  confirmPayment,
  StripeProvider,
  CardField,
  createToken,
} from '@stripe/stripe-react-native';
import Config from 'src/config.js';

const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);

class Deposit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
      card: null,
    };
  }

  componentDidMount() {
    const {setPaypalUrl} = this.props;
    setPaypalUrl(null);
  }

  setDetails = (complete, details) => {
    console.log('[CARD DETAILS]', complete, details);
    if (complete === true) {
      this.setState({card: details});
    }
  };

  createPayment = async () => {
    await createToken({type: 'Card'}).then(res => {
      console.log('[TOKEN]', res);
      let params = {
        amount: this.state.amount,
      };
      Api.request(Routes.createPaymentIntent, params, response => {
        console.log('[PAYMENT REPONSE]', response.data);
        this.handlePayment(response.data, res.token);
      });
    });
  };

  createLedger = (source, paymentIntent) => {
    const {user} = this.props.state;
    let params = {
      account_id: user.id,
      account_code: user.code,
      amount: this.state.amount,
      currency: paymentIntent.currency,
      details: 'deposit',
      description: 'deposit',
    };
    console.log('[CHARGE PARAMETER]', Routes.ledgerCreate, params);
    Api.request(Routes.ledgerCreate, params, response => {
      console.log('[CHARGE RESPONSE]', response);
      if (response.data != null) {
        Alert.alert('Payment Sucess', 'Successfull Paymemt', [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => this.props.navigation.navigate('drawerStack'),
          },
        ]);
      }
      if (respose.error !== null) {
        Alert.alert('Failed in charging user', response.error, [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
      }
    });
  };

  handlePayment = async (data, source) => {
    const {user} = this.props.state;
    const {error, paymentIntent} = await confirmPayment(data.client_secret, {
      type: 'Card',
      billingDetails: {name: user.email},
    });
    if (error) {
      Alert.alert('Payment Failed', error.message, [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
      console.log('[ERROR]', error);
    }
    if (paymentIntent) {
      await this.createLedger(source, paymentIntent);
      console.log('[SUCCESS]', paymentIntent);
    }
  };

  render() {
    const {theme, user, paypalUrl} = this.props.state;
    const {method, amount} = this.state;
    return (
      <View
        style={{
          height: height,
          backgroundColor: Color.containerBackground,
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {paypalUrl ? (
            <View
              style={{
                height: height,
              }}>
              <WebView
                source={{
                  uri: paypalUrl,
                }}
                style={{
                  height: '100%',
                }}
                startInLoadingState={true}
                javaScriptEnabled={true}
                thirdPartyCookiesEnabled={true}
              />
            </View>
          ) : (
            <View
              style={{
                minHeight: height + height * 0.5,
              }}>
              {this.props.navigation?.state?.params?.type ===
                'Subscription Donation' ||
                (this.props.navigation?.state?.params?.type ===
                  'Send Tithings' && (
                  <View
                    style={{
                      height: height / 4,
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: width,
                      backgroundColor: theme ? theme.primary : Color.primary,
                      borderTopRightRadius: 30,
                      borderTopLeftRadius: 30,
                    }}>
                    <FontAwesomeIcon
                      icon={faChurch}
                      size={height / 6}
                      style={{
                        color: 'white',
                      }}
                    />
                    <Text
                      style={{
                        color: 'white',
                        fontFamily: 'Poppins-SemiBold',
                      }}>
                      Los Angeles, California, USA
                    </Text>
                  </View>
                ))}

              {this.props.navigation?.state?.params?.type ===
                'Send Event Tithings' && (
                <CustomizedHeader
                  version={2}
                  redirect={() => {
                    console.log('ji');
                  }}
                />
              )}

              <View
                style={{
                  paddingTop: 20,
                  paddingLeft: 20,
                  paddingRight: 20,
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TextInput
                    style={{fontSize: 30}}
                    onChangeText={input => this.setState({amount: input})}
                    value={amount}
                    placeholder={'0.0'}
                    keyboardType={'numeric'}
                  />
                  <Text
                    style={{
                      color: theme ? theme.primary : Color.primary,
                      fontFamily: 'Poppins-SemiBold',
                    }}>
                    USD
                  </Text>
                </View>
              </View>
              
              <View style={{
                padding: 20,
              }}>
                <StripeCard amount={amount}/>
              </View>

              <View
                style={{
                  padding: 20,
                }}>
                <StripeProvider
                  publishableKey={Config.stripe.dev_pk}
                  merchantIdentifier="merchant.identifier">
                  <CardField
                    postalCodeEnabled={false}
                    placeholder={{
                      number: '4242 4242 4242 4242',
                    }}
                    cardStyle={{
                      backgroundColor: '#FFFFFF',
                      textColor: '#000000',
                      borderRadius: 50,
                    }}
                    style={{
                      width: '100%',
                      height: 50,
                      marginVertical: 30,
                    }}
                    onCardChange={cardDetails => {
                      this.setDetails(cardDetails.complete, cardDetails);
                    }}
                  />
                </StripeProvider>
              </View>
            </View>
          )}
        </ScrollView>

        {paypalUrl == null && (
          <View
            style={{
              position: 'absolute',
              bottom: 90,
              left: 0,
              paddingLeft: 20,
              paddingRight: 20,
              width: '100%',
            }}>
            <IncrementButton
              style={{
                backgroundColor: Color.secondary,
                width: '100%',
              }}
              textStyle={{
                fontFamily: 'Poppins-SemiBold',
              }}
              onClick={() => {
                this.createPayment()
                // this.props.navigation.navigate('otpStack');
              }}
              title={'Continue'}
            />
          </View>
        )}
      </View>
    );
  }
}
const mapStateToProps = state => ({state: state});

const mapDispatchToProps = dispatch => {
  const {actions} = require('@redux');
  return {
    setPaypalUrl: paypalUrl => dispatch(actions.setPaypalUrl(paypalUrl)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Deposit);
