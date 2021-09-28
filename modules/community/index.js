import React, { Component } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { Color } from 'common';
import Footer from 'modules/generic/Footer';
import { connect } from 'react-redux';
import PostCard from 'modules/generic/PostCard';

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

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
      },
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
  }

  render() {
    const { user, theme } = this.props.state;
    return (
      <View style={{
        height: height,
        backgroundColor: Color.containerBackground
      }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{
            marginBottom: 100
          }}>
            {data.length > 0 && data.map((item, index) => (
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
              />
            ))}
          </View>
        </ScrollView>
        <Footer layer={0} {...this.props} />
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

export default connect(
  mapStateToProps
)(Community);
