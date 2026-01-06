import React from 'react';
import { FlatList } from 'react-native';
import {
  ArrowIcon,
  Container,
  DetailsRow,
  EditButton,
  EditIcon,
  Email,
  HeaderButton,
  HeaderText,
  ItemRow,
  Mobile,
  Name,
} from './accordion-styles';

const editIcon = require('../../../../assets/icons/edit_blue.png');
const arrowDownIcon = require('../../../../assets/icons/caret/caret_down_blue.png');
const arrowupIcon = require('../../../../assets/icons/caret/caret_up_blue.png');

interface User {
  id: string;
  name: string;
  email?: string;
  mobile?: string;
}

interface AccordionProps {
  title: string;
  data: User[];
  isOpen: boolean;
  onPress: () => void;
  onEdit: (user: User) => void;
}

const Accordion: React.FC<AccordionProps> = ({
  title,
  data,
  isOpen,
  onPress,
  onEdit,
}) => {
  return (
    <Container>
      {/* Accordion Header */}
      <HeaderButton onPress={onPress}>
        <HeaderText>{title}</HeaderText>
        <ArrowIcon
          source={isOpen ? arrowupIcon : arrowDownIcon} // 🔹 toggle arrow icon
          resizeMode="contain"
        />
      </HeaderButton>

      {/* Accordion Content */}
      {isOpen && (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          style={{ backgroundColor: '#fff' }}
          renderItem={({ item }) => (
            <ItemRow>
              <DetailsRow>
                <Name numberOfLines={1} ellipsizeMode="tail">{item.name}</Name>
                {item.email && <Email numberOfLines={1} ellipsizeMode="tail">{item.email}</Email>}
                {item.mobile && <Mobile numberOfLines={1} ellipsizeMode="tail">{item.mobile}</Mobile>}
              </DetailsRow>

              <EditButton onPress={() => onEdit(item)}>
                <EditIcon source={editIcon} resizeMode="contain" />
              </EditButton>
            </ItemRow>
          )}
        />
      )}
    </Container>
  );
};


export default Accordion;
