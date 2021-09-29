import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { Color } from 'common';
import Footer from 'modules/generic/Footer';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChurch } from '@fortawesome/free-solid-svg-icons';
import IncrementButton from 'components/Form/Button';
import CustomizedHeader from '../generic/CustomizedHeader';
import StripeCard from 'components/Payments/Stripe/Stripe.js'
import { TextInput } from 'react-native-gesture-handler';
import { WebView } from 'react-native-webview';

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

class Deposit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0
    }
  }

  componentDidMount(){
    const { setPaypalUrl } = this.props;
    setPaypalUrl(null)
  }

  render() {
    const { theme, user, paypalUrl } = this.props.state;
    const { method, amount } = this.state;
    return (
      <View style={{
        height: height,
        backgroundColor: Color.containerBackground
      }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {paypalUrl ? (
            <View style={{
              height: height
            }}>
              <WebView
                source={{
                  uri: paypalUrl
                }}
                style={{
                  height: '100%'
                }}
                startInLoadingState={true}
                javaScriptEnabled={true}
                thirdPartyCookiesEnabled={true}
              />
            </View>
          ) :
            <View style={{
              minHeight: height + (height * 0.5)
            }}>
              {this.props.navigation?.state?.params?.type === 'Subscription Donation' || this.props.navigation?.state?.params?.type === 'Send Tithings' &&
                <View style={{
                  height: height / 4,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: width,
                  backgroundColor: theme ? theme.primary : Color.primary,
                  borderTopRightRadius: 30,
                  borderTopLeftRadius: 30
                }}>
                  <FontAwesomeIcon
                    icon={faChurch}
                    size={height / 6}
                    style={{
                      color: 'white'
                    }}
                  />
                  <Text style={{
                    color: 'white',
                    fontFamily: 'Poppins-SemiBold'
                  }}>Los Angeles, California, USA</Text>
                </View>
              }

              {this.props.navigation?.state?.params?.type === 'Send Event Tithings' &&
                <CustomizedHeader
                  version={2}
                  redirect={() => {
                    console.log('ji');
                  }}
                />
              }

              <View style={{
                paddingTop: 20,
                paddingLeft: 20,
                paddingRight: 20,
              }}>
                <View style={{
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <TextInput
                    style={{ fontSize: 30 }}
                    onChangeText={(input) => this.setState({ amount: input })}
                    value={amount}
                    placeholder={'0.0'}
                    keyboardType={'numeric'}
                  />
                  <Text style={{
                    color: theme ? theme.primary : Color.primary,
                    fontFamily: 'Poppins-SemiBold'
                  }}>USD</Text>
                </View>
              </View>

              <View style={{
                padding: 20,
              }}>
                <StripeCard amount={amount}/>
              </View>

            </View>
          }

        </ScrollView>

        {paypalUrl == null && <View style={{
          position: 'absolute',
          bottom: 90,
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
              this.props.navigation.navigate('otpStack');
            }}
            title={'Continue'}
          />
        </View>}
      </View>
    );
  }
}
const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux');
  return {
    setPaypalUrl: (paypalUrl) => dispatch(actions.setPaypalUrl(paypalUrl))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Deposit);