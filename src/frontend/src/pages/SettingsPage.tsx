import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Settings as SettingsIcon } from 'lucide-react';
import { useSettings, type GraphicsQuality, type ControlScheme } from '../hooks/useSettings';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings();

  return (
    <div 
      className="min-h-screen p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(/assets/generated/bg-tunnel.dim_1920x1080.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black/80" />
      
      <div className="relative z-10 max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => navigate({ to: '/' })}
            variant="ghost"
            className="text-neon-cyan"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Menu
          </Button>
          <h1 className="text-4xl font-black neon-text">
            <SettingsIcon className="inline mr-2 h-8 w-8" />
            SETTINGS
          </h1>
          <div className="w-32" />
        </div>

        <div className="space-y-4">
          <Card className="bg-black/80 border-neon-cyan/30">
            <CardHeader>
              <CardTitle className="text-neon-cyan">Audio</CardTitle>
              <CardDescription>Control sound and music</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="sound" className="text-base">Sound Effects</Label>
                <Switch
                  id="sound"
                  checked={settings.sound}
                  onCheckedChange={(checked) => updateSettings({ sound: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="music" className="text-base">Background Music</Label>
                <Switch
                  id="music"
                  checked={settings.music}
                  onCheckedChange={(checked) => updateSettings({ music: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/80 border-neon-orange/30">
            <CardHeader>
              <CardTitle className="text-neon-orange">Graphics</CardTitle>
              <CardDescription>Adjust visual quality for performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="graphics" className="text-base">Quality</Label>
                <Select
                  value={settings.graphics}
                  onValueChange={(value) => updateSettings({ graphics: value as GraphicsQuality })}
                >
                  <SelectTrigger id="graphics">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/80 border-neon-purple/30">
            <CardHeader>
              <CardTitle className="text-neon-purple">Controls</CardTitle>
              <CardDescription>Choose your preferred control scheme</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="controls" className="text-base">Control Scheme</Label>
                <Select
                  value={settings.controls}
                  onValueChange={(value) => updateSettings({ controls: value as ControlScheme })}
                >
                  <SelectTrigger id="controls">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="keyboard">Keyboard (Arrow Keys)</SelectItem>
                    <SelectItem value="touch">Touch (Buttons)</SelectItem>
                    <SelectItem value="joystick">Touch (Joystick)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
