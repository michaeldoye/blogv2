import { Injectable } from '@angular/core';
import 'firebase/storage';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { FirebaseApp } from '@angular/fire';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { Post } from '../../client/admin/posts/posts.component';

declare let marked: any;
declare let hljs: any;

@Injectable()
export class PostsService {
  postsRef: AngularFireObject<any>;
  previewHtml: any;
  firebaseApp: FirebaseApp;

  blah = {
    Version: '2012–10–17',
    Statement: [
      {
        Sid: 'PublicReadGetObject',
        Effect: 'Allow',
        Principal: '*',
        Action: 's3: GetObject',
        Resource: 'arn:aws:s3:::tutor-time/*',
      },
    ],
  };

  constructor(
    firebaseApp: FirebaseApp,
    private db: AngularFireDatabase,
    private _domSanitizer: DomSanitizer
  ) {
    this.firebaseApp = firebaseApp;
    this.postsRef = db.object('posts');
  }

  getPosts(): Observable<Post[]> {
    return this.postsRef.valueChanges().pipe(map((data: any) => data));
  }

  updateFrontendPosts(posts: Array<any>): Observable<any> {
    return of(this.postsRef.set(posts));
  }

  uploadImage(files: File): Promise<any> {
    const storageRef = this.firebaseApp.storage().ref().child(files[0].name);
    return storageRef
      .put(files[0])
      .then((snapshot) => {
        return storageRef.getDownloadURL();
      })
      .catch((e: Error) => {
        return e.message;
      });
  }

  renderContent(_content: any): SafeHtml {
    const _markedRender = new marked.Renderer();
    _markedRender.code = (code: any, language: any) => {
      const validLang = !!(language && hljs.getLanguage(language));
      const highlighted = validLang ? hljs.highlight(language, code).value : code;
      return `<pre style="padding: 0; border-radius: 0;"><code class="hljs ${language}">${highlighted}</code></pre>`;
    };

    _markedRender.table = (header: string, body: string) => {
      return `<table class="table table-bordered">\n<thead>\n${header}</thead>\n<tbody>\n${body}</tbody>\n</table>\n`;
    };

    _markedRender.listitem = (text: any) => {
      if (/^\s*\[[x ]\]\s*/.test(text)) {
        text = text
          .replace(
            /^\s*\[ \]\s*/,
            '<i class="fa fa-square-o" style="margin: 0 0.2em 0.25em -1.6em;"></i> '
          )
          .replace(
            /^\s*\[x\]\s*/,
            '<i class="fa fa-check-square" style="margin: 0 0.2em 0.25em -1.6em;"></i> '
          );
        return `<li style="list-style: none;">${text}</li>`;
      } else {
        return `<li>${text}</li>`;
      }
    };

    const _markedOpt = {
      renderer: _markedRender,
      highlight: (code: any) => hljs.highlightAuto(code).value,
    };

    const html = marked(_content, _markedOpt);

    return this._domSanitizer.bypassSecurityTrustHtml(html);
  }
}
