import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Color } from 'common';
import { connect } from 'react-redux';
import CardsWithIcon from '../generic/CardsWithIcon';
import InputFieldWithIcon from '../generic/InputFieldWithIcon';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

const data = [
  {
    title: 'Account Settings',
    description: "Account details and update password",
    route: 'accountSettingsStack'
  },
  {
    title: 'Edit Profile',
    description: "Update your personal information and more.",
    route: 'profileStack'
  },
  {
    title: 'Subscriptions',
    description: "View your subscribe plan",
    route: 'subscriptionStack'
  },
  {
    title: 'Notification Settings',
    description: "Receives notification to any of the ff.",
    route: 'notificationSettingsStack'
  },
  {
    title: 'About Glad Tithings',
    description: "Open website ",
    route: 'otpStack'
  },
  {
    title: 'Display Settings',
    description: "Change your theme colors here",
    route: 'displayStack'
  },
  {
    title: 'Laguage Settings',
    description: "Manage languages you want to use here",
    route: 'languageSettingsStack'
  },
]

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state={
      input: null
    }
  }

  render() {
    const { theme } = this.props.state;
    return (
      <View style={{
        height: height,
        backgroundColor: Color.containerBackground
      }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{
            paddingLeft: 20,
            paddingRight: 20,
            minHeight: height + (height * 0.5)
          }}>

            {
              data.map((item, index) => {
                return (
                  <CardsWithIcon
                    redirect={() => {
                      if(item.route !== 'pageMessageStack'){
                        this.props.navigation.navigate(item.route)
                      }else{
                        this.props.navigation.navigate(item.route, {
                          title: 'Success Page',
                          message: 'Transaction was successful',
                          payload: 'error'
                        })
                      }
                    }}
                    version={2}
                    title={item.title}
                    description={item.description}
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
const mapStateToProps = state => ({ state: state });

export default connect(
  mapStateToProps
)(Settings);
