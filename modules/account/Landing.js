import React, { Component } from 'react';
import Style from './Style.js';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { View, Image, Text, TouchableHighlight, ScrollView, Linking } from 'react-native';
import { Routes, Color, Helper, BasicStyles } from 'common';
import LinearGradient from 'react-native-linear-gradient'
import { Dimensions } from 'react-native';
import Button from '../generic/Button.js'
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
class Landing extends Component {
  constructor(props) {
    super(props);
  }

  onFocusFunction = async () => {
    /**
     * Executed each time we enter in this component &&
     * will be executed after going back to this component 
    */
    Linking.getInitialURL().then(url => {
      console.log(`from initial url ${url}, call navigate`)
      this.navigate(url);
    });
    Linking.addEventListener('url', this.handleOpenURL);
  }


  componentDidMount() {
    this.getTheme()
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.onFocusFunction()
    })
  }

  componentWillUnmount() { // C
    Linking.removeEventListener('url', this.handleOpenURL);
  }

  handleOpenURL = (event) => { // D
    this.navigate(event.url);
  }

  navigate = (url) => { // E
    const { navigate } = this.props.navigation;
    if(url !== null){
      const route = url.replace(/.*?:\/\//g, '');
      const routeName = route.split('/')[0];
      if (routeName === 'wearesynqt' && route.split('/')[1] === 'profile') {
        // navigate('orderPlacedStack')
        console.log('DEEP LINK ROUTE IS SET::::')
        const {setDeepLinkRoute} = this.props;
        setDeepLinkRoute(url);
      };
    }
  }

  getTheme = async () => {
    try {
      const primary = await AsyncStorage.getItem(Helper.APP_NAME + 'primary');
      const secondary = await AsyncStorage.getItem(Helper.APP_NAME + 'secondary');
      const tertiary = await AsyncStorage.getItem(Helper.APP_NAME + 'tertiary');
      const fourth = await AsyncStorage.getItem(Helper.APP_NAME + 'fourth');
      const gradient = await AsyncStorage.getItem(Helper.APP_NAME + 'gradient');
      if (primary != null && secondary != null && tertiary != null) {
        const { setTheme } = this.props;
        setTheme({
          primary: primary,
          secondary: secondary,
          tertiary: tertiary,
          fourth: fourth,
          gradient: JSON.parse(gradient)
        })
      }
    } catch (e) {
      console.log(e)
    }
  }

  render() {
    const { theme } = this.props.state;
    return (
      <LinearGradient
        colors={theme && theme.gradient !== undefined && theme.gradient !== null ? theme.gradient : Color.gradient}
        // colors={[theme ? theme.primary : Color.primary, theme ? theme.primary : Color.secondary, Color.primary]}
        locations={[0, 0.5, 1]} start={{ x: 2, y: 0 }} end={{ x: 1, y: 1 }}
        style={{height: '100%'}}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}>
          <View style={{
            height: height,
            flex: 1,
            alignItems: 'center',
          }}>
            <View style={{
              height: '40%',
              width: '100%',
              alignItems: 'center'
            }}>
              <Image source={require('assets/logo.png')} style={{
                flex: 1,
                width: '65%',
                height: '100%',
                resizeMode: 'contain',
              }}/>
            </View>
            <View style={{
              position: 'absolute',
              bottom: 10,
              alignItems: 'center'
            }}>
              <Button
              style={{
                width: '70%',
                height: 50,
                backgroundColor: theme ? theme.secondary : Color.secondary,
                marginBottom: '20%'
              }}
              content={
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ color: 'white', fontSize: 15 }}>Get Started</Text>
                </View>
              }
              redirect={() => this.props.navigation.navigate('registerStack')}
            />
                <Text style={{
                color: 'white',
                fontSize: BasicStyles.standardFontSize + 2
              }}>Already have an account?&nbsp;&nbsp;
                <Text
                  style={{
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: BasicStyles.standardFontSize + 2
                  }}
                  onPress={() => this.props.navigation.navigate('loginStack')}>
                  Sign In
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    );
  }
}
const mapStateToProps = state => ({ state: state });
const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setTheme: (theme) => dispatch(actions.setTheme(theme)),
    setDeepLinkRoute: (deepLinkRoute) => dispatch(actions.setDeepLinkRoute(deepLinkRoute))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps)(Landing);