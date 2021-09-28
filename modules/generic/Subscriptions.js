import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Currency from 'services/Currency';
import { connect } from 'react-redux';
import { Color, BasicStyles } from 'common';
import Skeleton from 'components/Loading/Skeleton';
import Button from 'components/Form/Button';
import { faHandshake, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

class Subscriptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    }
  }

  render() {
    const { data } = this.props;
    const { theme, user } = this.props.state;
    return (
      <View style={{
        paddingTop: this.props.paddingTop ? this.props.paddingTop : 0,
        width: '100%'
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
          marginBottom: 10
        }}>
          <Text style={{
            fontFamily: 'Poppins-SemiBold',
            color: Color.primary
          }}>Subscriptions</Text>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('subscriptionStack')
            }}
          >
            <Text style={{
              fontFamily: 'Poppins-SemiBold',
            }}>{'View more >>>'}</Text>

          </TouchableOpacity>
          {this.state.isLoading ? <Spinner mode="overlay" /> : null}
        </View>
        <View
          style={{
            width: '100%',
            borderRadius: 12,
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 15,
            paddingBottom: 15,
            backgroundColor: Color.gray
          }}>
          <View style={{
            width: '100%',
            flexDirection: 'row',
          }}>
            <View style={{
              width: '100%'
            }}>
              <Text style={{
                fontSize: BasicStyles.standardFontSize,
                textAlign: 'justify',
                paddingBottom: 10
              }}>
                Hassle free tithings. Just set the amount, church and time then we will do it for you.
              </Text>
              <View style={{
                width: '100%',
              }}>
                <Button
                  title={'Go to Subscriptions'}
                  onClick={() => {
                    this.props.navigation.navigate('subscriptionStack')
                  }}
                  style={{
                    width: '50%',
                    backgroundColor: Color.primary,
                    height: 40
                  }}
                  textStyle={{
                    fontSize: BasicStyles.standardFontSize,
                    color: Color.white,
                    fontFamily: 'Poppins-SemiBold'
                  }}
                />
              </View>
            </View>
          </View>
        </View>

      </View>
    );
  }
}

const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux');
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Subscriptions);

