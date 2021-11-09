import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native';
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
import BottomSheetOptions  from 'src/components/BottomSheet/index';

const coverPhotoMenu = [{
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

const profilePhotoMenu = [{
  title: 'View Photo',
  route: 'view_photo',
  type: 'callback',
  icon: faCog
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
      menuData: null
    }
  }

  header() {
    const { theme } = this.props.state;
    return (
      <View style={{
        flexDirection: 'row',
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 999,
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
            menuData: coverPhotoMenu
          })
          this.myRef.current.openBottomSheet()
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
        }}>
          <Image
            style={{
              width: 50,
              height: 50
            }}
            source={require('assets/iconlogo.png')}
          />
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
    const { isLoading, menuData } = this.state;
    return (
      <View style={{
        height: height,
        backgroundColor: Color.containerBackground
      }}>
        {
          this.header()
        }
        <BottomSheetOptions
          data={menuData}
          ref={this.myRef}
        ></BottomSheetOptions>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{
            minHeight: height * 1.5,
            width: '100%'
          }}>
            
            {
              this.pageImage()
            }

            <Comments withImages={true}/>
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