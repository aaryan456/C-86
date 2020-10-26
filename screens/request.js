import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'

export default class request extends Component{
  constructor(){
    super();
    this.state ={
      userId : firebase.auth().currentUser.email,
      bookName:"",
      reasonToRequest:"",
      IsBookRequestActive : "",
      requestitemname: "",
      bookStatus:"",
      requestId:"",
      userDocId: '',
      docId :''
    }
  }

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }



  addRequest = async (bookName,reasonToRequest)=>{
    var userId = this.state.userId
    var randomRequestId = this.createUniqueId()
    db.collection('requests').add({
        "user_id": userId,
        "exchange":bookName,
        "reason_to_request":reasonToRequest,
        "request_id"  : randomRequestId,
        "requestStatus" : "requested",
         "date"       : firebase.firestore.FieldValue.serverTimestamp()

    })

    await  this.getBookRequest()
    db.collection('users').where("user_id","==",userId).get()
    .then()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        db.collection('users').doc(doc.id).update({
      IsBookRequestActive: true
      })
    })
  })

    this.setState({
        bookName :'',
        reasonToRequest : '',
        requestId: randomRequestId
    })

    return Alert.alert("Book Requested Successfully")


  }

receivedBooks=(bookName)=>{
  var userId = this.state.userId
  var requestId = this.state.requestId
  db.collection('received_books').add({
      "user_id": userId,
      "exchange":bookName,
      "request_id"  : requestId,
      "bookStatus"  : "received",

  })
}




getIsBookRequestActive(){
  db.collection('users')
  .where('user_id','==',this.state.userId)
  .onSnapshot(querySnapshot => {
    querySnapshot.forEach(doc => {
      this.setState({
        IsBookRequestActive:doc.data().IsBookRequestActive,
        userDocId : doc.id
      })
    })
  })
}










getBookRequest =()=>{

var bookRequest=  db.collection('requests')
  .where('user_id','==',this.state.userId)
  .get()
  .then((snapshot)=>{
    snapshot.forEach((doc)=>{
      if(doc.data().requestStatus !== "received"){
        this.setState({
          requestId : doc.data().request_id,
          requestitemname: doc.data().exchange,
          bookStatus:doc.data().requestStatus,
          docId     : doc.id
        })
      }
    })
})}



sendNotification=()=>{
  //to get the first name and last name
  db.collection('users').where('user_id','==',this.state.userId).get()
  .then((snapshot)=>{
    snapshot.forEach((doc)=>{
      var name = doc.data().first_name
      var lastName = doc.data().last_name

      // to get the donor id and book nam
      db.collection('notification').where('request_id','==',this.state.requestId).get()
      .then((snapshot)=>{
        snapshot.forEach((doc) => {
          var donorId  = doc.data().donor_id
          var bookName =  doc.data().exchange

          //targert user id is the donor id to send notification to the user
          db.collection('notification').add({
            "targeted_user_id" : donorId,
            "message" : name +" " + lastName + " received the book " + bookName ,
            "notification_status" : "unread",
            "exchange" : bookName
          })
        })
      })
    })
  })
}

componentDidMount(){
  this.getBookRequest()
  this.getIsBookRequestActive()

}

updateBookRequestStatus=()=>{
  //updating the book status after receiving the book
  db.collection('requests').doc(this.state.docId)
  .update({
    requestStatus : 'recieved'
  })

  //getting the  doc id to update the users doc
  db.collection('users').where('user_id','==',this.state.userId).get()
  .then((snapshot)=>{
    snapshot.forEach((doc) => {
      //updating the doc
      db.collection('users').doc(doc.id).update({
        IsBookRequestActive: false
      })
    })
  })


}


  render(){

    if(this.state.IsBookRequestActive === true){
      return(

        // Status screen

        <View style = {{flex:1,justifyContent:'center'}}>
          <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
          <Text>Book Name</Text>
          <Text>{this.state.requestitemname}</Text>
          </View>
          <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
          <Text> Book Status </Text>

          <Text>{this.state.bookStatus}</Text>
          </View>

          <TouchableOpacity style={{borderWidth:1,borderColor:'orange',backgroundColor:"orange",width:300,alignSelf:'center',alignItems:'center',height:30,marginTop:30}}
          onPress={()=>{
            this.sendNotification()
            this.updateBookRequestStatus();
            this.receivedBooks(this.state.requestitemname)
          }}>
          <Text>I recieved the book </Text>
          </TouchableOpacity>
        </View>
      )
    }
    else
    {
    return(
      // Form screen
        <View style={{flex:1}}>
          <MyHeader title="Request Item" navigation ={this.props.navigation}/>

          <ScrollView>
            <KeyboardAvoidingView style={styles.keyBoardStyle}>
              <TextInput
                style ={styles.formTextInput}
                placeholder={"enter product to be requested"}
                onChangeText={(text)=>{
                    this.setState({
                        bookName:text
                    })
                }}
                value={this.state.bookName}
              />
              <TextInput
                style ={[styles.formTextInput,{height:300}]}
                multiline
                numberOfLines ={8}
                placeholder={"reason to request the product"}
                onChangeText ={(text)=>{
                    this.setState({
                        reasonToRequest:text
                    })
                }}
                value ={this.state.reasonToRequest}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={()=>{ this.addRequest(this.state.bookName,this.state.reasonToRequest);
                }}
                >
                <Text>Request</Text>
              </TouchableOpacity>

            </KeyboardAvoidingView>
            </ScrollView>
        </View>
    )
  }
}
}

const styles = StyleSheet.create({
  keyBoardStyle : {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  formTextInput:{
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:'#ffab91',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10,
  },
  button:{
    width:"75%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop:20
    },
  }
)
