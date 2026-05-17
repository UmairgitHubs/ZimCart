export const getDeviceInfo = (req) => {
    const userAgent = req.headers['user-agent'] || '';
    const ipAddress = (req.ip || req.headers['x-forwarded-for'] || '').split(',')[0];
    let deviceName = 'Web Browser';
    let deviceType = 'desktop';
    let os = 'Unknown OS';
    const isMobile = userAgent.includes('Mobile') ||
        userAgent.includes('Android') ||
        userAgent.includes('iPhone') ||
        userAgent.includes('iPad') ||
        userAgent.includes('Expo') ||
        userAgent.includes('okhttp');
    if (isMobile) {
        deviceType = 'mobile';
        deviceName = 'Mobile App';
        if (userAgent.includes('iPhone'))
            deviceName = 'iPhone';
        else if (userAgent.includes('iPad'))
            deviceName = 'iPad';
        else if (userAgent.includes('Android'))
            deviceName = 'Android Device';
    }
    if (userAgent.includes('Windows'))
        os = 'Windows';
    else if (userAgent.includes('Macintosh'))
        os = 'macOS';
    else if (userAgent.includes('Linux'))
        os = 'Linux';
    else if (userAgent.includes('iPhone') || userAgent.includes('iPad'))
        os = 'iOS';
    else if (userAgent.includes('Android'))
        os = 'Android';
    else if (isMobile)
        os = 'Mobile OS';
    // Override with app-sent info
    const { deviceInfo } = req.body || {};
    if (deviceInfo) {
        return {
            deviceName: deviceInfo.name || deviceName,
            deviceType: deviceInfo.type || deviceType,
            os: deviceInfo.os || os,
            ipAddress
        };
    }
    return { deviceName, deviceType, os, ipAddress };
};
//# sourceMappingURL=device.utils.js.map