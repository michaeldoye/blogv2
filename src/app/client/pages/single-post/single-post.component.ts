import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from '../../../shared/services/posts.service';
import { routeAnimation } from '../../../route.animation';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss'],
  host: {
    '[@routeAnimation]': 'true',
  },
  animations: [routeAnimation],
})
export class SinglePostComponent implements OnInit, OnDestroy {
  post: any;
  isLoading: boolean = true;

  subs: Array<Subscription> = [];

  constructor(private ar: ActivatedRoute, private postService: PostsService) {}

  ngOnInit() {
    let id = this.ar.snapshot.paramMap.get('id');
    this.subs.push(
      this.postService.getPosts().subscribe((data) => {
        this.post = data.filter((post: any) => post.id == id)[0];
        this.post.content = this.postService.renderContent(this.post.content);
        setTimeout(() => (this.isLoading = false), 150);
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }
}
