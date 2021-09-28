import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import { Color } from 'common';
import { connect } from 'react-redux';
import { NavigationActions, StackActions } from 'react-navigation';
import Message from 'modules/generic/DataMessages';
import { faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

class MessagePage extends Component {
  constructor(props) {
    super(props);
  }

  navigateToScreen = (route) => {
    
    this.props.navigation.toggleDrawer();
    const navigateAction = NavigationActions.navigate({
      routeName: 'drawerStack',
      action: StackActions.reset({
        index: 0,
        key: null,
        actions: [
          NavigationActions.navigate({
            routeName: route,
            params: {
              initialRouteName: route,
              index: 0
            }
          }),
        ]
      })
    });
    this.props.navigation.dispatch(navigateAction);
  }

  render() {
    const { user, theme } = this.props.state;
    const { message } = this.props.navigation?.state?.params
    return (
      <View style={{
        height: height,
        backgroundColor: Color.containerBackground,
      }}>
        <Message
          style={{
            marginTop: '20%'
          }}
          iconColor={message !== 'Error Message' ? theme ? theme.primary : Color.primary : Color.danger}
          icon={message === 'Error Message' ? faExclamationTriangle : faCheckCircle}
          message={message === 'Error Message' ? 'There was an error in your transaction.' : 'Transaction was successful.'}
          buttonTitle={'Go to Dashboard'}
          redirect={() => {this.navigateToScreen('Homepage')}}
        />
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

export default connect(
  mapStateToProps
)(MessagePage);
