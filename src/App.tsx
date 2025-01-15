import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/ui/Resizeable';
import TextInput from '@/ui/TextInput';
import { useState } from 'react';
import './App.css';

const App: React.FC = () => {
    const [value, setValue] = useState('');

    return (
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel minSize={10} defaultSize={25}>
                <TextInput label="Sentence" value={value} onChange={setValue} />
            </ResizablePanel>
            <ResizableHandle withHandle={true} />
            <ResizablePanel></ResizablePanel>
        </ResizablePanelGroup>
    );
};

export default App;
