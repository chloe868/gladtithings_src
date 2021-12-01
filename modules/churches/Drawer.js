import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Dimensions, TextInput } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Color, BasicStyles, Routes } from 'common';
import { connect } from 'react-redux';
import Api from 'services/api/index.js';
import Churches from './index.js';

const width = Math.round(Dimensions.get('window').width)

class HeaderOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSearch: false
    }
  }
  back = () => {
    this.props.navigationProps.pop()
  };

  render() {
    const { language, searchChurch } = this.props.state;
    const { showSearch } = this.state;
    const { setSearchChurch } = this.props;
    return (
      <View style={{ flexDirection: 'row', width: width }}>
        <TouchableOpacity onPress={this.back.bind(this)}>
          {/*Donute Button Image */}
          <FontAwesomeIcon
            icon={faChevronLeft}
            size={BasicStyles.headerBackIconSize}
            style={{
              color: Color.gray,
              marginTop: 2
            }}
          />
        </TouchableOpacity>
        {showSearch ?
          <View style={{
            borderWidth: 1,
            height: 35,
            width: width - 110,
            marginLeft: 25,
            marginRight: 25,
            borderRadius: 20,
            borderColor: Color.gray,
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <FontAwesomeIcon
              icon={faSearch}
              size={20}
              style={{
                color: Color.gray,
                marginRight: 10,
                marginLeft: 10
              }}
            />
            <TextInput
              style={{
                height: 35,
                width: '100%'
              }}
              onChangeText={(text) => setSearchChurch(text)}
              value={searchChurch}
              placeholder={language.search}
            />
          </View> :
          <View style={{
            height: 35,
            width: width - 110,
            marginLeft: 25,
            marginRight: 25,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Poppins-SemiBold'
              }}
            >{language.churchesNearby}</Text>
          </View>
        }
        <View style={{
          flexDirection: 'row',
          marginTop: 2,
          right: 10,
          position: 'absolute'
        }}>
          {!showSearch && <TouchableOpacity
            style={{marginRight: 10}}
            onPress={() => { this.setState({showSearch: true}) }}
          >
            <FontAwesomeIcon
              icon={faSearch}
              size={BasicStyles.headerBackIconSize - 5}
              style={{color: Color.gray}}
            />
          </TouchableOpacity>}
          <TouchableOpacity>
            <FontAwesomeIcon
              icon={faFilter}
              size={BasicStyles.headerBackIconSize - 5}
              style={{color: Color.gray}}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux');
  return {
    logout: () => dispatch(actions.logout()),
    setSearchChurch: (searchChurch) => dispatch(actions.setSearchChurch(searchChurch)),
  };
};

let HeaderOptionsConnect = connect(mapStateToProps, mapDispatchToProps)(HeaderOptions);

const churchesStack = createStackNavigator({
  churchesScreen: {
    screen: Churches,
    navigationOptions: ({ navigation }) => ({
      title: '',
      headerLeft: <HeaderOptionsConnect navigationProps={navigation} />,
      ...BasicStyles.headerDrawerStyle
    }),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(churchesStack);
