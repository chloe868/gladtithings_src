import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { Color } from 'common';
import Footer from 'modules/generic/Footer';
import { connect } from 'react-redux';
import CardsWithIcon from 'modules/generic/CardsWithIcon';
import InputFieldWithIcon from 'modules/generic/InputFieldWithIcon';
import { faUser, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import IncrementButton from 'components/Form/Button';

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

class AccountSettings extends Component {
  constructor(props) {
    super(props);
    this.state={
      input: null
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
            <InputFieldWithIcon
              placeholder={user ? user.username : 'Username'}
              icon={faUser}
              label={'Username'}
              disable={true}
              onTyping={(text) => {this.setState({input: text})}}
            />

            <InputFieldWithIcon
              placeholder={user ? user.email : 'Email Address'}
              icon={faEnvelope}
              label={'Email Address'}
              onTyping={(text) => {this.setState({input: text})}}
            />

            <IncrementButton style={{
                backgroundColor: Color.primary,
                width: '40%',
                marginTop: 20,
                marginBottom: 20
              }}
              textStyle={{
                fontWeight: 'bold'
              }}
              onClick={() => {
                this.props.navigation.navigate('withdrawStack')
              }}
              title={'Update'}
            />

            <View style={{
              marginTop: 20,
              marginBottom: 20
            }}>
              <Text style={{
                fontWeight: 'bold'
              }}>Security Credentials</Text>

              <InputFieldWithIcon
                placeholder={'New Password'}
                icon={faUser}
                label={'New Password *'}
                secureTextEntry={true}
                onTyping={(text) => {this.setState({input: text})}}
              />

              <InputFieldWithIcon
                placeholder={'Confirm New Password'}
                icon={faUser}
                label={'Confirm New Password *'}
                secureTextEntry={true}
                onTyping={(text) => {this.setState({input: text})}}
              />

              <IncrementButton style={{
                  backgroundColor: Color.primary,
                  width: '40%',
                  marginTop: 20,
                  marginBottom: 20
                }}
                textStyle={{
                  fontWeight: 'bold'
                }}
                onClick={() => {
                  this.props.navigation.navigate('withdrawStack')
                }}
                title={'Update'}
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
)(AccountSettings);