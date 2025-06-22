import getColor from "@/lib/getColor";
import searchItems from "@/lib/searchItems";
import { StarIcon } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInputProps,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import TextInput, { TextInputHandle } from "./TextInput";

interface ComboBoxProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  editable?: boolean;
  onInputFocus?: () => void;
  onInputBlur?: () => void;
  inputProps?: TextInputProps;
  inputRef?: React.Ref<TextInputHandle>;
  favorites?: string[];
}

export default function ComboBox({
  options,
  value,
  onChange,
  placeholder = "",
  editable = true,
  onInputFocus,
  onInputBlur,
  inputProps,
  inputRef,
  favorites = [],
}: ComboBoxProps) {
  const [searchText, setSearchText] = useState(value);
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
  const [showDropdown, setShowDropdown] = useState(false);
  const [visible, setVisible] = useState(showDropdown);

  useEffect(() => {
    setSearchText(value);
  }, [value]);

  const favoritesSet = new Set(favorites);
  const sortedOptions = favorites.length
    ? [...filteredOptions].sort(
        (a, b) => (favoritesSet.has(b) ? 1 : 0) - (favoritesSet.has(a) ? 1 : 0)
      )
    : filteredOptions;

  const handleChangeText = (text: string) => {
    setSearchText(text);
    onChange(text);

    setFilteredOptions(
      searchItems({
        items: options,
        query: text,
        getText: (item) => item,
      })
    );
    setShowDropdown(true);
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
        {...inputProps}
        placeholder={placeholder}
        value={searchText}
        onChangeText={handleChangeText}
        editable={editable}
        ref={inputRef}
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
            data={sortedOptions}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({ item }) => (
              <Pressable
                style={styles.dropdownItem}
                android_ripple={{ color: getColor("muted") }}
                onPress={() => {
                  setSearchText(item);
                  onChange(item);
                  setShowDropdown(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{item}</Text>
                {favoritesSet.has(item) && (
                  <View style={styles.starIconContainer}>
                    <StarIcon
                      size={18}
                      color={getColor("primary")}
                      fill={getColor("primary")}
                      strokeWidth={1.75}
                    />
                  </View>
                )}
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
    overflow: "hidden",
  },
  dropdownItemText: {
    color: getColor("foreground"),
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: getColor("border"),
  },
  starIconContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
