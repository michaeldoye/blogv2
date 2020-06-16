import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../material.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PostsModule } from './posts/posts.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [PostsModule, CommonModule, MaterialModule],
  entryComponents: [],
  providers: [],
})
export class AdminModule {}
