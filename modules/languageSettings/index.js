import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, Image, TouchableOpacity } from 'react-native';
import { Color } from 'common';
import { connect } from 'react-redux';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import styles from './Style.js';
import { English, Spanish } from 'src/modules/locales';

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      languages: [
        {
          image: 'assets/united-states.png',
          title: 'English',
          language: 'english'
        },
        {
          image: 'assets/spain.png',
          title: 'Spanish',
          language: 'spanish'
        }
      ]
    }
  }

  changeLanguage = (item) => {
    const { setLanguage } = this.props;
    console.log(item.language)
    switch(item.language) {
      case 'english':
        setLanguage(English)
        break;
      case 'spanish':
        setLanguage(Spanish)
        break;
      default:
        break;
    }
  }

  render() {
    const { test, languages } = this.state;
    const { theme, language } = this.props.state;
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
            }}>{language.availabeLanguages}</Text>
            <Text style={{
              width: '85%'
            }}>{language.tapLanguage}</Text>
          </View>
          {
            languages.map((item, index) => {
              return (
                <TouchableOpacity
                  style={styles.Container}
                  key={index}
                  onPress={() => {
                    this.changeLanguage(item)
                  }}
                >
                  <View style={{
                    width: '18%'
                  }}>
                    <Image source={index === 0 ? require('assets/united-states.png') : require('assets/spain.png')} style={styles.ImageStyle} />
                  </View>
                  <View style={styles.ThemeTitleContainer}>
                    <Text style={styles.ThemeTitleTextStyle}>
                      {item.title}
                    </Text>
                  </View>
                  <View>
                    {language.lang == item.language && 
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        size={25}
                        style={{ color: theme ? theme.primary : Color.primary }}
                      />
                    }
                  </View>
                </TouchableOpacity>
              )
            })
          }
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });


const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setLanguage: (language) => dispatch(actions.setLanguage(language)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Transactions);