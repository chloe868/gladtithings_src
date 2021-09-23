import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Color } from 'common';
import Footer from 'modules/generic/Footer';
import { connect } from 'react-redux';
import CardsWithImages from '../generic/CardsWithImages';
import CustomizedHeader from '../generic/CustomizedHeader';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {faSearch } from '@fortawesome/free-solid-svg-icons';

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

const data = [
  {
    id: 0,
    title: 'Theme 1',
    address: 'Cebu, Cebu City, Philippines',
    description: "Receives email address every time there's a login of the account.",
    date: 'July 23, 2021 5:00 PM',
    amount: 'USD 10.00',
    type: 'Recollection'
  },
  {
    id: 0,
    title: 'Theme 1',
    address: 'Cebu, Cebu City, Philippines',
    description: "Receives email address every time there's a login of the account.",
    date: 'July 23, 2021 5:00 PM',
    amount: 'USD 10.00',
    type: 'Recollection'
  }
]
class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: null
    }
  }

  render() {
    const { theme, user } = this.props.state;
    return (
      <View style={{
        backgroundColor: Color.containerBackground
      }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <CustomizedHeader
            version={2}
            redirect={() => {
              console.log('ji');
            }}
          />
          <View>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 20
            }}>
              <Text style={{
                fontFamily: 'Poppins-SemiBold'
              }}>Recently Visited Churches</Text>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('churchesStack')
                  console.log('hi');
                }}
                style={{
                  flexDirection: 'row'
                }}
              >
                <Text style={{
                  fontFamily: 'Poppins-SemiBold',
                  marginRight: 5,
                  color: theme ? theme.primary : Color.primary
                }}>Find Church</Text>
                <FontAwesomeIcon
                  icon={faSearch}
                  size={15}
                  style={{
                    color: theme ? theme.primary : Color.primary,
                    marginTop: 4
                  }}
                />

              </TouchableOpacity>
              {this.state.isLoading ? <Spinner mode="overlay" /> : null}
            </View>
            <CardsWithImages
              version={1}
              data={data}
              buttonColor={theme ? theme.secondary : Color.secondary}
              buttonTitle={'Subscribe'}
              redirect={() => { this.props.navigation.navigate('churchProfileStack') }}
              buttonClick={() => { this.props.navigation.navigate('depositStack', { type: 'Subscription Donation' }) }}
            />
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingLeft: 20,
              paddingRight: 20
            }}>
              <Text style={{
                fontFamily: 'Poppins-SemiBold'
              }}>Upcoming Events</Text>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('eventsStack')
                }}
              >
                <Text style={{
                  fontFamily: 'Poppins-SemiBold',
                  color: theme ? theme.primary : Color.primary
                }}>{'View more >>>'}</Text>

              </TouchableOpacity>
              {this.state.isLoading ? <Spinner mode="overlay" /> : null}
            </View>
            <CardsWithImages
              version={1}
              data={data}
              buttonColor={theme ? theme.secondary : Color.secondary}
              buttonTitle={'Donate'}
              redirect={() => { return }}
              buttonClick={() => { this.props.navigation.navigate('depositStack', { type: 'Send Event Tithings' }) }}
            />
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
