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
      initStripe({
        publishableKey: Config.stripe.dev_pk,
        merchantIdentifier: 'merchant.identifier',
      })
    })
  }

  setDetails = (complete, details) => {
    if (complete === true) {
      this.setState({card: details});
    }
  };

  unsubscribe = () => {
    Alert.alert('Confirmation', 'Are you sure you want to cancel your subscription ?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => this.proceed(),
      },
    ]);
  }

  proceed = () => {
    const { params } = this.props.navigation.state;
    let parameter = {
      id:  params.data.id,
    };
    this.setState({isLoading: true})
    Api.request(Routes.SubscriptionDelete, parameter, response => {
      this.setState({isLoading: false})
      if(response.data != null){
        this.props.navigation.navigate('pageMessageStack', {payload: 'success', title: 'Success'});
      }else{
        this.props.navigation.navigate('pageMessageStack', {payload: 'error', title: 'Error'});
      }
    });
  }

  createPayment = async () => {
    if(this.state.amount !== null && this.state.amount > 0){
      await createToken({type: 'Card'}).then(res => {
        let params = {
          amount: this.state.amount,
        };
        this.setState({isLoading: true})
        Api.request(Routes.createPaymentIntent, params, response => {
          this.handlePayment(response.data, res.token);
        });
      });
    }else{
      Alert.alert('Payment Error', 'You are missing your amount');
    }
  };

  createLedger = (paymentIntent) => {
    const {params} = this.props.navigation.state;
    let tempDetails = null;
    let tempDesc = null;
    if(this.state.subscribeId !== null){
      tempDetails = 'subscription'  //this.state.subscribeId
      tempDesc = 'Subscription'
      this.sendDirectTransfer(params.data, tempDetails, tempDesc, paymentIntent)
    }else{
      if(params?.page === 'withdrawStack'){
        tempDetails = 'withdraw'
        tempDesc = 'Withdraw'
        this.sendTransfer(paymentIntent, tempDetails, tempDesc)
      }else if(params?.page === 'depositStack'){
        tempDetails = 'deposit'
        tempDesc = 'Deposit'
        this.sendTransfer(paymentIntent, tempDetails, tempDesc)
      }
      if(params?.type === 'Send Tithings'){
        tempDetails = 'donation'
        tempDesc = 'Church Donation'
        this.sendDirectTransfer(params.data, tempDetails, tempDesc, paymentIntent)
      }
    }
  };

  sendTransfer(paymentIntent, tempDetails, tempDesc){
    const {user} = this.props.state;
    let parameter = {
      account_id: user.id,
      account_code: user.code,
      amount: this.state.amount,
      currency: paymentIntent.currency,
      details: tempDetails,
      description: tempDesc,
    };
    Api.request(Routes.ledgerCreate, parameter, response => {
      this.setState({isLoading: true})
      if (response.error == null) {
        this.props.navigation.navigate('pageMessageStack', {payload: 'success', title: 'Success'});
      } else {
        this.props.navigation.navigate('pageMessageStack', {payload: 'error', title: 'Error'});
      }
    });
  }

  sendDirectTransfer = (data, tempDetails, tempDesc, paymentIntent) => {
    const {user} = this.props.state;
    console.log('OTP Create Request API Call', data)
    let parameter = {
      from: {
        code: user.code,
        id: user.id
      },
      to: {
        id: data.account_id
      },
      amount: this.state.amount,
      details: tempDetails,
      currency: paymentIntent.currency,
      description: tempDesc,
    }
    console.log(parameter, '---------')
    this.setState({ isLoading: true });
    Api.request(Routes.sendDirectCreate, parameter, response => {
      this.setState({ isLoading: false });
      if (response.error == null) {
        this.props.navigation.navigate('pageMessageStack', {payload: 'success', title: 'Success'});
      } else {
        this.props.navigation.navigate('pageMessageStack', {payload: 'error', title: 'Error'});
      }
    },
      (error) => {
        console.log('API ERROR', error);
        this.setState({ isLoading: false });
      },
    );
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
    Api.request(Routes.SubscriptionCreate, parameter, response => {
      this.setState({isLoading: true})
      if (response.data != null) {
        this.setState({subscribeId: response.data})
        this.createLedger(paymentIntent)
      }
      if (respose.error !== null) {
        this.props.navigation.navigate('pageMessageStack', {payload: 'error', title: 'Error'});
      }
    });
  }

  updatePayment = () => {
    const {user} = this.props.state;
    const {params} = this.props.navigation.state;
    let parameter = {
      id: params.data.id,
      code: params.data.code,
      account_id: user.id,
      merchant: params.data.merchant,
      amount: this.state.amount === 0 ? params.data.amount : this.state.amount,
      currency: params.data.currency
    };
    this.setState({isLoading: true})
    Api.request(Routes.SubscriptionUpdate, parameter, response => {
      this.setState({isLoading: false})
      if (response.data == true) {
        this.props.navigation.navigate('pageMessageStack', {payload: 'success', title: 'Success'});
      }else{
        this.props.navigation.navigate('pageMessageStack', {payload: 'error', title: 'Error'});
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
        await this.createLedger(paymentIntent);
      }else{
        await this.subscribe(source, paymentIntent);
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
                      {data?.merchant_details != null ? data?.merchant_details?.name : data?.name}
                    </Text>
                    <Text
                      style={{
                        color: 'white',
                        fontFamily: 'Poppins-SemiBold',
                      }}>
                      {data?.merchant_details != null ? data?.merchant_details?.address : data?.address}
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
                    {
                      (this.props.navigation?.state?.params?.type === 'Edit Subscription Donation') ?
                      <TextInput
                        style={{fontSize: 50, marginTop: 50}}
                        onChangeText={input => this.setState({amount: input})}
                        value={amount}
                        placeholder={data?.amount != null ? data.amount.toString() : '0.0'}
                        keyboardType={'numeric'}
                      />
                      :
                      <TextInput
                        style={{fontSize: 30}}
                        onChangeText={input => this.setState({amount: input})}
                        value={amount}
                        placeholder={'0.0'}
                        keyboardType={'numeric'}
                      />
                    }
                  <Text
                    style={{
                      color: theme ? theme.primary : Color.primary,
                      fontFamily: 'Poppins-SemiBold',
                    }}>
                    {this.props.navigation?.state?.params?.type === 'Subscription Donation' ? 'USD /' + ' ' + language.month : 'USD'}
                  </Text>
                </View>
              </View>

              {
                (this.props.navigation?.state?.params?.type !== 'Edit Subscription Donation') && (
                  <View
                    style={{
                      padding: 20,
                    }}>
                    <StripeCard amount={amount} setCardDetails={(complete, cardDetails) => this.setDetails(complete, cardDetails)}/>
                  </View>
                )
              }
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
                        this.updatePayment()
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
