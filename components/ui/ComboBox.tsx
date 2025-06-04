import getColor from "@/lib/getColor";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import TextInput from "./TextInput";

interface ComboBoxProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  editable?: boolean;
  onInputFocus?: () => void;
  onInputBlur?: () => void;
}

export default function ComboBox({
  options,
  value,
  onChange,
  placeholder = "",
  editable = true,
  onInputFocus,
  onInputBlur,
}: ComboBoxProps) {
  const [searchText, setSearchText] = useState(value);
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
  const [showDropdown, setShowDropdown] = useState(false);
  // visible flag to keep mounted during exit animation
  const [visible, setVisible] = useState(showDropdown);
  // ref to current showDropdown for animation callbacks
  const showDropdownRef = useRef(showDropdown);
  useEffect(() => {
    showDropdownRef.current = showDropdown;
  }, [showDropdown]);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const dropdownHeight = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value },
      { translateY: (-dropdownHeight.value * (1 - scale.value)) / 2 },
    ],
  }));

  useEffect(() => {
    setSearchText(value);
  }, [value]);

  const handleChangeText = (text: string) => {
    setSearchText(text);
    onChange(text);
    setFilteredOptions(
      options.filter((item) => item.toLowerCase().includes(text.toLowerCase()))
    );
  };

  useEffect(() => {
    if (showDropdown) {
      // show and animate in
      setVisible(true);
      opacity.value = withTiming(1, {
        duration: 200,
        easing: Easing.out(Easing.ease),
      });
      scale.value = withTiming(1, {
        duration: 200,
        easing: Easing.out(Easing.ease),
      });
    } else {
      // animate out then unmount
      opacity.value = withTiming(
        0,
        { duration: 200, easing: Easing.out(Easing.ease) },
        (finished) => {
          if (finished && !showDropdownRef.current) {
            runOnJS(setVisible)(false);
          }
        }
      );
      // scale out without blocking unmount callback
      scale.value = withTiming(0.9, {
        duration: 200,
        easing: Easing.out(Easing.ease),
      });
    }
  }, [showDropdown, opacity, scale]);

  return (
    <View>
      <TextInput
        placeholder={placeholder}
        value={searchText}
        onChangeText={handleChangeText}
        editable={editable}
        onFocus={() => {
          onInputFocus && onInputFocus();
          setShowDropdown(true);
        }}
        onBlur={() => {
          onInputBlur && onInputBlur();
          setTimeout(() => setShowDropdown(false), 100);
        }}
      />
      {visible && (
        <Animated.View
          style={[styles.dropdown, animatedStyle]}
          onLayout={(e) => {
            dropdownHeight.value = e.nativeEvent.layout.height;
          }}
        >
          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSearchText(item);
                  onChange(item);
                  setShowDropdown(false);
                }}
              >
                <Text style={styles.dropdownItem}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    position: "absolute",
    top: 45,
    left: 0,
    right: 0,
    backgroundColor: getColor("background"),
    borderColor: getColor("border"),
    borderWidth: 1,
    borderRadius: 8,
    elevation: 1,
    zIndex: 1000,
  },
  dropdownItem: {
    padding: 10,
    fontSize: 16,
    color: getColor("foreground"),
  },
});
