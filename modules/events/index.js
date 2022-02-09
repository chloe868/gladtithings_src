import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, TextInput, Alert } from 'react-native';
import { Color, Routes, Helper } from 'common';
import { connect } from 'react-redux';
import CardsWithImages from '../generic/CardsWithImages';
import CustomizedHeader from '../generic/CustomizedHeader';
import IncrementButton from 'components/Form/Button';
import Api from 'services/api/index.js';
import { Spinner } from 'components'
import _ from 'lodash';
import Skeleton from 'components/Loading/Skeleton';
import AmountInput from 'modules/generic/AmountInput'

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: null,
      donate: false,
      amount: 0,
      isLoading: false,
      events: [],
      limit: 8,
      offset: 0,
      currency: 'PHP',
      loadingEvent: false
    }
  }

  componentDidMount() {
    this.retrieveEvents(false)
    this.setState({ currency: this.props.state.ledger?.currency || 'PHP' })
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

  createPayment = async () => {
    if (this.state.amount !== null && this.state.amount > 0) {
      this.createLedger();
    } else {
      Alert.alert('Donation Error', 'You are missing your amount.');
    }
  };

  createLedger = () => {
    const { user } = this.props.state;
    const { events } = this.state;
    let params = {
      account_id: user.id,
      account_code: user.code,
      amount: -(this.state.amount),
      currency: this.state.currency,
      details: events[0]?.id,
      description: 'Event Donation',
    };
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

  render() {
    const { theme, user, paypalUrl } = this.props.state;
    const { donate, amount, events, isLoading, loadingEvent } = this.state;
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
          <View style={{ marginBottom: height /2, }}>
            <CustomizedHeader
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
            />
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
                redirect={(item) => { this.props.navigation.navigate('viewEventStack', {data : item}) }}
                buttonClick={(item) => { this.props.navigation.navigate('otherTransactionStack', { type: 'Send Event Tithings', data: item}) }}
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
              <View style={{
                padding: 20,
              }}>
                <View style={{
                  padding: 20,
                }}>
                  <View style={{
                    borderWidth: 1,
                    borderColor: Color.lightGray,
                    padding: 15,
                    borderRadius: 10
                  }}>
                    <AmountInput
                      onChange={(amount, currency) => this.setState({
                        amount: amount,
                        currency: currency
                      })
                      }
                      maximum={(user && Helper.checkStatus(user) >= Helper.accountVerified) ? Helper.MAX_VERIFIED : Helper.MAX_NOT_VERIFIED}
                      type={{
                        type: 'Cash In'
                      }}
                      disableRedirect={false}
                      navigation={this.props.navigation}
                    />
                  </View>
                </View>
              </View>
            }
          </View>
        </ScrollView>
        {loadingEvent ? <Spinner mode="overlay" /> : null}
        {donate && <View style={{
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

