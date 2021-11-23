import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Color, Routes } from 'common';
import Style from './Style.js';
import { connect } from 'react-redux';
import CardsWithImages from 'src/modules/generic/CardsWithImages';
import CustomizedHeader from 'src/modules/generic/CustomizedHeader';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Api from 'services/api/index.js';
import { Spinner } from 'components';

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
      limit: 5
    }
  }

  componentDidMount() {
    this.retrieveChurches()
    this.retrieveEvents()
  }

  retrieveEvents = () => {
    const { user } = this.props.state;
    const { limit, offset } = this.state;
    let parameter = {
      condition: [{
        value: user.id,
        column: 'account_id',
        clause: '='
      }],
      sort: {created_at: 'asc'},
      limit: limit,
      offset: offset
    }
    Api.request(Routes.eventsRetrieve, parameter, response => {
      if(response.data.length > 0) {
        response.data.map((item, index) => {
          item['logo'] = item.image[0].category
          item['address'] = item.location
          item['date'] = item.start_date
        })
        this.setState({events: response.data})
      }
    }, error => {
      console.log(error)
    })
  }

  retrieveChurches = () => {
    const { days } = this.state;
    let parameter = {
      sort: { created_at: 'asc' },
      limit: 2,
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
                  address: item.address,
                  logo: item.logo,
                  name: i.name,
                  date: `${days[currentDay]} ${i.startTime} ${aIsAm} - ${i.endTime} ${bIsAm}`
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
    const { churches, isLoading, events } = this.state;
    console.log('[CHURCHES]', churches)
    return (
      <View style={{
        backgroundColor: Color.containerBackground
      }}>
        {isLoading ? <Spinner mode="overlay" /> : null}
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          <View style={{
            marginBottom: height / 2
          }}>
            <CustomizedHeader
              version={2}
              redirect={() => {
                this.props.navigation.navigate('subscriptionStack')
              }}
            />
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
              <CardsWithImages
                version={1}
                button={true}
                data={churches}
                buttonColor={theme ? theme.secondary : Color.secondary}
                buttonTitle={language.subscribe}
                redirect={(index) => { this.props.navigation.navigate('churchProfileStack', { data: index }) }}
                buttonClick={(item) => { this.props.navigation.navigate('depositStack', { type: 'Subscription Donation', data: item }) }}
              />
              {churches?.length > 0 && <View style={Style.title}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: 'Poppins-SemiBold',
                    width: '50%'
                  }}
                >{language.upcomingMasses}</Text>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('churchesStack')
                  }}
                  style={Style.right}
                >
                  <Text style={{
                    fontFamily: 'Poppins-SemiBold',
                    color: theme ? theme.primary : Color.primary
                  }}>{language.viewMore + '>>>'}</Text>

                </TouchableOpacity>
              </View>}
              <CardsWithImages
                version={1}
                data={churches}
                buttonColor={theme ? theme.secondary : Color.secondary}
                buttonTitle={language.subscribe}
                redirect={(data) => { this.props.navigation.navigate('churchProfileStack', { data: data }) }}
                buttonClick={(item) => { this.props.navigation.navigate('depositStack', { type: 'Subscription Donation', data: item }) }}
              />
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
              <CardsWithImages
                button={true}
                version={1}
                data={events}
                buttonColor={theme ? theme.secondary : Color.secondary}
                buttonTitle={language.donate}
                redirect={() => { return }}
                buttonClick={() => { this.props.navigation.navigate('depositStack', { type: 'Send Event Tithings' }) }}
              />
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
