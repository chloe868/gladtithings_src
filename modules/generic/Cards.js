import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';;
import { Color, BasicStyles } from 'common';
import { Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMoneyCheck } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import Button from '../generic/Button';

const width = Math.round(Dimensions.get('window').width)

class Cards extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { data } = this.props;
    return (
      <View style={{
        flexDirection: 'row',
        borderWidth: 1,
        marginBottom: 10,
        borderRadius: 20,
        borderColor: Color.gray,
        height: 130,
        padding: 20,
        backgroundColor: Color.white
      }}>
        <View style={{
          width: '50%',
          height: '100%',
        }}>
          <Text style={{
            fontFamily: 'Poppins-SemiBold'
          }}>{data.username}</Text>

          <View style={{
            flexDirection: 'row'
          }}>
            <FontAwesomeIcon
              icon={faMoneyCheck}
              size={20}
              style={{
                color: Color.black,
                marginRight: 10
              }}
            />
            <Text>{data.payment_method}</Text>
          </View>

          <TouchableOpacity style={{
            borderRadius: BasicStyles.buttonBorderRadius,
            width: '60%',
            marginTop: 10,
            alignSelf: 'flex-start', backgroundColor: 'red'
          }}
            underlayColor={Color.gray}
          >
            <Button
              style={{
                width: '100%',
                height: 30,
                backgroundColor: Color.danger
              }}
              content={
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ color: 'white', fontSize: 12 }}>Remove</Text>
                </View>
              }
              redirect={() => {
                console.log('hi')
              }}
            />
          </TouchableOpacity>
        </View>
        <View style={{
          width: '50%',
          height: '100%'
        }}>
          <Text style={{
            alignSelf: 'flex-end'
          }}>{data.status}</Text>
        </View>
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
  mapDispatchToProps)(Cards);