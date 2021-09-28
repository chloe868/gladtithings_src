import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { BasicStyles, Color } from 'common';
import styles from 'modules/display/Styles.js';
import ColorCircle from 'modules/display/ColorCircle';
import { connect } from 'react-redux';

class ThemeSettingTile extends Component {
  constructor(props) {
    super(props);
  }

  displayColorCirles = () => {
    return this.props.circles.map((color, index) => {
      return (
        <View style={styles.ColorContainer} key={index}>
          <ColorCircle color={color} />
        </View>
      );
    });
  };

  render() {
    const { theme } = this.props.state;
    return (
      <TouchableOpacity
        style={styles.SettingTileContainer}
        onPress={() => {
          this.props.onSelect(this.props.id);
        }}>
        <View style={styles.ThemeDetailsContainer}>
          <View style={styles.ThemeTitleContainer}>
            <Text style={[styles.ThemeTitleTextStyle, {
              fontSize: BasicStyles.standardFontSize
            }]}>
              {this.props.themeTitle}
            </Text>
          </View>
          {/* <View style={styles.ThemeColorsContainer}>
            <Text style={[
              styles.ThemeColorsTextStyle, { fontSize: BasicStyles.standardFontSize }]}>{this.props.colors}</Text>
          </View> */}
          <View style={styles.ColorsContainer}>
            {this.displayColorCirles()}
          </View>
        </View>
        <View style={styles.IconContainer}>
          <FontAwesomeIcon
            icon={faCheckCircle}
            size={25}
            style={{ color: this.props.selectedTile ? (theme ? theme.primary : Color.primary ) : Color.danger }}
          />
        </View>
      </TouchableOpacity>
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
  mapDispatchToProps)(ThemeSettingTile);