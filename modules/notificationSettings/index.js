import React, { Component } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { Color, Routes } from 'common';
import { connect } from 'react-redux';
import CardsWithIcon from '../generic/CardsWithIcon';
import Api from 'services/api/index.js';
import { Spinner } from 'components';

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

class NotificationSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: false,
      id: null
    }
  }

  componentDidMount() {
    this.retrieve();
  }
  
  update = (payload, value) => {
    const { data } = this.state;
    let parameter = {
      id: this.state.id,
      account_id: this.props.state.user.id,
      sms_login: data[3]?.value,
      sms_otp: data[2]?.value,
      email_login: data[0]?.value,
      email_otp:data[1]?.value,
      email_pin: 0
    }
    parameter[payload] = value ? 1 : 0
    this.setState({ isLoading: true })
    Api.request(Routes.notificationSettingsUpdate, parameter, response => {
      this.setState({ isLoading: false });
      this.retrieve();
    }, error => {
      this.setState({ isLoading: false });
    });
  }

  create = () => {
    const { user } = this.props.state;
    let parameter = {
      email_login: 0,
      email_otp: 0,
      sms_otp: 0,
      sms_login: 0,
      code: 0,
      account_id: user.id,
      email_pin: 0,
      devices: 0
    }
    this.setState({ isLoading: true })
    Api.request(Routes.notificationSettingsCreate, parameter, response => {
      this.setState({ isLoading: false });
      this.retrieve();
    }, error => {
      this.setState({ isLoading: false });
    });
  }

  retrieve = () => {
    const { user } = this.props.state;
    let parameter = {
      condition: [{
        value: user.id,
        clause: '=',
        column: 'account_id'
      }]
    }
    this.setState({ isLoading: true })
    Api.request(Routes.notificationSettingsRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        let data = []
        data.push({payload: 'email_login', value: response.data[0].email_login})
        data.push({payload: 'email_otp', value: response.data[0].email_otp})
        data.push({payload: 'sms_otp', value: response.data[0].sms_otp})
        data.push({payload: 'sms_login', value: response.data[0].sms_login})
        this.setState({
          data: data,
          id: response.data[0].id
        })
      } else {
        this.create()
      }
    }, error => {
      this.setState({isLoading: false})
    });
  }

  render() {
    const { language } = this.props.state;
    const { isLoading, data } = this.state;
    return (
      <View style={{
        height: height,
        backgroundColor: Color.containerBackground
      }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{
            paddingLeft: 20,
            paddingRight: 20,
            minHeight: height + (height * 0.5)
          }}>

          {
            language.notificationsOptions.map((item, index) => {
              return (
                <CardsWithIcon
                  redirect={() => {
                    console.log('test')
                  }}
                  clickToggle={(value) => { this.update(data[index]?.payload, value)}}
                  version={4}
                  title={item.title}
                  flag={data[index]?.value > 0}
                  description={item.description}
                />
              )
            })
          }
          </View>
        </ScrollView>
        {isLoading ? <Spinner mode="overlay" /> : null}
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

export default connect(
  mapStateToProps
)(NotificationSettings);