import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, Image, Platform } from 'react-native';
import { Color, BasicStyles, Routes } from 'common';
import Footer from 'modules/generic/Footer';
import { connect } from 'react-redux';
import IncrementButton from 'components/Form/Button';
import { faBell, faBan, faUsers, faPlus } from '@fortawesome/free-solid-svg-icons';
import {faChevronLeft, faShare, faCog} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Card from 'modules/community/Card'
import Api from 'services/api';
import _ from 'lodash';
import { Spinner } from 'components';
import Comments from 'src/components/Comments/index';
import RBSheet from 'react-native-raw-bottom-sheet';
import ImagePicker from 'react-native-image-picker';

const photoMenu = [{
  title: 'View Photo',
  route: 'view_photo',
  type: 'callback',
  icon: faChevronLeft
}, {
  title: 'Change Photo',
  route: 'change_photo',
  type: 'callback',
  icon: faCog
}];

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)



class Page extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef()
    this.state = {
      isLoading: false,
      data: [],
      image: null
    }
  }

  upload = () => {
    const { user } = this.props.state
    const options = {
      noData: true
    }
    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        this.setState({ photo: null })
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        this.setState({ photo: null })
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        this.setState({ photo: null })
      } else {
        ImageResizer.createResizedImage(response.uri, response.width * 0.5, response.height * 0.5, 'JPEG', 72, 0)
          .then(res => {

          })
          .catch(err => {
            // Oops, something went wrong. Check that the filename is correct and
            // inspect err to get more details.
            console.log('[ERROR]', err)
          });
      }
    })}


  imageOption(item){
    switch(item.title.toLowerCase()){
      case 'change photo': {
        this.upload()
        break
      }
      case 'view photo': {
        break
      }
    }
  }
  header() {
    const { theme } = this.props.state;
    return (
      <View style={{
        flexDirection: 'row',
        width: '100%',
        position: 'absolute',
        top: Platform.OS == 'ios' ? 40 : 0,
        left: 0,
        zIndex: 9999,
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        alignItems: 'center'
      }}>
        <TouchableOpacity onPress={() => {
          this.props.navigation.pop()
        }}>
          {/*Donute Button Image */}
          <FontAwesomeIcon
            icon={faChevronLeft}
            size={BasicStyles.headerBackIconSize}
            style={BasicStyles.iconStyle, {color: theme ? theme.primary : Color.primary}}
          />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => {
            this.props.navigation.navigate('pageSettingScreen', {
              data: this.props.navigation.state.params.data
            })
          }}>
          {/*Donute Button Image */}
          <FontAwesomeIcon
            icon={faCog}
            size={BasicStyles.headerBackIconSize}
            style={BasicStyles.iconStyle, {color: theme ? theme.primary : Color.primary}}
          />
        </TouchableOpacity>
      </View>
    );
  }

  pageImage(){
    const { theme } = this.props.state;
    const { params } = this.props.navigation.state;
    return (
      <View style={{
        marginBottom: 25
      }}>
        <TouchableOpacity style={{
          width: '100%'
        }}
        onPress={() => {
          this.setState({
            image: 'cover'
          })
          this.RBSheet.open()
        }}
        >
          <Image
            style={{
              width: width,
              height: height / 3
            }}

            source={require('assets/logo.png')}
            />
        </TouchableOpacity>

        <View style={{
          width: '90%',
          position: 'relative',
          marginTop: -50,
          marginLeft: '5%',
          marginRight: '5%',
          borderRadius: 20,
          padding: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: theme ? theme.primary : Color.primary
        }}
        
        >
          <TouchableOpacity
            onPress={() => {
              this.setState({
                image: 'profile'
              })
              this.RBSheet.open()
            }}>
            <Image
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                borderWidth: 0.5,
                borderColor: Color.secondary
              }}
              source={require('assets/iconlogo.png')}
            />
          </TouchableOpacity>
          {
            params.data && (
              <View style={{
                width: '90%',
                marginLeft: 10
              }}>
                <Text style={{
                  fontWeight: 'bold'
                }}>{params.data.title}</Text>
                <Text style={{
                  color: Color.white
                }}>{params.data.sub_title}</Text>
              </View>
            )
          }
          
        </View>
      </View>
    );
  }


  render() {
    const { theme } = this.props.state;
    const { isLoading } = this.state;
    const { params } = this.props.navigation.state;
    return (
      <View style={{
        height: height,
        backgroundColor: Color.containerBackground
      }}>
        {
          this.header()
        }
        <RBSheet
          ref={ref => {
            this.RBSheet = ref;
          }}
          closeOnDragDown={true}
          dragFromTopOnly={true}
          closeOnPressMask={false}
          height={height / 2}>
            {
              photoMenu && photoMenu.map(item => (
                <TouchableOpacity style={{
                  width: '100%',
                  paddingTop: 20,
                  paddingBottom: 20,
                  paddingRight: 20,
                  paddingLeft: 20,
                  borderBottomColor: Color.gray,
                  borderBottomWidth: 0.5
                }}
                onPress={() => {
                  this.imageOption(item)
                }}
                >
                  <View>
                    <Text>{item.title}</Text>
                  </View>
                </TouchableOpacity>
              ))
            }
        </RBSheet>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{
            minHeight: height * 1.5,
            width: '100%'
          }}>
            
            {
              this.pageImage()
            }

            <Comments withImages={true} payload={{
              payload: 'page',
              payload_value: params?.data?.id
            }}/>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux');
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);