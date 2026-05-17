export declare const dispatchPush: (users: any[], title: string, body: string, data: any) => Promise<void>;
export declare const sendNotification: (userIds: string[], title: string, body: string, data?: any) => Promise<void>;
export declare const sendPushNotification: (userIds: string[], title: string, body: string, data?: any) => Promise<void>;
export declare const updatePushToken: (userId: string, pushToken: string) => Promise<{
    id: string;
    pushToken: string | null;
}>;
export declare const broadcast: (title: string, body: string, data?: any) => Promise<void>;
//# sourceMappingURL=notification.service.d.ts.map