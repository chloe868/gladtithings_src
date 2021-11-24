import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { Color, BasicStyles } from 'common';
import { connect } from 'react-redux';

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

class TransactionDetails extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { theme } = this.props.state;
    const { data } = this.props.navigation.state?.params;
    try {
      data['details'] = JSON.parse(data.details)
    } catch (e) {
      console.log(e)
    }
    console.log(data.details);
    return (
      <View style={{
        height: height,
        backgroundColor: Color.containerBackground
      }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              minHeight: height + (height * 0.5)
            }}>
            <View style={{
              alignItems: 'center',
            }}>
              <Text style={{
                fontSize: 52,
                marginTop: 50,
                color: data.amount > 0 ? (theme ? theme.primary : Color.primary) : Color.danger
              }}>{data.amount}</Text>
              <Text style={{
                fontSize: BasicStyles.standardFontSize,
                marginTop: 10,
                fontWeight: 'bold'
              }}>{data.currency.toUpperCase()}</Text>

              <Text style={{
                fontSize: BasicStyles.standardFontSize,
                marginTop: 10,
              }}>{data.created_at_human}</Text>


              <Text style={{
                fontSize: BasicStyles.standardFontSize,
                fontStyle: 'italic',
                fontWeight: 'bold',
                marginTop: 25,
                textAlign: 'center'
              }}>{'"' + data.description + '"'}</Text>
            </View>
            <View style={{
              padding: 10
            }}>
              <View style={{
                height: 50,
                justifyContent: 'center',
                borderBottomWidth: 1,
                borderBottomColor: Color.lightGray
              }}>
                <Text style={{
                  fontWeight: 'bold',
                  fontSize: BasicStyles.standardFontSize
                }}>More details</Text>
              </View>

              <View style={{
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row'
              }}>
                <Text style={{
                  fontSize: BasicStyles.standardFontSize,
                  width: '50%'
                }}>Transaction #:</Text>

                <Text style={{
                  fontSize: BasicStyles.standardFontSize,
                  width: '50%',
                  textAlign: 'right'
                }}
                  numberOfLines={1}
                >****{data.code.substr(data.code.length - 16, data.code.length - 1)}</Text>
              </View>
              <View style={{
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row'
              }}>
                <Text style={{
                  fontSize: BasicStyles.standardFontSize,
                  width: '50%'
                }}>Transaction Type:</Text>

                <Text style={{
                  fontSize: BasicStyles.standardFontSize,
                  width: '50%',
                  textAlign: 'right'
                }}
                  numberOfLines={1}
                >{data.description?.toUpperCase()}</Text>
              </View>
              <View style={{
                height: 50,
                justifyContent: 'center',
                borderBottomWidth: 1,
                borderBottomColor: Color.lightGray
              }}>
                <Text style={{
                  fontWeight: 'bold',
                  fontSize: BasicStyles.standardFontSize
                }}>{'To'}</Text>
              </View>
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
