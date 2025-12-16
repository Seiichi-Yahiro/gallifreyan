import { setupStore } from '@/redux/store';
import Sidebar from '@/sidebar/Sidebar';
import Svg from '@/svg/Svg';
import Toolbar from '@/svg/Toolbar';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/ui/Resizeable';
import { ThemeProvider } from 'next-themes';
import React, { useMemo } from 'react';
import { Provider } from 'react-redux';
import './App.css';

const App: React.FC = () => {
    const store = useMemo(() => {
        return setupStore();
    }, []);

    return (
        <Provider store={store}>
            <ThemeProvider enableSystem={true}>
                <ResizablePanelGroup direction="horizontal">
                    <ResizablePanel
                        minSize={10}
                        defaultSize={25}
                        className="print:hidden"
                    >
                        <Sidebar className="h-full" />
                    </ResizablePanel>
                    <ResizableHandle
                        withHandle={true}
                        className="print:hidden"
                    />
                    <ResizablePanel className="relative">
                        <Toolbar className="absolute top-0 left-0" />
                        <Svg />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ThemeProvider>
        </Provider>
    );
};

export default App;
