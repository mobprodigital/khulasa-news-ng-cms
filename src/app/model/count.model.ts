export class PostCountModel {

    constructor(public published: number,
        public trash: number,
        public schedule: number,
        public draft: number) {
        trash = 0;
        schedule = 0;
        draft = 0;
        published = 0;

    }

}