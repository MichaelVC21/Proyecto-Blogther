import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-camera-view',
  templateUrl: './camera-view.page.html',
  styleUrls: ['./camera-view.page.scss'],
  standalone: false,
})
export class CameraViewPage implements OnInit {
  // Equivalente a useState(false)
  isCapturing = false;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  // Equivalente a handleTakePhoto + useNavigate
  handleTakePhoto() {
    this.isCapturing = true;
    setTimeout(() => {
      this.isCapturing = false;
      // Navega a /plant-info
      this.router.navigate(['/plant-info']);
    }, 1000);
  }
}

