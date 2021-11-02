import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Color, BasicStyles, Routes } from 'common';
import Footer from 'modules/generic/Footer';
import { connect } from 'react-redux';
import IncrementButton from 'components/Form/Button';
import { faBell, faBan, faUsers, faPlus } from '@fortawesome/free-solid-svg-icons';
import {faChevronLeft, faShare} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Card from 'modules/community/Card'
import Api from 'services/api';
import _ from 'lodash';
import { Spinner } from 'components';
import PostCard from 'components/Comments/PostCard';


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
    this.retrieve(false)
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
            // share
          }}>
          {/*Donute Button Image */}
          <FontAwesomeIcon
            icon={faShare}
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
    const { theme, comments } = this.props.state;
    const { isLoading } = this.state;
    return (
      <View style={{
        height: height,
        backgroundColor: Color.containerBackground
      }}>
        {
          this.header()
        }
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{
            minHeight: height * 1.5,
            width: '100%'
          }}>
            
            {
              this.pageImage()
            }

            {comments.length > 0 && comments.map((item, index) => {
              return (
                <PostCard
                  navigation={this.props.navigation}
                  loader={this.loader}
                  data={{
                    user: item.account,
                    comments: item.comment_replies,
                    message: item.text,
                    date: item.created_at_human,
                    id: item.id,
                    liked: item.liked,
                    joined: item.joined,
                    members: item.members,
                    index: index
                  }}
                  images={item.images?.length > 0 ? item.images : []}
                  postReply={() => { this.reply(item) }}
                  reply={(value) => this.replyHandler(value)}
                  onLike={(params) => this.like(params)}
                  onJoin={(params) => this.join(params)}
                  style={{
                    backgroundColor: 'white'
                  }}
                />
              )
            })}
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