import { useProgress } from './useProgress';

export type GraphicsQuality = 'low' | 'medium' | 'high';
export type ControlScheme = 'keyboard' | 'touch' | 'joystick';

export interface GameSettings {
  sound: boolean;
  music: boolean;
  graphics: GraphicsQuality;
  controls: ControlScheme;
}

const DEFAULT_SETTINGS: GameSettings = {
  sound: true,
  music: true,
  graphics: 'high',
  controls: 'keyboard'
};

const LOCAL_STORAGE_SETTINGS_KEY = 'speedRacerSettings';

export function useSettings() {
  const { progress, updateProgress } = useProgress();

  const getLocalSettings = (): Partial<GameSettings> => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  };

  const localSettings = getLocalSettings();

  const settings: GameSettings = {
    sound: progress.settings.sound,
    music: progress.settings.music,
    graphics: (localSettings.graphics as GraphicsQuality) || DEFAULT_SETTINGS.graphics,
    controls: (localSettings.controls as ControlScheme) || DEFAULT_SETTINGS.controls
  };

  const updateSettings = (newSettings: Partial<GameSettings>) => {
    const updated = { ...settings, ...newSettings };
    
    updateProgress({
      settings: {
        sound: updated.sound,
        music: updated.music
      }
    });

    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify({
      graphics: updated.graphics,
      controls: updated.controls
    }));
  };

  return {
    settings,
    updateSettings
  };
}
