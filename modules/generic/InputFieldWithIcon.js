import React, { Component } from 'react';
import { View, Text, TextInput, TouchableHighlight} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-brands-svg-icons'
import { Color, BasicStyles } from 'common';
import { connect } from 'react-redux';
class TextInputWithIcon extends Component{
  
  constructor(props){
    super(props);
    this.state = {
      flag: false,
      input: null
    }
  }

  setInput(input){
    this.setState({
      input: input
    })
    this.props.onTyping(input)
  }

  render () {
    const { theme } = this.props.state;
    return (
      <View>
        {
          this.props.label && (
            <Text style={{
              ...this.props.labelStyle,
              fontFamily: this.props.profile ? 'Poppins-SemiBold' : 'normal',
              paddingTop: 20,
              paddingBottom: this.props.profile ? 10 : 20
            }}>{this.props.label} <Text style={{ color: 'red' }}>*</Text></Text>
          )
        }
        <View style={{
          flexDirection: 'row',
          ...BasicStyles.standardFormControl,
          ...this.props.style,
          alignItems: 'center'
          }}>
          <FontAwesomeIcon style={{
            marginLeft: 10,
            marginRight: 10
          }}
            icon={this.props.icon}
            size={20}
            color={Color.primary}
          />
          <TextInput
            onChangeText={(input) => this.setInput(input)}
            value={this.state.input}
            placeholder={this.props.placeholder}
            placeholderTextColor={'#d1d1d1'}
            editable={this.props.disable ? false : true}
            secureTextEntry={this.props.secureTextEntry ? this.props.secureTextEntry : false}
            style={{
              width: '100%'
            }}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({ state: state });
const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {};
}
export default connect(
  mapStateToProps,
  mapDispatchToProps)(TextInputWithIcon);