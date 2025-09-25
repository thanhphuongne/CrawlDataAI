import { Directive, Input, Host, TemplateRef, ViewContainerRef, OnInit, DoCheck } from "@angular/core";
import { NgSwitch } from "@angular/common";

@Directive({
    selector: '[appSwitchCases]'
})

export class SwitchCasesDirective implements OnInit, DoCheck{
    @Input() appSwitchCases: any[];

    private ngSwitch: any;
    private _created = false;

    constructor(
        private viewContainer : ViewContainerRef,
        private templateRef : TemplateRef<object>,
        @Host() ngSwitch : NgSwitch
    ){
        this.ngSwitch = ngSwitch;
    }

    ngOnInit(): void {
        (this.appSwitchCases || []).forEach(() => this.ngSwitch._addCase());
    }

    ngDoCheck(): void {
        let enforce = false;
        (this.appSwitchCases || []).forEach(value => enforce = this.ngSwitch._matchCase(value) || enforce);
        this.enforceState(enforce);
    }

    enforceState(created : boolean){
        if(created && !this._created){
            this._created = true;
            this.viewContainer.createEmbeddedView(this.templateRef);
        }else if(!created && this._created){
            this._created = false;
            this.viewContainer.clear();
        }
    }
}