import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';

interface TouchControlsProps {
  onLeft: () => void;
  onRight: () => void;
  onBoost: () => void;
  onRelease: () => void;
}

export default function TouchControls({ onLeft, onRight, onBoost, onRelease }: TouchControlsProps) {
  return (
    <div className="absolute bottom-20 left-4 right-4 flex items-center justify-between pointer-events-auto">
      <div className="flex space-x-2">
        <Button
          onTouchStart={onLeft}
          onTouchEnd={onRelease}
          onMouseDown={onLeft}
          onMouseUp={onRelease}
          size="lg"
          variant="outline"
          className="h-16 w-16 border-neon-cyan/50 hover:border-neon-cyan"
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
        <Button
          onTouchStart={onRight}
          onTouchEnd={onRelease}
          onMouseDown={onRight}
          onMouseUp={onRelease}
          size="lg"
          variant="outline"
          className="h-16 w-16 border-neon-cyan/50 hover:border-neon-cyan"
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>

      <Button
        onTouchStart={onBoost}
        onMouseDown={onBoost}
        size="lg"
        className="h-16 w-16 neon-button"
      >
        <Zap className="h-8 w-8" />
      </Button>
    </div>
  );
}
