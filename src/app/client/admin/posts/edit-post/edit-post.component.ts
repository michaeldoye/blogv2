import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../posts.component';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PostsService } from '../../../../shared/services/posts.service';
import { routeAnimation } from '../../../../route.animation';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'firebase';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss'],
  host: {
    '[@routeAnimation]': 'true',
  },
  animations: [routeAnimation],
})
export class EditPostComponent implements OnDestroy {
  isLoading: boolean = true;
  user: User;

  postForm: FormGroup;
  post: Post;
  postRef: AngularFireObject<Post>;
  postsRef: AngularFireObject<Post[]>;

  postCats: any;
  postTags: any;
  allPosts: Array<Post> = [];
  subs: Array<Subscription> = [];

  constructor(
    private ar: ActivatedRoute,
    private db: AngularFireDatabase,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private postService: PostsService,
    private activatedRoute: ActivatedRoute,
    private sb: MatSnackBar,
    private rt: Router
  ) {
    const user: User = this.activatedRoute.snapshot.data.auth;
    this.user = user;
    this.postsRef = this.db.object(`users/${user.uid}`);
    // Fill the category, tags and posts arrays
    this.getCatsAndTags();
    // Build the post form (for editing)
    this.postForm = this.fb.group({
      id: '',
      title: ['', [Validators.required, Validators.minLength(5)]],
      content: ['', Validators.minLength(10)],
      author: '',
      dateAdded: '',
      categories: ['', Validators.required],
      tags: ['', Validators.required],
      status: ['', Validators.required],
      fileUrl: '',
    });
  }

  /**
   * @desc Get all categories, tags and posts from firebase
   * @return void
   */
  getCatsAndTags(): void {
    this.subs.push(
      this.postsRef.valueChanges().subscribe(
        (data: any) => {
          if (data) {
            this.postCats = data.categories;
            this.postTags = data.tags;
            this.allPosts = data.posts;
            this.setFormValues(data.posts);
          }
          this.isLoading = false;
        },
        (e: Error) => {
          this.isLoading = false;
          this.sb.open(e.message, '', { duration: 5000 });
        }
      )
    );
  }

  /**
   * @desc Get the post id from router and fetch the post from FireBase then
   *       set the form values on init
   * @param Posts array - the posts to be filtered and updated
   * @return void
   */
  setFormValues(posts: Array<Post>): void {
    // Get the post id from router
    let postId = this.ar.snapshot.paramMap.get('id');

    // Get only the current post
    const post: Post = posts.find((post: Post) => post.id == postId);

    // Set the values of the form from the post data
    if (post && !this.postForm.valid) {
      this.post = post;
      this.postForm.setValue({
        id: post.id,
        title: post.title,
        content: post.content,
        author: post.author,
        dateAdded: post.dateAdded,
        categories: post.categories,
        tags: post.tags,
        status: post.status,
        fileUrl: post.fileUrl ? post.fileUrl : '',
      });
    } else {
      if (post) {
        this.postForm.patchValue({ categories: post.categories });
      }
    }

    // Remove the progress bar
    this.isLoading = false;
  }

  /**
   * @desc Update an existing post
   * @param Post post - the post to be updated
   * @return void
   */
  savePost(post: Post): void {
    if (!post) return;
    // Remove the selected post from the post array
    this.allPosts = this.allPosts.filter((post: Post) => {
      return post.id !== this.post.id;
    });

    // Add edited post to posts array
    this.allPosts.push(post);

    // Save the post structure for Firebase
    let posts: any = { posts: this.allPosts };

    // Update the posts node with the updated posts array
    this.postsRef
      .update(posts)
      .then(() => {
        this.sb.open('Your post has been saved!', '', { duration: 5000 });
        this.postService.updateFrontendPosts(this.allPosts);
      })
      .catch((e: Error) => {
        this.sb.open(e.message, '', { duration: 5000 });
      });
  }

  /**
   * @desc Delete a selected post
   * @return void
   * @todo save deleted posts for undo
   */
  deletePost() {
    // Set up the confirm dialog
    const confDialog = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { item: this.post.title },
    });

    // Once the user has confirmed
    confDialog.afterClosed().subscribe((result: boolean) => {
      if (result) {
        // Remove the selected post from the post array
        this.allPosts = this.allPosts.filter((post: Post) => {
          return post.id !== this.post.id;
        });

        // Save the post structure for Firebase
        let posts: any = { posts: this.allPosts };

        // Update the posts node with the updated posts array
        this.postsRef
          .update(posts)
          .then(() => {
            this.rt.navigate(['admin/posts']);
            this.openSnackBox('Post Deleted', 'undo');
            this.postService.updateFrontendPosts(this.allPosts);
          })
          .catch((e: Error) => {
            this.sb.open(e.message, '', { duration: 5000 });
          });
      }
    });
  }

  /**
   * @desc Check all post checkboxes
   * @param string message - snackbox message
   * @param string action - click action for the snackbox
   * @return void
   */
  openSnackBox(message: string, action?: string): void {
    const sbRef = this.sb.open(message, action, { duration: 30000 });
    this.subs.push(sbRef.onAction().subscribe(() => console.log('do undo')));
  }

  openDialog(): void {
    let postContent = this.content.value;
    let dialogRef = this.dialog.open(AddCategoryComponent, {
      width: '550px',
      data: { user: this.user.uid },
    });
  }

  doUpload(file: File) {
    this.isLoading = true;
    this.postService.uploadImage(file).then((data) => {
      this.postForm.patchValue({ fileUrl: data });
      this.sb.open('Image uploaded', 'OK', { duration: 3500 });
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  // Form field reference: title
  get title() {
    return this.postForm.get('title');
  }
  // Form field reference: categories
  get categories() {
    return this.postForm.get('categories');
  }
  // Form field reference: tags
  get tags() {
    return this.postForm.get('tags');
  }
  // Form field reference: status
  get status() {
    return this.postForm.get('status');
  }
  // Form field reference: content
  get content() {
    return this.postForm.get('content');
  }
  // Form field reference: fileUrl
  get fileUrl() {
    return this.postForm.get('fileUrl');
  }
}
