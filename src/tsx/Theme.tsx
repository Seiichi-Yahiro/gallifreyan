import { createTheme, ThemeOptions, ThemeProvider } from '@mui/material';
import React from 'react';
import { useRedux } from './hooks/useRedux';

interface ThemeProps {
    children: React.ReactNode;
}

const Theme: React.FunctionComponent<ThemeProps> = ({ children }) => {
    const mode = useRedux((state) => state.theme.mode);

    const options: ThemeOptions = {
        palette: {
            mode,
        },
    };

    const theme = createTheme(options);

    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default Theme;
