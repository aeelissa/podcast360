
import React from 'react';
import { Settings, RotateCcw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { usePodcastSettings } from '../contexts/PodcastSettingsContext';
import PodcastIdentityTab from './settings/PodcastIdentityTab';
import EpisodeConfigTab from './settings/EpisodeConfigTab';

interface PodcastSettingsPanelProps {
  trigger?: React.ReactNode;
}

const PodcastSettingsPanel: React.FC<PodcastSettingsPanelProps> = ({ trigger }) => {
  const { resetSettings } = usePodcastSettings();

  const defaultTrigger = (
    <Button variant="ghost" size="sm" className="text-podcast-gray hover:text-podcast-blue">
      <Settings className="w-4 h-4 ml-1" />
      إعدادات البودكاست
    </Button>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle className="text-xl font-bold text-podcast-blue">
            إعدادات البودكاست
          </DialogTitle>
          <DialogDescription className="text-podcast-gray">
            قم بتخصيص هوية البودكاست وإعدادات الحلقات لتحسين تجربة المحتوى
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="identity" className="mt-4">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="identity" className="text-right">
              هوية البودكاست
            </TabsTrigger>
            <TabsTrigger value="episode" className="text-right">
              إعدادات الحلقة
            </TabsTrigger>
          </TabsList>

          <div className="max-h-[50vh] overflow-y-auto">
            <TabsContent value="identity" className="space-y-4">
              <PodcastIdentityTab />
            </TabsContent>

            <TabsContent value="episode" className="space-y-4">
              <EpisodeConfigTab />
            </TabsContent>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-6">
            <Button
              variant="outline"
              onClick={resetSettings}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <RotateCcw className="w-4 h-4 ml-1" />
              إعادة تعيين
            </Button>
            <div className="text-sm text-podcast-gray">
              يتم حفظ التغييرات تلقائياً
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PodcastSettingsPanel;
