import React, {Component} from 'react';
import {View, ScrollView, Dimensions} from 'react-native';
import {Color, Routes} from 'common';
import {connect} from 'react-redux';
import IncrementButton from 'components/Form/Button';
import StripeCard from 'modules/Stripe/Stripe.js';
import {WebView} from 'react-native-webview';
import { Spinner } from 'components';
import Api from 'services/api/index.js';
import Config from 'src/config.js';
import {
  createToken,
  initStripe 
} from '@stripe/stripe-react-native';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);

class Payments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
      card: null,
      isLoading: false
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

  createPayment = async () => {
    const {user} = this.props.state;
    await createToken({type: 'Card'}).then(res => {
      console.log('[TOKEN]', res);
      let params = {
        account_id: user.id,
        account_code: user.code,
        payload: 'stripe',
        payload_value: JSON.stringify(res),
        status: 'authorize'
      };
      this.setState({isLoading: true})
      console.log(Routes.createPaymentMethod, params)
      Api.request(Routes.createPaymentMethod, params, response => {
        this.setState({isLoading: false})
        this.props.navigation.navigate('subscriptionStack')
        console.log(response);
      }, error => {
        console.log(error)
        this.setState({isLoading: false})
      });
    });
  };

  render() {
    const {theme, user, paypalUrl} = this.props.state;
    console.log('[pay]', paypalUrl)
    const {method, amount, isLoading} = this.state;
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
              }}
              title={'Authorize'}
            />
          </View>
        )}
        {isLoading ? <Spinner mode="overlay" /> : null}
      </View>
    );
    // }
  }
}
const mapStateToProps = state => ({state: state});

const mapDispatchToProps = dispatch => {
  const {actions} = require('@redux');
  return {
    setPaypalUrl: paypalUrl => dispatch(actions.setPaypalUrl(paypalUrl)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Payments);
