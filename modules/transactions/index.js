import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { Color } from 'common';
import Footer from 'modules/generic/Footer';
import { connect } from 'react-redux';
import CardsWithIcon from '../generic/CardsWithIcon';
import InputFieldWithIcon from '../generic/InputFieldWithIcon';
import { faUser, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import IncrementButton from 'components/Form/Button';

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)
const data = [
  {
    id: 0,
    title: 'Churh 1',
    description: "Receives email address every time there's a login of the account.",
    date: 'July 23, 2021 5:00 PM',
    amount: 'USD 10.00'
  },
  {
    id: 1,
    title: 'Churh 2',
    description: "Receives email address every time there's a login of the account.",
    date: 'July 23, 2021 5:00 PM',
    amount: 'USD 10.00'
  },
  {
    id: 2,
    title: 'Churh 1',
    description: "Receives email address every time there's a login of the account.",
    date: 'July 23, 2021 5:00 PM',
    amount: 'USD 10.00'
  },
  {
    id: 3,
    title: 'Churh 2',
    description: "Receives email address every time there's a login of the account.",
    date: 'July 23, 2021 5:00 PM',
    amount: 'USD 10.00'
  },
  {
    id: 4,
    title: 'Churh 1',
    description: "Receives email address every time there's a login of the account.",
    date: 'July 23, 2021 5:00 PM',
    amount: 'USD 10.00'
  },
  {
    id: 5,
    title: 'Churh 2',
    description: "Receives email address every time there's a login of the account.",
    date: 'July 23, 2021 5:00 PM',
    amount: 'USD 10.00'
  }
]

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    const { theme, user } = this.props.state;
    return (
      <View style={{
        height: height,
        backgroundColor: Color.containerBackground
      }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{
            paddingLeft: 20,
            paddingRight: 20,
            minHeight: height + (height * 0.5)
          }}>
            {
              data.map((item, index) => {
                return (
                  <CardsWithIcon
                    redirect={() => {
                      console.log('donate')
                    }}
                    version={3}
                    title={item.title}
                    description={item.description}
                    date={item.date}
                    amount={item.amount}
                  />
                )
              })
            }
          </View>
          
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

export default connect(
  mapStateToProps
)(Transactions);