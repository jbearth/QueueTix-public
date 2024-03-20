import { View, Text, SafeAreaView } from "react-native";
import React, { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import QuestionTab from "./QuestionTab";
import QuestionList from "./QuestionList";
import { Block } from "@src/components";

const FAQScreen = () => {
    const [selectedTab, setSelectedTab]: [number, Dispatch<SetStateAction<number>>] = useState(0);
    const [expanded, setExpanded]: [string[], Dispatch<SetStateAction<string[]>>] = useState([""]);
    return (
        <Block align='center' bgcolor={"#fff"}>
            <View
                style={{
                    backgroundColor: "#F3C95B",
                    width: "85%",
                    height: 50,
                    borderRadius: 10,
                    borderColor: "black",
                    borderWidth: 2,
                    justifyContent: "center",
                    marginTop: 30,
                }}
            >
                <Text style={{ fontSize: 16, padding: 10, fontWeight: "bold" }}>FAQ</Text>
            </View>
            <QuestionTab selectedTab={selectedTab} setSelectedTab={setSelectedTab} setExpanded={setExpanded} />
            <View
                style={{
                    width: "85%",
                    borderColor: "#000000",
                    borderWidth: 2,
                    borderRadius: 10,
                }}
            >
                <QuestionList selectedTab={selectedTab} expanded={expanded} setExpanded={setExpanded} />
            </View>
        </Block>
    );
};

export default FAQScreen;
