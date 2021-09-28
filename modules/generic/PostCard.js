import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Dimensions, Text, TextInput, Alert } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck, faTimes, faStar, faUserCircle, faEllipsisH, faPrayingHands, faCommentAlt } from '@fortawesome/free-solid-svg-icons';
import { BasicStyles, Color, Routes } from 'common';
import { connect } from 'react-redux';
import Config from 'src/config.js';
import Api from 'services/api';
import UserImage from 'components/User/Image';
import ImageModal from 'components/Modal/ImageModal.js';
import Styles from './PostCardStyles.js'

const height = Math.round(Dimensions.get('window').height);
const width = Math.round(Dimensions.get('window').width);

class PostCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reply: null,
      options: false,
      imageModalUrl: null,
      isImageModal: false
    }
  }

  remove = (data) => {
    Alert.alert(
      '',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', onPress: () => console.log('Ok'), style: 'cancel' },
        {
          text: 'Delete', onPress: () => {
            let posts = this.props.state.comments;
            let parameter = {
              id: data.id
            }
            this.props.loader(true);
            Api.request(Routes.commentsDelete, parameter, response => {
              this.props.loader(false);
              if (response.data !== null) {
                posts && posts.length > 0 && posts.map((item, index) => {
                  if (item.id == data.id) {
                    this.setState({ options: false })
                    posts.splice(index, 1)
                    this.props.setComments(posts)
                  }
                })
              }
            });
          }, style: 'cancel'
        }
      ],
      { cancelable: false }
    )
  }

  createSynqt = (data) => {
    let status = false;
    if (data.members && data.members?.length > 0) {
      let temp = data.members
      data.members.length === 1 && data.members.map((item, index) => {
        if (item.account_id == this.props.state.user.id) {
          status = true;
        }
      })
    } else {
      Alert.alert(
        '',
        'Cannot proceed! You have no people on SYNQT yet.',
        [
          { text: 'Ok', onPress: () => { return } }
        ],
        { cancelable: false }
      )
    }
  }

  replyHandler = (value) => {
    this.setState({ reply: value });
    this.props.reply(value);
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
            }}>{data?.user?.username}</Text>
            <Text style={{
              fontSize: BasicStyles.standardFontSize
            }}>
              {data.date}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 5,
              top: 0
            }}
            onPress={() => { this.setState({ options: !this.state.options }) }}>
            <FontAwesomeIcon icon={faEllipsisH} />
          </TouchableOpacity>
          {this.state.options === true && show === true && (<TouchableOpacity style={{
            position: 'absolute',
            right: -5,
            top: 40,
            height: 40,
            width: 105,
            borderWidth: 1,
            borderRadius: 10,
            borderColor: Color.gray,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10
          }}
            onPress={() => { this.remove(data) }}>
            <Text>Delete Post</Text>
          </TouchableOpacity>)}
        </View>
      </View>
    )
  }

  setImage = (url) => {
    this.setState({ imageModalUrl: url })
    setTimeout(() => {
      this.setState({ isImageModal: true })
    }, 500)
  }

  renderBody = (data) => {
    return (
      <View style={{
        ...BasicStyles.standardWidth,
        paddingTop: 20,
        paddingBottom: 10,
      }}>
        <Text style={{
          fontSize: BasicStyles.standardFontSize
        }}>{data.message}</Text>
        {this.props.images.length === 1 &&
          <View style={{
            height: 200,
            width: '100%',
            marginBottom: 10,
            marginTop: 10
          }}>
            <TouchableOpacity onPress={() => { this.setImage(Config.BACKEND_URL + '') }}>
              <Image
                source={require('assets/test.jpg')}
                style={Styles.image} />
            </TouchableOpacity>
          </View>
        }
        {this.props.images.length === 2 &&
          <View style={{
            height: 200,
            width: '100%',
            marginBottom: 10,
            marginTop: 10,
            flexDirection: 'row'
          }}>
            <TouchableOpacity
              style={Styles.twoImages}
              onPress={() => { this.setImage(Config.BACKEND_URL + '') }}>
              <Image
                source={require('assets/test.jpg')}
                style={Styles.image} />
            </TouchableOpacity>
            <TouchableOpacity
              style={Styles.twoImages}
              onPress={() => { this.setImage(Config.BACKEND_URL + '') }}>
              <Image
                source={require('assets/test.jpg')}
                style={Styles.image} />
            </TouchableOpacity>
          </View>
        }
        {this.props.images.length === 3 &&
          <View style={{
            height: 200,
            width: '100%',
            marginBottom: 10,
            marginTop: 10,
            flexDirection: 'row'
          }}>
            <TouchableOpacity
              style={{
                height: '100%',
                width: '50%'
              }}
              onPress={() => { this.setImage(Config.BACKEND_URL + '') }}>
              <Image
                source={require('assets/test.jpg')}
                style={Styles.image} />
            </TouchableOpacity>
            <View style={{
              height: 200,
              width: '50%',
            }}>
              <TouchableOpacity
                style={Styles.fourImages}
                onPress={() => { this.setImage(Config.BACKEND_URL + '') }}>
                <Image
                  source={require('assets/test.jpg')}
                  style={Styles.image} />
              </TouchableOpacity>
              <TouchableOpacity
                style={Styles.fourImages}
                onPress={() => { this.setImage(Config.BACKEND_URL + '') }}>
                <Image
                  source={require('assets/test.jpg')}
                  style={Styles.image} />
              </TouchableOpacity>
            </View>
          </View>
        }
        {this.props.images.length > 3 &&
          <View style={{
            height: 200,
            width: '100%',
            marginBottom: 10,
            marginTop: 10,
            flexDirection: 'row'
          }}>
            <View style={{
              height: 200,
              width: '50%',
            }}>
              <TouchableOpacity
                style={Styles.fourImages}
                onPress={() => { this.setImage(Config.BACKEND_URL + '') }}>
                <Image
                  source={require('assets/test.jpg')}
                  style={Styles.image} />
              </TouchableOpacity>
              <TouchableOpacity
                style={Styles.fourImages}
                onPress={() => { this.setImage(Config.BACKEND_URL + '') }}>
                <Image
                  source={require('assets/test.jpg')}
                  style={Styles.image} />
              </TouchableOpacity>
            </View>
            <View style={{
              height: 200,
              width: '50%',
            }}>
              <TouchableOpacity
                style={Styles.fourImages}
                onPress={() => { this.setImage(Config.BACKEND_URL + '') }}>
                <Image
                  source={require('assets/test.jpg')}
                  style={Styles.image} />
              </TouchableOpacity>
              <TouchableOpacity
                style={Styles.fourImages}
                onPress={() => { this.setImage(Config.BACKEND_URL + '') }}>
                <Image
                  source={require('assets/test.jpg')}
                  style={Styles.image} />
              </TouchableOpacity>
            </View>
          </View>
        }
      </View>
    )
  }

  renderComment = (data) => {
    return (
      <View style={{
        ...BasicStyles.standardWidth,
        paddingTop: 10,
        paddingBottom: 10,
      }}>
        <Text style={{
          fontSize: BasicStyles.standardFontSize
        }}>{data.message}</Text>
      </View>
    )
  }

  renderActions = (data) => {
    const { theme } = this.props.state
    return (
      <View style={{
        ...BasicStyles.standardWidth,
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 20,
        flexDirection: 'row'
      }}>
        <TouchableOpacity style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 20,
          flexDirection: 'row'
        }}
          onPress={() => {
            // this.props.onLike(data)
          }}
        >
          <FontAwesomeIcon
            icon={faPrayingHands}
            size={20}
            style={{
              color: Color.gray
            }}
          />
          <Text style={{
            marginLeft: 10,
            fontSize: 13,
            color: Color.gray
          }}>Amen</Text>
        </TouchableOpacity>


        <TouchableOpacity style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 5,
          flexDirection: 'row'
        }}
          onPress={() => {
            // this.props.onLike(data)
          }}
        >
          <FontAwesomeIcon
            icon={faCommentAlt}
            size={20}
            style={{
              color: Color.black
            }}
          />
          <Text style={{
            marginLeft: 10,
            fontSize: 13
          }}>Comment</Text>
        </TouchableOpacity>
      </View>
    )
  }


  renderComments = (comments) => {
    const { user, theme } = this.props.state;
    return (
      <View style={{
        width: '100%',
        alignItems: 'center'
      }}>
        {
          comments?.length > 0 && comments.map((item, index) => (
            <View
              key={index}
              style={{
                width: '100%'
              }}>
              {this.renderHeader({ user: item.account, date: item.created_at_human }, false)}
              {this.renderComment({ message: item.text })}
            </View>
          ))
        }
        <View style={{
          width: '90%',
          borderTopColor: Color.lightGray,
          flexDirection: 'row',
          alignItems: 'center',
          marginLeft: '5%',
          marginRight: '5%'
        }}>
          <TextInput style={{
            width: '100%',
            height: 50,
            borderWidth: .25,
            borderColor: Color.gray,
            borderRadius: 100,
            marginBottom: 15,
            paddingLeft: 20
          }}
            value={this.state.reply}
            onSubmitEditing={() => { this.props.postReply(comments); this.setState({ reply: null }) }}
            onChangeText={(value) => this.replyHandler(value)}
            placeholder={'Type here'}
          />
        </View>
      </View>
    )
  }


  render() {
    const { data } = this.props;
    const { isImageModal, imageModalUrl } = this.state;
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
        {this.renderActions(data)}
        {this.renderComments(data.comments)}
        <ImageModal
          visible={isImageModal}
          url={imageModalUrl}
          action={() => this.setState({ isImageModal: false })}
        ></ImageModal>
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
)(PostCard);
