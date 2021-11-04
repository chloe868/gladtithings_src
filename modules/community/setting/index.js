import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Color, BasicStyles, Routes } from 'common';
import Footer from 'modules/generic/Footer';
import { connect } from 'react-redux';
import IncrementButton from 'components/Form/Button';
import { faBell, faBan, faUsers, faPlus } from '@fortawesome/free-solid-svg-icons';
import {faChevronLeft, faShare, faCog} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Api from 'services/api';
import _ from 'lodash';
import { Spinner } from 'components';
import CardsWithIcon from 'modules/generic/CardsWithIcon';


const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

const menu = [{
  title: 'About',
  description: 'This is a test',
  route: null
}, {
  title: 'Page Roles',
  description: 'This is a test',
  route: null
}, {
  title: 'Members',
  description: 'This is a test',
  route: null
}]

class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    }
  }

  render() {
    const { theme, comments } = this.props.state;
    const { isLoading } = this.state;
    return (
      <View style={{
        height: height,
        backgroundColor: Color.containerBackground
      }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{
            minHeight: height * 1.5,
            width: '100%'
          }}>
            {
              menu.map((item) => (
                <CardsWithIcon
                  redirect={() => {
                    if(item.route === 'website') {
                      console.log('opening url')
                      Linking.openURL('https://app.gladtithings.com');
                    } else{
                      this.props.navigation.navigate(item.route, {
                        title: 'Success Page',
                        message: 'Transaction was successful',
                        payload: 'error'
                      })
                    }
                  }}
                  version={2}
                  title={item.title}
                  description={item.description}
                />
              ))
            }
          </View>
        </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(Setting);