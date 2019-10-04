import { RouterModule, Routes } from '@angular/router';
import { FormRecaptchaComponent } from './form-recaptcha/form-recaptcha.component';
import { RecaptchaGuard } from './check/recaptcha.guard';
import { AuthorizationGuard } from './check/authorization.guard';
import { CancelacionComponent } from './Cancelacion/cancelacion/cancelacion.component';
import { CeseComponent } from './cese/cese.component';
import { CeseFuncionarioODiplomaticoComponent } from './cese-funcionario-o-diplomatico/cese-funcionario-o-diplomatico.component';


const APP_ROUTES: Routes = [
	{ path: '', redirectTo: '/cesefuncionariodiplomatico', pathMatch: 'full' },
	{ path: 'cese', component: CeseComponent },
	{ path: 'cesefuncionariodiplomatico', component: CeseFuncionarioODiplomaticoComponent },
	{ path: 'form-recaptcha', component: FormRecaptchaComponent}
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);

