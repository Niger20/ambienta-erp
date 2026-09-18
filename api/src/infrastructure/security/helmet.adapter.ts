import helmet from 'helmet';

export class HelmetAdapter {

    static get middleware() {
        return helmet();
    }

}
