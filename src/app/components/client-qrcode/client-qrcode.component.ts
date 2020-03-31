import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientService } from 'src/app/services/client/client.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-client-qrcode',
  templateUrl: './client-qrcode.component.html',
  styleUrls: ['./client-qrcode.component.css']
})
export class ClientQrcodeComponent implements OnInit {

  idClient;
  clientQueue;
  qrCodeLink = 'a';

  constructor(private route: ActivatedRoute,
              private clientService: ClientService) { }

  ngOnInit(): void {
    this.idClient = this.route.snapshot.paramMap.get("id");
    this.getClientQueue();
  }

  getClientQueue(){
    this.clientService.getClientQueue(this.idClient).subscribe(
      resp => {
        this.clientQueue = resp;
        this.getQrCodeLink()
      },
      err => console.log(err)
    );
    
  }

  getQrCodeLink(){
    this.qrCodeLink = environment.host_position_client+this.idClient;
  }

}
