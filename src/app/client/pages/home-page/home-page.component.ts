import { Component, OnInit, OnDestroy } from '@angular/core';
import { routeAnimation, slideAnimation } from '../../../route.animation';
import { PostsService } from '../../../shared/services/posts.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  host: {
    '[@routeAnimation]': 'true',
  },
  animations: [routeAnimation, slideAnimation],
})
export class HomePageComponent implements OnInit, OnDestroy {
  subs: Array<Subscription> = [];
  direction: string = 'row';

  posts: Array<any> = [];
  isLoading: boolean = true;

  constructor(private postsService: PostsService, private rt: Router) {}

  ngOnInit() {
    this.subs.push(
      this.postsService.getPosts().subscribe((data) => {
        this.posts = data
          .filter((post: any) => post.status === 'published')
          .reverse();
        setTimeout(() => (this.isLoading = false), 150);
      })
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

  ngOnDestroy() {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }
}
