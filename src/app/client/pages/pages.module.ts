import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginPageComponent } from './login-page/login-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SinglePostComponent } from './single-post/single-post.component';
import { MaterialModule } from '../../material.module';
import { AngularFireDatabaseModule } from '@angular/fire/database';

@NgModule({
  declarations: [LoginPageComponent, HomePageComponent, SinglePostComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  entryComponents: [],
  providers: [AngularFireDatabaseModule],
})
export class PagesModule {}
