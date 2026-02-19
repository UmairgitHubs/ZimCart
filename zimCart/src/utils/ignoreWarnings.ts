import { LogBox } from 'react-native';

const ignoreWarnings = () => {
    // Suppress deprecated warnings and other noisy logs that are safe to ignore
    LogBox.ignoreLogs([
        'Review the version of your dependencies',
        'setLayoutAnimationEnabledExperimental',
        'SafeAreaView has been deprecated',
        'Unable to activate keep awake',
        'ViewPropTypes will be removed',
        'Constants.platform.ios.model has been deprecated',
        'Require cycles', // Common in navigation
    ]);

    // Handle promise errors that don't need to be disruptive
    // (This is a bit more aggressive, but keeps the console clean for trivial dev errors)
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
        const errorMsg = args.join(' ');
        
        // Suppress known noisy errors
        if (/Unable to activate keep awake/.test(errorMsg)) return;
        if (/defaultProps/.test(errorMsg)) return;
        if (/text strings must be rendered within a <Text> component/.test(errorMsg)) return; // We fixed this, but suppressed just in case during HMR

        // Intercept and format Axios/Network errors
        if (errorMsg.includes('AxiosError') || errorMsg.includes('Network Error')) {
            // Check if it's a connection refused/network error
            if (errorMsg.includes('Network Error')) {
                originalConsoleError(' [Network Error]: Unable to reach the server. Please check your internet connection or if the backend is running.');
                return;
            }
            // For other axios errors, try to extract status code and message
            // This is a heuristic as args[0] might be the error object
            const errorObj = args[0];
            if (errorObj?.response) {
                const status = errorObj.response.status;
                const data = errorObj.response.data;
                const message = data?.message || errorObj.message;
                originalConsoleError(` [API Error] ${status}: ${message}`);
                return;
            }
        }

        originalConsoleError(...args);
    };
};

export default ignoreWarnings;
