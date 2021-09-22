import React, { Component } from 'react';
import { View, ScrollView} from 'react-native';
import { Color } from 'common';
import { connect } from 'react-redux';
import CardsWithImages from '../generic/CardsWithImages';

const data = [
  {
    id: 0,
    title: 'Theme 1',
    address: 'Cebu, Cebu City, Philippines',
    description: "Receives email address every time there's a login of the account.",
    date: 'July 23, 2021 5:00 PM',
    amount: 'USD 10.00',
    type: 'Recollection'
  },
  {
    id: 0,
    title: 'Theme 1',
    address: 'Cebu, Cebu City, Philippines',
    description: "Receives email address every time there's a login of the account.",
    date: 'July 23, 2021 5:00 PM',
    amount: 'USD 10.00',
    type: 'Recollection'
  }
]
class Churches extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: null
    }
  }

  render() {
    const { theme, user } = this.props.state;
    return (
      <View style={{
        backgroundColor: Color.containerBackground
      }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.state.isLoading ? <Spinner mode="overlay" /> : null}
          <CardsWithImages
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
