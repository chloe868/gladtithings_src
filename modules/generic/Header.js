import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Dimensions, SafeAreaView, TextInput } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAlignLeft, faBars, faChevronLeft, faClock, faHistory, faShoppingBag, faStar, faEdit, faQrcode, faCamera } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { NavigationActions, StackActions } from 'react-navigation';
import { BasicStyles, Color } from 'common';
const width = Math.round(Dimensions.get('window').width)

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: null
    }
  }

  searchHandler = (value) => {
    this.setState({ search: value });
  }

  navigateToScreen = (route, message) => {

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
              index: 0,
              message: message
            }
          }),
        ]
      })
    });
    this.props.navigation.dispatch(navigateAction);
  }

  back = () => {
    this.props.navigationProps.pop();
  };
  render() {
    const { routeName } = this.props.navigation.state;
    const { theme } = this.props.state;
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: width,
          backgroundColor: this.props.navigation.state.routeName === 'Homepage' ? theme ? theme.primary : Color.primary : Color.containerBackground,
          height: 60,
          padding: 5
        }}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            left: 10
          }}
          onPress={() => {
            this.props.navigation.toggleDrawer()
          }}
        >
          <FontAwesomeIcon
            icon={faAlignLeft}
            size={BasicStyles.iconSize}
            style={[
              BasicStyles.iconStyle,
              {
                color: Color.gray
              },
            ]}
          />
        </TouchableOpacity>

        {routeName === 'Homepage' && <Text style={{
          color: Color.white,
          fontFamily: 'Poppins-SemiBold'
        }}>Welcome Kennette!</Text>}

        {routeName === 'Dashboard' &&
          <TouchableOpacity
            onPress={() => {
              // this.navigateToScreen('MessagePage', 'Success Message')
              // this.props.setQRCodeModal(true);
              this.props.navigation.navigate('qrCodeScannerStack');
            }}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: 50,
              width: 50,
              position: 'absolute',
              right: 1,
              elevation: BasicStyles.elevation
            }}
          >
            <FontAwesomeIcon
              icon={faQrcode}
              size={BasicStyles.iconSize}
              style={[
                BasicStyles.iconStyle,
                {
                  color: Color.black,
                },
              ]}
            />
          </TouchableOpacity>
        }
      </View>
    );
  }
}

const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux');
  return {
    logout: () => dispatch(actions.logout()),
    setStatusSearch: (statusSearch) => dispatch(actions.setStatusSearch(statusSearch)),
    setCreateStatus: (createStatus) => dispatch(actions.setCreateStatus(createStatus)),
    setQRCodeModal: (isVisible) => dispatch(actions.setQRCodeModal({ isVisible: isVisible }))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
