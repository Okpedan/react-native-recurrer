import SubscriptionCard from "@/components/SubscriptionCard";
import { subscriptionsStore } from "@/constants/data";
import { icons } from "@/constants/icons";
import { useFocusEffect } from "expo-router";
import { styled } from "nativewind";
import React, { useCallback, useMemo, useState } from "react";
import {
    FlatList,
    Image,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

type FilterType = "All" | "Active" | "Paused" | "Cancelled";
const FILTERS: FilterType[] = ["All", "Active", "Paused", "Cancelled"];

const Subscriptions = () => {
  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(
    subscriptionsStore.getAll(),
  );

  useFocusEffect(
    useCallback(() => {
      setSubscriptions(subscriptionsStore.getAll());
    }, []),
  );

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => {
      // First apply status filter
      const matchesStatus =
        activeFilter === "All" ||
        sub.status?.toLowerCase() === activeFilter.toLowerCase();

      // Then apply text search (name, plan, or category)
      const searchLower = searchText.toLowerCase().trim();
      const matchesSearch =
        searchLower === "" ||
        sub.name?.toLowerCase().includes(searchLower) ||
        sub.plan?.toLowerCase().includes(searchLower) ||
        sub.category?.toLowerCase().includes(searchLower);

      return matchesStatus && matchesSearch;
    });
  }, [searchText, activeFilter, subscriptions]);

  return (
    <SafeAreaView className="flex-1 bg-background p-5 pb-0">
      <View className="subs-header">
        <Text className="subs-title">Subscriptions</Text>
        <View className="subs-count">
          <Text className="subs-count-text">
            {filteredSubscriptions.length}
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View className="subs-search-row">
        <Image
          source={icons.search} // Using menu as a generic icon, typically would use search
          className="subs-search-icon"
          resizeMode="contain"
        />
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search subscriptions..."
          placeholderTextColor="rgba(0,0,0,0.4)"
          className="subs-search-input"
        />
        {searchText.length > 0 && (
          <Pressable
            onPress={() => setSearchText("")}
            className="subs-clear"
            hitSlop={10}
          >
            <Text className="subs-clear-text">×</Text>
          </Pressable>
        )}
      </View>

      {/* Filter Chips */}
      <View className="mb-4">
        <FlatList
          data={FILTERS}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2"
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setActiveFilter(item)}
              className={`subs-chip ${activeFilter === item ? "subs-chip-active" : ""}`}
            >
              <Text
                className={`subs-chip-text ${activeFilter === item ? "subs-chip-text-active" : ""}`}
              >
                {item}
              </Text>
            </Pressable>
          )}
        />
      </View>

      {/* Subscriptions List */}
      <FlatList
        data={filteredSubscriptions}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View className="h-4" />}
        contentContainerClassName="pb-20"
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() =>
              setExpandedSubscriptionId((currentId) =>
                currentId === item.id ? null : item.id,
              )
            }
          />
        )}
        ListEmptyComponent={
          <View className="subs-empty">
            <Text className="subs-empty-label">No matches found</Text>
            <Text className="subs-empty-hint">
              Try adjusting your search or filters
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Subscriptions;
