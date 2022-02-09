import { ModuleWithProviders, NgModule } from "@angular/core";
import { ApiConstant } from "../types";
import { ResetPasswordLazyModule } from "./reset-password-lazy.module";
import { ResetPasswordService } from "./services";
import { RESET_PASSWORD_API_TOKEN } from "./types";

@NgModule({
    imports: [ResetPasswordLazyModule],
    exports: [ResetPasswordLazyModule],
})

export class ResetPasswordModule {
    static forRoot(apiConstant: ApiConstant): ModuleWithProviders<ResetPasswordModule> {
        return {
            ngModule: ResetPasswordModule,
            providers: [
                {
                    provide: RESET_PASSWORD_API_TOKEN,
                    useValue: apiConstant,
                },
                ResetPasswordService,
            ],
        };
    }
}
