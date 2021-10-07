import React, { Component } from 'react';
import { View, ScrollView} from 'react-native';
import { Color, Routes } from 'common';
import CardsWithImages from '../generic/CardsWithImages';
import Api from 'services/api/index.js';
import { connect } from 'react-redux';
import { Spinner } from 'components';

class Churches extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: null,
      isLoading: false,
      data: [],
      limit: 5,
      offset: 0
    }
  }

  componentDidMount() {
    this.retrieve(false)
  }

  retrieve = (flag) => {
    const { user } = this.props.state;
    let parameter = {
      sort: { created_at: 'asc' },
      limit: this.state.limit,
      offset: flag == true && this.state.offset > 0 ? (this.state.offset * this.state.limit) : this.state.offset
    }
    this.setState({ isLoading: true })
    Api.request(Routes.merchantsRetrieve, parameter, response => {
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
    });
  }

  render() {
    const { theme, user } = this.props.state;
    const { data, isLoading } = this.state;
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
                this.retrieve(true)
              }
            }
          }}
        >
          {this.state.isLoading ? <Spinner mode="overlay" /> : null}
          <CardsWithImages
            photos={true}
            version={3}
            data={data}
            buttonColor={theme ? theme.primary : Color.primary}
            buttonTitle={'Subscribe'}
            redirect={() => { this.props.navigation.navigate('churchProfileStack') }}
            buttonClick={() => { this.props.navigation.navigate('depositStack', { type: 'Subscription Donation' }) }}
          />
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

export default connect(
  mapStateToProps
)(Churches);
