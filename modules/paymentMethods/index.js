import React, { Component } from 'react';
import { View, ScrollView, Dimensions, TouchableOpacity, Text } from 'react-native';
import { Color, Routes } from 'common';
import { connect } from 'react-redux';
import PaymentMethodCard from 'modules/generic/Cards';
import Api from 'services/api/index.js';
import _ from 'lodash';

import Skeleton from 'components/Loading/Skeleton';
import EmptyMessage from 'modules/generic/Empty.js'

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

class PaymentMethods extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      data: [],
      limit: 4,
      offset: 0
    }
  }

  componentDidMount = () => {
    this.props.navigation.addListener('didFocus', () => {
      this.retrieveAllPayment(false)
    });
  }

  retrieveAllPayment = (flag) => {
    const { user } = this.props.state;
    let parameter = {
      account_id: user.id,
      limit: this.state.limit,
      offset: 0
    }
    this.setState({ isLoading: true })
    Api.request(Routes.paymentRetrieveMethods, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        this.setState({
          data: flag == false ? response.data : _.uniqBy([...this.state.data, ...response.data], 'id'),
          offset: flag == false ? 1 : (this.state.offset + 1)
        })
      } else {
        this.setState({
          data: flag == false ? [] : this.state.data,
          offset: flag == false ? 0 : this.state.offset
        })
      }
    }, error => {
      console.log(error);
      this.setState({ isLoading: false })
    })
  }

  render() {
    const { language, theme } = this.props.state;
    const { isLoading, data } = this.state;
    return (
      <View style={{
        backgroundColor: Color.containerBackground,
        paddingLeft: 15,
        paddingRight: 15,
        height: height,
        marginBottom: height / 2
      }}>
        <ScrollView showsVerticalScrollIndicator={false}
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
                this.retrieve(true)
              }
            }
          }}>
          <TouchableOpacity style={{ width: '100%', marginBottom: 10 }}
            onPress={() => { this.props.navigation.navigate('paymentStack') }}>
            <Text style={{
              color: theme ? theme.primary : Color.primary,
              fontFamily: 'Poppins-SemiBold',
              textAlign: 'right'
            }}>{language.add}</Text>
          </TouchableOpacity>
          {data.length > 0 && data.map((item, index) => {
            return (
              <PaymentMethodCard
                data={item}
              />
            )
          })}
          {
            data.length === 0 && !isLoading && <EmptyMessage message={language.subscription.noPayment} />
          }
          {
            (isLoading && data.length === 0) && (
              <Skeleton size={1} template={'block'} height={100} />
            )
          }
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

export default connect(
  mapStateToProps
)(PaymentMethods);
