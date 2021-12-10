import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { Color, Routes } from 'common';
import { connect } from 'react-redux';
import CardsWithImages from 'src/modules/generic/CardsWithImages';
import Api from 'services/api/index.js';
import Skeleton from 'components/Loading/Skeleton';
import _ from 'lodash';

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

class Masses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      churches: [],
      days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      isLoading: false,
      offset: 0,
      limit: 5,
    }
  }

  componentDidMount() {
    this.retrieveChurches(false)
  }

  retrieveChurches = (flag) => {
    const { days, offset, limit, churches } = this.state;
    let parameter = {
      sort: { created_at: 'asc' },
      limit: limit,
      offset: flag == true && offset > 0 ? (offset * limit) : offset
    }
    this.setState({ isLoading: true })
    Api.request(Routes.merchantsRetrieve, parameter, response => {
      console.log('[RESPONSE]', response)
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        let temp = [];
        response.data.map((item, index) => {
          let sched = [];
          if (item.schedule) {
            sched = JSON.parse(item.schedule)
          }
          sched.length > 0 && sched.map((items, inde) => {
            let currentDay = new Date().getDay();
            items.schedule.length > 0 && items.schedule.map((i, ind) => {
              let a = i.startTime.split(':')
              let b = i.endTime.split(':')
              let aIsAm = parseInt(a[0]) <= 12 ? 'AM' : 'PM'
              let bIsAm = parseInt(b[0]) <= 12 ? 'AM' : 'PM'
              temp.push({
                id: item.id,
                address: item.address,
                logo: item.logo,
                name: i.name,
                date: `${days[currentDay]} ${i.startTime} ${aIsAm} - ${i.endTime} ${bIsAm}`,
                account_id: item.account_id
              })
            })
          })
          this.setState({
            churches: flag == false ? temp : _.uniqBy([...churches, ...temp], 'id'),
            offset: flag == false ? 1 : (offset + 1)
          })
        })
      } else {
        this.setState({
          data: flag == false ? [] : churches,
          offset: flag == false ? 0 : offset
        })
      }
    }, error => {
      console.log(error)
      this.setState({ isLoading: false })
    });
  }

  render() {
    const { theme, user, language } = this.props.state;
    const { churches, isLoading, events, recentlyVisited } = this.state;
    return (
      <View style={{
        backgroundColor: Color.containerBackground
      }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={(event) => {
            let scrollingHeight = event.nativeEvent.layoutMeasurement.height + event.nativeEvent.contentOffset.y
            let totalHeight = event.nativeEvent.contentSize.height
            if (event.nativeEvent.contentOffset.y <= 0) {
              if (isLoading == false) {
                // this.retrieve(false)
              }
            }
            if (scrollingHeight >= (totalHeight)) {
              if (isLoading == false) {
                this.retrieveChurches(true)
              }
            }
          }}
        >
          <View style={{
            marginBottom: height / 2
          }}>
            <View>
              <CardsWithImages
                version={1}
                data={churches}
                buttonColor={theme ? theme.secondary : Color.secondary}
                buttonTitle={language.subscribe}
                redirect={(data) => { this.props.navigation.navigate('churchProfileStack', { data: data }) }}
                buttonClick={(item) => { this.props.navigation.navigate('depositStack', { type: 'Subscription Donation', data: item }) }}
              />
              {isLoading &&
                <View style={{
                  flexDirection: 'row',
                  width: width
                }}>
                  <View style={{ width: '50%' }}>
                    <Skeleton size={1} template={'block'} height={150} />
                  </View>
                  <View style={{ width: '50%' }}>
                    <Skeleton size={1} template={'block'} height={150} />
                  </View>
                </View>}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

export default connect(
  mapStateToProps
)(Masses);
