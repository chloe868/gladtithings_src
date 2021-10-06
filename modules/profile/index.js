import React, { Component } from 'react';
import { View, Image, Text, TouchableOpacity, TextInput, ScrollView, Alert, Dimensions } from 'react-native';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faMapMarkerAlt, faEnvelope, faMobileAlt, faUser, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import Style from './Style';
import CustomizedButton from 'modules/generic/CustomizedButton';
import { connect } from 'react-redux';
import Api from 'services/api/index.js';
import { Spinner, ImageUpload } from 'components';
import Config from 'src/config.js';
import InputFieldWithIcon from '../generic/InputFieldWithIcon';

const height = Math.round(Dimensions.get('window').height);

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: null,
      lastName: null,
      isLoading: false,
      id: null,
      isImageUpload: false,
      isEdit: false,
      cellularNumber: null,
      gender: null,
      address: null
    }
  }

  componentDidMount() {
    this.retrieve();
  }

  firstNameHandler = (value) => {
    this.setState({ firstName: value })
  }

  lastNameHandler = (value) => {
    this.setState({ lastName: value })
  }

  emailHandler = (value) => {
    this.setState({ email: value })
  }

  cellularNumberHandler = (value) => {
    this.setState({ cellularNumber: value })
  }

  addressHandler = (value) => {
    this.setState({ address: value })
  }

  genderHandler = (value) => {
    this.setState({ gender: value })
  }

  retrieve = () => {
    const { user } = this.props.state;
    if (user === null) {
      return
    }
    let parameter = {
      condition: [{
        value: user.id,
        clause: '=',
        column: 'account_id'
      }]
    }
    this.setState({ isLoading: true })
    Api.request(Routes.accountInformationRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        let data = response.data[0]
        console.log(data, '---');
        this.setState({
          id: data.id,
          firstName: data.first_name,
          lastName: data.last_name,
          email: user.email,
          cellularNumber: data.cellular_number,
          address: data.address,
          gender: data.sex
        })
      }
    });
  }

  updateAccount = () => {
    const { user } = this.props.state;
    if (this.state.email !== user.email && (this.state.password === '' || this.state.password === null)) {
      Alert.alert(
        "Opps",
        "Email not updated. Password needs to be changed too if you change your email.",
        [
          { text: "OK" }
        ],
        { cancelable: false }
      );
      return
    }
    if (this.state.password && (this.state.password.length < 6 || /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/.test(this.state.password) === false)) {
      Alert.alert(
        "Opps",
        "Passwords should be atleast 6 characters. It must be alphanumeric characters. It should contain 1 number, 1 special character and 1 capital letter.",
        [
          { text: "OK" }
        ],
        { cancelable: false }
      );
      return
    }
    if ((this.state.password !== null || this.state.confirmPassword !== null
      || this.state.password !== '' || this.state.confirmPassword !== '') && this.state.password !== this.state.confirmPassword) {
      Alert.alert(
        "Opps",
        "Passwords doesn't match.",
        [
          { text: "OK" }
        ],
        { cancelable: false }
      );
      return
    }
    if (this.state.password === null || this.state.confirmPassword === null
      || this.state.password === '' || this.state.confirmPassword === '') {
      return
    }
    let parameter = {
      id: user.id,
      code: user.code,
      username: user.username,
      email: this.state.email,
      password: this.state.password
    }
    this.setState({ isLoading: true })
    Api.request(Routes.accountUpdate, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data !== null) {
        Alert.alert(
          "",
          "Email and Password updated successfully!",
          [
            { text: "OK" }
          ],
          { cancelable: false }
        );
      }
      this.reloadProfile();
    }, error => {
      this.setState({ isLoading: false })
      console.log(error)
    });
  }

  update = () => {
    const { user } = this.props.state;
    console.log(this.validation(), user, '-----');
    if (user === null) {
      return
    }
    if (this.validation() === true) {
      Alert.alert(
        "Opps",
        "All fields are required!",
        [
          { text: "OK" }
        ],
        { cancelable: false }
      );
      return
    }
    let parameter = {
      id: this.state.id,
      account_id: user.id,
      first_name: this.state.firstName,
      middle_name: 'NULL',
      sex: this.state.gender,
      last_name: this.state.lastName,
      cellular_number: this.state.cellularNumber,
      address: this.state.address
    }
    // this.updateAccount();
    // if (user.account_information?.last_name === this.state.lastName && user.account_information?.first_name === this.state.firstName && this.state) {
    //   return
    // }

    this.setState({ isLoading: true })
    Api.request(Routes.accountInformationUpdate, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data !== null) {
        this.reloadProfile();
        Alert.alert(
          "",
          "Profile updated successfully!",
          [
            { text: "OK" }
          ],
          { cancelable: false }
        );
      }
    }, error => {
      console.log(error)
    });
  }

  reloadProfile = () => {
    const { user, token } = this.props.state;
    if (user == null) {
      return
    }
    let parameter = {
      condition: [{
        value: user.id,
        clause: '=',
        column: 'id'
      }]
    }
    this.setState({ isLoading: true })
    Api.request(Routes.accountRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      const { updateUser } = this.props;
      updateUser(response.data[0])
    }, error => {
      console.log(error)
    });
  }


  updateProfile = (url) => {
    const { user } = this.props.state;
    if (user == null) {
      return
    }
    let parameter = null;
    let route = null
    if (this.props.state.user?.account_profile?.url) {
      parameter = {
        id: this.props.state.user?.account_profile?.id,
        url: url
      }
      route = Routes.accountProfileUpdate;
    } else {
      parameter = {
        account_id: user.id,
        url: url
      }
      route = Routes.accountProfileCreate;
    }
    this.setState({ isLoading: true })
    Api.request(route, parameter, response => {
      this.setState({ isLoading: false })
      this.reloadProfile();
    }, error => {
      console.log(error)
    });
  }

  validation = () => {
    const { firstName, lastName, address, gender } = this.state;
    if (firstName === null || lastName === null ||
        firstName === '' || lastName === '' ||
        address === '' || address === null ||
        gender === '' || gender === null) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    const { user, theme } = this.props.state;
    const { firstName, lastName } = this.state;
    return (
      <View style={{backgroundColor: Color.containerBackground}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{
            backgroundColor: Color.containerBackground,
            marginBottom: 170,
            height: height * 1.5
          }}>
            <View style={[Style.TopView, { backgroundColor: theme ? theme.primary : Color.primary }]}>
              <TouchableOpacity
                style={{
                  height: 120,
                  width: 120,
                  borderRadius: 100,
                  borderColor: Color.primary,
                  borderWidth: 2,
                  marginTop: 15
                }}
                onPress={() => {
                  this.setState({ isImageUpload: true })
                }}>
                {
                  user.account_profile && user.account_profile.url ? (
                    <Image
                      source={user && user.account_profile && user.account_profile.url ? { uri: Config.BACKEND_URL + user.account_profile.url } : require('assets/logo.png')}
                      style={[BasicStyles.profileImageSize, {
                        height: '100%',
                        width: '100%',
                        borderRadius: 100
                      }]} />
                  ) : <FontAwesomeIcon
                    icon={faUserCircle}
                    size={130}
                    style={{
                      color: 'white'
                    }}
                  />
                }
              </TouchableOpacity>
              <Text style={{
                textAlign: 'center',
                fontFamily: 'Poppins-SemiBold',
                marginTop: 5
              }}>{firstName && lastName && firstName + ' ' + lastName}</Text>
              <Text style={{
                textAlign: 'center',
                marginBottom: 2,
                color: Color.white
              }}>@{user.email}</Text>
              <View style={Style.BottomView}>
                <FontAwesomeIcon style={{ marginRight: 5 }} icon={faCheckCircle} size={20} color={'#0066FF'} />
                <Text style={{
                  textAlign: 'center',
                  fontFamily: 'Poppins-SemiBold',
                  fontStyle: 'italic'
                }}>Verified</Text>
              </View>
            </View>
            <View style={{
              marginTop: 40,
              borderBottomWidth: 1,
              paddingLeft: 15,
              paddingBottom: 10,
              borderColor: Color.gray,
            }}>
              <Text
                style={{
                  fontFamily: 'Poppins-SemiBold',
                }}>
                Personal Information
              </Text>
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: 20,
                }}
                onPress={() => {
                  this.setState({ isEdit: !this.state.isEdit })
                }}>
                <Text style={{
                  color: this.state.isEdit ? Color.danger : theme ? theme.primary : Color.primary,
                  fontFamily: 'Poppins-SemiBold',
                }}>{this.state.isEdit ? 'Cancel' : 'Edit'}</Text>
              </TouchableOpacity>
            </View>
            {this.state.isEdit ? <View style={{
              paddingLeft: 20,
              paddingRight: 20,
              paddingBottom: 20,
              paddingTop: 5,
              textAlign: 'center',
              justifyContent: 'center'
            }}>
              <InputFieldWithIcon
                placeholder={this.state.firstName ? this.state.firstName : 'Enter First Name'}
                icon={faUser}
                label={'First Name'}
                onTyping={text => { this.firstNameHandler(text) }}
                profile={true}
                placeholderTextColor={this.state.firstName ? '#000' : '#999'}
              />
              <InputFieldWithIcon
                placeholder={this.state.lastName ? this.state.lastName : 'Enter Last Name'}
                icon={faUser}
                label={'Last Name'}
                profile={true}
                onTyping={text => { this.lastNameHandler(text) }}
              />
              <InputFieldWithIcon
                placeholder={this.state.gender ? this.state.gender : 'Enter Gender'}
                icon={faUser}
                label={'Gender'}
                profile={true}
                onTyping={text => { this.genderHandler(text) }}
              />
              <InputFieldWithIcon
                placeholder={this.state.cellularNumber ? this.state.cellularNumber : 'Enter Phone Number'}
                icon={faUser}
                label={'Phone Number'}
                profile={true}
                onTyping={text => { this.cellularNumberHandler(text) }}
              />
              <InputFieldWithIcon
                placeholder={this.state.address ? this.state.address : 'Enter Address'}
                icon={faMapMarkerAlt}
                label={'Address'}
                profile={true}
                onTyping={text => { this.addressHandler(text) }}
              />
            </View> :
              <View style={{
                padding: 25
              }}>
                <View style={{
                  flexDirection: 'row',
                  padding: 10
                }}>
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    size={20}
                    style={{
                      color: Color.black,
                      marginRight: 10
                    }}
                  />
                  <Text>{this.state.email || 'No email provided'}</Text>
                </View>
                <View style={{
                  flexDirection: 'row',
                  padding: 10
                }}>
                  <FontAwesomeIcon
                    icon={faMobileAlt}
                    size={20}
                    style={{
                      color: Color.black,
                      marginRight: 10
                    }}
                  />
                  <Text>{this.state.cellularNumber || 'No phone number provided'}</Text>
                </View>
                <View style={{
                  flexDirection: 'row',
                  padding: 10
                }}>
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    size={20}
                    style={{
                      color: Color.black,
                      marginRight: 10
                    }}
                  />
                  <Text>{this.state.address || 'No address provided'}</Text>
                </View>
                <View style={{
                  flexDirection: 'row',
                  padding: 10
                }}>
                  <FontAwesomeIcon
                    icon={faUser}
                    size={20}
                    style={{
                      color: Color.black,
                      marginRight: 10
                    }}
                  />
                  <Text>{this.state.gender || 'Gender'}</Text>
                </View>
              </View>}
          </View>
          {this.state.isImageUpload ?
            <ImageUpload
              visible={this.state.isImageUpload}
              onSelect={(url) => {
                this.setState({ isImageUpload: false, isLoading: false })
                this.updateProfile(url)
              }}
              onClose={() => {
                this.setState({ isImageUpload: false, isLoading: false })
              }} /> : null}
        </ScrollView>
        {this.state.isLoading ? <Spinner mode="overlay" /> : null}
        {this.state.isEdit && <View style={{
          bottom: 10,
          width: '90%'
        }}>
          <CustomizedButton onClick={() => { this.update() }} title={'Update'}></CustomizedButton>
        </View>}
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });


const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    updateUser: (user) => dispatch(actions.updateUser(user)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
