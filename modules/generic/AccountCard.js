import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';;
import { Color, BasicStyles } from 'common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { connect } from 'react-redux';
import { faUser } from '@fortawesome/free-solid-svg-icons';

class AccountCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { profile, name, address } = this.props;
    const { theme } = this.props.state;
    return (
      <TouchableOpacity
        onPress={() => { console.log('hi') }}
        style={{ backgroundColor: Color.containerBackground }}
      >
        <View style={{
          flexDirection: 'row',
          height: 75,
          marginLeft: 20,
          marginRight: 20,
          marginTop: 10,
          marginBottom: 20
        }}>
          {profile ? <Image
            style={{
              width: 75,
              height: 75,
              borderRadius: 50,
              borderColor: theme ? theme.primary : Color.primary,
              borderWidth: 3,
              overflow: "hidden",
            }}
            source={{ uri: profile }}
          /> :
            <View style={{
              width: 75,
              height: 75,
              borderRadius: 50,
              borderColor: theme ? theme.primary : Color.primary,
              borderWidth: 3,
              overflow: "hidden",
              justifyContent: 'center',
              alignItems: 'center'
            }}><FontAwesomeIcon
                icon={faUser}
                size={53}
                color={theme ? theme.primary : Color.primary}
              /></View>
          }
          <View style={{
            flexDirection: 'row',
            marginLeft: 10
          }}>
            <View style={{ width: '70%' }}>
              <Text style={{ fontFamily: 'Poppins-SemiBold', }} numberOfLines={1}>{name}</Text>
              <Text style={{ fontFamily: 'Poppins-Italic' }}>{address}</Text>
              <Text style={{ color: 'gray', fontSize: 10 }}>similar connection(s)</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => this.storePeople(el)}
            style={{
              backgroundColor: theme ? theme.primary : Color.primary,
              width: 80,
              height: 30,
              backgroundColor: Color.primary,
              borderRadius: 25,
              alignItems: 'center',
              justifyContent: 'center',
              elevation: BasicStyles.elevation,
              position: 'absolute',
              right: 10
            }}
          >
            <Text style={{ color: 'white' }}>Action</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
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
  mapDispatchToProps)(AccountCard);