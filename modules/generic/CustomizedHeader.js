import React, { Component } from 'react';
import { View, Image, Dimensions, Text } from 'react-native'
import { BasicStyles, Color } from 'common';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendarCheck, faChurch, faExclamationTriangle, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import Button from '../generic/Button.js'

const width = Math.round(Dimensions.get('window').width)

const height = Math.round(Dimensions.get('window').height)
class CustomizedHeader extends Component {
  constructor(props) {
    super(props)
  }

  versionOne = () => {
    const { theme } = this.props.state;
    const { text } = this.props;
    return (
      <View style={{
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Text style={{
          textAlign: 'center',
          padding: 10,
          fontSize: 13
        }}>
          Hi, Kennette Canales. How are you? {text}.
        </Text>
        <Button
          style={{
            width: '40%',
            height: 30,
            backgroundColor: theme ? theme.secondary : Color.secondary,
            marginTop: 10
          }}
          content={
            <View style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <Text style={{
                color: 'white',
                fontSize: 12,
                fontFamily: 'Poppins-SemiBold'
              }}>Find Church</Text>
            </View>
          }
          redirect={() => {
            this.props.redirect()
          }}
        />
      </View>
    )
  }

  versionTwo = () => {
    const { theme, language } = this.props.state;
    return (
      <View style={{
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
        flexDirection: 'row',
        marginTop: 10
      }}>
        <View style={{
          width: '50%',
          height: (height / 4) - 40
        }}>
          <Image
            source={require('assets/test.jpg')}
            style={{
              height: '100%',
              width: '100%',
              borderRadius: 10
            }}
          />
        </View>
        <View style={{
          width: '50%',
          paddingLeft: 15,
          paddingRight: 15
        }}>
          <Text style={{
            color: Color.white,
            fontFamily: 'Poppins-SemiBold'
          }}>Church 1</Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%'
          }}>
            <FontAwesomeIcon
              icon={faChurch}
              size={10}
              style={{ marginRight: 5 }}
            />
            <Text style={{
              fontFamily: 'Poppins-SemiBold'
            }}>$ 10.00 / Month</Text>
          </View>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%'
          }}>
            <FontAwesomeIcon
              icon={faCalendarCheck}
              size={10}
              style={{ marginRight: 5 }}
            />
            <Text
              style={{
                fontSize: 10,
                width: '90%',
                fontFamily: 'Poppins-SemiBold'
              }}>Next donation on August 16, 2021</Text>
          </View>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '85%'
          }}>
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              size={10}
              style={{ marginRight: 5 }}
            />
            <Text style={{
              fontSize: 10,
              fontFamily: 'Poppins-SemiBold'
            }}>Cebu</Text>
          </View>

          {!this.props.showButton && <Button
            style={{
              width: '80%',
              height: 35,
              backgroundColor: (this.props.buttonText != null || this.props.buttonText !== undefined) ? Color.danger : (theme ? theme.secondary : Color.secondary),
              marginTop: 10
            }}
            content={
              <View style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center'
              }}>
                <Text style={{
                  color: 'white',
                  fontSize: 12,
                  fontFamily: 'Poppins-SemiBold'
                }}>{(this.props.buttonText != null || this.props.buttonText !== undefined) ? 'Edit' : language.goToSubscription}</Text>
              </View>
            }
            redirect={() => {
              this.props.redirect()
            }}
          />}
        </View>
      </View>
    )
  }

  versionThree = () => {
    const { theme, language } = this.props.state;
    return (
      <View style={{
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
        flexDirection: 'row',
        paddingLeft: 25,
        paddingTop: 18
      }}>
        <View style={{
          width: '50%',
          height: (height / 4) - 40
        }}>
          <Image
            source={require('assets/test.jpg')}
            style={{
              height: '100%',
              width: '100%',
              borderRadius: 10
            }}
          />
        </View>
        <View style={{
          width: '50%',
          paddingLeft: 15,
          paddingRight: 15
        }}>
          <Text style={{
            color: Color.white,
            fontFamily: 'Poppins-SemiBold'
          }}>Church 1</Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%'
          }}>
            <FontAwesomeIcon
              icon={faChurch}
              size={10}
              style={{ marginRight: 5 }}
            />
            <Text style={{
              fontFamily: 'Poppins-SemiBold'
            }}>$ 10.00 / Month</Text>
          </View>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%'
          }}>
            <FontAwesomeIcon
              icon={faCalendarCheck}
              size={10}
              style={{ marginRight: 5 }}
            />
            <Text
              style={{
                fontSize: 10,
                width: '90%',
                fontFamily: 'Poppins-SemiBold'
              }}>Next donation on August 16, 2021</Text>
          </View>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '85%'
          }}>
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              size={10}
              style={{ marginRight: 5 }}
            />
            <Text style={{
              fontSize: 10,
              fontFamily: 'Poppins-SemiBold'
            }}>Cebu</Text>
          </View>

          {!this.props.showButton && <Button
            style={{
              width: '80%',
              height: 35,
              backgroundColor: theme ? theme.secondary : Color.secondary,
              marginTop: 10
            }}
            content={
              <View style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center'
              }}>
                <Text style={{
                  color: 'white',
                  fontSize: 12,
                  fontFamily: 'Poppins-SemiBold'
                }}>{language.goToSubscription}</Text>
              </View>
            }
            redirect={() => {
              this.props.redirect()
            }}
          />}
        </View>
      </View>
    )
  }

  render() {
    const { theme } = this.props.state;
    console.log('[>>>>>>>>>>>>>]', this.props.navigation)
    return (
      <View style={{
        height: height / 4,
        backgroundColor: this.props.version != 3 ? (theme ? theme.primary : Color.primary) : (Color.gray),
        borderBottomRightRadius: this.props.version != 3 ? 30 : 50,
        borderBottomLeftRadius: this.props.version != 3 ? 30 : 50,
        borderTopRightRadius: this.props.version != 3 ? 0 : 50,
        borderTopLeftRadius: this.props.version != 3 ? 0 : 50,
        paddingLeft: 15,
        paddingRight: 15,
        marginBottom: this.props.version != 3 ? 0 : 15
      }}>
        {this.props.version === 1 && this.versionOne()}
        {this.props.version === 2 && this.versionTwo()}
        {this.props.version === 3 && this.versionThree()}
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
  mapDispatchToProps)(CustomizedHeader);