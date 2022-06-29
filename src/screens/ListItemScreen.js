import { View, Text,FlatList ,StyleSheet,Linking,Platform,RefreshControl} from 'react-native'
import React, { useEffect, useState ,useCallback} from 'react';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}
const ListItemScreen = () => {
  const [data,setData]=useState([])
  const [refreshing, setRefreshing] = useState(false);
useEffect(()=>{
const getData=async ()=>{
  const snapshots = await getDocs(collection(db,'ads'))
  const ads = snapshots.docs.map(doc=>({
    ...doc.data(),id:doc.id
  }))
setData(ads)
}
getData()

},[])
function useAsync(asyncFn, onSuccess) {
  useEffect(() => {
    let isActive = true;
    asyncFn().then(data => {
      if (isActive) onSuccess(data);
    });
    return () => { isActive = false };
  }, [asyncFn, onSuccess]);
}    
const phoneDial = (phone)=>{
  let phoneNumber = '';
    if (Platform.OS === 'android') { phoneNumber = `tel:${phone}`; }
    else {phoneNumber = `telprompt:${phone}`; }
    Linking.openURL(phoneNumber);

}

//     const myItem=[{
//         name:"iphone",
//         year:"2013",
//         phone:"123456789",
//         image:"https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8aXBob25lfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
//         desc:"i am selling this iphone"
//     },
//     {
//         name:"camera",
//         year:"2014",
//         phone:"123456779",
//         image:"https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8aXBob25lfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
//         desc:"i am selling this iphone"
//     },     
// ]
const renderItem = (item) =>{
  
    return(
        <Card style={styles.card}>
    <Card.Title title={item?.first_name}  />
    <Card.Content>
     
      <Paragraph>{item?.descryption}</Paragraph>
      <Paragraph>{item?.years}</Paragraph>
    </Card.Content>
    <Card.Cover source={{ uri: item?.image }} />
    <Card.Actions>
      <Button>{item?.price}</Button>
      <Button onPress={()=>phoneDial(item.phone_number)}>call seller</Button>
    </Card.Actions>
  </Card>
    )
}
const onRefresh = useCallback(() => {
  setRefreshing(true);
  wait(200).then(() => setRefreshing(false));
}, []);
  return (
    <View>
     <FlatList
     refreshControl={
      <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          tintColor="#F8852D"/>
  }
     data={data}
     renderItem={({item})=>renderItem(item)}

     />
     
    </View>
  )
}
const styles = StyleSheet.create({
  card:{
    margin:10,
    elevation:2
  }  
})
export default ListItemScreen