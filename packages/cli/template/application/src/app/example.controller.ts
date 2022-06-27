import { Controller, http, View } from '@dazejs/framework';

@Controller()
export default class {
    @http.get()
    index() {
        return new View('hello.html');
    }
}