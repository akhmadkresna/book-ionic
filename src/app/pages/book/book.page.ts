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
  xDown: any;                                      
  yDown: any; 
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
  getTouches(evt:any) {
    return evt.touches ||             // browser API
          evt.originalEvent.touches; // jQuery
  }                                                     
                                                                          
  handleTouchStart(evt:any) {
      const firstTouch = this.getTouches(evt)[0];                                      
      this.xDown = firstTouch.clientX;                                      
      this.yDown = firstTouch.clientY;                                      
  };                                                
                                                                          
  handleTouchMove(evt:any) {
      if ( ! this.xDown || ! this.yDown ) {
          return;
      }

      var xUp = evt.touches[0].clientX;                                    
      var yUp = evt.touches[0].clientY;

      var xDiff = this.xDown - xUp;
      var yDiff = this.yDown - yUp;
                                                                          
      if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
          if ( xDiff > 0 ) {
              this.nextPage()
          } else {
              /* left swipe */
          }                       
      } else {
          if ( yDiff > 0 ) {
              /* down swipe */ 
          } else { 
              /* up swipe */
          }                                                                 
      }
      /* reset values */
      this.xDown = null;
      this.yDown = null;                                             
  };
  setupGesture() {
    var self = this
    this.rendition.on("displayed", () => {
      var cont = document.querySelector('.overlay')
      
      
      if (cont){
        const gesture = this.gestureCtrl.create({
          el: cont,
          threshold: 0,
          disableScroll: true,
          gestureName: 'book-swipe',
          onEnd: (event: GestureDetail) => this.onMove(event)
        });
        gesture.enable(true);
      }
      
  
      
    });

    

      // const gesture2 = this.gestureCtrl.create({
      //   el: this.elementRef.nativeElement,
      //   threshold: 0,
      //   gestureName: 'square-drag',
      //   onMove: (event: GestureDetail) => this.onMove(event)
      // });
      // gesture2.enable(true);

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
    if ( event.deltaX < -100) {
      this.nextPage()
    }
    else if (event.deltaX > 100) {
      this.previousPage()
    }
    else {
      
    }
    // 
    console.log("detltaY", event.deltaX);
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

