import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../../constants/colors";
import Accordion from "./Accordion/Accordion";
import { useGetUserManagementTreeListQuery } from "../../../services/user";

const AccordionList: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const navigation = useNavigation();

  const { data, isLoading, isError } = useGetUserManagementTreeListQuery();
  console.log(data, 'userLists');
  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleEdit = (user: any) => {
    (navigation as any).navigate("EditUser", { user });
  };

  // 🔹 Transform API response into Accordion format
  const transformData = (apiResponse: any[]) => {
    if (!apiResponse || !Array.isArray(apiResponse)) return [];

    console.log('🔍 Raw API Response:', apiResponse);

    // Separate groups and users
    const groups = apiResponse.filter(item => item.groupOrUser === 'Group');
    const users = apiResponse.filter(item => item.groupOrUser === 'User');

    console.log('🔍 Groups:', groups);
    console.log('🔍 Users:', users);

    // Group users by their parentGroupId
    return groups.map((group) => {
      const groupUsers = users.filter(user => user.parentGroupId === group.id);

      console.log(`🔍 Group "${group.name}" has ${groupUsers.length} users`);

      return {
        title: group.name,
        data: groupUsers.map((user: any) => ({
          id: user.id.toString(),
          name: user.name,
          email: user.email || "",
          mobile: user.phone || "",
        })),
      };
    });
  };

  const dataSets = transformData(data);

  if (isLoading) {
    return <Text style={{ textAlign: "center", marginTop: 20 }}>Loading...</Text>;
  }

  if (isError) {
    return <Text style={{ textAlign: "center", marginTop: 20 }}>Failed to load data</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerText, { flex: 1 }]}>Name</Text>
        <Text style={[styles.headerText, { flex: 1 }]}>Email</Text>
        <Text style={[styles.headerText, { flex: 1 }]}>Mobile</Text>
      </View>

      {/* ✅ Accordions from API */}
      {dataSets.map((section, index) => (
        <Accordion
          key={index}
          title={section.title}
          data={section.data}
          isOpen={openIndex === index}
          onPress={() => toggleAccordion(index)}
          onEdit={handleEdit}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingRight: 30,
    backgroundColor: Colors.primary_blue_80_color,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
  },
});

export default AccordionList;
