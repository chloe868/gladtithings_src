import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Color } from 'common';
import Footer from 'modules/generic/Footer';
import { connect } from 'react-redux';
import PaymentMethodCard from 'modules/generic/Cards';
import CustomizedHeader from '../generic/CustomizedHeader';
import Button from '../generic/Button';

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

const data = [
  {
    username: 'Han',
    payment_method: 'paypal',
    status: 'Authorized',
    end_date: 'November 30, 2020'
  },
  {
    username: 'Kai',
    payment_method: 'credit_card',
    status: 'Authorized',
    end_date: 'November 30, 2020'
  }
]

class Subscriptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: false
    }
  }

  render() {
    const { user, theme } = this.props.state;
    return (
      <View style={{
        height: height,
        backgroundColor: Color.containerBackground
      }}>
        {
          this.state.details === false ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <CustomizedHeader
                version={1}
                text={data === null ? `You don't have church selected for now. Kindly click the button below to look for church you are interested to automate your tithings.` : 
                'Here are the list of churches you are subscribed. Click the button below to look for more churches you are interested to automate your tithings'}
                redirect={() => {
                  this.props.navigation.navigate('churchesStack')
                }}
              />
              <View style={{
                marginBottom: 100,
                paddingTop: 10,
                paddingRight: 10,
                paddingLeft: 10,
                alignItems: 'center'
              }}>
                <Button
                  style={{
                    width: '60%',
                    height: 50,
                    backgroundColor: theme ? theme.secondary : Color.secondary,
                    marginTop: 5
                  }}
                  content={
                    <View style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}>
                      <Text style={{
                        color: 'white',
                        fontSize: 12
                      }}>See your billing here...</Text>
                    </View>
                  }
                  redirect={() => {
                    this.props.navigation.navigate('transactionsStack',{title: 'Subscription Billings', parameter: data})
                  }}
                />
                <View style={{
                  width: width,
                  flexDirection: 'row',
                  padding: 9
                }}>
                </View>
                {data.length > 0 && data.map((item, index) => {
                  return (
                    <CustomizedHeader
                      version={3}
                      redirect={() => {
                        this.setState({details: true})
                      }}
                    />
                  )
                })
                }
              </View>
            </ScrollView>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <CustomizedHeader
                version={2}
                buttonText={'edit'}
                redirect={() => {
                  this.props.navigation.navigate('depositStack', { type: 'Edit Subscription Donation' })
                }}
              />
              <View style={{
                marginBottom: 100,
                paddingTop: 10,
                paddingRight: 10,
                paddingLeft: 10,
                alignItems: 'center'
              }}>
                <Button
                  style={{
                    width: '60%',
                    height: 50,
                    backgroundColor: theme ? theme.secondary : Color.secondary,
                    marginTop: 5
                  }}
                  content={
                    <View style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}>
                      <Text style={{
                        color: 'white',
                        fontSize: 12
                      }}>See your billing here...</Text>
                    </View>
                  }
                  redirect={() => {
                    this.props.navigation.navigate('transactionsStack',{title: 'Subscription Billings', parameter: data})
                  }}
                />
                <View style={{
                  width: width,
                  flexDirection: 'row',
                  padding: 15
                }}>
                  <View style={{ width: '50%' }}>
                    <Text style={{fontFamily: 'Poppins-SemiBold'}}>Payment Methods</Text>
                  </View>
                  <TouchableOpacity style={{ width: '50%' }}
                  onPress={() => {this.props.navigation.navigate('paymentStack')}}>
                    <Text style={{
                      color: theme ? theme.primary : Color.primary,
                      fontFamily: 'Poppins-SemiBold',
                      textAlign: 'right'
                    }}>Add</Text>
                  </TouchableOpacity>
                </View>
                {data.length > 0 && data.map((item, index) => {
                  return (
                    <PaymentMethodCard
                      data={item}
                    />
                  )
                })
                }
              </View>
            </ScrollView>
          )
        }
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

export default connect(
  mapStateToProps
)(Subscriptions);
