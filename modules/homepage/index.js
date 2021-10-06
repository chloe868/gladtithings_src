import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Color, Routes } from 'common';
import { connect } from 'react-redux';
import CardsWithImages from '../generic/CardsWithImages';
import CustomizedHeader from '../generic/CustomizedHeader';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Api from 'services/api/index.js';
import { Spinner } from 'components';

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
      input: null,
      churches: []
    }
  }

  componentDidMount(){
    this.retrieveChurches()
  }

  retrieveChurches = () => {
    let parameter = {
      sort: { created_at: 'asc' },
      limit: 2,
      offset: 0
    }
    this.setState({ isLoading: true })
    Api.request(Routes.merchantsRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        this.setState({
          churches: response.data
        })
      }
    });
  }

  render() {
    const { theme, user } = this.props.state;
    const { churches } = this.state;
    return (
      <View style={{
        backgroundColor: Color.containerBackground,
      }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          <View style={{
            height: height * 1.5
          }}>
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
                }}>Upcoming Masses</Text>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('churchesStack')
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
                data={churches}
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
