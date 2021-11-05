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
import { Spinner } from 'components';
import Api from 'services/api/index.js';
import Config from 'src/config.js';
import {
  confirmPayment,
  createToken,
  initStripe 
} from '@stripe/stripe-react-native';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);

class Deposit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
      card: null,
      isLoading: false,
      subscribeId: null
    };
  }

  componentDidMount() {
    const {setPaypalUrl} = this.props;
    setPaypalUrl(null);
    this.props.navigation.addListener('didFocus', () => {
      console.log('[INIT STRIPE]');
      initStripe({
        publishableKey: Config.stripe.dev_pk,
        merchantIdentifier: 'merchant.identifier',
      })
    })
  }

  setDetails = (complete, details) => {
    console.log('[CARD DETAILS]', complete, details);
    if (complete === true) {
      this.setState({card: details});
    }
  };

  unsubscribe = () => {
    console.log('[delete]')
  }

  createPayment = async () => {
    if(this.state.amount !== null && this.state.amount > 0){
      await createToken({type: 'Card'}).then(res => {
        console.log('[TOKEN]', res);
        let params = {
          amount: this.state.amount,
        };
        this.setState({isLoading: true})
        Api.request(Routes.createPaymentIntent, params, response => {
          console.log('[PAYMENT REPONSE]', response.data);
          this.handlePayment(response.data, res.token);
        });
      });
    }else{
      Alert.alert('Payment Error', 'You are missing your amount', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => console.log('Cancel Pressed'),
        },
      ]);
    }
  };

  createLedger = (source, paymentIntent) => {
    const {user} = this.props.state;
    const {params} = this.props.navigation.state;
    let parameter = {
      account_id: user.id,
      account_code: user.code,
      amount: this.state.amount,
      currency: paymentIntent.currency,
      details: this.state.subscribeId === null ? ((params.page === 'withdrawStack') ? 'withdraw' : 'deposit') : this.state.subscribeId,
      description: this.state.subscribeId === null ? (params.page === 'withdrawStack' ? 'withdraw' : 'deposit') : 'subscription',
    };
    console.log('[CHARGE PARAMETER]', Routes.ledgerCreate, params);
    Api.request(Routes.ledgerCreate, parameter, response => {
      console.log('[CHARGE RESPONSE]', response);
      this.setState({isLoading: true})
      if (response.data != null) {
        this.props.navigation.navigate('pageMessageStack', {payload: 'success', title: 'Success'});
      }
      if (respose.error !== null) {
        this.props.navigation.navigate('pageMessageStack', {payload: 'error', title: 'Error'});
      }
    });
  };

  subscribe = (source, paymentIntent) => {
    const {user} = this.props.state;
    const {params} = this.props.navigation.state;
    let parameter = {
      account_id: user.id,
      merchant: params.data.id,
      amount: this.state.amount,
      currency: paymentIntent.currency
    };
    console.log('[Subscription PARAMETER]', Routes.SubscriptionCreate, parameter);
    Api.request(Routes.SubscriptionCreate, parameter, response => {
      console.log('[Subscribe RESPONSE]', response);
      this.setState({isLoading: true})
      if (response.data != null) {
        this.setState({subscribeId: response.data})
        this.createLedger('subscribe', paymentIntent)
      }
      if (respose.error !== null) {
        this.props.navigation.navigate('pageMessageStack', {payload: 'error', title: 'Error'});
      }
    });
  }

  handlePayment = async (data, source) => {
    const {user} = this.props.state;
    const {error, paymentIntent} = await confirmPayment(data.client_secret, {
      type: 'Card',
      billingDetails: {name: user.username, email: user.email, phone: ' '},
    });
    if (error) {
      Alert.alert('Payment Failed', error.message, [
        {
          text: 'Cancel',
          onPress: () => this.setState({isLoading: false}),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => this.setState({isLoading: false})},
      ]);
      console.log('[ERROR]', error);
    }
    if (paymentIntent) {
      if(this.props.navigation?.state?.params?.type !== 'Subscription Donation'){
        await this.createLedger(source, paymentIntent);
        console.log('[SUCCESS this is]', paymentIntent);
      }else{
        await this.subscribe(source, paymentIntent);
        console.log('[SUCCESS]', paymentIntent);
      }
    }
  };

  render() {
    const {theme, language, paypalUrl} = this.props.state;
    const {method, amount, isLoading} = this.state;
    const { data } = this.props.navigation?.state?.params;
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
              {(this.props.navigation?.state?.params?.type ===
                'Subscription Donation' ||
                this.props.navigation?.state?.params?.type ===
                'Edit Subscription Donation' ||
                this.props.navigation?.state?.params?.type ===
                  'Send Tithings') && (
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
                      {data?.name}
                    </Text>
                    <Text
                      style={{
                        color: 'white',
                        fontFamily: 'Poppins-SemiBold',
                      }}>
                      {data?.address}
                    </Text>
                  </View>
                )}

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
                    {this.props.navigation?.state?.params?.type === 'Subscription Donation' ? 'USD /' + ' ' + language.month : 'USD'}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  padding: 20,
                }}>
                <StripeCard amount={amount} setCardDetails={(complete, cardDetails) => this.setDetails(complete, cardDetails)}/>
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
              {
                (this.props.navigation?.state?.params?.type !==
                'Edit Subscription Donation') ? (
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
                    title={language.subscription.proceed}
                  />
                ) : (
                  <View style={{
                    width: '100%',
                    flex: 1,
                    flexDirection: 'row'
                  }}>
                    <IncrementButton
                      style={{
                        backgroundColor: Color.danger,
                        width: '50%',
                        marginRight: 5
                      }}
                      textStyle={{
                        fontFamily: 'Poppins-SemiBold',
                      }}
                      onClick={() => {
                        this.unsubscribe()
                        // this.props.navigation.navigate('otpStack');
                      }}
                      title={language.subscription.cancelSubscription}
                    />
                    <IncrementButton
                      style={{
                        backgroundColor: Color.secondary,
                        width: '50%',
                        marginLeft: 5
                      }}
                      textStyle={{
                        fontFamily: 'Poppins-SemiBold',
                      }}
                      onClick={() => {
                        // this.createPayment()
                        console.log('[update]')
                      }}
                      title={language.subscription.saveChanges}
                    />
                  </View>
                )
              }
          </View>
        )}
        {isLoading ? <Spinner mode="overlay" /> : null}
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
