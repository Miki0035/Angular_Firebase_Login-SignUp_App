import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize, Observable } from 'rxjs';
import { AuthService } from '../core/auth/auth.service';
import { UserProfile } from '../core/auth/user-profile.model';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  loading: boolean = false;
  private itemDoc?: AngularFirestoreDocument<UserProfile>;
  item?: Observable<UserProfile | undefined> 
  uid?: string | null;
  error?: string | null;

  downloadURL?: Observable<string | null>
  uploadProgress?: Observable<number | undefined>

  constructor(public afAuth: AngularFireAuth,
              private authService: AuthService, 
              private route: ActivatedRoute,
              private afStorage: AngularFireStorage,
              public afs: AngularFirestore) {

    this.uid = route.snapshot.paramMap.get('id');
    this.downloadURL = this.afStorage.ref(`users/${this.uid}/profile-image`).getDownloadURL();
               }

  ngOnInit(): void {
    this.itemDoc = this.afs.doc<UserProfile>(`users/${this.uid}`);
    this.item = this.itemDoc.valueChanges();
  }

  async onSubmit(form: NgForm) {
    this.loading = true;
    const {name, email, address, city, zip, state, phone, specialty, ip} = form.form.getRawValue();
    const userProfile: UserProfile = {
      uid: this.uid!,
      name, email, address, city, zip, state, phone, specialty, ip
    };

    try{  
      await this.authService.updateUserDocument(userProfile);
    }catch(error: any) {
      console.log(error.message);
      this.error = error.message;
    }

    this.loading = false;
  }

  fileChange(event: any) {
    this.downloadURL = null!;
    this.error = null;

    const file = event.target.files[0];
    const filePath = `users/${this.uid}/profile-image`;
    const fileRef = this.afStorage.ref(filePath);
    const task = this.afStorage.upload(filePath, file);

    task.catch(error => this.error = error.message)

    this.uploadProgress = task.percentageChanges();

    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = fileRef.getDownloadURL();
      })
    ).subscribe();
  }

}
