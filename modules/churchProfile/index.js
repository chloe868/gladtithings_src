import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { Color } from 'common';
import { connect } from 'react-redux';
import CardsWithImages from '../generic/CardsWithImages';
import IncrementButton from 'components/Form/Button';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChurch } from '@fortawesome/free-solid-svg-icons';
import CardsWithIcon from '../generic/CardsWithIcon';

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

const donations = [
  {
    title: 'Display Settings',
    description: "Change your theme colors here",
    route: 'displayStack'
  },
  {
    title: 'Error Message',
    description: "Change your theme colors here",
    route: 'pageMessageStack'
  }
]
class ChurchProfile extends Component {
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
          <View style={{
            height: height / 3,
            justifyContent: 'center',
            alignItems: 'center',
            width: width,
            backgroundColor: theme ? theme.primary : Color.primary,
            borderTopRightRadius: 30,
            borderTopLeftRadius: 30,
            padding: 15,
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
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 20,
            marginBottom: 20
          }}>
            <IncrementButton style={{
              backgroundColor: Color.primary,
              width: '40%',
              marginRight: 20
            }}
              onClick={() => {
                this.props.navigation.navigate('depositStack', { type: 'Send Tithings' })
              }}
              title={'Follow'}
            />

            <IncrementButton style={{
              backgroundColor: Color.secondary,
              width: '40%'
            }}
              onClick={() => {
                this.props.navigation.navigate('depositStack', { type: 'Send Tithings' })
              }}
              title={'Donation'}
            />
          </View>
          <View style={{
            width: width,
            paddingLeft: 15,
            paddingRight: 15
          }}>
            <Text style={{
              fontFamily: 'Poppins-SemiBold'
            }}>Announcements</Text>
            {
              donations.map((item, index) => {
                return (
                  <CardsWithIcon
                    version={5}
                    title={item.title}
                    description={item.description}
                  />
                )
              })
            }
          </View>
          <View>
            <Text style={{
              paddingTop: 10,
              paddingLeft: 20,
              fontFamily: 'Poppins-SemiBold'
            }}>Events</Text>
            <CardsWithImages
              version={2}
              data={data}
              buttonColor={theme ? theme.secondary : Color.secondary}
              buttonTitle={'Subscribe'}
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
)(ChurchProfile);
