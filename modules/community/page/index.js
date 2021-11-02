import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Color, BasicStyles, Routes } from 'common';
import Footer from 'modules/generic/Footer';
import { connect } from 'react-redux';
import PostCard from 'components/Comments/PostCard';
import IncrementButton from 'components/Form/Button';
import { faBell, faBan, faUsers, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Card from 'modules/community/Card'
import Api from 'services/api';
import _ from 'lodash';
import { Spinner } from 'components';


const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)



class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      data: []
    }
  }

  componentDidMount() {
  }

  retrieve = (flag) => {
    const { setComments } = this.props;
    let parameter = {
      limit: this.state.limit,
      offset: flag === true && this.state.offset > 0 ? (this.state.offset * this.state.limit) : this.state.offset,
      sort: {
        created_at: "desc"
      }
    }
    this.setState({ isLoading: true });
    Api.request(Routes.commentsRetrieve, parameter, response => {
      this.setState({ isLoading: false });
      if (response.data.length > 0) {
        this.setState({ offset: flag === false ? 1 : (this.state.offset + 1) })
        setComments(flag === false ? response.data : _.uniqBy([...this.props.state.comments, ...response.data], 'id'));
        console.log(this.props.state.comments);
      } else {
        this.setState({ offset: flag == false ? 0 : this.state.offset, })
        setComments(flag == false ? [] : this.props.state.comments);
      }
    })
  }

  header(){
    const { theme } = this.props.state;
    return (
      <View>
        <Image
          style={{
            width: width,
            height: height / 3
          }}

          source={require('assets/logo.png')}
          />

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
          <View style={{
            width: '90%',
            marginLeft: 10
          }}>
            <Text style={{
              fontWeight: 'bold'
            }}>Test</Text>
            <Text style={{
              color: Color.white
            }}>Test</Text>
          </View>
        </View>
      </View>
    );
  }


  render() {
    const { theme } = this.props.state;
    const { isLoading } = this.state;
    return (
      <View style={{
        height: height,
        backgroundColor: Color.containerBackground
      }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{
            minHeight: height * 1.5,
            width: '100%'
          }}>
            {
              this.header()
            }
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