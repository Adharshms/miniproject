import { Image, ScrollView, StyleSheet, Text, View,TextInput } from 'react-native'
import React,{useState} from 'react'

export default function ContacttList() {
    const [searchText,setSearchText]=useState('');
    const contacts=[
        {
            uid:1,
            name:'Mohan Lal',
            status:'Actor',
            imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Mohanlal_Viswanathan_BNC.jpg/330px-Mohanlal_Viswanathan_BNC.jpg'
        },
        {
            uid:2,
            name:'Mammootty',
            status:'Actor',
            imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/1694712686978_jbvm34_2_0.jpg/330px-1694712686978_jbvm34_2_0.jpg'
        },
        {
            uid:3,
            name:'prithvi Raj',
            status:'Actor',
            imageUrl:'https://m.media-amazon.com/images/M/MV5BODQ2NTlkYjItZTIyNi00ZTM0LTk3OTctNzkzYWI1ZWI0ODEyXkEyXkFqcGc@.V1.jpg'
        },
        {
            uid:4,
            name:'P T Usha',
            status:'Athlete',
            imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/P._T._Usha.jpg/330px-P._T._Usha.jpg'
        },
        {
            uid:5,
            name:'Arijith Singh',
            status:'Singer',
            imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Arijit_5th_GiMA_Awards.jpg/330px-Arijit_5th_GiMA_Awards.jpg'
        }
    ];
    const filteredContacts=contacts.filter(contact=>
        contact.name.toLowerCase().includes(searchText.toLowerCase())
    );
  return (
    <View>
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        onChangeText={(text)=>setSearchText(text)}
      />
      <Text style={styles.headingText}>Contact tList</Text>
      <ScrollView style={styles.Container} scrollEnabled={false}>
        {filteredContacts.map(({uid,name,status,imageUrl})=>(
            <View key={uid} style={styles.userCard}>
                <Image
                source={{
                    uri:imageUrl

                }}
                style={styles.userImage}
                />
                <View>
                    <Text style={styles.userName}>{name}</Text>
                    <Text style={styles.userStatus}>{status}</Text>     
                </View>
            </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
    headingText:{
        fontSize: 24,
        fontWeight: 'bold',
        paddingHorizontal: 15,
    },
    Container:{
        paddingHorizontal:16,
        marginBottom:10
    },
    userCard:{
        flex:1,
        flexDirection:'row',
        alignItems:"center",
        paddingVertical:5,
        backgroundColor:"#3245",
        paddingHorizontal:7,
        borderRadius:10,
        margin:3
    },
    userImage:{
        height:60,
        width:60,
        borderRadius:30,
        marginRight:14
        
    },
    userName:{
        fontSize:16,
        fontWeight:'600'
    },
    userStatus:{
        fontSize:13,
    },
    searchInput:{
        height:40,
        borderColor:'#ccc',
        borderWidth:1,
        paddingHorizontal:10,
        marginHorizontal:16,
        marginVertical:8
    },
})