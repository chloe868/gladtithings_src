import React, { Component } from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import Screen from 'modules/payments';
import { BasicStyles, Color } from 'common';
import { connect } from 'react-redux';

const width = Math.round(Dimensions.get('window').width)

class HeaderOptions extends Component {
  constructor(props) {
    super(props);
  }
  back = () => {
    this.props.navigationProps.pop()
  };
  render() {
    const { theme } = this.props.state;
    return (
      <View>
        <TouchableOpacity onPress={this.back.bind(this)}>
          {/*Donute Button Image */}
          <FontAwesomeIcon
            icon={faChevronLeft}
            size={BasicStyles.headerBackIconSize}
            style={BasicStyles.iconStyle, { color: Color.primary }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux');
  return {};
};
let HeaderOptionsConnect = connect(mapStateToProps, mapDispatchToProps)(HeaderOptions);

const subscriptionStack = createStackNavigator({
  subscriptionScreen: {
    screen: Screen,
    navigationOptions: ({ navigation }) => ({
      title: 'Authorized Payments',
      headerLeft: <HeaderOptionsConnect navigationProps={navigation} />,
      ...BasicStyles.headerDrawerStyle
    }),
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(subscriptionStack);
