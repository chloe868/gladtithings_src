import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    View,
    Linking,
    Dimensions,
    Platform,
    Alert
} from 'react-native';
import { BasicStyles, Color, Routes } from 'common';
import Api from 'services/api/index.js';
import { connect } from 'react-redux';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { Spinner } from 'components';
import { RNCamera } from 'react-native-camera';
const height = Math.round(Dimensions.get('window').height);
class Scanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      camera: null,
      isLoading: false
    }
  }

  retrieve = (code) => {
    let parameter = {
      condition: [{
        value: code,
        clause: '=',
        column: 'code'
      }]
    }
    this.setState({ isLoading: true })
    Api.request(Routes.accountRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        let data = response.data[0]
        this.manageRedirect(data);
      } else {
        Alert.alert(
          "Message Alert",
          "Invalid Accessed",
          [
            { text: "OK", onPress: () => {
              this.props.navigation.pop()
            }}
          ]
        );
      }
    });
  }

  manageRedirect = (data) => {
    this.props.navigation.navigate('ewalletStack', {data: data});
  }
  onSuccess = e => {
    if(e.data) {
      let code = e.data
      this.retrieve(code);
    }
  };

  render() {
    return (
      <View style={{
        flex: 1
      }}>
        {
          Platform.OS == 'ios' && (
            <RNCamera
              ref={ref => {
                this.camera = ref;
              }}
              style={{
                flex: 1,
                width: '100%',
              }}
              onBarCodeRead={this.onSuccess}
            >
            </RNCamera>
          )
        }
        {
          Platform.OS == 'android' && (
             <QRCodeScanner
              onRead={this.onSuccess}
              showMarker
              containerStyle={{
                height: height,
                backgroundColor: Color.black
              }}
            />
          )
        }
        {this.state.isLoading ? <Spinner mode="overlay" /> : null}
      </View>
    );
  }
}

const mapStateToProps = state => ({ state: state });


const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Scanner);