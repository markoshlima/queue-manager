import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ClientService } from 'src/app/services/client/client.service';
import { Router, ActivatedRoute } from '@angular/router';
import { QueueService } from 'src/app/services/queue/queue.service';

@Component({
  selector: 'app-form-client-queue',
  templateUrl: './form-client-queue.component.html',
  styleUrls: ['./form-client-queue.component.css']
})
export class FormClientQueueComponent implements OnInit {

  error;
  idQueue;
  queue = <any>{};  

  profileForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    telephone: new FormControl(''),
    queue: new FormControl('')
  });

  constructor(private clientService: ClientService,
              private router: Router,
              private queueService: QueueService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.idQueue = this.route.snapshot.paramMap.get("id");
    this.getQueue();
  }

  onSubmit(){
    this.profileForm.patchValue({queue: this.idQueue});    
    this.clientService.save(this.profileForm.value).subscribe(
      resp => {
        this.router.navigate(['/client-queue/'+this.idQueue])  
      },
      err => {
        this.error = err.error.message;
      }
    );
  }

  getQueue(){
    this.queueService.getQueue(this.idQueue).subscribe(
      resp => this.queue = resp[0],
      err => console.log(err)
    );
  }

}
