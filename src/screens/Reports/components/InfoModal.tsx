import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
} from "react-native";

interface InfoModalProps {
  visible: boolean;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <ScrollView>
                <Text style={styles.text}>DT = Distance Travelled</Text>
                <Text style={styles.text}>TDT = Total Distance Travelled</Text>
                <Text style={styles.text}>TT = Travel Time</Text>
                <Text style={styles.text}>TTT = Total Travel Time</Text>
                <Text style={styles.text}>IT = Idle Time</Text>
                <Text style={styles.text}>TIT = Total Idle Time</Text>
                <Text style={styles.text}>TID = Total Number of Idle Times</Text>
                <Text style={styles.text}>ST = Stoppage Time</Text>
                <Text style={styles.text}>TST = Total Stoppage Time</Text>
                <Text style={styles.text}>TOT = Total Operation Time</Text>
                <Text style={styles.text}>OT = Operation Time</Text>
                <Text style={styles.text}>MS = Max Speed</Text>
                <Text style={styles.text}>SV = Speed Violations</Text>
                <Text style={styles.text}>
                  EXSV = Excess Speed Violations events (&gt; 125 km/hr)
                </Text>
                <Text style={styles.text}>TSV = Total Speed Violation</Text>
                <Text style={styles.text}>HA = Harsh Acceleration</Text>
                <Text style={styles.text}>HB = Harsh Breaking</Text>
                <Text style={styles.text}>HC = Harsh Cornering</Text>
                <Text style={styles.text}>SBV = Seat Belt Violations</Text>
                <Text style={styles.text}>OD = Overspeed Duration</Text>
                <Text style={styles.text}>AS = Average Speed</Text>
                <Text style={styles.text}>TTR = Total Trips</Text>
                <Text style={styles.text}>FAT = Fleet Average Total</Text>
                <Text style={styles.text}>DS = Danger Score</Text>
                <Text style={styles.text}>SFS = Safety Score</Text>
                <Text style={styles.text}>ES = Efficiency Score</Text>
                <Text style={styles.text}>ECS = Eco Score</Text>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    maxHeight: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  text: {
    fontSize: 14,
    marginBottom: 6,
    color: "#333",
  },
});

export default InfoModal;
