import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Color, BasicStyles, Routes } from 'common';
import Footer from 'modules/generic/Footer';
import { connect } from 'react-redux';
import PostCard from 'components/Comments/PostCard';
import IncrementButton from 'components/Form/Button';
import { faBell, faBan, faUsers, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Format from './TabContainer'
import Card from './Card'
import Api from 'services/api';
import CreatePost from 'src/components/Comments/Create';
import Style from './Style';
import _ from 'lodash';
import { Spinner } from 'components';


const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

const dataPope = [
  {
    id: 0,
    account: {
      id: 0,
      username: 'Pope Francis',
      first_name: 'Pope',
      last_name: 'Francis'
    },
    text: "May Saints Cyril and Methodius, precursors of #ecumenism, help us make every effort to work for a reconciliation of diversity in the Holy Spirit: a unity that, witout being uniformity, is capable of being a sign and witness to the freedom of Christ, the Lord. #ApostolicJourney",
    created_at_human: 'Just Now',
  },

  {
    id: 1,
    account: {
      id: 0,
      username: 'Pope Francis',
      first_name: 'Pope',
      last_name: 'Francis'
    },
    text: "The Eucharist is here to remind us who God is. It does not do so just in words, but in a concrete way, showing us God as bread broken, as love crucified and  bestowed. #EcharisticCongress #Budapest",
    created_at_human: 'Just Now',
  }

]

const dataCommunityInterested = [
  {
    id: 0,
    account: {
      id: 0,
      username: 'JCI Cebu, Philippines',
      first_name: '',
      last_name: ''
    },
    status: 'Non Profit - 20k Followers - 10k Joined',
    notifs: 'Follow & Join',
    icon: faUsers
  },

  {
    id: 1,
    account: {
      id: 0,
      username: 'JCI Cebu, Philippines',
      first_name: '',
      last_name: ''
    },
    status: 'Non Profit - 20k Followers - 10k Joined',
    notifs: 'Follow & Join',
    icon: faUsers
  }

]

const dataCommunityManage = [
  {
    id: 0,
    account: {
      id: 0,
      username: 'JCI Cebu, Philippines',
      first_name: '',
      last_name: ''
    },
    status: 'Non Profit - 20k Followers - 10k Joined',
    notifs: 'Notifications',
    icon: faBell
  },

  {
    id: 1,
    account: {
      id: 0,
      username: 'JCI Cebu, Philippines',
      first_name: '',
      last_name: ''
    },
    status: 'Non Profit - 20k Followers - 10k Joined',
    notifs: 'Notifications',
    icon: faBell
  }

]

const data = [
  {
    id: 0,
    account: {
      id: 0,
      username: 'lalaine',
      first_name: 'Lalaine',
      last_name: 'Garrido'
    },
    comment_replies: [
      {
        account: {
          id: 0,
          username: 'riki',
          first_name: 'Lalaine',
          last_name: 'Garrido'
        },
        text: "Amazing!",
        created_at_human: 'Just Now'
      }
    ],
    text: "We would like to thank everyone who donated to our campaigns. Here's the documentation.",
    created_at_human: 'Just Now',
    images: [1]
  },
  {
    id: 1,
    account: {
      id: 0,
      username: 'jake',
      first_name: 'Lalaine',
      last_name: 'Garrido'
    },
    comment_replies: [],
    text: 'Hi. This is a test version two.',
    created_at_human: 'August 30, 2021',
    images: [1, 2]
  },
  {
    id: 1,
    account: {
      id: 0,
      username: 'heeseung',
      first_name: 'Lalaine',
      last_name: 'Garrido'
    },
    comment_replies: [],
    text: 'Hi. This is a test version two.',
    created_at_human: 'August 30, 2021',
    images: [1, 2, 3]
  },
  {
    id: 1,
    account: {
      id: 0,
      username: 'sunoo',
      first_name: 'Lalaine',
      last_name: 'Garrido'
    },
    comment_replies: [],
    text: 'Hi. This is a test version two.',
    created_at_human: 'August 30, 2021',
    images: [1, 2, 3, 4]
  }
]

class Community extends Component {
  constructor(props) {
    super(props);
    this.state = {
      default: true,
      community: false,
      message: false,
      isActive: null,
      isActive2: null,
      community: [],
      createStatus: false,
      data: []
    }
  }

  componentDidMount() {
    this.retrieve(false);
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

  retrieveCommunities = () => {
    const { user } = this.props.state;
    if(user == null){
      return null
    }

    let parameter = {
    }
    console.log({
      parameter
    })
    this.setState({ isLoading: true })
    Api.request(Routes.pageRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      console.log({
        response
      })
      if(response.data && response.data.length > 0){
        this.setState({
          community: response.data
        })
      }else{
        this.setState({
          community: []
        })
      }
    }, error => {
      this.setState({ isLoading: false })
    });
  }

  
  popetwitterMessage = () => {
    this.setState({
      default: false,
      message: true,
      community: false,
    })

  }

  communitiesMessage = () => {
    this.setState({
      default: false,
      message: false,
      community: true
    })
    this.retrieveCommunities()
  }

  popetwitter = () => {
    return(
      <View style={{
        marginBottom: 100
      }}>
       
        {dataPope.length > 0 && dataPope.map((item, index) => (
          <Format
            navigation={this.props.navigation}
            loader={this.loader}
            data={{
              user: item.account,
              message: item.text,
              date: item.created_at_human,
              id: item.id
            }} 
          />
          
        ))}
      </View>
    )
  }

  communities = () =>{
    const { community } = this.state;

    return(
      <View style={{
        marginBottom: 100
      }}>
        <View style={{
                marginTop: 20,
              }}>
          <Text 
            style={{
            ...BasicStyles.standardWidth,
             fontFamily: 'Poppins-SemiBold',
            }}
          >Communities You Might Interested In</Text>
        </View>
        {community.length > 0 && community.map((item, index) => (
          <Card
            data={item}
          />
        ))}

         <View style={{
                marginTop: 20,
              }}>
          <Text 
            style={{
            ...BasicStyles.standardWidth,
             fontFamily: 'Poppins-SemiBold',
            }}
          >Communities You Manage</Text>
        </View>


        {community.length > 0 && community.map((item, index) => (
          <Card
            data={item}
          />
        ))}

        <View style={{
                marginTop: 20,
                marginBottom: 20
              }}>
          <Text 
            style={{
            ...BasicStyles.standardWidth,
             fontFamily: 'Poppins-SemiBold',
            }}
          >Communities You Followed & Joined</Text>
          <Text
            style={{
            paddingTop: 10,
            ...BasicStyles.standardWidth,
            }}
          >View Recommendation</Text>


        </View>
        
        {community.length > 0 && community.map((item, index) => (
          <Card
            data={item}
          />
        ))}
      </View>
    )
  }



  render() {
    const { theme, comments } = this.props.state;
    const { createStatus, isLoading } = this.state;
    return (
      <View style={{
        height: height,
        backgroundColor: Color.containerBackground
      }}>

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 20,
          marginBottom: 20,
          marginHorizontal: 25,
          overflow: 'hidden'

        }}>
          <IncrementButton style={{
            backgroundColor: this.state.isActive2 == 1 ? Color.secondary : Color.white,
            width: '45%',
            borderWidth: 0.1,

          }}
            textStyle={{
              color: this.state.isActive2 == 1 ? Color.white : Color.black
            }}
            onClick={() => {
              this.setState({
                isActive2: 1,
                isActive: 0
              })
              this.communitiesMessage()
            }}
            title={'Communities'}
          />
          <IncrementButton style={{
            backgroundColor: this.state.isActive == 1 ? Color.secondary : Color.white,
            width: '50%',
            borderWidth: 0.1,
          }}
            textStyle={{
              color: this.state.isActive == 1 ? Color.white : Color.black
            }}
            onClick={() => {
              this.setState({
                isActive: 1,
                isActive2: 0
              })
              this.popetwitterMessage()
            }}
            title={"Pope's Messages"}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {this.state.default == true &&
            <View style={{
              height: height * 1.5
            }}>
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
          }
          {this.state.message && this.popetwitter()}
          {this.state.community && this.communities()}

        </ScrollView>
        {isLoading ? <Spinner mode="overlay" /> : null}
        <CreatePost
          visible={createStatus}
          close={() => this.setState({ createStatus: false })}
          title={'Create Post'}
        />
        {this.state.default && <TouchableOpacity
          style={[Style.floatingButton, {
            backgroundColor: theme ? theme.secondary : Color.secondary,
            height: 60,
            width: 60,
            borderRadius: 30,
            bottom: 70
          }]}
          onPress={() => {
            this.setState({ createStatus: true });
          }}>
          <FontAwesomeIcon
            icon={faPlus}
            style={{
              color: Color.white
            }}
            size={16}
          />
        </TouchableOpacity>}
        <Footer layer={0} {...this.props} />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux');
  return {
    setComments: (comments) => {
      dispatch(actions.setComments(comments));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Community);