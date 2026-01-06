import { Audio } from 'expo-av';

export const audioService = {
  async playClickSound(): Promise<void> {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==' },
        { shouldPlay: true }
      );
      await sound.playAsync();
      sound.unloadAsync();
    } catch (error) {
      console.error('Error playing click sound:', error);
    }
  },

  async playSuccessSound(): Promise<void> {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==' },
        { shouldPlay: true }
      );
      await sound.playAsync();
      sound.unloadAsync();
    } catch (error) {
      console.error('Error playing success sound:', error);
    }
  },

  async playErrorSound(): Promise<void> {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==' },
        { shouldPlay: true }
      );
      await sound.playAsync();
      sound.unloadAsync();
    } catch (error) {
      console.error('Error playing error sound:', error);
    }
  },

  async initialize(): Promise<void> {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
    } catch (error) {
      console.error('Error initializing audio:', error);
    }
  },
};
