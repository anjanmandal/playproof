export type InputImageContent = {
    type: "input_image";
    image_url: string;
};
/**
 * Build a single OpenAI Responses API image content part.
 * If mediaUrl is a local upload, we read it and embed as a data URL.
 * Otherwise, we return the remote URL directly.
 *
 * NOTE: Only images are embedded as data URLs. Videos will be returned as-is (URL).
 */
export declare const buildInputImageContent: (mediaUrl: string) => Promise<InputImageContent | null>;
/**
 * Convenience: build multiple image content parts (filters out nulls).
 */
export declare const buildInputImageContents: (mediaUrls: string[]) => Promise<InputImageContent[]>;
//# sourceMappingURL=openaiMedia.d.ts.map