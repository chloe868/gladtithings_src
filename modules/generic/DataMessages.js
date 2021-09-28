import React, { Component } from 'react';
import { View, TouchableOpacity, Dimensions, Text } from 'react-native'
import { BasicStyles, Color } from 'common';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import Button from '../generic/Button.js'

const height = Math.round(Dimensions.get('window').height)
class DataMessages extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    const { theme } = this.props.state;
    return (
        <View style={{
            alignItems: 'center',
            ...this.props.style
          }}>
            <FontAwesomeIcon
              icon={this.props.icon}
              size={height/6}
              style={{
                color: this.props.iconColor
              }}
            />
            <Text style={{
                fontFamily: 'Poppins-SemiBold',
                marginTop: 20,
                marginBottom: 20,
                textAlign: 'center'
            }}>{this.props.message}</Text>
            <Button
              style={{
                width: '60%',
                height: 50,
                backgroundColor: theme ? theme.secondary : Color.secondary,
              }}
              content={
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ color: 'white', fontSize: 15 }}>{this.props.buttonTitle}</Text>
                </View>
              }
              redirect={() => {
                this.props.redirect()
              }}
            />
          </View>
    )
  }
}

const mapStateToProps = state => ({ state: state });
const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {};
}
export default connect(
  mapStateToProps,
  mapDispatchToProps)(DataMessages);