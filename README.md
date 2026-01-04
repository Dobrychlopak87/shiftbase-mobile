# shiftbase Mobile

A React Native work time tracking and management application built with Expo.

## Features

- ✅ **Records Screen** - Add, view, and manage work entries with time tracking
- ✅ **Projects Screen** - Create and manage projects with color coding
- ✅ **Overview Screen** - View statistics and summary of work hours
- ✅ **Data Persistence** - All data saved locally using AsyncStorage
- ✅ **Time Calculations** - Automatic calculation of work hours with break time support
- ✅ **Category Support** - Categorize entries as work, overtime, or vacation

## Quick Start

### Import to Expo Snack

1. Go to [snack.expo.dev](https://snack.expo.dev)
2. Click **File** → **Import from GitHub**
3. Enter: `Dobrychlopak87/shiftbase-mobile`
4. Click **Import**

### Local Development

```bash
# Install dependencies
npm install
# or
yarn install

# Start the app
npm start
# or
yarn start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web
```

## Project Structure

```
shiftbase-expo/
├── App.tsx              # Main app component with all screens
├── app.json             # Expo configuration
├── package.json         # Dependencies
├── README.md            # This file
└── assets/              # App icons and splash screen
```

## Screens

### Records
- Add new work entries with date, time, and description
- View all entries in a list
- Delete entries
- Track break time
- Assign entries to projects and categories

### Projects
- Create new projects
- Assign colors to projects
- Delete projects
- View project list

### Overview
- View total hours worked
- See entry count
- Quick statistics dashboard

## Data Storage

All data is stored locally on the device using AsyncStorage:
- **entries** - Array of work entries
- **projects** - Array of projects

## Technologies

- **React Native** - Cross-platform mobile framework
- **Expo** - React Native development platform
- **React Navigation** - Navigation library
- **AsyncStorage** - Local data persistence
- **TypeScript** - Type safety

## Version

1.0.0

## License

MIT
