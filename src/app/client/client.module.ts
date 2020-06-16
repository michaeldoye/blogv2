import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { PagesModule } from './pages/pages.module';
import { MaterialModule } from '../material.module';
import { AdminAuthGuard } from './utils/admin-auth.gaurd';
import { SharedModule } from '../shared/shared.module';
import { AdminModule } from './admin/admin.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    PagesModule,
    AdminModule,
    SharedModule,
  ],
  providers: [AdminAuthGuard],
})
export class ClientModule {}
