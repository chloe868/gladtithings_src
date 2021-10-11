import React, { Component } from 'react';
import { View, TouchableOpacity, Dimensions, Text } from 'react-native'
import { BasicStyles, Color } from 'common';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faChevronRight, faChurch, faExclamationTriangle, faToggleOn, faToggleOff, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import Styles from './CardsWithIconStyle';

const height = Math.round(Dimensions.get('window').height)
class CardsWithIcon extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  versionOne = () => {
    const { theme } = this.props.state;
    return (
      <View style={[Styles.cardContainer, {height: 90}]}>
        <View style={{width: '90%'}}>
          <Text style={{ fontFamily: 'Poppins-SemiBold' }}>{this.props.title}</Text>
          <Text style={{ fontSize: 13 }}>{this.props.description}</Text>
        </View>
        <View style={{
          width: '10%',
          alignItems: 'center'
        }}>
          <FontAwesomeIcon
            icon={faToggleOn}
            size={30}
            style={{
              color: theme ? theme.primary : Color.primary
            }}
          />
        </View>
      </View>
    )
  }

  versionTwo = () => {
    const { theme } = this.props.state;
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.redirect()
        }}
        style={[Styles.cardContainer, {height: 90}]}>
        <View style={{
          width: '100%',
          flexDirection: 'row'
        }}>
          <View style={{width: '90%'}}>
            <Text style={{ fontFamily: 'Poppins-SemiBold' }}>{this.props.title}</Text>
            <Text style={{ fontSize: 13 }}>{this.props.description}</Text>
          </View>
          <View style={{
            width: '10%',
            alignItems: 'center'
          }}>
            <FontAwesomeIcon
              icon={faChevronRight}
              size={25}
              style={{
                color: theme ? theme.primary : Color.primary
              }}
            />
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  versionThree = () => {
    const { theme } = this.props.state;
    return (
      <View
        style={{
          ...Styles.cardContainer,
          height: 80,
          ...this.props.style
        }}
        >
        <View style={{
          width: '15%',
          justifyContent: 'center'
        }}>
          <FontAwesomeIcon
            icon={this.props.description === 'Direct Transfer' ? faChurch : faCreditCard}
            size={35}
            style={{color: Color.secondary}}
          />
        </View>
        <View style={{width: '60%', justifyContent: 'center'}}>
          <Text style={{ fontFamily: 'Poppins-SemiBold' }}>{this.props.title}</Text>
          <Text style={{ fontSize: 13 }}>{this.props.date}</Text>
        </View>
        <View style={{
          width: '25%',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Text style={{
            color: theme ? theme.primary : Color.primary,
            fontFamily: 'Poppins-SemiBold'
          }}>{this.props.amount}</Text>
        </View>
      </View>
    )
  }

  versionToggle = () => {
    const { theme } = this.props.state;
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.redirect()
        }}
        style={[Styles.cardContainer, {height: 90}]}>
        <View style={{
          width: '100%',
          flexDirection: 'row'
        }}>
          <View style={{width: '90%'}}>
            <Text style={{ fontFamily: 'Poppins-SemiBold' }}>{this.props.title}</Text>
            <Text style={{ fontSize: 13 }}>{this.props.description}</Text>
          </View>
          <View style={{
            width: '10%',
            alignItems: 'center'
          }}>
            <FontAwesomeIcon
              icon={this.props.flag ? faToggleOn : faToggleOff}
              size={25}
              style={{
                color: this.props.flag ? Color.primary : Color.danger
              }}
            />
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  versionFive = () => {
    const { theme } = this.props.state;
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.redirect()
        }}
        style={[Styles.cardContainer, {padding: 20}]}>
        <View style={{
          width: '100%',
          flexDirection: 'row'
        }}>
          <View style={{width: '100%'}}>
            <Text style={{ fontFamily: 'Poppins-SemiBold', color: theme ? theme.primary : Color.primary }}>{this.props.title}</Text>
            <Text style={{ fontSize: 13 }}>{this.props.description}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const { version } = this.props;
    return (
      <View style={{
        alignItems: 'center',
        ...this.props.style
      }}>
        {version === 1 && this.versionOne()}
        {version === 2 && this.versionTwo()}
        {version === 3 && this.versionThree()}
        {version === 4 && this.versionToggle()}
        {version === 5 && this.versionFive()}
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
  mapDispatchToProps)(CardsWithIcon);