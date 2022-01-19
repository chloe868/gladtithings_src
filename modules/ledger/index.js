import React, { Component } from 'react';
import { View, Text, SafeAreaView, Dimensions, ScrollView, Alert } from 'react-native';
import Button from 'components/Form/Button';
import Currency from 'services/Currency';
import { connect } from 'react-redux';
import { BasicStyles, Color, Routes, Helper } from 'common';
import Api from 'services/api/index.js';
import { NavigationActions, StackActions } from 'react-navigation';
import TextInputWithoutLabel from 'components/Form/TextInputWithoutLabel'
import AmountInput from 'modules/generic/AmountInput'
import Skeleton from 'components/Loading/Skeleton';

const height = Math.round(Dimensions.get('window').height);
class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    }
  }

  detailsHandler(data, param){
    if(data){
      let details = JSON.parse(data)

      console.log({details})
      
      switch(param){
        case 'payment_payload':
          return details['payment_payload'].toUpperCase();

        case 'type':
          return details['type'];

        case 'request_id':
          code = details['payment_payload_value']
          return code.substr(code.length - 16, code.length - 1);

        case 'account':
          code = details['account']['code'];
          return code.substr(code.length - 16, code.length - 1);
      }
    }else{
      return null
    }
  }


  renderData = (data) => {
    const { theme } = this.props.state;
    return (
      <View style={{
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Text style={{
          fontSize: 52,
          marginTop: 50,
          color: data.amount > 0 ? (theme ? theme.secondary : Color.secondary) : Color.danger
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
    );
  }

  renderMoreDetails = (data) => {
    return (
      <View>
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



        {
          (data.details && this.detailsHandler(data.details, 'payment_payload')) && (
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
              >{this.detailsHandler(data.details, 'payment_payload')}</Text>
            </View>
          )
        }


        {
          (data.details && this.detailsHandler(data.details, 'request_id') && this.detailsHandler(data.details, 'payment_payload') == 'REQUEST') && (
            <View style={{
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row'
            }}>
              <Text style={{
                fontSize: BasicStyles.standardFontSize,
                width: '50%'
              }}>Request #:</Text>

              <Text style={{
                fontSize: BasicStyles.standardFontSize,
                width: '50%',
                textAlign: 'right'
              }}
                numberOfLines={1}
              >****{this.detailsHandler(data.details, 'request_id')}</Text>
            </View>
          )
        }
        


      </View>
    );
  }

  renderFrom = (data) => {
    return (
      <View>
        <View style={{
          height: 50,
          justifyContent: 'center',
          borderBottomWidth: 1,
          borderBottomColor: Color.lightGray
        }}>
          <Text style={{
            fontWeight: 'bold',
            fontSize: BasicStyles.standardFontSize
          }}>{this.detailsHandler(data.details, 'type') == 'send' ? 'To' : 'From'}</Text>
        </View>

        {
          (data.details && this.detailsHandler(data.details, 'account')) && (
            <View style={{
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row'
            }}>
              <Text style={{
                fontSize: BasicStyles.standardFontSize,
                width: '50%'
              }}>Account Code:</Text>

              <Text style={{
                fontSize: BasicStyles.standardFontSize,
                width: '50%',
                textAlign: 'right'
              }}
                numberOfLines={1}
              >****{this.detailsHandler(data.details, 'account')}</Text>
            </View>
          )
        }
      </View>
    );
  }

  footerOptionsComplete = (data) => {
    const { theme } = this.props.state;
    return (
      <View style={{
        alignItems: 'center',
        backgroundColor: Color.white,
        width: '100%',
        flexDirection: 'row',
        position: 'absolute',
        bottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
        left: 0
      }}>

        <Button
          title={'Go to Dashboard'}
          onClick={() => this.props.navigation.navigate('Dashboard')}
          style={{
            width: '100%',
            backgroundColor: theme ? theme.secondary : Color.secondary
          }}
        />
      </View>
    );
  }

  render() {
    const { isLoading } = this.state;
    const { params } = this.props.navigation.state;
    return (
      <SafeAreaView>
        <ScrollView
          showsVerticalScrollIndicator={false}>

          <View style={{
            minHeight: height * 1.5,
            width: '90%',
            marginRight: '5%',
            marginLeft: '5%',
            marginBottom: 100
          }}>

            {
              (params && params.data) && (
                this.renderData(params.data)
              )
            }


            {
              (params && params.data) && (
                this.renderMoreDetails(params.data)
              )
            }

            {
              (params && params.data) && (
                this.renderFrom(params.data)
              )
            }


            
          </View>

        </ScrollView>
        {
          (params && params.data) && (
            this.footerOptionsComplete(params.data)
          )
        }
        {
          isLoading && (<Skeleton size={1} template={'block'} height={125} />)
        }
      </SafeAreaView>
    )
  }
}

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);