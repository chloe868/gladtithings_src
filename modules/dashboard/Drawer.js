import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Dimensions, TextInput } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Color, BasicStyles } from 'common';
import { connect } from 'react-redux';
import Dashboard from './index.js';

const width = Math.round(Dimensions.get('window').width)

class HeaderOptions extends Component {
  constructor(props) {
    super(props);
  }
  back = () => {
    this.props.navigationProps.navigate('drawerStack');
  };

  render() {
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

const dashboardStack = createStackNavigator({
  churchesScreen: {
    screen: Dashboard,
    navigationOptions: ({ navigation }) => ({
      title: '',
      headerLeft: <HeaderOptionsConnect navigationProps={navigation} />,
      ...BasicStyles.headerDrawerStyle
    }),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(dashboardStack);
