import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SidenavService } from './services/sidenav.service';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { MaterialModule } from '../material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PostsService } from './services/posts.service';

@NgModule({
  declarations: [ConfirmDialogComponent],
  imports: [CommonModule, MaterialModule, FlexLayoutModule],
  entryComponents: [ConfirmDialogComponent],
  providers: [SidenavService, PostsService],
})
export class SharedModule {}
