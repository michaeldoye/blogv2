import { Component, OnInit, OnDestroy } from '@angular/core';
import { routeAnimation, slideAnimation } from '../../../route.animation';
import { PostsService } from '../../../shared/services/posts.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Post } from '../../admin/posts/posts.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  host: {
    '[@routeAnimation]': 'true',
  },
  animations: [routeAnimation, slideAnimation],
})
export class HomePageComponent implements OnInit {
  direction: string = 'row';

  posts$: Observable<Post[]>;
  isLoading: boolean = true;

  constructor(private postsService: PostsService, private rt: Router) {}

  ngOnInit() {
    this.posts$ = this.postsService
      .getPosts()
      .pipe(
        map((posts) => posts.reverse().filter((post) => post.status === 'published'))
      );
  }

  toggleDirection() {
    this.direction = this.direction === 'column' ? 'row' : 'column';
  }

  goToPost(post: any): void {
    this.rt.navigate([
      'post',
      post.id,
      post.title.replace(/\s+/g, '-').toLowerCase(),
    ]);
  }
}
