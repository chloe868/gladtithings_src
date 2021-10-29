import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styles from './BalanceCardStyle';
import Currency from 'services/Currency';
import {connect} from 'react-redux';
import { Color } from 'common';

class BalanceCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { message } = this.props;
    const { theme } = this.props.state;
    return (
      <View
        style={[styles.CardContainer, {
          backgroundColor: theme ? theme.danger : Color.danger
        }]}>
        
        <Text style={{
          ...styles.AvailableBalanceTextStyle, 
          marginBottom: 25
        }}>
          {message}
        </Text>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({state: state});

const mapDispatchToProps = (dispatch) => {
  const {actions} = require('@redux');
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BalanceCard);
