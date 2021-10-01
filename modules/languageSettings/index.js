import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, Image } from 'react-native';
import { Color } from 'common';
import { connect } from 'react-redux';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import styles from './Style.js';

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: [
        {
          image: 'assets/united-states.png',
          language: 'English',
          enable: true
        },
        {
          image: 'assets/spain.png',
          language: 'Spanish',
          enable: false
        }
      ]
    }
  }


  render() {
    const { test, language } = this.state;
    const { theme } = this.props.state;
    return (
      <View style={{
        paddingLeft: 20,
        paddingRight: 20,
        height: height,
        backgroundColor: Color.containerBackground
      }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{
            justifyContent: 'center'
          }}>
            <Text style={{
              fontFamily: 'Poppins-SemiBold',
              textAlign: 'left',
              paddingTop: 2
            }}>Available Languages</Text>
            <Text style={{
              width: '85%'
            }}>Top the language you want to use.</Text>
          </View>
          {
            language.map((item, index) => {
              return (
                <View style={styles.Container} key={index}>
                  <View style={{
                    width: '18%'
                  }}>
                    <Image source={index === 0 ? require('assets/united-states.png') : require('assets/spain.png')} style={styles.ImageStyle} />
                  </View>
                  <View style={styles.ThemeTitleContainer}>
                    <Text style={styles.ThemeTitleTextStyle}>
                      {item.language}
                    </Text>
                  </View>
                  <View style={styles.IconContainer}>
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      size={25}
                      style={{ color: Color.danger }}
                    />
                  </View>
                </View>
              )
            })
          }
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

export default connect(
  mapStateToProps
)(Transactions);