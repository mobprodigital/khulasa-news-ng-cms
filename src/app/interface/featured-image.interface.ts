/**
 * News image sizes interface
 */
export interface IFeturedImage {

    /**
     * Orignal image as uploaded
     */
    original: string,
    /**
     * size 1024*height 
     */
    large: string,
    /**
     * size 512*height
     */
    medium: string,
    /**
     * size 150*height
     */
    small: string,
}