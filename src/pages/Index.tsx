
import WorkArea from '../components/WorkArea';
import NavigationPanel from '../components/NavigationPanel';
import AIChatPanel from '../components/AIChatPanel';
import { DocumentProvider } from '../contexts/DocumentContext';
import { PodcastProvider } from '../contexts/PodcastContext';
import { SidebarProvider, SidebarInset } from '../components/ui/sidebar';

const Index = () => {
  return (
    <PodcastProvider>
      <DocumentProvider>
        <SidebarProvider>
          <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 w-full">
            <div className="flex h-screen w-full">
              {/* Navigation Panel - Now Minimizable */}
              <NavigationPanel />
              
              {/* Main Content Area */}
              <SidebarInset className="flex-1 flex">
                {/* Work Area */}
                <div className="flex-1 p-4">
                  <WorkArea />
                </div>
                
                {/* AI Chat Panel */}
                <div className="w-80 p-4 border-l border-podcast-border">
                  <AIChatPanel />
                </div>
              </SidebarInset>
            </div>
          </div>
        </SidebarProvider>
      </DocumentProvider>
    </PodcastProvider>
  );
};

export default Index;
