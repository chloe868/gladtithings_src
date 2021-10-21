import React, { Component } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { Color } from 'common';
import { connect } from 'react-redux';
import CardsWithIcon from '../generic/CardsWithIcon';

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state={
      input: null
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
              language.settingsOptions.map((item, index) => {
                return (
                  <CardsWithIcon
                    redirect={() => {
                      if(item.route !== 'pageMessageStack'){
                        this.props.navigation.navigate(item.route)
                      }else{
                        this.props.navigation.navigate(item.route, {
                          title: 'Success Page',
                          message: 'Transaction was successful',
                          payload: 'error'
                        })
                      }
                    }}
                    version={2}
                    title={item.title}
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
)(Settings);
