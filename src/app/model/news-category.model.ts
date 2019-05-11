export class NewsCategoryModel {

    slug: string;
    constructor(public id: number, public name: string, public selected: boolean = false) {
        this.slug = this.name.toLowerCase().split(' ').join('-');
    }
}