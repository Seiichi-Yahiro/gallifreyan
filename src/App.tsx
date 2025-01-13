import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/ui/Resizeable';
import './App.css';

const App: React.FC = () => {
    return (
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel minSize={10} defaultSize={25}></ResizablePanel>
            <ResizableHandle withHandle={true} />
            <ResizablePanel></ResizablePanel>
        </ResizablePanelGroup>
    );
};

export default App;
