import {Component, ViewChild, ElementRef, OnInit} from "@angular/core";
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";
import {TalkService} from "../../providers/talkService";
import {Storage} from "@ionic/storage";
// import {NativeStorage} from "ionic-native";
import {NativeStorage} from "ionic-native";

@Component({
  selector: 'page-home',
  providers: [TalkService],
  template: `
<ion-header>
  <ion-navbar>
    <ion-title>Home</ion-title>
    <ion-buttons right>
      <button tappable (click)="showAddTalkPanel()" ion-button color="primary">Add talk</button>
    </ion-buttons>
  </ion-navbar>
</ion-header>
<ion-content padding>

  <div *ngIf="showAddTalk">
    <add-talk></add-talk>
  </div>
  
  <ion-item>
    <ion-label floating>Search</ion-label>
    <ion-input type="text" #searchInput></ion-input>
  </ion-item>
  
  <talk-row *ngFor="let talk of talks | async" [talk]="talk" (onClick)="onClick($event)"></talk-row>
</ion-content>`
})
export class HomePage implements OnInit {

  talks: any;
  showAddTalk: boolean = false;
  search;

  @ViewChild('searchInput') input: ElementRef;

  ngOnInit(): void {

    // let obsA = Observable.interval(Math.random() * 1000).map(x => 'a');
    // let obsB = Observable.interval(Math.random() * 1000).map(x => 'b');
    //
    // let topic = x => console.log(x);
    // obsA.concat(obsB).subscribe(topic);
    // obsA.zip(obsB).subscribe(topic);
    // obsA.merge(obsB).subscribe(topic);
    // obsA.race(obsB).subscribe(topic);
    // obsA.combineLatest(obsB).subscribe(topic);

    this.storage.get('visited')
      .then(value => console.log(value));

    // this.talks = Observable.fromEvent(this.input.nativeElement, 'keyup')
    //   .map((e: any) => e.target.value)
    //   .filter(text => text.length > 1)
    //   .debounceTime(700)
    //   .distinctUntilChanged()
    //   .switchMap(term => this.talkService.getTalks(term))
    this.talks = this.talkService.getAllTalks();
  }

  constructor(public talkService: TalkService, public storage: Storage) {
  }

  onClick($event) {
    this.storage.get('visited')
      .then(value => this.storage.set('visited', value ? value + 1 : 1));
    console.log($event);
    // let browser = new InAppBrowser('http://google.es');
    // browser.show();

    NativeStorage.setItem('visited', 0)
      .then(x => console.log('Writen: ' + x))
      .catch(err => {
        console.log('Error :(');
        console.log(JSON.stringify(err))
      });

    NativeStorage.getItem('visited')
      .then(x => console.log('Read: ' + x))
      .catch(err => {
        console.log('Error :(');
        console.log(JSON.stringify(err))
      });
  }

  showAddTalkPanel() {
    this.showAddTalk = !this.showAddTalk
  }
}
