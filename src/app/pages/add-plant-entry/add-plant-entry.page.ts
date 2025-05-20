import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-plant-entry',
  templateUrl: './add-plant-entry.page.html',
  styleUrls: ['./add-plant-entry.page.scss'],
  standalone: false,
})
export class AddPlantEntryPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
