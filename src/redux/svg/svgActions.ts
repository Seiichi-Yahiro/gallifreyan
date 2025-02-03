import { createAction } from '@reduxjs/toolkit';

const reset = createAction('SVG/RESET');

const svgActions = {
    reset,
};

export default svgActions;
