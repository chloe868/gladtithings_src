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

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0
    }
  }

  render() {
    const { theme, user } = this.props.state;
    const { method } = this.state;
    return (
      <View style={{
        height: height,
        backgroundColor: Color.containerBackground
      }}>
        <ScrollView showsVerticalScrollIndicator={false}>
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
                  value={this.state.amount}
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
              <StripeCard />
            </View>

          </View>

        </ScrollView>

        <View style={{
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
        </View>
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

export default connect(
  mapStateToProps
)(Transactions);