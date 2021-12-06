import React, { Component } from 'react';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { View, Dimensions, Text, ScrollView, Platform } from 'react-native';
import Style from './Style.js';
import { Spinner } from 'components';
import CustomError from 'components/Modal/Error.js';
import Api from 'services/api/index.js';
import { Routes, Color, Helper, BasicStyles } from 'common';
import Header from './Header';
import config from 'src/config';
import SystemVersion from 'services/System.js';
import LinearGradient from 'react-native-linear-gradient'
import PasswordInputWithIconLeft from 'components/InputField/PasswordWithIcon.js';
import TextInputWithIcon from 'components/InputField/TextInputWithIcon.js';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowRight, faUser } from '@fortawesome/free-solid-svg-icons';
import Button from '../generic/Button.js'
import { fcmService } from 'services/broadcasting/FCMService';
import { localNotificationService } from 'services/broadcasting/LocalNotificationService';
import NotificationsHandler from 'services/NotificationHandler';

const height = Math.round(Dimensions.get('window').height);
const width = Math.round(Dimensions.get('window').width);
class Login extends Component {
  //Screen1 Component
  constructor(props) {
    super(props);
    this.notificationHandler = React.createRef();
    this.state = {
      username: null,
      password: null,
      isLoading: false,
      token: null,
      error: 0,
      isResponseError: false,
      isOtpModal: false,
      blockedFlag: false,
      notifications: []
    };
    this.audio = null;
  }

  async componentDidMount() {
    this.setState({ error: 0 })
    this.getTheme()
    if (config.versionChecker == 'store') {
      // this.setState({isLoading: true})
      SystemVersion.checkVersion(response => {
        // this.setState({isLoading: false})
        console.log(response);
        if (response == true) {
          this.getData();
        }
      })
    } else {
      this.getData();
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

  redirect = (route) => {
    this.props.navigation.navigate(route);
  }

  retrieveUserData = (accountId) => {
    if (Helper.retrieveDataFlag == 1) {
      this.setState({ isLoading: false });
      const { setLayer } = this.props;
      setLayer(0)
      this.firebaseNotification()
    }
  }

  onRegister = () => {
    this.notificationHandler.onRegister();
  };

  onOpenNotification = (notify) => {
    this.notificationHandler.onOpenNotification(notify);
  };

  onNotification = (notify) => {
    this.notificationHandler.onNotification(notify);
  };

  firebaseNotification(){
    const { user } = this.props.state;
    if(user == null){
      return
    }
    fcmService.registerAppWithFCM()
    fcmService.register(this.onRegister, this.onNotification, this.onOpenNotification)
    localNotificationService.configure(this.onOpenNotification, Helper.APP_NAME)
    this.notificationHandler.setTopics()
    this.redirect('drawerStack')
    return () => {
      console.log("[App] unRegister")
      fcmService.unRegister()
      localNotificationService.unRegister()
    }
  }

  login = () => {
    console.log('STATE TOKEN', this.state.token);
    const { login } = this.props;
    if (this.state.token != null) {
      this.setState({ isLoading: true });
      Api.getAuthUser(this.state.token, (response) => {
        this.setState({ isLoading: false });
        login(response, this.state.token);
        let parameter = {
          condition: [{
            value: response.id,
            clause: '=',
            column: 'id'
          }]
        }
        Api.request(Routes.accountRetrieve, parameter, userInfo => {
          this.setState({ isLoading: false });
          if (userInfo.data.length > 0) {
            login(userInfo.data[0], this.state.token);
            this.retrieveUserData(userInfo.data[0].id)
          } else {
            login(null, null)
          }
        }, error => {
          console.log(error, 'login-account retrieve');
        })
      }, error => {
        console.log(error, 'login-authenticate');
        this.setState({ isResponseError: true })
      })
    }
  }

  getData = async () => {
    try {
      const temp = await AsyncStorage.getItem(Helper.APP_NAME + 'social');
      const token = await AsyncStorage.getItem(Helper.APP_NAME + 'token');
      console.log('======= get data', token);
      if (token != null) {
        this.setState({ token: token });
        this.login();
      }
    } catch (e) {
      // error reading value
    }
  }

  submit() {
    // this.props.navigation.navigate('drawerStack');
    const { username, password } = this.state;
    const { login } = this.props;
    if ((username != null && username != '') && (password != null && password != '')) {
      this.setState({ isLoading: true, error: 0 });
      Api.authenticate(username, password, (response) => {
        this.setState({ isLoading: false });
        if (response.error) {
          this.setState({ error: 2, isLoading: false });
        }
        if (response.token) {
          const token = response.token;
          Api.getAuthUser(response.token, (response) => {
            this.setState({ isLoading: false });
            login(response, token);
            let parameter = {
              condition: [{
                value: response.id,
                clause: '=',
                column: 'id'
              }]
            }
            console.log(Routes.accountRetrieve, parameter);
            Api.request(Routes.accountRetrieve, parameter, userInfo => {
              this.setState({ isLoading: false });
              if (userInfo.data.length > 0) {
                login(userInfo.data[0], token);
                this.retrieveUserData(userInfo.data[0].id)
              } else {
                this.setState({ error: 2 })
              }
            }, error => {
              console.log(error, 'ERROR');
              this.setState({
                isResponseError: true,
                isLoading: false
              })
            })

          }, error => {
            console.log(error, 'ERROR');
            this.setState({
              isResponseError: true,
              isLoading: false
            })
          })
        }
      }, error => {
        console.log('error', error)
        this.setState({
          isResponseError: true,
          isLoading: false
        })
      })
      // this.props.navigation.navigate('drawerStack');
    } else {
      this.setState({ error: 1 });
    }
  }

  render() {
    const { isLoading, error, isResponseError } = this.state;
    const { theme, language } = this.props.state;
    return (
      <LinearGradient
        colors={theme && theme.gradient !== undefined && theme.gradient !== null ? theme.gradient : Color.gradient}
        locations={[0, 0.5, 1]}
        start={{ x: 2, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ height: '100%' }}
      >
        <ScrollView
          style={Style.ScrollView}
          showsVerticalScrollIndicator={false}>
          <View style={{
            flex: 1,
            alignItems: 'center',
            paddingLeft: 20,
            paddingRight: 20,
            height: height * 1.5
          }}>
            <NotificationsHandler notificationHandler={ref => (this.notificationHandler = ref)} />
            <Header params={language.signIn}></Header>

            {error > 0 ? <View style={Style.messageContainer}>
              {error == 1 ? (
                <Text style={Style.messageText}>{language.fieldError}</Text>
              ) : null}

              {error == 2 ? (
                <Text style={Style.messageText}>{language.notMatchError}</Text>
              ) : null}

              {error == 3 ? (
                <Text style={Style.messageText}>{language.emailError}</Text>
              ) : null}
            </View> : null}

            <TextInputWithIcon
              onTyping={(username) => this.setState({ username })}
              value={this.state.email}
              placeholder={language.username}
              style={{ width: '90%', borderColor: 'white', color: 'black' }}
              icon={faUser}
            />

            <PasswordInputWithIconLeft
              onTyping={(input) => this.setState({
                password: input
              })}
              style={{ width: '80%', borderColor: 'white', color: 'black' }}
              placeholder={language.password}
            />

            <Text
              onPress={() => this.redirect('forgotPasswordStack')}
              style={{
                color: 'white',
                width: '100%',
                marginTop: 20,
                alignSelf: 'flex-end',
                textAlign: 'right'
              }}
            >{language.forgotPassword}</Text>

            <Button
              style={{
                width: '40%',
                height: 50,
                backgroundColor: theme ? theme.secondary : Color.secondary,
                alignSelf: 'flex-end',
                marginTop: 20
              }}
              content={
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ color: 'white', fontSize: 15 }}>{language.signIn}</Text>
                  <FontAwesomeIcon color={'white'} icon={faArrowRight} style={{ marginLeft: 10, marginTop: 1 }} />
                </View>
              }
              redirect={() => {
                this.submit()
                // this.props.navigation.navigate('drawerStack');
              }}
            />
            <View style={{
              width: '100%',
              alignItems: 'center',
              marginBottom: '10%',
              marginTop: '10%'
            }}>
              <Text style={{
                color: 'white',
                fontSize: BasicStyles.standardFontSize
              }}>{language.dontHaveAnAccount}&nbsp;&nbsp;
                <Text
                  style={{
                    fontFamily: 'Poppins-SemiBold'
                  }}
                  onPress={() => this.props.navigation.navigate('registerStack')}>
                  {language.signUp}
                </Text>
              </Text>
            </View>
          </View>
          {isResponseError ? <CustomError visible={isResponseError} onCLose={() => {
            this.setState({ isResponseError: false, isLoading: false })
          }} /> : null}
        </ScrollView>
          {isLoading ? <Spinner mode="overlay" /> : null}
      </LinearGradient>
    );
  }
}

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    login: (user, token) => dispatch(actions.login(user, token)),
    logout: () => dispatch(actions.logout()),
    setTheme: (theme) => dispatch(actions.setTheme(theme)),
    setLayer: (layer) => dispatch(actions.setLayer(layer)),
    setNotifications: (unread, notifications) => dispatch(actions.setNotifications(unread, notifications)),
    updateNotifications: (unread, notification) => dispatch(actions.updateNotifications(unread, notification)),
    setSearchParameter: (searchParameter) => dispatch(actions.setSearchParameter(searchParameter)),
    setSystemNotification: (systemNotification) => dispatch(actions.setSystemNotification(systemNotification)),
    setComments: (comments) => dispatch(actions.setComments(comments)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
