import { Component, ViewChild } from '@angular/core';

import { routeAnimation } from '../../../route.animation';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PostsService } from '../../../shared/services/posts.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { SafeHtml } from '@angular/platform-browser';
import { MatPaginator } from '@angular/material/paginator';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'firebase';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
  host: {
    '[@routeAnimation]': 'true',
  },
  animations: [routeAnimation],
})
export class PostsComponent {
  displayedColumns = [
    'checkbox',
    'id',
    'title',
    'author',
    'dateAdded',
    'status',
    'action',
  ];
  tblData: MatTableDataSource<Post>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  allPosts: Array<Post> = [];
  user: User;

  isLoading: boolean = true;
  postsRef: AngularFireObject<Post>;

  checkAll: any;
  selectedPosts: Array<number> = [];

  postCats: any;
  selectedCat: any;

  constructor(
    private db: AngularFireDatabase,
    private sb: MatSnackBar,
    private postService: PostsService,
    public dl: MatDialog,
    private rt: Router,
    private activatedRoute: ActivatedRoute
  ) {
    const user: User = this.activatedRoute.snapshot.data.auth;
    this.user = user;
    this.postsRef = db.object(`users/${user.uid}`);
    this.postsRef.valueChanges().subscribe(
      (data: any) => {
        if (data) {
          this.tblData = new MatTableDataSource(data.posts);
          this.allPosts = data.posts ? data.posts : [];
          this.postCats = data.categories ? data.categories : [];
          this.tblData.paginator = this.paginator;
          this.tblData.sort = this.sort;
        }
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }

  /**
   * @desc Filters table rows based on input
   * @param string filterValue - the inputted value to filter by
   * @return void
   */
  applyFilter(filterValue: string): void {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.tblData.filter = filterValue;
  }

  /**
   * @desc Navigates to selected post when clicked
   * @param int postId - the id of the post to navigate to
   * @return void
   */
  editPost(postId: any): void {
    this.rt.navigate(['/admin/posts/edit', postId]);
  }

  /**
   * @desc Check all post checkboxes
   * @param boolean value - value of checkbox
   * @return void
   */
  doCheckAll(value: boolean): void {
    if (value) this.selectedPosts = [];
    this.allPosts.forEach((post: Post) => {
      post.isChecked = value;
      if (value) {
        this.selectedPosts.push(post.id);
      } else {
        this.selectedPosts = [];
      }
    });
  }

  /**
   * @desc Check if all checkboxes are checked
   * @return boolean
   */
  isAllChecked(): boolean {
    return this.allPosts.every((post: Post) => post.isChecked);
  }

  /**
   * @desc Add selected posts to selected posts array
   * @param int id - seleted post id
   * @param boolean isChecked - if the selected post is checked
   * @return void
   */
  doSinglePostSelection(id: number, isChecked: boolean): void {
    if (isChecked) {
      this.selectedPosts.push(id);
    } else {
      let indx = this.selectedPosts.indexOf(id);
      if (indx > -1) this.selectedPosts.splice(indx, 1);
    }
  }

  /**
   * @desc Delete a selected posts on user confirmation
   * @return void
   * @todo save deleted posts for undo
   */
  doDeleteSelected(): void {
    // Set up the confirm dialog
    const confDialog = this.dl.open(ConfirmDialogComponent, {
      width: '350px',
      data: { item: `${this.selectedPosts.length} posts` },
    });

    // Once the user has confirmed
    confDialog.afterClosed().subscribe((result: boolean) => {
      if (result) {
        // Remove selected posts from posts array
        this.selectedPosts.forEach((v, i) => {
          this.allPosts = this.allPosts.filter((post: Post) => post.id !== v);
        });

        // Save the post structure for Firebase
        let posts: any = { posts: this.allPosts };

        // Update the posts node with the updated posts array
        this.postsRef
          .update(posts)
          .then(() => {
            this.openSnackBox('Posts Deleted', 'undo');
            this.selectedPosts = [];
            this.postService.updateFrontendPosts(this.allPosts);
          })
          .catch((e: Error) => {
            this.sb.open(e.message, '', { duration: 5000 });
          });
      }
    });
  }

  /**
   * @desc Open the snack box to notify the user
   * @param string message - snackbox message
   * @param string action - click action for the snackbox
   * @return void
   */

  openSnackBox(message: string, action?: string): void {
    const sbRef = this.sb.open(message, action, { duration: 30000 });
    sbRef.onAction().subscribe(() => console.log('do undo'));
  }
}

export interface Post {
  id: any;
  title: string;
  content: string | SafeHtml;
  dateAdded: Date;
  author: string;
  categories?: Array<string>;
  status: string;
  tags?: Array<string>;
  isChecked?: boolean;
  fileUrl?: string;
}
