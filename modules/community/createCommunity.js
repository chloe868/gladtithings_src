import React, { Component, } from 'react';
import { View, Text, ScrollView, Dimensions, Alert, Image } from 'react-native';
import { Color, Routes, BasicStyles } from 'common';
import Footer from 'modules/generic/Footer';
import { connect } from 'react-redux';
import { Spinner } from 'components';
import CardsWithIcon from 'modules/generic/CardsWithIcon';
import InputFieldWithIcon from 'modules/generic/InputFieldWithIcon';
import { faUser, faEnvelope, faImage, faMapMarkerAlt, faGlobe, faSitemap} from '@fortawesome/free-solid-svg-icons';
import IncrementButton from 'components/Form/Button';
import Api from 'services/api/index.js';
import CardsWithImages from '../generic/CardsWithImages';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-picker';

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

class CreateCommunity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: null,
      address: null,
      category: null,
      email: null,
      website: null,
      errorMessage: null
    }
  }

  upload = () => {
    const { user } = this.props.state
    const options = {
      noData: true
    }
    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        this.setState({ photo: null })
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        this.setState({ photo: null })
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        this.setState({ photo: null })
      } else {
        ImageResizer.createResizedImage(response.uri, response.width * 0.5, response.height * 0.5, 'JPEG', 72, 0)
          .then(res => {

          })
          .catch(err => {
            // Oops, something went wrong. Check that the filename is correct and
            // inspect err to get more details.
            console.log('[ERROR]', err)
          });
      }
    })}

  submit = () => {
    const { user } = this.props.state;
    const { title, address, category, email, website } = this.state;
    if(user == null){
      return null
    }

    let parameter = {
      account_id: user.id,
      title,
      address,
      category,
      email,
      website
    }
    console.log({
      parameter
    })
    this.setState({ isLoading: true })
    Api.request(Routes.pageCreate, parameter, response => {
      this.setState({ isLoading: false })
      console.log({
        response
      })
      
    }, error => {
      this.setState({ isLoading: false })
    });
  }

  render() {
    const { theme, user } = this.props.state;
    const { language } = this.props.state;
    return (
      <View style={{
        height: height,
        backgroundColor: Color.containerBackground
      }}>
        {this.state.isLoading ? <Spinner mode="overlay" /> : null}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{
            paddingLeft: 20,
            paddingRight: 20,
            minHeight: height * 1.5
          }}>
            <InputFieldWithIcon
              placeholder={language.community.name_placeholder}
              icon={faUser}
              label={language.community.name}
              onTyping={(title) => {
                this.setState({title})
              }}
            />

            <InputFieldWithIcon
              placeholder={language.community.address_placeholder}
              icon={faMapMarkerAlt}
              label={language.community.address}
              onTyping={(address) => {
                this.setState({address})
              }}
            />

            <InputFieldWithIcon
              placeholder={language.community.category_placeholder}
              icon={faSitemap}
              label={language.community.category}
              onTyping={(category) => {
                this.setState({category})
              }}
            />

            <InputFieldWithIcon
              placeholder={language.community.website_placeholder}
              icon={faGlobe}
              label={language.community.website}
              onTyping={(website) => {
                this.setState({website})
              }}
            />

            <InputFieldWithIcon
              placeholder={language.community.email_placeholder}
              icon={faEnvelope}
              label={language.community.email}
              onTyping={(email) => {
                this.setState({email})
              }}
            />
            
            {/*<Text
              style={{marginTop: 22}}
            >{language.community.logo}</Text>

            <Text style={{
              marginTop: 5,
              fontSize: BasicStyles.standardFontSize - 2
            }}>512px x 512px</Text>
            <TouchableOpacity
              style={{
                borderWidth: 0.5,
                borderColor: Color.gray,
                marginTop: 20,
                backgroundColor: Color.white,
                borderRadius: 5,
                width: '100%',
                display: 'flex',
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onPress={() => {
                this.upload()
              }}
              >
              <FontAwesomeIcon
                icon={faImage}
                size={150}
                color={Color.gray}
              />
            </TouchableOpacity>

            <Text
              style={{marginTop: 22}}
            >{language.community.banner}</Text>

            <TouchableOpacity
              style={{
                borderWidth: 0.5,
                borderColor: Color.gray,
                marginTop: 20,
                backgroundColor: Color.white,
                borderRadius: 5,
                width: '100%',
                display: 'flex',
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onPress={() => {
                this.upload()
              }}
              >
              <FontAwesomeIcon
                icon={faImage}
                size={150}
                color={Color.gray}
              />
            </TouchableOpacity>*/}
            

            <View style={{
              marginTop: 20,
              marginBottom: 20
            }}>
              
              <IncrementButton style={{
                  backgroundColor: Color.secondary,
                  width: '100%',
                  marginTop: 20,
                  marginBottom: 100
                }}
                textStyle={{
                  fontFamily: 'Poppins-SemiBold'
                }}
                onClick={() => {
                  this.submit()
                }}
                title={language.community.submit}
              />
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
)(CreateCommunity);