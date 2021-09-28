import React, { Component } from 'react';
import { View, Image, Text, TouchableOpacity, TextInput, ScrollView, SafeAreaView, Dimensions, Alert } from 'react-native';
import { ListItem } from 'react-native-elements'
import { Routes, Color, Helper, BasicStyles } from 'common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faEdit, faUserCircle, faUser } from '@fortawesome/free-solid-svg-icons';
import Style from './Style';
import { connect } from 'react-redux';
import Config from 'src/config.js';
import _ from 'lodash';
import Api from 'services/api/index.js';
import { Spinner, Empty } from 'components';
const height = Math.round(Dimensions.get('window').height);
class ViewProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: null,
      phoneNumber: null,
      email: null,
      choice: 'SYNQT ACTIVITIES',
      isVisible: false,
      data: [],
      limit: 5,
      offset: 0,
      isLoading: false,
      ids: [],
      account: null,
    }
  }

  componentDidMount() {
    this.props.setDeepLinkRoute(null);
    this.setState({ choice: this.props.navigation.state?.params?.level === 1 ? 'SYNQT ACTIVITIES' : 'CONNECTIONS' });
  }

  choiceHandler = (value) => {
    this.setState({ choice: value })
  }

  fullNameHandler = (value) => {
    this.setState({ fullName: value })
  }

  phoneNumberHandler = (value) => {
    this.setState({ phoneNumber: value })
  }

  emailHandler = (value) => {
    this.setState({ email: value })
  }

  render() {
    let user = this.props.navigation.state?.params?.user
    const { theme } = this.props.state;
    return (
      <View style={{
        backgroundColor: Color.containerBackground,
        height: '100%'
      }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <View style={Style.TopView}>
              <TouchableOpacity>
                {user.account?.profile?.url ? <Image
                  style={[Style.circleImage, {
                    height: 180,
                    width: 180,
                    borderRadius: 100,
                    borderColor: theme ? theme.primary : Color.primary,
                    borderWidth: 2
                  }]}
                  // resizeMode="cover"
                  source={{ uri: Config.BACKEND_URL + user.account?.profile?.url }}
                />
                  :
                  <FontAwesomeIcon
                    icon={faUserCircle}
                    size={182}
                    style={{
                      color: theme ? theme.primary : Color.primary,
                      height: 180,
                      width: 180,
                      borderRadius: 100,
                      borderColor: theme ? theme.primary : Color.primary,
                      borderWidth: 2
                    }}
                  />
                }
              </TouchableOpacity>
            </View>
            <View style={Style.BottomView}>
              <FontAwesomeIcon
                icon={faCheckCircle}
                size={20}
                style={{ marginRight: 5 }}
                color={theme ? theme.primary : Color.primary} />
              <Text style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: 18
              }}>{user?.account?.information?.first_name ? user?.account?.information?.first_name + user?.account?.information?.last_name : user.name ? user.name : user?.account?.username}</Text>
            </View>
            {user?.account?.id?.toString() !== this.props.state.user?.id?.toString() && <View style={{
              width: '100%'
            }}>
            </View>}
          </View>
          {this.state.isLoading ? <Spinner mode="overlay" /> : null}
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setCurrentAccount: (acc) => dispatch(actions.setCurrentAccount(acc)),
    setDeepLinkRoute: (deepLinkRoute) => dispatch(actions.setDeepLinkRoute(deepLinkRoute))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps)(ViewProfile);