import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, Image, TouchableOpacity } from 'react-native';
import { Color, Routes, BasicStyles } from 'common';
import { connect } from 'react-redux';
import Api from 'services/api/index.js';
import Skeleton from 'components/Loading/Skeleton';
import CardsWithIcon from '../generic/CardsWithIcon';
import EmptyMessage from 'modules/generic/Empty.js'
import _ from 'lodash';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import StreetView from 'react-native-streetview';

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
      isMapReady: false,
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
        formatted_address: null,
      },
      moreMarkers: [{
        latitude: 10.323971563875467,
        latitudeDelta: 0.00968137024035265,
        longitude: 123.9079531095922,
        longitudeDelta: 0.0075058266520358075
      }],
      mapType: 'standard',
      streetView: false
    }
  }

  onRegionChange = (region) => {
    console.log(region)
    this.setState({
      region: region
    })
  };

  onMapLayout = () => {
    this.setState({ isMapReady: true });
  };

  componentDidMount() {
    this.retrieveChurches(false)
    const config = {
      enableHighAccuracy: false
    };
    Geolocation.getCurrentPosition(
      info =>
        this.setState({
          region: {
            ...this.state.region,
            latitude: info.coords.latitude,
            longitude: info.coords.longitude
          }
        }),
      error => console.log("ERROR", error),
      config,
    );
    console.log('--s-')
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
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        this.setState({
          churches: flag == false ? response.data : _.uniqBy([...churches, ...response.data], 'id'),
          offset: flag == false ? 1 : (offset + 1)
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

  renderMap = () => {
    const { region, mapType, streetView } = this.state;
    const { theme } = this.props.state;
    return (
      <View>
        <MapView
          style={{
            minWidth: width - 50,
            minHeight: height - 300,
            flex: 1,
            borderRadius: BasicStyles.standardBorderRadius
          }}
          mapType={mapType}
          ref={(ref) => (this.mapView = ref)}
          onMapReady={this.onMapLayout}
          provider={PROVIDER_GOOGLE}
          region={region} // without this the map won't move. but layo kaayo ang map
          // onRegionChangeComplete={(e) => this.onRegionChange(e)} // without this dili momove ang map but dili machange ang current loc as you move the map
        >
          {
            this.state.isMapReady &&
            <Marker
              key={0}
              coordinate={region}
              title={'Title route'}
            >
              <Image
                source={require('src/assets/userPosition.png')}
                style={{
                  width: 60,
                  height: 60
                }}
              />
            </Marker>
          }
          {
            this.state.isMapReady && this.state.moreMarkers.length > 0 && this.state.moreMarkers.map((item, index) => {
              return (
                <Marker
                  key={index}
                  coordinate={item}
                  title={'Title route'}
                >
                  <Image
                    source={require('src/assets/userPosition.png')}
                    style={{
                      width: 60,
                      height: 60
                    }}
                  />
                </Marker>
              )
            })
          }
        </MapView>
      </View>
    );
  };

  render() {
    const { language, theme } = this.props.state;
    const { churches, isLoading, region, streetView, mapType } = this.state;
    console.log(region, '---region---')
    return (
      <View style={{
        backgroundColor: Color.containerBackground
      }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={(event) => {
            let scrollingHeight = event.nativeEvent.layoutMeasurement.height + event.nativeEvent.contentOffset.y
            let totalHeight = event.nativeEvent.contentSize.height
            if (scrollingHeight >= (totalHeight)) {
              if (isLoading == false) {
                this.retrieveChurches(true)
              }
            }
          }}
        >
          <View style={{ marginBottom: height / 2 }}>
            <View>
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  bottom: 60,
                  right: 10,
                  zIndex: 100,
                  padding: 10,
                  borderRadius: 20,
                  backgroundColor: theme ? theme.primary : Color.primary
                }}
                onPress={() => {
                  this.setState({ mapType: mapType === 'standard' ? 'satellite' : 'standard' })
                }}
              >
                <Text style={{ color: 'white' }}>{mapType === 'standard' ? 'Satellite View' : 'Standard View'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  bottom: 10,
                  right: 10,
                  zIndex: 100,
                  padding: 10,
                  borderRadius: 20,
                  backgroundColor: !streetView ? (theme ? theme.primary : Color.primary) : Color.danger
                }}
                onPress={() => {
                  this.setState({ streetView: !streetView })
                }}
              >
                <Text style={{ color: 'white' }}>{!streetView ? 'Enable Street View' : 'Disable Street View'}</Text>
              </TouchableOpacity>
              {streetView &&
                <View style={{
                  flex: 1
                }}>
                  <StreetView
                    style={{
                      minWidth: width - 50,
                      minHeight: height - 300,
                      margin: 0
                    }}
                    allGesturesEnabled={true}
                    coordinate={region}
                    pov={{
                      tilt: parseFloat(0),
                      bearing: parseFloat(0),
                      zoom: parseInt(1)
                    }}
                    onSuccess={() => console.log('map loaded')}
                    onError={(event) => console.log('failed to load map', event.nativeEvent)}
                  />
                </View>}
              {!streetView && this.renderMap()}
            </View>
            {!isLoading && churches.length === 0 && <EmptyMessage message={language.emptyTithings} />}
            <View style={{ padding: 15 }}>
              {
                churches.map((item, index) => {
                  return (
                    <CardsWithIcon
                      key={index}
                      schedule={item.schedule}
                      item={item}
                      version={6}
                      description={'Direct Transfer'}
                      title={item.name}
                      date={item.address}
                      amount={null}
                    />
                  )
                })
              }
            </View>
            {
              (isLoading) && (
                <Skeleton size={3} template={'block'} height={75} />
              )
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
)(Masses);
