import React, {Component} from 'react';
import {View, Dimensions } from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import Screen from './index';
import {connect} from 'react-redux';
import { Color } from 'common';
const width = Math.round(Dimensions.get('window').width)
class HeaderOptions extends Component {
  constructor(props) {
    super(props);
  }
  back = () => {
    this.props.navigationProps.pop();
  };
  render() {
    const { theme } = this.props.state;
    return (
      <View style={{flexDirection: 'row'}}>
        {/* <TouchableOpacity onPress={this.back.bind(this)}> */}
          {/*Donute Button Image */}
          {/* <FontAwesomeIcon
            icon={faChevronLeft}
            size={BasicStyles.headerBackIconSize}
            style={{color: theme ? theme.primary : Color.primary }}
          /> */}
        {/* </TouchableOpacity> */}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({state: state});

const mapDispatchToProps = (dispatch) => {
  const {actions} = require('@redux');
  return {
    logout: () => dispatch(actions.logout()),
  };
};

let HeaderOptionsConnect  = connect(mapStateToProps, mapDispatchToProps)(HeaderOptions);

const Stack = createStackNavigator({
  displayScreen: {
    screen: Screen,
    navigationOptions: ({navigation}) => ({
      title: navigation.state.params.title ? navigation.state.params.title : 'Page',
      drawerLabel: navigation.state.params.title ? navigation.state.params.title : 'Page',
      headerLeft: <HeaderOptionsConnect navigationProps={navigation} />,
      ...{
        headerStyle: {
          elevation: 0,
          backgroundColor: Color.containerBackground,
          height: 60,
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 18,
          width: width
        },
        headerTitleContainerStyle: {
          backgroundColor: Color.containerBackground,
          justifyContent: 'center',
          alignItems: 'center',
          width: '69%'
        },
        headerTitleStyle: {
          fontFamily: 'Poppins-SemiBold',
        },
      },
    }),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Stack);
