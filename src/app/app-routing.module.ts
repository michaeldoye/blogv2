import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FrontendContainerComponent } from './core/layout/frontend-container/frontend-container.component';
import { HomePageComponent } from './client/pages/home-page/home-page.component';
import { SinglePostComponent } from './client/pages/single-post/single-post.component';
import { LoginPageComponent } from './client/pages/login-page/login-page.component';
import { AdminComponent } from './core/layout/admin/admin.component';
import { DashboardComponent } from './client/admin/dashboard/dashboard.component';
import { PostsComponent } from './client/admin/posts/posts.component';
import { EditPostComponent } from './client/admin/posts/edit-post/edit-post.component';
import { AddPostComponent } from './client/admin/posts/add-post/add-post.component';
import { AdminAuthGuard } from './client/utils/admin-auth.gaurd';

const routes: Routes = [
  {
    path: '',
    component: FrontendContainerComponent,
    children: [
      {
        path: '',
        component: HomePageComponent,
      },
      {
        path: 'post/:id/:title',
        component: SinglePostComponent,
      },
    ],
  },
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminAuthGuard],
    children: [
      {
        path: '',
        component: DashboardComponent,
        pathMatch: 'full',
      },
      {
        path: 'posts',
        component: PostsComponent,
      },
      {
        path: 'posts/edit/:id',
        component: EditPostComponent,
      },
      {
        path: 'posts/new',
        component: AddPostComponent,
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
