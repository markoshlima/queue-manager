import React, { Component } from 'react';
import './App.css';

const HOST = 'https://d1qf41er9evhu5.cloudfront.net/'

class App extends Component {

  constructor() {
    super();
    this.state = {
      userFound: false,
      client: {},
      queue: {}
    };
  }

  componentDidMount() {
    let id = this.getId();
    console.log(id)
    this.getPosition(id); //needed to call once
    this.getClientAndQueueInfo(id)
    this.interval = setInterval(() => this.getPosition(id), 3000);
  }

  getId(){
    let id = window.location.pathname;
    return id.substring(1);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  // get client position (cache) information
  getPosition(id){
    fetch(HOST+'v1/client/'+id)
    .then(response => response.json())
    .then(data => {
      this.setState({ client: data });
      if(data.message){ //it means 404 callback
        this.state.userFound = false
        this.getClientAndQueueInfo(id)
      }else{
        this.state.userFound = true
      }
    }).catch(console.log);
  }

  // get client and queue information (transient)
  getClientAndQueueInfo(id){
    fetch(HOST+'v1/client/'+id+'/queue')
    .then(response => {
      //if client is empty in cache but client exists in transient, so its end of queue
      if(response.status == 200){
        this.state.userFound = true;
        if(this.state.client.message){
          this.componentWillUnmount();
        }
      }else{
        this.componentWillUnmount();
      }
      return response.json()
    })
    .then(data => {
      this.setState({ queue: data });
    }).catch(console.log);
  }

  //verify if object is empty
  isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
  }

  render() {
    const { client, queue, userFound } = this.state;
    return (
    <div>
      { userFound ?
      <div class="jumbotron jumbotron-fluid">
        <div class="container">
          <h1 class="display-4">{queue.name_queue}</h1>
          <p class="lead">{queue.text_queue}</p>
          {client.name ?
          <div class="card text-white bg-primary mb-3">
            <div class="card-header">{client.name} sua posição é:</div>
            <div class="card-body">
              <h5 class="card-title position">{client.pos}º</h5>
            </div>
          </div>
          :
          <div class="card text-white bg-success mb-3">
            <div class="card-header">
              {queue.name}:<br />
              {queue.end_queue}
              </div>
          </div>
          }
        </div>
      </div>
      :
      <div class="jumbotron jumbotron-fluid">
        <div class="container">
          <h1 class="display-4">Not Found</h1>
        </div>
      </div>  
      }
      <div class="copyright">Copyright-2020</div>
    </div>
    )
  }
}

export default App;