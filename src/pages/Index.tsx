
import WorkArea from '../components/WorkArea';
import NavigationPanel from '../components/NavigationPanel';
import AIChatPanel from '../components/AIChatPanel';
import { DocumentProvider } from '../contexts/DocumentContext';
import { PodcastProvider } from '../contexts/PodcastContext';

const Index = () => {
  return (
    <PodcastProvider>
      <DocumentProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="grid grid-cols-12 gap-4 p-4 min-h-screen">
            {/* Navigation Panel */}
            <div className="col-span-3 overflow-hidden">
              <NavigationPanel />
            </div>
            
            {/* Work Area */}
            <div className="col-span-6 overflow-hidden">
              <WorkArea />
            </div>
            
            {/* AI Chat Panel */}
            <div className="col-span-3 overflow-hidden">
              <AIChatPanel />
            </div>
          </div>
        </div>
      </DocumentProvider>
    </PodcastProvider>
  );
};

export default Index;
