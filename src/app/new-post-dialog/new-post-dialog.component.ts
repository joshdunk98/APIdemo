import { HttpClient } from '@angular/common/http';
import {
    Component,
  } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
  import {
    MatDialogRef,
  } from '@angular/material/dialog';
import { catchError, of } from 'rxjs';
import { environment } from 'src/env/env.dev';

  @Component({
    selector: 'app-new-post-dialog',
    templateUrl: './new-post-dialog.component.html',
    styleUrls: ['./new-post-dialog.component.scss'],
  })
  export class NewPostDialogComponent
  {
    newPostForm = new FormGroup({
      Title: new FormControl('', [Validators.required]),
      Body: new FormControl('', [Validators.required]),
    })

    isSaving = false;

    constructor(
      private dialogRef: MatDialogRef<NewPostDialogComponent>,
      private http: HttpClient
    ) {}
  
    addNewPost() {
      this.isSaving = true;
      const data = {
        title: this.newPostForm.controls.Title.value,
        body: this.newPostForm.controls.Body.value
      }
      
      this.http.post<any>(
        `${environment.host}/posts`, 
        data
      ).pipe(
        catchError((err) => {
          console.log("Something went wrong => ", err)
          return of(null)
        })
      ).subscribe((post) => {
        this.isSaving = false;
        if (post) {
          console.log("Created New Post!");
          this.dialogRef.close(post);
        }
      })
    }
  }