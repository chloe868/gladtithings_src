import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import {NavigationActions} from 'react-navigation';

const width = Math.round(Dimensions.get('window').width);
import { connect } from 'react-redux';
class NavigationDrawerStructureRight extends Component {
  constructor(props){
    super(props);
    this.state = {
      selected: null,
      address:[],
    }
  }
  goTo = (screen) => {
    if (this.props.state.user == null) {
      const proceedToLogin = NavigationActions.navigate({
        routeName: 'loginStack'
      });
      this.props.navigationProps.dispatch(proceedToLogin)
      return
    }
    this.props.navigationProps.navigate(screen)
  }

  navigateToScreen = (route) => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigationProps.dispatch(navigateAction);
  }
  
  render() {
    const { notifications, user, activeRoute } = this.props.state;
    const { theme, cart } = this.props.state
    return (
      <View style={{
        flexDirection: 'row',
        width: width - (width * .10),
       
      }}>
      </View>
    );
  }
}

const mapStateToProps = state => ({state: state});

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setActiveRoute: (route) => dispatch(actions.setActiveRoute(route))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
  )(NavigationDrawerStructureRight);