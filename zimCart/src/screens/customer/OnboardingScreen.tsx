import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");
const isSmallScreen = height < 700;

interface Slide {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

const slides: Slide[] = [
  {
    id: "0",
    title: "ZimCart",
    description: "",
    icon: "store",
  },
  {
    id: "1",
    title: "Real - Time Tracking",
    description:
      "Track your deliveries in real-time and know exactly where your package is at every moment",
    icon: "map-marker",
  },
  {
    id: "2",
    title: "Order Groceries in\nMinutes",
    description:
      "Book your delivery in just a few taps with our simple and intuitive interface",
    icon: "basket",
  },
  {
    id: "3",
    title: "Secure Shipping",
    description:
      "We ensure your package is handled with care and delivered safely to your hands.",
    icon: "shield-check-outline",
  },
  {
    id: "4",
    title: "24/7 Support",
    description:
      "Our support team is available around the clock to assist you with any issues.",
    icon: "headset",
  },
];

const SlideItem = ({ item }: { item: Slide }) => {
  return (
    <View style={{ width }} className="items-center justify-center px-8">
      <Animated.View
        entering={FadeInUp.delay(200).duration(1000)}
        className={`items-center justify-center ${isSmallScreen ? "mb-6" : "mb-10"}`}
      >
        <View 
          className={`rounded-full bg-white items-center justify-center ${isSmallScreen ? "w-[140px] h-[140px]" : "w-[180px] h-[180px]"}`}
        >
          <MaterialCommunityIcons name={item.icon} size={isSmallScreen ? 60 : 80} color="#2e7d32" />
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(400).duration(1000)}
        className="items-center"
      >
        <Text className={`${isSmallScreen ? "text-xl" : "text-2xl"} font-bold text-white text-center mb-4 tracking-wider leading-8`}>
          {item.title}
        </Text>
        {item.description ? (
          <Text className={`${isSmallScreen ? "text-sm" : "text-base"} text-white text-center opacity-90 leading-6 max-w-[90%]`}>
            {item.description}
          </Text>
        ) : null}
      </Animated.View>
    </View>
  );
};

export default function OnboardingScreen() {
  const navigation = useNavigation<any>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      // Navigate to Home Hub
      navigation.navigate('Main');
    }
  };

  const handleSkip = () => {
    navigation.navigate('Main');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="light" />

      {/* Header */}
      <View className="px-5 pt-3 items-end z-10 h-10 justify-center">
        <TouchableOpacity onPress={handleSkip}>
          <Text className="text-white text-base font-medium opacity-80">
            Skip
          </Text>
        </TouchableOpacity>
      </View>

      {/* Slides */}
      <View className="flex-1 justify-center">
        <FlatList
          ref={flatListRef}
          data={slides}
          renderItem={({ item }) => <SlideItem item={item} />}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          bounces={false}
        />
      </View>

      {/* Footer */}
      <View className={`px-5 items-center ${isSmallScreen ? "pb-6" : "pb-10"}`}>
        {/* Pagination Dots */}
        <View className="flex-row mb-8 gap-2">
          {slides.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full ${
                currentIndex === index
                  ? "w-8 bg-white"
                  : "w-2 bg-white/40"
              }`}
            />
          ))}
        </View>

        {/* Next Button */}
        <TouchableOpacity
          className="bg-white flex-row items-center justify-center w-full py-[18px] rounded-full shadow-sm"
          onPress={handleNext}
          activeOpacity={0.8}
          style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 }}
        >
        
          <Text className="text-primary text-lg font-bold mr-1">{currentIndex === slides.length -1 ? "Get Started" : "Next"}</Text>
          <MaterialCommunityIcons
            name={currentIndex === slides.length - 1 ? "check" : "chevron-right"}
            size={24}
            color="#2e7d32"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
