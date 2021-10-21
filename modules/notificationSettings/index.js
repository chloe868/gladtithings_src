import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { Color } from 'common';
import Footer from 'modules/generic/Footer';
import { connect } from 'react-redux';
import CardsWithIcon from '../generic/CardsWithIcon';
import InputFieldWithIcon from '../generic/InputFieldWithIcon';
import { faUser, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import IncrementButton from 'components/Form/Button';

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

class NotificationSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    const { language } = this.props.state;
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
                  version={4}
                  title={item.title}
                  flag={item.flag}
                  description={item.description}
                />
              )
            })
          }
          </View>
          
        </ScrollView>

      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

export default connect(
  mapStateToProps
)(NotificationSettings);