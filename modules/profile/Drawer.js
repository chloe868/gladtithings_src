import React, {Component} from 'react';
import {View, TouchableOpacity, Text, Dimensions} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import Profile from 'modules/profile/index';
import {BasicStyles, Color} from 'common';
import {connect} from 'react-redux';
const width = Math.round(Dimensions.get('window').width);
class HeaderOptions extends Component {
  constructor(props) {
    super(props);
  }
  back = () => {
    this.props.navigationProps.pop()
  };
  render() {
    const { theme, language } = this.props.state;
    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: width}}
      >
        <TouchableOpacity
          onPress={this.back.bind(this)}
          style={{
            position: 'absolute',
            left: 0
          }}
        >
          <FontAwesomeIcon
            icon={faChevronLeft}
            size={BasicStyles.headerBackIconSize}
            style={{ color: theme ? theme.primary : Color.primary }}
          />
        </TouchableOpacity>
        <Text style={{
          fontFamily: 'Poppins-SemiBold',
          fontSize: 20
        }}>{language.profile}</Text>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({state: state});

const mapDispatchToProps = (dispatch) => {
  const {actions} = require('@redux');
  return {};
};
let HeaderOptionsConnect  = connect(mapStateToProps, mapDispatchToProps)(HeaderOptions);

const ProfileStack = createStackNavigator({
  profileScreen: {
    screen: Profile,
    navigationOptions: ({navigation}) => ({
      title: '',
      headerLeft: <HeaderOptionsConnect navigationProps={navigation} />,
      ...BasicStyles.drawerHeader1
    }),
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileStack);
