import React, { Component } from 'react';
import { View, TouchableOpacity, Dimensions, Text } from 'react-native'
import { BasicStyles, Color } from 'common';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faChevronRight, faChurch, faExclamationTriangle, faToggleOn, faToggleOff, faCreditCard, faChevronDown, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import Styles from './CardsWithIconStyle';
import { array } from 'yup';
import { color } from 'react-native-reanimated';

const height = Math.round(Dimensions.get('window').height)
class CardsWithIcon extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapse: false,
      days: [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    }
  }

  versionOne = () => {
    const { theme } = this.props.state;
    return (
      <View style={[Styles.cardContainer, { height: 90 }]}>
        <View style={{ width: '90%' }}>
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
        style={[Styles.cardContainer, { minHeight: 30 }]}>
        <View style={{
          width: '100%',
          flexDirection: 'row'
        }}>
          <View style={{ width: '90%' }}>
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
    let amount = null
    if (this.props.amount) {
      amount = this.props.amount.split(' ')[1]
    }
    console.log(amount);
    return (
      <TouchableOpacity
        style={{
          ...Styles.cardContainer,
          height: 80,
          ...this.props.style
        }}
        onPress={() => {
          if (this.props.redirect) {
            this.props.redirect()
          }
        }}
      >
        <View style={{
          width: '15%',
          justifyContent: 'center'
        }}>
          <FontAwesomeIcon
            icon={this.props.description === 'Direct Transfer' ? (this.props.amount !== null ? faChurch : faMapMarkerAlt) : faCreditCard}
            size={30}
            style={{ color: this.props.amount !== null ? Color.secondary : Color.danger }}
          />
        </View>
        <View style={{ width: '60%', justifyContent: 'center' }}>
          <Text style={{ fontFamily: 'Poppins-SemiBold' }}>{this.props.title}</Text>
          <Text style={{ fontSize: 13 }}>{this.props.date}</Text>
        </View>
        {this.props.amount !== null ?
          <View style={{
            width: '25%',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Text style={{
              color: amount && amount > 0 ? (theme ? theme.primary : Color.primary) : Color.danger,
              fontFamily: 'Poppins-SemiBold'
            }}>{this.props.amount}</Text>
          </View>
          :
          <View style={{
            position: 'absolute',
            right: 20,
            top: 20
          }}>
            <FontAwesomeIcon
              icon={faChevronDown}
              size={15}
              style={{ color: Color.gray }}
            />
          </View>}
      </TouchableOpacity>
    )
  }

  versionToggle = () => {
    const { theme } = this.props.state;
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.redirect()
        }}
        style={Styles.cardContainer}>
        <View style={{
          width: '100%',
          flexDirection: 'row'
        }}>
          <View style={{ width: '90%' }}>
            <Text style={{ fontFamily: 'Poppins-SemiBold' }}>{this.props.title}</Text>
            <Text style={{ fontSize: 13 }}>{this.props.description}</Text>
          </View>
          <TouchableOpacity style={{
            width: '10%',
            alignItems: 'center'
          }}
            onPress={() => {
              this.props.clickToggle(!this.props.flag)
            }}>
            <FontAwesomeIcon
              icon={this.props.flag ? faToggleOn : faToggleOff}
              size={25}
              style={{
                color: this.props.flag ? Color.primary : Color.danger
              }}
            />
          </TouchableOpacity>
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
        style={[Styles.cardContainer, { padding: 20 }]}>
        <View style={{
          width: '100%',
          flexDirection: 'row'
        }}>
          <View style={{ width: '100%' }}>
            <Text style={{ fontFamily: 'Poppins-SemiBold', color: theme ? theme.primary : Color.primary }}>{this.props.title}</Text>
            <Text style={{ fontSize: 13 }}>{this.props.description}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  versionSix = () => {
    const { theme } = this.props.state;
    const { item } = this.props;
    let sched = []
    if (item.schedule) {
      sched = JSON.parse(item.schedule)
    }
    return (
      <TouchableOpacity
        style={{
          ...Styles.cardContainer,
          height: !this.state.collapse ? 80 : null,
          flexDirection: 'column',
          ...this.props.style
        }}
        onPress={() => {
          console.log(item)
          this.setState({ collapse: !this.state.collapse })
        }}
      >
        <View style={{
          flexDirection: 'row'
        }}>
          <View style={{
            width: '15%',
            justifyContent: 'center'
          }}>
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              size={30}
              style={{ color: Color.danger }}
              onPress={() => {
                this.props.redirect()
              }}
            />
          </View>
          <View style={{ width: '60%', justifyContent: 'center' }}>
            <Text style={{ fontFamily: 'Poppins-SemiBold' }}>{this.props.title}</Text>
            <Text style={{ fontSize: 13 }}>{this.props.date}</Text>
          </View>
          <View style={{
            position: 'absolute',
            right: 20,
            top: 20
          }}>
            <FontAwesomeIcon
              icon={faChevronDown}
              size={15}
              style={{ color: Color.gray }}
            />
          </View>
        </View>
        {this.state.collapse &&
          <View style={{
            marginTop: 20
          }}>
            <Text style={{
              fontFamily: 'Poppins-SemiBold'
            }}>Mass Schedule/s:</Text>
            {sched.length > 0 && sched.map((item, index) => {
              if (item.schedule?.length > 0) {
                return (
                  <View>
                    <Text style={{
                      fontFamily: 'Poppins-SemiBold',
                      color: this.state.days[new Date().getDay()] == item.title ? Color.danger : null
                    }}>{item.title}</Text>
                    {item.schedule.map(i => (<View>
                      <Text>Language: {i.language}</Text>
                      <Text>Time: {i.startTime} - {i.endTime}</Text>
                      <Text>Name: {i.name}</Text>
                    </View>))}
                  </View>
                )
              }
            })}
          </View>
        }
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
        {version === 6 && this.versionSix()}
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