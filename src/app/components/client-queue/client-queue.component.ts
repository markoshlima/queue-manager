import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QueueService } from 'src/app/services/queue/queue.service';
import { ClientService } from 'src/app/services/client/client.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-client-queue',
  templateUrl: './client-queue.component.html',
  styleUrls: ['./client-queue.component.css']
})

export class ClientQueueComponent implements OnInit {

  idQueue;
  clients = <any>[];
  queue = <any>{};

  constructor(private route: ActivatedRoute,
              private queueService: QueueService,
              private clientService: ClientService) { }

  ngOnInit(): void {
    this.idQueue = this.route.snapshot.paramMap.get("id");
    this.getClients();
    this.getQueue();
  }

  getClients(){
    this.queueService.getClients(this.idQueue).subscribe(
      resp => this.clients = resp,
      err => console.log(err)
    );
  }

  getQueue(){
    this.queueService.getQueue(this.idQueue).subscribe(
      resp => this.queue = resp[0],
      err => console.log(err)
    );
  }

  remove(){
    this.clientService.remove(this.clients[0].id_client).subscribe(
      resp => this.getClients(),
      err => console.log(err)
    );
  }

  goTo(id){
    window.open(environment.host_position_client+id, "_blank");
  }

}