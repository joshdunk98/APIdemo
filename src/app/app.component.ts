import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/env/env.dev';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { NewPostDialogComponent } from './new-post-dialog/new-post-dialog.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  accounts: any[] = [];
  posts: any[] = [];

  faTrash = faTrash;

  dataSource = new MatTableDataSource<any>();
  displayedColumns = [
    {
      label: 'Post #',
      property: 'id',
    },
    {
      label: 'Title',
      property: 'title',
    },
    {
      label: 'Body',
      property: 'body'
    }
  ];
  columnDefs = this.displayedColumns.map((col) => col.property).concat(['Remove']);

  getProperty = (item: any, property: string) => {
    switch (property) {
      default:
        return item[property];
    }
  };

  sortingDataAccessor = (item: any, property: string) => {
    switch (property) {
      default:
        return typeof item[property] === 'string'
          ? item[property].toLowerCase()
          : item[property];
    }
  };


  constructor(
    private http: HttpClient, 
    private dialog: MatDialog
  ){}

  ngOnInit(): void {
    this.http.get<any>(
      `${environment.host}/posts`
    ).subscribe((data) => {
      console.log("Retrieved posts => ", data);
      this.posts = data;
      this.dataSource.data = data;
    })
  }

  openNewPostDialog() {
    const dialogRef = this.dialog.open(NewPostDialogComponent);

    dialogRef.afterClosed().subscribe((post) => {
      if (post) {
        this.posts.push(post);
        this.dataSource.data = this.posts;
      }
    })
  }

  deletePost(post: any) {
    this.http.delete<any>(
      `${environment.host}/posts/${post.id}`,
    ).subscribe((deletedPost) => {
      console.log("Post deleted! => ", post);
      if (post) {
        this.posts = this.posts.filter((p) => p.title !== post.title && p.id !== post.id)
        this.dataSource.data = this.posts
      }
    });
  }

  get numberOfPosts() {
    return this.posts.length
  }
}