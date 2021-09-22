import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';;
import { Color, BasicStyles } from 'common';
import { Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import Button from '../generic/Button';
import Styles from './CardsWithImagesStyles';

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

class CardsWithImages extends Component {
  constructor(props) {
    super(props);
  }

  versionTwo = () => {
    const { theme } = this.props.state;
    return (
      <View style={Styles.container}>
        {this.props.data?.length > 0 && this.props.data.map((item, index) => (
          <TouchableOpacity style={{
            height: 200,
            width: '50%',
            padding: 10
          }}
            onPress={() => {
              if(this.props.redirect) {
                this.props.redirect()
              }
            }}
          >
            <View style={{
              height: '75%'
            }}>
              <Image
                source={require('assets/test.jpg')}
                style={Styles.image} />
            </View>
            <Text
              numberOfLines={1}
              style={
                {
                  color: theme ? theme.primary : Color.primary,
                  fontFamily: 'Poppins-SemiBold',
                  width: '85%',
                  marginTop: 7
                }
              }>{item.type}</Text>
            <Text
              numberOfLines={1}
              style={{
                width: '85%'
              }}>{item.date}</Text>
          </TouchableOpacity>
        ))}
      </View>
    )
  }

  versionOne = () => {
    const { theme } = this.props.state;
    return (
      <View style={Styles.container}>
        {this.props.data?.length > 0 && this.props.data.map((item, index) => (
          <TouchableOpacity style={Styles.view} onPress={() => {
            this.props.redirect()
            console.log('hi');
          }}>
            <View style={Styles.imageView}>
              <Image
                source={require('assets/test.jpg')}
                style={Styles.image} />
              <View style={Styles.textInImageView}>
                <Text style={[Styles.textInImage, { fontFamily: 'Poppins-SemiBold' }]}>{item.title}</Text>
                <Text style={Styles.textInImage}>{item.date}</Text>
              </View>
            </View>
            <View style={[Styles.bottomView, { height: '20%' }]}>
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                size={15}
                style={{
                  color: theme ? theme.secondary : Color.secondary
                }}
              />
              <Text
                numberOfLines={1}
                style={Styles.address}>{item.address}</Text>
            </View>
            <Button
              style={{
                width: '55%',
                height: 30,
                backgroundColor: this.props.buttonColor
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
                  }}>{this.props.buttonTitle}</Text>
                </View>
              }
              redirect={() => {
                this.props.buttonClick()
              }}
            />
          </TouchableOpacity>
        ))}
      </View>
    )
  }

  versionThree = () => {
    const { theme } = this.props.state;
    return (
      <View style={{
        width: width,
        padding: 10,
        height: height
      }}>
        {this.props.data?.length > 0 && this.props.data.map((item, index) => (
          <View style={{
            width: width,
            flexDirection: 'row',
            height: 220
          }}>
            <View style={{
              height: 220,
              width: '50%',
              padding: 10
            }}>
              <View style={Styles.imageView}>
                <Image
                  source={require('assets/test.jpg')}
                  style={Styles.image} />
              </View>
              <View style={{
                flexDirection: 'row',
                marginTop: 10
              }}>
                <Image
                  source={require('assets/test.jpg')}
                  style={{
                    height: 40,
                    width: '31%',
                    marginRight: '3%',
                    borderRadius: 5
                  }} />
                  <Image
                  source={require('assets/test.jpg')}
                  style={{
                    height: 40,
                    width: '31%',
                    marginRight: '3%',
                    borderRadius: 5
                  }} />
                  <Image
                  source={require('assets/test.jpg')}
                  style={{
                    height: 40,
                    width: '31%',
                    borderRadius: 5
                  }} />
              </View>
            </View>
            <View style={{
              height: 210,
              width: '50%',
              paddingRight: 10,
              paddingTop: 10,
              paddingBottom: 10
            }}>
              <Text style={{ fontFamily: 'Poppins-SemiBold' }}>{item.title}</Text>
              <View style={[
                Styles.bottomView, {
                  marginTop: 5,
                  marginBottom: 10
                }
              ]}>
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  size={15}
                  style={{
                    color: theme ? theme.secondary : Color.secondary
                  }}
                />
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 11,
                    width: '85%'
                  }}>{item.address}</Text>
              </View>
              <Button
                style={{
                  width: '55%',
                  height: 30,
                  backgroundColor: this.props.buttonColor
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
                    }}>{this.props.buttonTitle}</Text>
                  </View>
                }
                redirect={() => {
                  this.props.redirect()
                }}
              />
            </View>
          </View>
        ))}
      </View>
    )
  }

  render() {
    return (
      <View>
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
  return {
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps)(CardsWithImages);