export class PostCategoryModel {


    constructor(
        public categoryId: number,
        public categoryName: string,
        public categorySlug: string,
        public subCategory?: PostCategoryModel[],
        public isSelected?: boolean
    ) {
        isSelected = false
    }
}
