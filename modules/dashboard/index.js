import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Color, Routes } from 'common';
import Api from 'services/api/index.js';
import { connect } from 'react-redux';
import CardsWithIcon from '../generic/CardsWithIcon';
import BalanceCard from 'modules/generic/BalanceCard.js';
import IncrementButton from 'components/Form/Button';
import Subscription from 'modules/generic/Subscriptions.js';
import { Spinner } from 'components';

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: null,
      ledger: {
        currency: 'USD',
        available_balance: 0,
        current_balance: 0,
        balance: 0
      },
      isLoading: false,
      data: [],
      offset: 0,
      limit: 5
    }
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.retrieveBalance();
      this.retrieve(false);
    })
  }

  retrieve = (flag) => {
    const { user } = this.props.state;
    let parameter = {
      condition: [{
        column: 'account_id',
        value: user.id,
        clause: '='
      }, {
        column: 'account_id',
        value: user.id,
        clause: 'or'
      }],
      sort: { created_at: 'desc' },
      limit: this.state.limit,
      offset: flag == true && this.state.offset > 0 ? (this.state.offset * this.state.limit) : this.state.offset
    }
    this.setState({ isLoading: true })
    Api.request(Routes.transactionHistoryRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        this.setState({
          data: flag == false ? response.data : _.uniqBy([...this.state.data, ...response.data], 'id'),
          offset: flag == false ? 1 : (this.state.offset + 1)
        })
      } else {
        this.setState({
          data: flag == false ? [] : this.state.data,
          offset: flag == false ? 0 : this.state.offset
        })
      }
    });
  }

  retrieveBalance = () => {
    const { user } = this.props.state;
    let parameter = {
      condition: [
        {
          clause: '=',
          column: 'account_id',
          value: user.id
        }
      ],
      account_id: user.id,
      account_code: user.code
    }
    this.setState({ isLoading: true })
    Api.request(Routes.ledgerDashboard, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data) {
        this.setState({ ledger: response.data.ledger[0] });
        this.props.setLedger(response.data.ledger[0])
      }
    }, error => {
      console.log(error);
      this.setState({ isLoading: false });
    })
  }

  render() {
    const { theme } = this.props.state;
    const { ledger, data, isLoading } = this.state;
    return (
      <View style={{
        backgroundColor: Color.containerBackground
      }}>
        <ScrollView
          style={{
            backgroundColor: Color.containerBackground
          }} showsVerticalScrollIndicator={false}
        >
          <View style={{
            paddingLeft: 15,
            paddingBottom: 15,
            paddingRight: 15,
            height: height * 1.5,
          }}>
            {isLoading ? <Spinner mode="overlay" /> : null}
            {
              ledger && (
                <BalanceCard data={ledger} />
              )
            }

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
              marginBottom: 20
            }}>
              <IncrementButton style={{
                backgroundColor: Color.secondary,
                width: '40%'
              }}
                onClick={() => {
                  this.props.navigation.navigate('depositStack', { page: 'Deposit' })
                }}
                title={'Deposit'}
              />

              <IncrementButton style={{
                backgroundColor: Color.secondary,
                width: '40%'
              }}
                onClick={() => {
                  this.props.navigation.navigate('depositStack', { page: 'Withdraw' })
                }}
                title={'Withdraw'}
              />
            </View>

            <Subscription
              navigation={this.props.navigation}
            />

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
              marginBottom: 10
            }}>
              <Text style={{
                fontFamily: 'Poppins-SemiBold',
                color: Color.primary
              }}>Tithings</Text>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('transactionsStack')
                }}
              >

                <Text style={{
                  fontFamily: 'Poppins-SemiBold',
                }}>{'View more >>>'}</Text>

              </TouchableOpacity>
            </View>

            {
              data.map((item, index) => {
                return (
                  <CardsWithIcon
                    redirect={() => {
                      console.log('')
                    }}
                    version={3}
                    description={item.description}
                    title={item.receiver ? item.receiver.email : item.description}
                    date={item.created_at_human}
                    amount={item.currency + ' ' + item.amount?.toLocaleString()}
                  />
                )
              })
            }
          </View>
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux');
  return {
    setQRCodeModal: (isVisible) => dispatch(actions.setQRCodeModal({ isVisible: isVisible })),
    setLedger: (ledger) => dispatch(actions.setLedger(ledger))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);