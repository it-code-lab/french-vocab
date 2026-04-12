# French Vocab Native (Expo + React Native)

This starter converts your standalone HTML app into a **native-feeling React Native Android app** instead of wrapping the old UI in a WebView.

## What is already mapped from your HTML app

- Home / Study / Finish screens
- Broad category + subcategory filtering
- Card count selection
- Built-in French deck
- JSON deck import
- Persist imported deck locally on-device
- Flip card animation
- Auto-next countdown after reveal
- French text-to-speech
- Reset back to built-in deck

## Recommended setup

Create a new Expo TypeScript project:

```bash
npx create-expo-app@latest french-vocab-native --template blank-typescript
cd french-vocab-native
```

Install the native packages used by this conversion:

```bash
npx expo install expo-linear-gradient expo-haptics expo-speech expo-document-picker expo-file-system react-native-safe-area-context @react-native-picker/picker
```

Then copy the files from this package into the new Expo project and run:

```bash
npx expo start
```

For Android emulator/device:

```bash
npx expo run:android
```

## Why this version feels more premium

- Native `Pressable` interactions
- Native `Animated` flip transition
- Safe-area aware layout
- Native gradients and shadows
- Haptic feedback on important actions
- Native document picker for deck import
- Native speech instead of browser speech synthesis

## Suggested next polish steps

1. Add daily streaks and weak-word revision
2. Add favorites / bookmarks
3. Add quiz mode with score tracking
4. Add dark/light theme toggle
5. Add onboarding and app icon / splash screen

## Important note

The built-in vocabulary deck in `src/data/builtinDeck.ts` was extracted from your uploaded `index.html`, so you keep the original content while moving to a native app structure.
