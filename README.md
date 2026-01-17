# Winsdor - Food Ordering App

React Native mobile app for food ordering with menu management and shopping cart.

## Features

- Food menu display
- Add/Edit/Delete food items
- Shopping cart with local persistence
- API integration with environment variables

## Prerequisites

- Node.js >= 16
- React Native CLI
- Android Studio (for Android)
- Xcode (for iOS - macOS only)

## Installation

```bash
npm install
cd ios && pod install && cd ..  # macOS only
```

## Environment Setup

Create `.env` file in root directory:

```env
FETCH_MENU_API=https://your-api-endpoint/webhook/fetch-menu
ADD_ITEM_API=https://your-api-endpoint/webhook/add-item
UPDATE_ITEM_API=https://your-api-endpoint/webhook/update-item
DELETE_ITEM_API=https://your-api-endpoint/webhook/delete-item
```

⚠️ **Important:** `.env` is excluded from git. Use `.env.example` as template.

## Running the App

### Android
```bash
npm start
npm run android
```

### iOS (macOS only)
```bash
npm start
npm run ios
```

## Available Scripts

- `npm start` - Start Metro bundler
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run lint` - Run ESLint

## Tech Stack

React Native, TypeScript, Redux Toolkit, React Navigation, Axios

## Troubleshooting

**Metro bundler issues:**
```bash
npm start -- --reset-cache
```

**Environment variables not working:**
- Ensure `.env` exists in root directory
- Restart Metro bundler after changes
- Clear cache: `npm start -- --reset-cache`
