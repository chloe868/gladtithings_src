import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { Color, Routes } from 'common';
import CardsWithIcon from 'modules/generic/CardsWithIcon';
import { connect } from 'react-redux';
import PaymentMethodCard from 'modules/generic/Cards';
import CustomizedHeader from 'modules/generic/CustomizedHeader';
import Button from 'modules/generic/Button';
import Api from 'services/api/index.js';

import Skeleton from 'components/Loading/Skeleton';
import EmptyMessage from 'modules/generic/Empty.js'

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

class Subscriptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: false,
      payment: true,
      subscription: false,
      isLoading: false,
      dataLimit: [],
      data: [],
      dataPayment: [],
      items: null
    }
  }

  componentDidMount = () => {
    this.retrieveAllSubscriptions()
    this.retrieveAllPayment()
  }

  retrieveAllSubscriptions = () => {
    const { user } = this.props.state;
    let parameter = {
      account_id: user.id  
    }
    this.setState({isLoading: true})
    Api.request(Routes.SubscriptionRetrieveByParams, parameter, response => {
      this.setState({data: response.data})
    });
  }

  retrieveAllPayment = () => {
    const {user} = this.props.state;
    let parameter = {
      account_id: user.id,
      account_code: user.code
    }
    Api.request(Routes.paymentMethodsRetrieve, parameter, response => {
      this.setState({dataPayment: response.data})
    })
  }

  retrieveLTransaction = (flag) => {
    const { user } = this.props.state;
    let parameter = {
      condition: [{
        column: 'account_id',
        value: user.id,
        clause: '='
      }, {
        column: 'description',
        value: 'subscription',
        clause: '='
      }],
      sort: {created_at: 'desc'},
      limit: 5,
      offset: 0
    }
    this.setState({ isLoading: true })
    Api.request(Routes.transactionHistoryRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      console.log('[=', response)
      // if (response.data.length > 0) {
      //   this.setState({
      //     dataLimit: flag == false ? response.data : _.uniqBy([...this.state.data, ...response.data], 'id'),
      //   })
      // } else {
      //   this.setState({
      //     dataLimit: flag == false ? [] : this.state.data
      //   })
      // }
    });
  }

  render() {
    const { language, theme } = this.props.state;
    const { subscription, payment, isLoading, dataLimit, data, dataPayment } = this.state;
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
                    this.props.navigation.navigate('transactionsStack', {title: 'Subscription Billings', parameter: 'all'})
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
                  onPress={() => {this.setState({subscription: true , payment: false})}}>{language.subscription.viewPaymentMethods}</Text>
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
                          data={item}
                          redirect={() => {
                            this.setState({details: true, items: item})
                            this.retrieveLTransaction(false)
                          }}
                        />
                      )
                    })
                    }
                    {
                      data.length === 0 && <EmptyMessage message={language.subscription.noSubscription}/>
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
                  onPress={() => {this.setState({payment: true , subscription: false})}}>{language.subscription.viewSubscriptionList}</Text>
                  <View style={{
                    flexDirection: 'row',
                    paddingTop: 15,
                    paddingBottom: 15
                  }}>
                    <View style={{ width: '50%' }}>
                      <Text style={{fontFamily: 'Poppins-SemiBold'}}>{language.subscription.paymentMethods}</Text>
                    </View>
                    <TouchableOpacity style={{ width: '50%' }}
                    onPress={() => {this.props.navigation.navigate('paymentStack')}}>
                      <Text style={{
                        color: theme ? theme.primary : Color.primary,
                        fontFamily: 'Poppins-SemiBold',
                        textAlign: 'right'
                      }}>{language.add}</Text>
                    </TouchableOpacity>
                  </View>
                  {dataPayment.length > 0 && data.map((item, index) => {
                    return (
                      <PaymentMethodCard
                        data={item}
                      />
                    )
                  })
                  }
                  {
                    dataPayment.length === 0 && <EmptyMessage message={language.subscription.noPayment}/>
                  }
                </View>
                )
              }
            </ScrollView>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <CustomizedHeader
                version={2}
                data={this.state.items}
                buttonText={language.edit}
                redirect={() => {
                  this.props.navigation.navigate('depositStack', { type: 'Edit Subscription Donation', data: this.state.items })
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
                    Alert.alert(language.subscription.message, language.subscription.noBillings, [
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


                  {!isLoading && dataLimit.length === 0 && <EmptyMessage message={language.subscription.noSubscription}/>}
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
