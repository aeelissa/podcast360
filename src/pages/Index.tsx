
import WorkArea from '../components/WorkArea';
import NavigationPanel from '../components/NavigationPanel';
import AIChatPanel from '../components/AIChatPanel';
import { DocumentProvider } from '../contexts/DocumentContext';
import { PodcastProvider } from '../contexts/PodcastContext';

const Index = () => {
  return (
    <PodcastProvider>
      <DocumentProvider>
        <div className="h-screen bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="grid grid-cols-12 gap-4 h-full p-4">
            {/* Navigation Panel */}
            <div className="col-span-3 h-full">
              <NavigationPanel />
            </div>
            
            {/* Work Area */}
            <div className="col-span-6 h-full">
              <WorkArea />
            </div>
            
            {/* AI Chat Panel */}
            <div className="col-span-3 h-full">
              <AIChatPanel />
            </div>
          </div>
        </div>
      </DocumentProvider>
    </PodcastProvider>
  );
};

export default Index;
