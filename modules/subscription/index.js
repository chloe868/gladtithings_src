import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { Color } from 'common';
import CardsWithIcon from 'modules/generic/CardsWithIcon';
import { connect } from 'react-redux';
import PaymentMethodCard from 'modules/generic/Cards';
import CustomizedHeader from 'modules/generic/CustomizedHeader';
import Button from 'modules/generic/Button';

import Skeleton from 'components/Loading/Skeleton';
import EmptyMessage from 'modules/generic/Empty.js'

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
      details: false,
      payment: true,
      subscription: false,
      isLoading: false,
      dataLimit: []
    }
  }

  render() {
    const { language, theme } = this.props.state;
    const { subscription, payment, isLoading, dataLimit } = this.state;
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
                text={data === null ? language.subscription.noChurchSelectedMessage : language.subscription.ChurchSelectedMessage}
                redirect={() => {
                  this.props.navigation.navigate('churchesStack')
                }}
              />
              <View style={{
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
                        fontSize: 12,
                        fontWeight: 'bold'
                      }}>{language.subscription.seeBillings}</Text>
                    </View>
                  }
                  redirect={() => {
                    this.props.navigation.navigate('transactionsStack',{title: 'Subscription Billings', parameter: 'all'})
                  }}
                />
              </View>
              {
                (payment) && (
                  <View style={{marginBottom: 100}}>
                  <Text
                  style={{
                    color: Color.primary,
                    fontSize: 14,
                    padding: 9,
                    paddingLeft: 10,
                    paddingTop: 20,
                    textAlign: 'left',
                    fontWeight: 'bold'
                  }}
                  onPress={() => {this.setState({subscription: true , payment: false})}}>View Payment Methods</Text>
                  <View style={{
                    paddingTop: 10,
                    paddingRight: 10,
                    paddingLeft: 10,
                    alignItems: 'center'
                  }}>
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
                </View>
                )
              }
              {
                (subscription) && (
                <View style={{
                  marginBottom: 100, 
                  paddingLeft: 15,
                  paddingRight: 15}}>
                  <Text
                  style={{
                    color: Color.primary,
                    fontSize: 14,
                    paddingTop: 20,
                    fontWeight: 'bold'
                  }}
                  onPress={() => {this.setState({payment: true , subscription: false})}}>View Subscriptions List</Text>
                  <View style={{
                    flexDirection: 'row',
                    paddingTop: 15,
                    paddingBottom: 15
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
                )
              }
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
                      }}>{language.subscription.seeBillings}</Text>
                    </View>
                  }
                  redirect={() => {
                    dataLimit.length === 0 ?
                    Alert.alert('Message', 'You do not have any subscription on this church.', [
                      {
                        text: 'OK',
                        onPress: () => console.log('Cancel Pressed'),
                      },
                    ]) :
                    this.props.navigation.navigate('transactionsStack',{title: 'Subscription Billings', parameter: 'personal'})
                  }}
                />
                <View style={{
                  paddingLeft: 20,
                  paddingRight: 20,
                  minHeight: height + (height * 0.5)
                }}>

                  {
                    (isLoading) && (
                      <Skeleton size={5} template={'block'} height={60}/>
                    )
                  }


                  {!isLoading && dataLimit.length === 0 && <EmptyMessage message={language.emptyTithings}/>}
                  {
                    dataLimit.map((item, index) => {
                      return (
                        <CardsWithIcon
                          redirect={() => {
                            console.log('')
                          }}
                          version={3}
                          // tentative
                          description={item.description}
                          title={item.receiver ? item.receiver.email : item.description}
                          date={item.created_at_human}
                          amount={item.currency + ' ' + item.amount?.toLocaleString()}
                        />
                      )
                    })
                  }
                </View>
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
