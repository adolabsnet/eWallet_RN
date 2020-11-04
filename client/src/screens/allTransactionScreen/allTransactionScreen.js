import React, {useState, useContext, useEffect} from 'react';
import {View, Text, StatusBar, FlatList} from 'react-native';
import {Icon, Header} from 'react-native-elements';
import {ListItem} from 'react-native-elements';
import {ListTransaction, Button} from '../../components';
import {useMutation, useQuery} from 'react-query';
import {useNavigation} from '@react-navigation/native';
import color from '../../utils/color';
//import {formatRupiah} from '../../utils/formatRupiah';
import {styles} from './style';
import {UserContext} from '../../context/userContext';
import {API, urlAsset} from '../../config/api';
import {useIsDrawerOpen} from '@react-navigation/drawer';

function currencyFormat(num) {
  return num.toFixed().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}

export const allTransactionScreen = (props) => {
  const navigation = useNavigation();
  const [show, setShow] = useState(false);
  const [state, dispatch] = useContext(UserContext);
  const user = JSON.parse(state.user);

  const isDrawerOpen = useIsDrawerOpen();

  const {isLoading, data: transactionData, refetch} = useQuery(
    'getTransaction',
    () => API.get(`/transaction-user/${user.id}?limit=100`),
  );

  const renderItem = ({item}) => {
    return (
      <ListTransaction
        key={item.id}
        image={
          item.type === 1
            ? urlAsset.img + item.receiver.photo
            : urlAsset.img + item.sender.photo
        }
        name={
          item.type === 1
            ? item.receiver.first_name + ' ' + item.receiver.last_name
            : item.sender.first_name + ' ' + item.sender.last_name
        }
        ammount={
          item.type === 1
            ? '-' + currencyFormat(item.ammount)
            : '+' + currencyFormat(item.ammount)
        }
        date={item.date}
        time={item.time}
        description="Test"
        style={{
          backgroundColor: color.white,
          paddingLeft: 0,
          paddingRight: 0,
        }}
        color={color.black}
        colorAmmount={item.type === 1 ? color.red : color.green}
        onPress={() =>
          props.navigation.navigate('detail', {
            id_trx: item.id,
            type: item.type,
          })
        }
      />
    );
  };

  return (
    <>
      <StatusBar
        backgroundColor={isDrawerOpen ? color.primary : color.white}
        barStyle={isDrawerOpen ? 'light-content' : 'dark-content'}
        translucent={false}
      />
      <Header
        centerComponent={{
          text: 'All Transactions',
          style: {
            color: color.black,
            fontSize: 28,
            fontFamily: 'SFPro-Bold',
          },
        }}
        rightComponent={
          <Icon
            type="fontisto"
            name="move-h-a"
            size={30}
            onPress={() => navigation.openDrawer()}
          />
        }
        rightContainerStyle={{right: 10}}
        placement="left"
        containerStyle={{backgroundColor: color.white}}
      />
      <View style={styles.container}>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={transactionData.data.data.transactions}
            renderItem={renderItem}
            refreshing={isLoading}
            onRefresh={refetch}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </>
  );
};
