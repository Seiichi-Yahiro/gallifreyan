import { setupStore } from '@/redux/store';
import Sidebar from '@/sidebar/Sidebar';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/ui/Resizeable';
import { useMemo } from 'react';
import { Provider } from 'react-redux';
import './App.css';

const App: React.FC = () => {
    const store = useMemo(() => {
        return setupStore();
    }, []);

    return (
        <Provider store={store}>
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel minSize={10} defaultSize={25}>
                    <Sidebar />
                </ResizablePanel>
                <ResizableHandle withHandle={true} />
                <ResizablePanel></ResizablePanel>
            </ResizablePanelGroup>
        </Provider>
    );
};

export default App;
