import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { QueueService } from 'src/app/services/queue/queue.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-queue',
  templateUrl: './form-queue.component.html',
  styleUrls: ['./form-queue.component.css']
})
export class FormQueueComponent implements OnInit {

  error = false;

  profileForm = new FormGroup({
    name: new FormControl(''),
    text_queue: new FormControl(''),
    end_queue: new FormControl('')
  });

  constructor(private queueService: QueueService,
              private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.queueService.save(this.profileForm.value).subscribe(
      resp => {
        this.router.navigate(['/list-queue'])  
      },
      err => {
        this.error = err.error.message;
      }
    );
  }

}
