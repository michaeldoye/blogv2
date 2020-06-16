import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FrontendContainerComponent } from './layout/frontend/frontend-container.component';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared/shared.module';
import { AdminComponent } from './layout/admin/admin.component';
import { ScrollbarModule } from './scrollbar/scrollbar.module';

@NgModule({
  declarations: [FrontendContainerComponent, AdminComponent],
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    ScrollbarModule,
    MaterialModule,
    SharedModule,
  ],
  entryComponents: [],
  providers: [],
})
export class CoreModule {}
