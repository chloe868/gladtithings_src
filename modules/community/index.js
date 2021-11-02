import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { Color, BasicStyles, Routes } from 'common';
import Footer from 'modules/generic/Footer';
import { connect } from 'react-redux';
import IncrementButton from 'components/Form/Button';
import Format from './TabContainer'
import Card from './Card'
import Api from 'services/api';
import _ from 'lodash';
import Comments from 'src/components/Comments/index';
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
      data: [],
      offset: 0,
      limit: 5
    }
  }

  componentDidMount() {
    this.setState({
      default: true,
      community: false,
      message: false
    })
  }

  retrieveCommunities = () => {
    const { user } = this.props.state;
    if (user == null) {
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
      if (response.data && response.data.length > 0) {
        this.setState({
          community: response.data
        })
      } else {
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
    return (
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

  communities = () => {
    const { community } = this.state;

    return (
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
    const { isLoading } = this.state;
    return (
      <View style={{
        height: height,
        backgroundColor: Color.containerBackground
      }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
            marginBottom: 20,
            marginHorizontal: 15,
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
          {this.state.default == true &&
            <View style={{
              height: height * 1.5
            }}>
              <Comments/>
            </View>
          }
          {this.state.message && this.popetwitter()}
          {this.state.community && this.communities()}
        </ScrollView>
        {isLoading ? <Spinner mode="overlay" /> : null}
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