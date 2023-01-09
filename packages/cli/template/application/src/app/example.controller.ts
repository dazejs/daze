import { view, Controller, Get } from '@dazejs/framework';

@Controller()
export class Example {
    @Get()
    index() {
        return view('hello.html')
    }
}