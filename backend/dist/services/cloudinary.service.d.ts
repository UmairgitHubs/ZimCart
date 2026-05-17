export interface CloudinaryUploadResponse {
    url: string;
    publicId: string;
    format: string;
    width: number;
    height: number;
    bytes: number;
}
export declare class CloudinaryService {
    private static readonly DEFAULT_FOLDER;
    private static readonly DEFAULT_TRANSFORMATIONS;
    static uploadBuffer(buffer: Buffer, folder?: string): Promise<CloudinaryUploadResponse>;
    static uploadImage(source: string, folder?: string): Promise<CloudinaryUploadResponse>;
    static deleteImage(publicId: string): Promise<boolean>;
    static deleteBatchImages(publicIds: string[]): Promise<void>;
    private static mapUploadResponse;
}
//# sourceMappingURL=cloudinary.service.d.ts.map