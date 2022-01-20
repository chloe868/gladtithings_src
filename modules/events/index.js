import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, TextInput, Alert } from 'react-native';
import { Color, Routes } from 'common';
import { connect } from 'react-redux';
import CardsWithImages from '../generic/CardsWithImages';
import CustomizedHeader from '../generic/CustomizedHeader';
import IncrementButton from 'components/Form/Button';
import StripeCard from 'modules/Stripe/Stripe.js';
import { WebView } from 'react-native-webview';
import Api from 'services/api/index.js';
import Config from 'src/config.js';
import { Spinner } from 'components'
import _ from 'lodash';
import Skeleton from 'components/Loading/Skeleton';
import { confirmPayment, createToken, initStripe } from '@stripe/stripe-react-native';
const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: null,
      method: 'paypal',
      donate: false,
      amount: 0,
      card: null,
      isLoading: false,
      events: [],
      limit: 8,
      offset: 0
    }
  }

  componentDidMount() {
    this.retrieveEvents(false)
    const { setPaypalUrl } = this.props;
    setPaypalUrl(null);
    this.props.navigation.addListener('didFocus', () => {
      console.log('[INIT STRIPE]');
      initStripe({
        publishableKey: Config.stripe.dev_pk,
        merchantIdentifier: 'merchant.identifier',
      })
    })
  }

  retrieveEvents = (flag) => {
    const { user } = this.props.state;
    const { limit, offset, events } = this.state;
    let parameter = {
      condition: [{
        value: new Date(),
        column: 'start_date',
        clause: '>'
      }],
      sort: { created_at: 'asc' },
      limit: limit,
      offset: flag == true && offset > 0 ? (offset * this.state.limit) : offset
    }
    this.setState({ isLoading: true })
    Api.request(Routes.eventsRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        response.data.map((item, index) => {
          item['logo'] = item.image?.length > 0 ? item.image[0].category : null
          item['address'] = item.location
          item['date'] = item.start_date
        })
        this.setState({
          events: flag == false ? response.data : _.uniqBy([...events, ...response.data], 'id'),
          offset: flag == false ? 1 : (offset + 1)
        })
      } else {
        this.setState({
          data: flag == false ? [] : events,
          offset: flag == false ? 0 : offset
        })
      }
    }, error => {
      console.log(error)
      this.setState({ isLoading: false })
    })
  }

  setDetails = (complete, details) => {
    console.log('[CARD DETAILS]', complete, details);
    if (complete === true) {
      this.setState({ card: details });
    }
  };

  createPayment = async () => {
    if (this.state.amount !== null && this.state.amount > 0) {
      await createToken({ type: 'Card' }).then(res => {
        console.log('[TOKEN]', res);
        let params = {
          amount: this.state.amount,
        };
        this.setState({ isLoading: true })
        Api.request(Routes.createPaymentIntent, params, response => {
          console.log('[PAYMENT REPONSE]', response.data);
          this.handlePayment(response.data, res.token);
        });
      });
    } else {
      Alert.alert('Donation Error', 'You are missing your amount.');
    }
  };

  createLedger = (source, paymentIntent) => {
    const { user } = this.props.state;
    const { events } = this.state;
    let params = {
      account_id: user.id,
      account_code: user.code,
      amount: this.state.amount,
      currency: paymentIntent.currency,
      details: events[0]?.id,
      description: 'Event Donation',
    };
    console.log('[CHARGE PARAMETER]', Routes.ledgerCreate, params);
    Api.request(Routes.ledgerCreate, params, response => {
      console.log('[CHARGE RESPONSE]', response);
      this.setState({ isLoading: true })
      if (response.data != null) {
        this.props.navigation.navigate('pageMessageStack', { payload: 'success', title: 'Success' });
      }
      if (respose.error !== null) {
        this.props.navigation.navigate('pageMessageStack', { payload: 'error', title: 'Error' });
      }
    });
  };

  handlePayment = async (data, source) => {
    const { user } = this.props.state;
    const { error, paymentIntent } = await confirmPayment(data.client_secret, {
      type: 'Card',
      billingDetails: { name: user.email },
    });
    if (error) {
      Alert.alert('Payment Failed', error.message, [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
      console.log('[ERROR]', error);
    }
    if (paymentIntent) {
      await this.createLedger(source, paymentIntent);
      console.log('[SUCCESS]', paymentIntent);
    }
  };

  render() {
    const { theme, user, paypalUrl } = this.props.state;
    const { donate, amount, events, isLoading } = this.state;
    return (
      <View style={{ backgroundColor: Color.containerBackground }}>
        <ScrollView showsVerticalScrollIndicator={false}
          onScroll={(event) => {
            let scrollingHeight = event.nativeEvent.layoutMeasurement.height + event.nativeEvent.contentOffset.y
            let totalHeight = event.nativeEvent.contentSize.height
            if (event.nativeEvent.contentOffset.y <= 0) {
              if (isLoading == false) {
                // this.retrieve(false)
              }
            }
            if (scrollingHeight >= (totalHeight)) {
              if (isLoading == false) {
                this.retrieveEvents(true)
              }
            }
          }}
          style={{
            backgroundColor: Color.containerBackground
          }}>
          <View style={{ height: height * 1.5, }}>
            {paypalUrl === null && <CustomizedHeader
              version={2}
              donate={true}
              redirect={() => {
                this.setState({ donate: true })
              }}
              data={
                events.length > 0 ?
                  {
                    merchant_details: {
                      name: events[0].name,
                      logo: events[0].logo,
                      address: events[0].address
                    },
                    amount: 0
                  }
                  : null
              }
              showButton={donate}
            />}
            {!donate ? <View style={{ marginTop: 20 }}>
              <View style={{
                paddingLeft: 20,
                paddingRight: 20
              }}>
                <Text style={{
                  fontFamily: 'Poppins-SemiBold'
                }}>Upcoming Events.</Text>
              </View>
              <CardsWithImages
                button={true}
                version={1}
                data={events}
                buttonColor={theme ? theme.secondary : Color.secondary}
                buttonTitle={'Donate'}
                redirect={() => { return }}
                buttonClick={() => { this.props.navigation.navigate('otherTransactionStack', { type: 'Send Event Tithings' }) }}
              />
              {!isLoading && events.length == 0 &&
                <View style={{
                  paddingLeft: 20,
                  paddingRight: 20
                }}>
                  <Text>No upcoming events</Text>
                </View>
              }
              {isLoading &&
                <View style={{
                  flexDirection: 'row',
                  width: width
                }}>
                  <View style={{ width: '50%' }}>
                    <Skeleton size={1} template={'block'} height={150} />
                  </View>
                  <View style={{ width: '50%' }}>
                    <Skeleton size={1} template={'block'} height={150} />
                  </View>
                </View>}
            </View> :
              (paypalUrl ? <View
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
              </View> : <View style={{
                padding: 20,
              }}>
                <View style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 20,
                }}>
                  <TextInput
                    style={{ fontSize: 30 }}
                    onChangeText={input => this.setState({ amount: input })}
                    value={amount}
                    placeholder={'0.0'}
                    keyboardType={'numeric'}
                  />
                  <Text style={{
                    color: theme ? theme.primary : Color.primary,
                    fontFamily: 'Poppins-SemiBold'
                  }}>USD</Text>
                </View>
                <View style={{
                  padding: 20,
                }}>
                  <StripeCard amount={amount} setCardDetails={(complete, cardDetails) => this.setDetails(complete, cardDetails)} />
                </View>
              </View>
              )
            }
          </View>
        </ScrollView>
        {this.state.isLoading ? <Spinner mode="overlay" /> : null}
        {donate && paypalUrl === null && <View style={{
          position: 'absolute',
          bottom: 10,
          left: 0,
          paddingLeft: 20,
          paddingRight: 20,
          width: '100%'
        }}>
          <IncrementButton
            style={{
              backgroundColor: Color.secondary,
              width: '100%'
            }}
            textStyle={{
              fontFamily: 'Poppins-SemiBold'
            }}
            onClick={() => {
              this.createPayment()
            }}
            title={'Continue'}
          />
        </View>}
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setPaypalUrl: paypalUrl => dispatch(actions.setPaypalUrl(paypalUrl)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Events);

