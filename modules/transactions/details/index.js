import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { Color } from 'common';
import { connect } from 'react-redux';

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

class TransactionDetails extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { data } = this.props.navigation.state?.params;
    try {
      data['details'] = JSON.parse(data.details)
    } catch(e) {
      console.log(e)
    }
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
            <Text>Here are the further details of this tithings.</Text>
            <View style={{
              paddingTop: 10,
              paddingBottom: 10
            }}>
              <Text style={{
                fontFamily: 'Poppins-SemiBold'
              }}>Date</Text>
              <Text>{data.created_at_human}</Text>
            </View>
            <View style={{
              paddingTop: 10,
              paddingBottom: 10
            }}>
              <Text style={{
                fontFamily: 'Poppins-SemiBold'
              }}>Amount</Text>
              <Text>{data.currency} {data.amount}</Text>
            </View>
            <View style={{
              paddingTop: 10,
              paddingBottom: 10
            }}>
              <Text style={{
                fontFamily: 'Poppins-SemiBold'
              }}>Transaction Type</Text>
              <Text>{data.description}</Text>
            </View>
            <View style={{
              paddingTop: 10,
              paddingBottom: 10
            }}>
              <Text style={{
                fontFamily: 'Poppins-SemiBold'
              }}>Reference</Text>
              <Text>{data.code.substring(4)}</Text>
            </View>
            <View style={{
              paddingTop: 10,
              paddingBottom: 10
            }}>
              <Text style={{
                fontFamily: 'Poppins-SemiBold'
              }}>{data.details ? data.details.type === 'receive' ? 'Sender' : 'Receiver' : 'Sender'}</Text>
              <Text>{data.details ? data.details.account.id : 'Own transaction'}</Text>
            </View>
            <View style={{
              paddingTop: 10,
              paddingBottom: 10
            }}>
              <Text style={{
                fontFamily: 'Poppins-SemiBold'
              }}>Recipient Address</Text>
              <Text>{data.created_at_human}</Text>
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
)(TransactionDetails);
