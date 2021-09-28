import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { Color } from 'common';
import Footer from 'modules/generic/Footer';
import { connect } from 'react-redux';
import CardsWithIcon from '../generic/CardsWithIcon';
import InputFieldWithIcon from '../generic/InputFieldWithIcon';
import { faUser, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import IncrementButton from 'components/Form/Button';

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

const data = [
  {
    title: 'Email Login',
    description: "Receives email address every time there’s a login of the account.",
    flag: false
  },
  {
    title: 'Email OTP',
    description: "OTP will be send to you email address",
    flag: false
  },
  {
    title: 'SMS OTP',
    description: "OTP will be send to you via SMS using your registered mobile number",
    flag: true
  },
  {
    title: 'Subscribe to get our latest updates',
    description: "Receives events, and many more to your registered email address",
    flag: false
  },
]

class NotificationSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    const { theme, user } = this.props.state;
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
                  version={4}
                  title={item.title}
                  flag={item.flag}
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
)(NotificationSettings);