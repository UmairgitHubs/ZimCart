declare const config: {
    PORT: string | number;
    NODE_ENV: string;
    DATABASE_URL: string | undefined;
    API_URL: string;
    /** Comma-separated origins for CORS (Expo + Next admin, etc.) */
    FRONTEND_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    REFRESH_TOKEN_SECRET: string;
    EMAIL_HOST: string | undefined;
    EMAIL_PORT: string | undefined;
    EMAIL_USER: string | undefined;
    EMAIL_PASSWORD: string | undefined;
    EMAIL_FROM: string | undefined;
    TWILIO_ACCOUNT_SID: string | undefined;
    TWILIO_AUTH_TOKEN: string | undefined;
    TWILIO_PHONE_NUMBER: string | undefined;
    CLOUDINARY_CLOUD_NAME: string | undefined;
    CLOUDINARY_API_KEY: string | undefined;
    CLOUDINARY_API_SECRET: string | undefined;
    STRIPE_SECRET_KEY: string | undefined;
    STRIPE_PUBLISHABLE_KEY: string | undefined;
    FIREBASE_PROJECT_ID: string | undefined;
    FIREBASE_PRIVATE_KEY: string | undefined;
    FIREBASE_CLIENT_EMAIL: string | undefined;
    GOOGLE_MAPS_API_KEY: string | undefined;
};
export default config;
//# sourceMappingURL=config.d.ts.map