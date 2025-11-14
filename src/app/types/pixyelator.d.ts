declare module "pixyelator" {
  /**
   * Supported image source types that can be converted to HTMLImageElement
   */
  export type ImageSource = HTMLImageElement | Blob | ArrayBuffer | string;

  /**
   * Configuration options for creating a Pixyelator instance
   */
  export interface PixyelatorOptions {
    /**
     * Maximum number of web workers to use for pixelation
     * @default navigator.hardwareConcurrency || 4
     */
    maxWorkers?: number;

    /**
     * Canvas element to write pixelation results to
     * @default A newly created canvas element
     */
    targetCanvas?: HTMLCanvasElement;
  }

  /**
   * Options for the pixelate operation
   */
  export interface PixelateOptions {
    /**
     * Whether to convert the image to grayscale
     * @default false
     */
    grayscale?: boolean;
  }

  /**
   * Chainable methods available on the promise returned by pixelate()
   */
  export interface PixelateChainable {
    /**
     * Convert the pixelated image to a Blob
     * @returns Promise resolving to a Blob containing the image data
     */
    toBlob(): Promise<Blob>;

    /**
     * Get the canvas element containing the pixelated image
     * @returns The canvas element
     */
    toCanvas(): Promise<HTMLCanvasElement>;

    /**
     * Convert the pixelated image to a data URL
     * @returns Data URL string containing the image data
     */
    toDataURL(): Promise<string>;

    /**
     * Convert the pixelated image to an ArrayBuffer
     * @returns Promise resolving to an ArrayBuffer containing the image data
     */
    toArrayBuffer(): Promise<ArrayBuffer>;
  }

  /**
   * Promise returned by pixelate() with chainable output methods
   */
  export type PixelatePromise = Promise<void> & PixelateChainable;

  /**
   * Main class for pixelating images
   */
  export class Pixyelator {
    /**
     * Creates a new Pixyelator instance
     * @param imageElement - The HTMLImageElement to pixelate
     * @param options - Configuration options
     */
    constructor(imageElement: HTMLImageElement, options?: PixyelatorOptions);

    /**
     * Factory method to create Pixyelator instance from various image sources
     * @param imageSource - Image source (HTMLImageElement, Blob, ArrayBuffer, data URL, or image URL)
     * @param options - Configuration options
     * @returns Promise resolving to a new Pixyelator instance
     * @throws Error if image fails to load or has invalid dimensions
     */
    static fromImage(
      imageSource: ImageSource,
      options?: PixyelatorOptions
    ): Promise<Pixyelator>;

    /**
     * Pixelate the image and write to the target canvas
     * @param xPixels - Number of horizontal pixels/blocks (must be positive integer)
     * @param yPixels - Number of vertical pixels/blocks (must be positive integer)
     * @param options - Pixelation options
     * @returns Promise with chainable output methods (toBlob, toCanvas, toDataURL, toArrayBuffer)
     * @throws Error if instance is disposed, dimensions are invalid, or exceed image dimensions
     */
    pixelate(
      xPixels: number,
      yPixels: number,
      options?: PixelateOptions
    ): PixelatePromise;

    /**
     * Get the canvas element containing the pixelated image
     * @returns The canvas element
     * @throws Error if instance is disposed
     */
    toCanvas(): HTMLCanvasElement;

    /**
     * Convert the pixelated image to a Blob
     * @returns Promise resolving to a Blob containing the image data
     * @throws Error if instance is disposed
     */
    toBlob(): Promise<Blob>;

    /**
     * Convert the pixelated image to a data URL
     * @returns Data URL string containing the image data
     * @throws Error if instance is disposed
     */
    toDataURL(): string;

    /**
     * Convert the pixelated image to an ArrayBuffer
     * @returns Promise resolving to an ArrayBuffer containing the image data
     * @throws Error if instance is disposed
     */
    toArrayBuffer(): Promise<ArrayBuffer>;

    /**
     * Clean up resources and dispose of the instance
     */
    dispose(): void;
  }
}
