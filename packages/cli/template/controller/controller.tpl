import { Controller, GetMapping } from '@tiger/common';

@Controller('/{{ name | plural | lower }}')
export class {{ name | firstUpperCase }} {
    @GetMapping()
    index() {
        // TODO
    }
}