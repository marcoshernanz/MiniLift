import getColor from "@/lib/getColor";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
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
  const [visible, setVisible] = useState(showDropdown);

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
    let timeout: ReturnType<typeof setTimeout>;
    if (showDropdown) {
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
      opacity.value = withTiming(0, {
        duration: 200,
        easing: Easing.out(Easing.ease),
      });
      scale.value = withTiming(0.9, {
        duration: 200,
        easing: Easing.out(Easing.ease),
      });
      timeout = setTimeout(() => setVisible(false), 200);
    }
    return () => clearTimeout(timeout);
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
            keyboardShouldPersistTaps="handled"
            data={filteredOptions}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({ item }) => (
              <Pressable
                style={styles.dropdownItem}
                onPress={() => {
                  setSearchText(item);
                  onChange(item);
                  setShowDropdown(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{item}</Text>
              </Pressable>
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
    maxHeight: 221,
    backgroundColor: getColor("background"),
    borderColor: getColor("border"),
    borderWidth: 1,
    borderRadius: 8,
    elevation: 1,
    zIndex: 1000,
  },
  dropdownItemText: {
    color: getColor("foreground"),
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: getColor("border"),
  },
});
