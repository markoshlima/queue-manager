import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login/login.service';
import { QueueService } from 'src/app/services/queue/queue.service';

@Component({
  selector: 'app-list-queue',
  templateUrl: './list-queue.component.html',
  styleUrls: ['./list-queue.component.css']
})
export class ListQueueComponent implements OnInit {

  constructor(private queueService: QueueService) { }

  listQueue = []

  ngOnInit(): void {
    this.queueService.getAllQueue().subscribe(
      resp => this.listQueue = resp,
      err => console.log(err)
    );
  }

}
