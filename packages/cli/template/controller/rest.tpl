import { Rest } from '@tiger/common';

@Rest('/{{ name | plural | lower }}')
export class {{ name | firstUpperCase }} {
    /**
     * Display a listing of the resource.
     */
    index() {
        // TODO
    }

    /**
     * Show the form for creating a new resource.
     */
    create() {
        // TODO
    }

    /**
     * Display the specified resource.
     */
    show(id: string | number) {
        // TODO
    }

    /**
     * Show the form for editing the specified resource.
     */
    edit(id: string | number) {
        // TODO
    }

    /**
     * Store a newly created resource in storage.
     */
    store() {
        // TODO
    }

    /**
     * Update the specified resource in storage.
     */
    update(id: string | number) {
        // TODO
    }

    /**
     * Remove the specified resource from storage.
     */
    destroy(id: string | number) {
        // TODO
    }
}