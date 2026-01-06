import React from "react";
import { StatusBar, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/colors";
import { Content, Icon, Message, SafeArea } from "./nointernet-styles";

const noInternet = require("../../assets/icons/no_internet_grey.png");

const NoInternet: React.FC = () => {
  return (
    <SafeArea>
      <StatusBar
        backgroundColor={Colors.primary_background_color}
        barStyle="light-content"
      />
      <Content>
        <Icon source={noInternet} resizeMode="contain" />
        <Message>No Internet</Message>
      </Content>
    </SafeArea>
  );
};

export default NoInternet;