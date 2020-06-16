import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { routeAnimation } from '../../../../route.animation';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../posts.component';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { PostsService } from '../../../../shared/services/posts.service';
import { MatDialog } from '@angular/material/dialog';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'firebase';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss'],
  host: {
    '[@routeAnimation]': 'true',
  },
  animations: [routeAnimation],
})
export class AddPostComponent implements OnInit {
  postForm: FormGroup;
  postDate: Date = new Date();

  user: User;
  isLoading: boolean = false;

  postsRef: AngularFireObject<any>;
  postCats: any;
  postTags: any;
  allPosts: Post[] = [];
  postsCount: number;

  constructor(
    private fb: FormBuilder,
    private db: AngularFireDatabase,
    private sb: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private postService: PostsService,
    private dialog: MatDialog,
    private router: Router
  ) {
    const user: User = this.activatedRoute.snapshot.data.auth;
    this.user = user;
    this.getPosts();
    this.postForm = fb.group({
      id: this.postsCount,
      title: ['', [Validators.required, Validators.minLength(5)]],
      content: ['### I am example markdown', Validators.minLength(10)],
      author: user.displayName || user.email,
      dateAdded: this.postDate,
      categories: ['', Validators.required],
      tags: ['', Validators.required],
      status: ['draft', Validators.required],
      fileUrl: '',
    });
  }

  ngOnInit(): void {}

  getPosts() {
    this.postsRef = this.db.object(`users/${this.user.uid}`);
    this.postsRef.valueChanges().subscribe(
      (data: any) => {
        if (data) {
          this.allPosts = data.posts ? data.posts : [];
          this.postCats = data.categories;
          this.postTags = data.tags;
          this.postsCount = data.posts ? data.posts.length : 0;
          const maxId = Math.max(...data.posts.map((o) => o.id));
          this.postForm.patchValue({ id: maxId + 1 }, { onlySelf: true });
        }
        this.isLoading = false;
      },
      (error: Error) => {
        this.sb.open(error.message, '', { duration: 5000 });
        this.isLoading = false;
      }
    );
  }

  addNewPost(result: Post): void {
    if (!result) return;
    this.isLoading = true;
    this.allPosts.push(result);
    let post: any = { posts: this.allPosts };
    this.postsRef
      .update(post)
      .then(() => {
        this.isLoading = false;
        this.sb.open('Your post has been added!', '', { duration: 5000 });
        this.router.navigate([`admin/posts/edit/${result.id}`]);
        this.postService.updateFrontendPosts(this.allPosts);
      })
      .catch((error) => {
        this.sb.open(error.message, '', { duration: 5000 });
        this.isLoading = false;
      });
  }

  doUpload(file: File) {
    this.isLoading = true;
    this.postService.uploadImage(file).then((data) => {
      console.log(data);
      this.postForm.patchValue({ fileUrl: data });
      this.sb.open('Image uploaded', 'OK', { duration: 3500 });
      this.isLoading = false;
    });
  }

  fullScreenSave(post: Post): void {
    if (!this.postForm.invalid) {
      this.addNewPost(post);
    } else {
      this.sb.open('You need to fill out all fields', '', { duration: 5000 });
    }
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(AddCategoryComponent, {
      width: '550px',
      data: { user: this.user.uid },
    });
  }

  get title() {
    return this.postForm.get('title');
  }
  get categories() {
    return this.postForm.get('categories');
  }
  get tags() {
    return this.postForm.get('tags');
  }
  get status() {
    return this.postForm.get('status');
  }
  get content() {
    return this.postForm.get('content');
  }
  get fileUrl() {
    return this.postForm.get('fileUrl');
  }
}
