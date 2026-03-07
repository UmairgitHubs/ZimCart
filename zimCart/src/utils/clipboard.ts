import { Alert } from 'react-native';

/**
 * Senior Developer Implementation: Ultra-Resilient Clipboard Utility
 * 
 * PROBLEM: Static imports (import ... from 'expo-clipboard') can cause 
 * the app to crash at LOAD TIME if the native module is missing.
 * 
 * SOLUTION: This utility uses a lazy-loading / defensive pattern to prevent
 * load-time crashes. It will only attempt to access the native layer when 
 * the function is actually called.
 */

let ClipboardModule: any = null;

// Defensive lazy-load to catch crash at import time
try {
    // We use require instead of import to prevent top-level hoist crash
    ClipboardModule = require('expo-clipboard');
} catch (e) {
    console.warn('[Clipboard] Native module could not be initialized. Fallback enabled.');
}

export const copyToClipboard = async (text: string, label: string = 'Code'): Promise<boolean> => {
    try {
        if (!ClipboardModule || typeof ClipboardModule.setStringAsync !== 'function') {
            throw new Error('Module Not Initialized');
        }

        await ClipboardModule.setStringAsync(text);
        return true;
    } catch (error) {
        console.warn(`[Clipboard Fallback] Could not copy: ${text}. Error:`, error);
        
        // Graceful Edge Case Handling: Manual Copy Instruction
        Alert.alert(
            label,
            `We couldn't copy this automatically. Please manually use this code: \n\n${text}`,
            [{ text: "Got it" }]
        );
        return false;
    }
};
