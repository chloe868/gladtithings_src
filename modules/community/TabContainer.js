import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Dimensions, Text, TextInput, Alert } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBan, faBell } from '@fortawesome/free-solid-svg-icons';
import { BasicStyles, Color, Routes } from 'common';
import { connect } from 'react-redux';
import Config from 'src/config.js';
import Api from 'services/api';
import UserImage from 'components/User/Image';
import ImageModal from 'components/Modal/ImageModal.js';


const height = Math.round(Dimensions.get('window').height);
const width = Math.round(Dimensions.get('window').width);

class Format extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reply: null,
      options: false,
      isImageModal: false
    }
  }
  renderHeader = (data, show) => {
    return (
      <View style={{
        ...BasicStyles.standardWidth,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: show ? 20 : 0,
      }}>
        <UserImage
          marginLeft={-2}
          user={data.user}
          size={35}
        />
        <View style={{
          paddingLeft: 5,
          justifyContent: 'space-between',
          flexDirection: 'row',
          width: '90%',
          alignItems: 'center'
        }}>
          <View>

            
            <Text style={{
              fontSize: BasicStyles.standardTitleFontSize,
              fontFamily: 'Poppins-SemiBold',
            }}> {data?.user?.username}</Text>
            <Text style={{
              fontSize: BasicStyles.standardFontSize
            }}> {data.date}
            </Text>
          </View>
         
        </View>
      </View>
    )
  }

  
  renderBody = (data) => {
    return (
      <View style={{
        ...BasicStyles.standardWidth,
        paddingTop: 20,
        paddingBottom: 25,
        flexDirection: 'row',
        justifyContent: 'flex-start',
      }}>
        <FontAwesomeIcon
          icon={data.icon}
          style={{
            marginRight: 10,
            marginLeft: 5
            
          }}
        />
        <Text style={{
          fontSize: BasicStyles.standardFontSize,
          
        }}>{data.message}</Text>
        
      </View>
    )
  }
  render() {
    const { data } = this.props;
    return (
      <View style={{
        ...BasicStyles.standardWidth,
        borderRadius: BasicStyles.standardBorderRadius,
        borderColor: Color.gray,
        borderWidth: .3,
        marginBottom: 10,
        marginTop: 10,
        backgroundColor: 'white'
      }}>

        {this.renderHeader(data, true)}
        {this.renderBody(data)}


      </View>
    )
  }

}



const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setComments: (comments) => dispatch(actions.setComments(comments)),
    setTempMembers: (tempMembers) => dispatch(actions.setTempMembers(tempMembers))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Format);
