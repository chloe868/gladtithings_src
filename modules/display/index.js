import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { connect } from 'react-redux'
import { Color } from 'common'
import ThemeSettingTile from 'modules/display/ThemeSettingTile.js';
import Footer from 'modules/generic/Footer'
const height = Math.round(Dimensions.get('window').height);

class Display extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTile: 0,
    };
  }

  componentDidMount(){
    const { theme, language } = this.props.state;
    language.colorList.map((item, index) => {
      if(item.colors[0] === theme?.primary || item.colors[0] === Color.primary) {
        this.setState({selectedTile: index})
      }
    })
  }

  selectHandler = (index) => {
    const { language } = this.props.state;
    let _theme = language.colorList.[index].colors
    const {setTheme} = this.props;
    let temGrad = []
    if(_theme[0] === '#4CCBA6' || _theme[0] === '#000000'){
      temGrad =['#8ae6cc', '#2bb58d', '#0ead7f']
    }else if(_theme[0] === '#5842D7'){
      temGrad =['#584fff', '#5842D7', '#5842D7']
    }else{
      temGrad =['#9276E6', '#9276E6', '#5741D7']
    }
    setTheme({
      primary: _theme[0],
      secondary: _theme[1],
      tertiary: _theme[2],
      fourth: _theme[3],
      gradient: temGrad
    });
    console.log(_theme)
    this.setState({selectedTile: index});
  };
  

  displayThemeTiles = () => {
    const{ language } = this.props.state;
    return language.colorList.map((data, index) => {
      return (
        <ThemeSettingTile
          id={index}
          key={index}
          selectedTile={index === this.state.selectedTile ? true : false}
          onSelect={this.selectHandler}
          themeTitle={data.title}
          colors={data.details}
          circles={data.colors}
          theme = {this.props.state.theme}
        />
      );
    });
  };
  render() {
    console.log(this.props.navigation.state.routeName, 'test')
    return (
      <View style={{
        flex: 1,
        backgroundColor: Color.containerBackground,
        padding: 15
      }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            backgroundColor: Color.containerBackground
          }}
          >
          <View
          style={{
            flex: 1
          }}

          >
            {this.displayThemeTiles()}
          </View>
        </ScrollView>
      
      </View>
    )
  }
}

const mapStateToProps = state => ({state: state});

const mapDispatchToProps = dispatch => {
  const {actions} = require('@redux');
  return {
    setTheme: (theme) => dispatch(actions.setTheme(theme))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Display)