import { Controller, GetMapping, View } from '@tiger/common';

@Controller()
export default class {
    @GetMapping()
    index() {
        return new View('hello.html');
    }
}