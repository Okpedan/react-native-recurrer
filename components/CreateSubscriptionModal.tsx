import { icons } from "@/constants/icons";
import clsx from "clsx";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

type Frequency = "Monthly" | "Yearly";

const CATEGORIES = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
] as const;

type Category = (typeof CATEGORIES)[number];

const CATEGORY_COLORS: Record<Category, string> = {
  Entertainment: "#f15898",
  "AI Tools": "#b8d4e3",
  "Developer Tools": "#e8def8",
  Design: "#f5c542",
  Productivity: "#c7f3d4",
  Cloud: "#8accff",
  Music: "#d6c7ff",
  Other: "#9fa7b8",
};

export type CreateSubscriptionPayload = {
  name: string;
  price: number;
  frequency: Frequency;
  category: Category;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onCreate: (subscription: Subscription) => void;
  defaultFrequency?: Frequency;
  defaultCategory?: Category;
  currency?: string;
};

function toPositiveNumber(value: string) {
  const normalized = value.replace(",", ".").trim();
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) return null;
  if (parsed <= 0) return null;
  return parsed;
}

function makeId(name: string) {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const randomSuffix = (() => {
    try {
      const cryptoObj = (globalThis as any)?.crypto;
      if (cryptoObj?.randomUUID) {
        return String(cryptoObj.randomUUID()).replace(/-/g, "").slice(0, 8);
      }

      if (cryptoObj?.getRandomValues) {
        const bytes = new Uint8Array(4);
        cryptoObj.getRandomValues(bytes);
        return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join(
          "",
        );
      }
    } catch {
      // ignore
    }

    return Math.random().toString(36).slice(2, 10);
  })();

  return `${base || "subscription"}-${Date.now().toString(36)}-${randomSuffix}`;
}

const CreateSubscriptionModal = ({
  visible,
  onClose,
  onCreate,
  defaultFrequency = "Monthly",
  defaultCategory = "Other",
  currency,
}: Props) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState<Frequency>(defaultFrequency);
  const [category, setCategory] = useState<Category>(defaultCategory);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  useEffect(() => {
    if (!visible) {
      setAttemptedSubmit(false);
    }
  }, [visible]);

  const parsedPrice = useMemo(() => toPositiveNumber(price), [price]);

  const nameError = attemptedSubmit && name.trim().length === 0;
  const priceError = attemptedSubmit && parsedPrice === null;

  const canSubmit = name.trim().length > 0 && parsedPrice !== null;

  const resetForm = () => {
    setName("");
    setPrice("");
    setFrequency(defaultFrequency);
    setCategory(defaultCategory);
    setAttemptedSubmit(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    setAttemptedSubmit(true);
    if (!canSubmit || parsedPrice === null) return;

    const start = dayjs();
    const renewal =
      frequency === "Monthly" ? start.add(1, "month") : start.add(1, "year");

    const newSubscription: Subscription = {
      id: makeId(name),
      name: name.trim(),
      price: parsedPrice,
      category,
      status: "active",
      startDate: start.toISOString(),
      renewalDate: renewal.toISOString(),
      icon: icons.plus,
      billing: frequency,
      color: CATEGORY_COLORS[category],
      currency: currency ?? "USD",
    };

    onCreate(newSubscription);
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <Pressable className="modal-overlay" onPress={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
        >
          <Pressable className="modal-container" onPress={() => {}}>
            <View className="modal-header">
              <Text className="modal-title">New Subscription</Text>
              <Pressable
                className="modal-close"
                onPress={handleClose}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Close"
              >
                <Text className="modal-close-text">×</Text>
              </Pressable>
            </View>

            <ScrollView
              className="modal-body"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View className="auth-field">
                <Text className="auth-label">Name</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Netflix"
                  placeholderTextColor="rgba(0,0,0,0.4)"
                  className={clsx(
                    "auth-input",
                    nameError && "auth-input-error",
                  )}
                />
                {nameError && (
                  <Text className="auth-error">Name is required</Text>
                )}
              </View>

              <View className="auth-field">
                <Text className="auth-label">Price</Text>
                <TextInput
                  value={price}
                  onChangeText={setPrice}
                  placeholder="e.g. 9.99"
                  placeholderTextColor="rgba(0,0,0,0.4)"
                  keyboardType="decimal-pad"
                  className={clsx(
                    "auth-input",
                    priceError && "auth-input-error",
                  )}
                />
                {priceError && (
                  <Text className="auth-error">Enter a valid price</Text>
                )}
              </View>

              <View className="auth-field">
                <Text className="auth-label">Frequency</Text>
                <View className="picker-row">
                  {(["Monthly", "Yearly"] as const).map((option) => {
                    const active = frequency === option;
                    return (
                      <Pressable
                        key={option}
                        onPress={() => setFrequency(option)}
                        className={clsx(
                          "picker-option",
                          active && "picker-option-active",
                        )}
                      >
                        <Text
                          className={clsx(
                            "picker-option-text",
                            active && "picker-option-text-active",
                          )}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View className="auth-field">
                <Text className="auth-label">Category</Text>
                <View className="category-scroll">
                  {CATEGORIES.map((option) => {
                    const active = category === option;
                    return (
                      <Pressable
                        key={option}
                        onPress={() => setCategory(option)}
                        className={clsx(
                          "category-chip",
                          active && "category-chip-active",
                        )}
                      >
                        <Text
                          className={clsx(
                            "category-chip-text",
                            active && "category-chip-text-active",
                          )}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <Pressable
                onPress={handleSubmit}
                disabled={!canSubmit}
                className={clsx(
                  "auth-button",
                  !canSubmit && "auth-button-disabled",
                )}
                accessibilityRole="button"
                accessibilityLabel="Create subscription"
              >
                <Text className="auth-button-text">Create</Text>
              </Pressable>
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};

export default CreateSubscriptionModal;
