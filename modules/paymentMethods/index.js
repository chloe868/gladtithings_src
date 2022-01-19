import React, { Component } from 'react';
import { View, ScrollView, Dimensions, TouchableOpacity, Text } from 'react-native';
import { Color, Routes } from 'common';
import { connect } from 'react-redux';
import PaymentMethodCard from 'modules/generic/Cards';
import Api from 'services/api/index.js';

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
    }
  }

  componentDidMount = () => {
    this.retrieveAllPayment()
  }

  retrieveAllPayment = () => {
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
        this.setState({ data: response.data })
      } else {
        this.setState({ data: [] })
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
        paddingRight: 15
      }}>
        <ScrollView showsVerticalScrollIndicator={false}>
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
