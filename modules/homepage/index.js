import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { Color, Routes } from 'common';
import Style from './Style.js';
import { connect } from 'react-redux';
import CardsWithImages from 'src/modules/generic/CardsWithImages';
import CustomizedHeader from 'src/modules/generic/CustomizedHeader';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Api from 'services/api/index.js';
import Skeleton from 'components/Loading/Skeleton';
import {Spinner} from 'components';

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: null,
      churches: [],
      days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      isLoading: false,
      events: [],
      offset: 0,
      limit: 5,
      recentlyVisited: [],
      loadingEvent: false,
      currentSubscription: null
    }
  }

  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => {
      this.retrieveChurches()
      this.retrieveEvents()
      this.retrieveRecentlyVisitedChurches()
      this.retrieveAllSubscriptions()
    })
  }

  
  retrieveAllSubscriptions = () => {
    const { user } = this.props.state;
    let parameter = {
      account_id: user.id
    }
    this.setState({ isLoading: true })
    Api.request(Routes.SubscriptionRetrieveByParams, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        response.data.map(item => {
          item.merchant_details.address = JSON.parse(item.merchant_details?.address)?.name
        })
        this.setState({ currentSubscription: {
          ...response.data[0],
          address: response.data[0].merchant_details.address,
          amount: 20,
          date: response.data[0].next_month,
          logo: response.data[0].merchant_details.logo
        }})
      }
    }, error => {
      console.log(error);
      this.setState({ isLoading: false })
    });
  }

  attendEvent = (item) => {
    let parameter = {
      condition: [{
        value: item.id,
        column: 'id',
        clause: '='
      }]
    }
    this.setState({loadingEvent: true})
    Api.request(Routes.eventsRetrieve, parameter, response => {
      this.setState({loadingEvent: false})
      if (response.data.length > 0) {
        Alert.alert('Attend Event?', `Event Name: ${response.data[0].name?.toUpperCase()}\n\nLimit: ${response.data[0].limit}`, [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Attend',
            onPress: () => this.addToEventAttendees(item),
          },
        ]);
      }
    }, error => {
      this.setState({loadingEvent: false})
      console.log(error)
    })
  }

  addToEventAttendees = (event) => {
    this.setState({loadingEvent: true})
    console.log(Routes.eventAttendeesCreate, {
      event_id: event.id,
      account_id: this.props.state.user.id
    });
    Api.request(Routes.eventAttendeesCreate, {
      event_id: event.id,
      account_id: this.props.state.user.id
    }, response => {
      this.setState({loadingEvent: false})
      if (response.data > 0) {
        Alert.alert('Success', `You successfully attended to "${event.name}" event.`);
      } else {
        Alert.alert('Error', response.error);
      }
    }, error => {
      this.setState({loadingEvent: false})
      console.log(error)
    })
  }

  retrieveRecentlyVisitedChurches = () => {
    const { user } = this.props.state;
    let parameter = {
      condition: [{
        value: user.id,
        column: 'account_id',
        clause: '='
      }],
      limit: 6,
      sort: {created_at: 'desc'}
    }
    this.setState({isLoading: true});
    console.log(parameter, Routes.recentlyVisitedChurchesRetrieve)
    Api.request(Routes.recentlyVisitedChurchesRetrieve, parameter, response => {
      this.setState({isLoading: false});
      let temp = []
      if(response.data?.length > 0) {
        response.data.map((item, index) => {
         temp.push({
          id: item.merchant.id,
          address: JSON.parse(item.merchant?.address)?.name,
          logo: item.merchant.logo,
          name: item.merchant.name,
          account_id: item.merchant.account_id,
          addition_informations: item.merchant.addition_informations
         })
        })
      }
      this.setState({ recentlyVisited: temp })
    }, error => {
      console.log(error)
    })
  }

  retrieveEvents = () => {
    const { user } = this.props.state;
    const { limit, offset } = this.state;
    let parameter = {
      condition: [{
        value: new Date(),
        column: 'start_date',
        clause: '>'
      }],
      sort: { created_at: 'asc' },
      limit: limit,
      offset: offset
    }
    Api.request(Routes.eventsRetrieve, parameter, response => {
      if (response.data.length > 0) {
        response.data.map((item, index) => {
          item['logo'] = item.image?.length > 0 ? item.image[0].category : null
          item['address'] = item.location
          item['date'] = item.start_date
        })
        this.setState({ events: response.data })
      }
    }, error => {
      console.log(error)
    })
  }

  retrieveChurches = () => {
    const { days } = this.state;
    let parameter = {
      sort: { created_at: 'asc' },
      limit: 6,
      offset: 0
    }
    this.setState({ isLoading: true })
    Api.request(Routes.merchantsRetrieve, parameter, response => {
      console.log('[RESPONSE]', response)
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        let temp = [];
        response.data.map((item, index) => {
          let sched = [];
          if (item.schedule) {
            sched = JSON.parse(item.schedule)
          }
          sched.length > 0 && sched.map((items, inde) => {
            let currentDay = new Date().getDay();
            if (items.title === days[currentDay]) {
              items.schedule.length > 0 && items.schedule.map((i, ind) => {
                let a = i.startTime.split(':')
                let b = i.endTime.split(':')
                let aIsAm = parseInt(a[0]) <= 12 ? 'AM' : 'PM'
                let bIsAm = parseInt(b[0]) <= 12 ? 'AM' : 'PM'
                temp.push({
                  id: item.id,
                  address: JSON.parse(item.address)?.name,
                  logo: item.logo,
                  name: i.name,
                  date: `${days[currentDay]} ${i.startTime} ${aIsAm} - ${i.endTime} ${bIsAm}`,
                  account_id: item.account_id,
                  addition_informations: item.addition_informations
                })
              })
            }
          })
          this.setState({
            churches: temp
          })
        })
      }
    });
  }

  render() {
    const { theme, user, language } = this.props.state;
    const { churches, isLoading, events, recentlyVisited, loadingEvent, currentSubscription } = this.state;
    return (
      <View style={{
        backgroundColor: Color.containerBackground
      }}>
        {loadingEvent && <Spinner mode="overlay" />}
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          <View style={{
            marginBottom: height / 2
          }}>
            {currentSubscription ? <CustomizedHeader
              version={2}
              data={{
                merchant_details: {
                  name: currentSubscription.name,
                  logo: currentSubscription.logo,
                  address: currentSubscription.address,
                },
                amount: currentSubscription.amount,
                next_month: currentSubscription.next_month
              }}
              redirect={() => {
                this.props.navigation.navigate('subscriptionStack')
              }}
            /> : 
            <CustomizedHeader
              version={4}
              text={language.homepage.noSubscription}
              redirect={() => {
                this.props.navigation.navigate('subscriptionStack')
              }}
            />
            }
            <View>
              <View style={Style.title}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: 'Poppins-SemiBold',
                    width: '50%'
                  }}
                >{language.visitedChurches}</Text>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('churchesStack')
                  }}
                  style={Style.right}
                >
                  <FontAwesomeIcon
                    icon={faSearch}
                    size={15}
                    style={{
                      color: theme ? theme.primary : Color.primary,
                      marginTop: 4
                    }}
                  />
                  <Text style={{
                    fontFamily: 'Poppins-SemiBold',
                    marginRight: 5,
                    color: theme ? theme.primary : Color.primary
                  }}>{language.findChurch}</Text>
                </TouchableOpacity>
              </View>
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
              <CardsWithImages
                version={1}
                button={true}
                data={recentlyVisited}
                buttonColor={theme ? theme.secondary : Color.secondary}
                buttonTitle={language.subscribe}
                redirect={(index) => { this.props.navigation.navigate('churchProfileStack', { data: index }) }}
                buttonClick={(item) => { this.props.navigation.navigate('otherTransactionStack', { type: 'Subscription Donation', data: item }) }}
              />
              {!isLoading && recentlyVisited.length === 0 && <Text style={{
                padding: 20,
                margin: 0,
                marginTop: -25,
                marginBottom: -20,
                fontSize: 11
              }}>No recently visited churches.</Text>}
              <View style={Style.title}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: 'Poppins-SemiBold',
                    width: '50%'
                  }}
                >{language.nearbyMass}</Text>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('massesStack')
                  }}
                  style={Style.right}
                >
                  <Text style={{
                    fontFamily: 'Poppins-SemiBold',
                    color: theme ? theme.primary : Color.primary
                  }}>{language.findMass + '>>>'}</Text>

                </TouchableOpacity>
              </View>
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
              <CardsWithImages
                version={1}
                data={churches}
                buttonColor={theme ? theme.secondary : Color.secondary}
                buttonTitle={language.subscribe}
                redirect={(data) => { this.props.navigation.navigate('churchProfileStack', { data: data }) }}
                buttonClick={(item) => { this.props.navigation.navigate('otherTransactionStack', { type: 'Subscription Donation', data: item }) }}
              />
              {!isLoading && churches.length === 0 && <Text style={{
                padding: 20,
                margin: 0,
                marginTop: -25,
                marginBottom: -20,
                fontSize: 11
              }}>No nearby upcoming masses.</Text>}
              <View style={Style.title}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: 'Poppins-SemiBold',
                    width: '50%'
                  }}
                >{language.upcomingEvents}</Text>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('eventsStack')
                  }}
                  style={Style.right}
                >
                  <Text style={{
                    fontFamily: 'Poppins-SemiBold',
                    color: theme ? theme.primary : Color.primary
                  }}>{language.viewMore + '>>>'}</Text>

                </TouchableOpacity>
              </View>
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
              <CardsWithImages
                button={true}
                version={1}
                data={events}
                buttonColor={theme ? theme.secondary : Color.secondary}
                buttonTitle={language.donate}
                redirect={(item) => { this.attendEvent(item) }}
                buttonClick={(item) => { this.props.navigation.navigate('otherTransactionStack', { type: 'Send Event Tithings', data: item }) }}
              />
              {!isLoading && events.length === 0 && <Text style={{
                padding: 20,
                margin: 0,
                marginTop: -25,
                marginBottom: -20,
                fontSize: 11
              }}>No nearby upcoming events.</Text>}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

export default connect(
  mapStateToProps
)(HomePage);
