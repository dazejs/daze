import { Controller, http } from '@dazejs/framework';

@Controller('/{{ name | plural | lower }}')
export class {{ name | firstUpperCase }} {
    @http.get()
    index() {
        // TODO
    }
}