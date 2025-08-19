
import WorkArea from '../components/WorkArea';
import NavigationPanel from '../components/NavigationPanel';
import AIChatPanel from '../components/AIChatPanel';
import { DocumentProvider } from '../contexts/DocumentContext';
import { PodcastProvider } from '../contexts/PodcastContext';

const Index = () => {
  return (
    <PodcastProvider>
      <DocumentProvider>
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 w-full">
          <div className="flex h-screen w-full">
            {/* Navigation Panel - Left side, now with minimize functionality */}
            <NavigationPanel />
            
            {/* Work Area - Center, flex-1 */}
            <div className="flex-1 p-4">
              <WorkArea />
            </div>
            
            {/* AI Chat Panel - Right side, fixed width */}
            <div className="w-80 p-4 border-l border-podcast-border">
              <AIChatPanel />
            </div>
          </div>
        </div>
      </DocumentProvider>
    </PodcastProvider>
  );
};

export default Index;
