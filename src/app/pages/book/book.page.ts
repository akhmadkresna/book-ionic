import { Component, OnInit, ViewChild, ElementRef, AfterViewInit  } from '@angular/core';
import ePub from 'epubjs';
import { Gesture, GestureController, GestureDetail  } from '@ionic/angular';

@Component({
  selector: 'app-book',
  templateUrl: './book.page.html',
  styleUrls: ['./book.page.scss'],
})
export class BookPage implements OnInit, AfterViewInit  {
  private book: any;
  private rendition: any;
  // private viewer: any;
  @ViewChild('viewer', { read: ElementRef }) viewer!: ElementRef;
  // private gesture: Gesture;
  // private el: HTMLElement;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private gestureCtrl: GestureController,
    // private domCtrl: DomController
  ) { }
  
  ionViewDidEnter() {
    console.log("trest")
  }
  swipeEvent () {
    console.log("swipe", event)
    this.nextPage()
  }
  setupGesture() {
    var self = this
    this.rendition.on("displayed", () => {
      var el = this.elementRef.nativeElement.querySelector('.epub-view')
      if (el) {
        el.addEventListener('touchstart', function(event) {
          self.nextPage()
        }, false);
        
        el.addEventListener('touchend', function(event) {
          self.nextPage()
        }, false); 
      }
      
      const gesture = this.gestureCtrl.create({
        el: this.viewer.nativeElement,
        threshold: 0,
        gestureName: 'book-swipe',
        onMove: (event: GestureDetail) => this.onMove(event)
      });
      gesture.enable(true);
  
      
    });

    

    const gesture2 = this.gestureCtrl.create({
      el: this.elementRef.nativeElement,
      threshold: 0,
      gestureName: 'square-drag',
      onMove: (event: GestureDetail) => this.onMove(event)
    });
    gesture2.enable(true);

  }

  async ngAfterViewInit() {
    
    this.book = ePub('../../assets/test.epub'); // Replace with the actual path to your EPUB file
    this.rendition = this.book.renderTo("viewer", {width: '100%', height: '100%'});
    this.rendition.display();
    this.setupGesture()
    // await this.book.ready(() => {
      
    // });
    // Use DomCtrl to get the correct header height
    
  }

  ngOnInit() {
    

    
  }
  private onMove(event: GestureDetail) {
    this.nextPage()
    console.log("move ",event)
  }

  previousPage() {
    this.book.rendition.prev();
  }
  
  nextPage() {
    this.book.rendition.next();
  }

  decreaseFontSize() {
    this.rendition.themes.default({ "*": { "font-size": "small !important"}})
  }

  increaseFontSize() {
    this.rendition.themes.default({ "*": { "font-size": "medium !important"}})
  }
}

