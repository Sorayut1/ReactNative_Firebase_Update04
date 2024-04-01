import React, { Component,useState } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, Text ,Alert} from 'react-native';
import { firebase } from '../database/firebaseDb';
import { ThemeProvider, Button, Input, Image } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import RNPickerSelect from 'react-native-picker-select';
import { CheckBox } from 'react-native-elements';

 
class UserDetailScreen extends Component{

    constructor(){
        super();

        this.state = {
            name_song: '',
            artist: '',
            band: '',
            Year_published: '',
            link: '',
            detail: '',
            data:[],
            isLoading: true
        }
    }

        componentDidMount() {
        const dbRef = firebase.firestore().collection('firebase').doc(this.props.route.params.userKey);
        dbRef.get().then((res) => {
            if (res.exists) {
                const user = res.data();
                this.setState({
                    key: res.id,
                    name_song: user.name_song,
                    artist: user.artist,
                    band: user.band,
                    Year_published: user.Year_published,
                    link: user.link,
                    detail: user.detail,
                    numberViews:user.numberViews,
                    topLike:user.topLike,
                    data:user.data,
                    isLoading: false
                })
            } else {
                console.log('Document does not exist!');
            }
        })
    }

    inputValueUpdate = (val, prop) => {
        const state = this.state;
        state[prop] = val !== '' ? val : null; // ถ้า val ไม่ใช่ค่าว่าง ให้เก็บค่า val ถ้า val เป็นค่าว่าง ให้เก็บค่า null
        this.setState(state);
    }



    handleCheck1 = () => {
        this.setState({
            isSelected1: true,
            isSelected2: false,
            Year_published: 'ชาย'
        });
    };
    handleCheck2 = () => {
        this.setState({
            isSelected1: false,
            isSelected2: true,
            Year_published: 'หญิง'
        });
    };

    updateUser() {
        this.setState({
            isLoading: true
        });
    
        const { name_song, artist, band, Year_published, detail, link, numberViews, topLike } = this.state;
    
        // เช็คค่า numberViews และ topLike ว่าไม่ใช่ undefined หรือไม่
        const data = [];
        if (typeof numberViews !== 'undefined' && typeof topLike !== 'undefined') {
            data.push(numberViews, topLike);
        }
    
        const updateDBRef = firebase.firestore().collection('firebase').doc(this.state.key);
        updateDBRef.set({
            name_song: name_song || '',
            artist: artist || '',
            band: band || '',
            Year_published: Year_published || '',
            detail: detail || '',
            link: link || '',
            data: data,  // ส่งค่า data ที่เช็คค่าไม่ใช่ undefined เพื่อเขียนลงใน Firestore
            numberViews: typeof numberViews !== 'undefined' ? numberViews : null,
            topLike: typeof topLike !== 'undefined' ? topLike : null,
        }).then((docRef) => {
            this.setState({
                key: '',
                name_song: '',
                artist: '',
                band: '',
                Year_published: '',
                detail: '',
                link: '',
                numberViews: '',
                topLike: '',
                isLoading: false
            });
            this.props.navigation.navigate('UserScreen');
        })
        .catch((err) => {
            console.error('Error:', err),
            this.setState({
                isLoading: false,
            })
        });
    }
    

    deleteUser() {
        const dbRef = firebase.firestore().collection('firebase').doc(this.props.route.params.userKey);
        dbRef.delete().then(() => {
            console.log("Item removed from database");
            this.props.navigation.navigate('UserScreen');
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }
    
    openTwoButtonAlert() {
        Alert.alert(
            'Delete User',
            'Are you sure?',
            [
                {text: 'Yes', onPress: () => this.deleteUser()},
                {text: 'No', onPress: () => console.log('No item was removed'), style: 'cancel'}
            ],
            {
                cancelable: true
            }
        );
    }




    render() {

        if (this.state.isLoading) {
            return (
                <View style={styles.preloader}>
                    <ActivityIndicator size="large" color="#9E9E9E" />
                </View>
            )
        }
        const placeholder = {
            label: this.state.band,
            value: null,
          };
     
        const options = [
            { label: 'Rock', value: 'Rock' },
            { label: 'Pop', value: 'Pop' },
            { label: 'Electronic', value: 'Electronic' },
            { label: 'Indie', value: 'Indie' },
            { label: 'R&B', value: 'R&B' },
            { label: 'Metal', value: 'Metal' },
            { label: 'Country', value: 'Country' },
            { label: 'Jazz', value: 'Jazz' },
            { label: 'Classical', value: 'Classical' },
            { label: 'Hip Hop', value: 'Hip Hop' },
        ];
          
        return (
            <View style={styles.container}>
            <ScrollView >
                <Image
                    source={{ uri: this.state.link }}
                    style={{ width: 200, height: 200, alignSelf: 'center' }}
                    containerStyle={{ marginLeft: 'auto', marginRight: 'auto' }}
                />
                <Text>ชื่อเพลง :</Text>
                <Input
                    placeholder={'ชื่อเพลง'}
                    value={this.state.name_song}
                    onChangeText={(val) => this.inputValueUpdate(val, 'name_song')}
                />
                <Text>ชื่อผู้แต่ง :</Text>
                <Input
                    placeholder={'ชื่อผู้แต่ง'}
                    value={this.state.artist}
                    onChangeText={(val) => this.inputValueUpdate(val, 'artist')}
                />
                <Text>เพศ :</Text>
                <Input
                    placeholder={'เพศ'}
                    value={this.state.Year_published}
                    onChangeText={(val) => this.inputValueUpdate(val, 'Year_published')}
                />
                    <CheckBox
                            checked={this.state.isSelected1}
                            onPress={this.handleCheck1}
                            title={"ชาย"}
                        />
                        <CheckBox
                            checked={this.state.isSelected2}
                            onPress={this.handleCheck2}
                            title={"หญิง"}
                        />
                 <Text>วงดนตรี :</Text>
                    <RNPickerSelect
                        placeholder={placeholder}
                        items={options}
                        onValueChange={(val) => this.inputValueUpdate(val, 'band')}
                        value={this.state.band}
                        style={pickerSelectStyles}
                    />
                <Text>รายละเอียด :</Text>
                <Input
                    placeholder={'รายละเอียด'}
                    value={this.state.detail}
                    onChangeText={(val) => this.inputValueUpdate(val, 'detail')}
                />
                <Text>Link รูปภาพ :</Text>
                <Input
                    placeholder={'link'}
                    value={this.state.link}
                    onChangeText={(val) => this.inputValueUpdate(val, 'link')}
                />

                <Text>ยอดวิว : {this.state.data[0]}</Text>
                <Input 
                    leftIcon={
                        <Icon 
                            name='mobile'
                            size={30}
                            color='#0085E6'
                        />
                    }
                    placeholder={'  ยอดวิว'}
                    value={this.state.numberViews || this.state.data[0]}
                    onChangeText={(val) => this.inputValueUpdate(val, 'numberViews')}
                />
                <Text></Text>
                <Text>ยอดไลค์ : {this.state.data[1]}</Text>
                <Input 
                    leftIcon={
                        <Icon 
                            name='mobile'
                            size={30}
                            color='#0085E6'
                        />
                    }
                    placeholder={'  ยอดไลค์'}
                    value={this.state.topLike || this.state.data[1]}
                    onChangeText={(val) => this.inputValueUpdate(val, 'topLike')}
                />

                    
                    
                    
                <Button
                    icon={
                        <Icon
                            name="wrench"
                            size={15}
                            color="#fff"
                        />
                    }
                    title='  แก้ไข'
                    onPress={() => this.updateUser()}
                />
                <Button
                    icon={
                        <Icon
                            name="trash"
                            size={15}
                            color="#fff"
                        />
                    }
                    title='  ลบข้อมูล'
                    containerStyle={{
                        marginTop: 10
                    }}
                    buttonStyle={{
                        backgroundColor: "red"
                    }}
                    onPress={() => this.openTwoButtonAlert()}
                />
            </ScrollView>
            </View>
        )
    }
    
}


const theme = {
    Button: {
        raised: true
    }
}

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: 'purple',
      borderRadius: 8,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
  });

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        overflowY: 'scroll',
        marginVertical: 20,
        paddingHorizontal: 20,
    },
    preloader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
      label: {
        fontSize: 16,
        marginBottom: 10,
      },
      selectedText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
      },
})

export default UserDetailScreen;