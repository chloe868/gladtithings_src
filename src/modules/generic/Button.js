import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Dimensions, Text, TextInput } from 'react-native'
import { BasicStyles, Color } from 'common';
import { connect } from 'react-redux';

class Button extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    const { theme } = this.props.state;
    return (
      <View>
        <TouchableOpacity style={[
          this.props.styles, {
          padding: 10,
          paddingLeft: 40,
          paddingRight: 40,
          borderRadius: 50,
          backgroundColor: theme ? theme.secondary : Color.secondary
        }]} onPress={() => this.props.redirect()} underlayColor={Color.gray}>
            {this.props.content}
        </TouchableOpacity>
      </View>
    )
  }
}

const mapStateToProps = state => ({ state: state });
const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {};
}
export default connect(
  mapStateToProps,
  mapDispatchToProps)(Button);