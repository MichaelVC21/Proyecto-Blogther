import { Component, OnInit } from '@angular/core';
import type { DatetimeCustomEvent } from '@ionic/core';
import { Task, tasksData } from 'src/app/data/taskData';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Router } from '@angular/router';


@Component({
  
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.page.html',
  styleUrls: ['./calendar-view.page.scss'],
  standalone: false,
})

export class CalendarViewPage implements OnInit {
  todayIso = new Date().toISOString();
  selectedDateIso = this.todayIso.slice(0, 10);
  filteredTasks: Task[] = [];
  currentTime = new Date();  // almacena la hora actual

  constructor(private router: Router) {}

  ngOnInit() {
    this.filterTasksByDate(this.selectedDateIso);
    // actualiza la hora cada minuto (opcional)
    setInterval(() => {
      this.currentTime = new Date();
    }, 60000);
  }

  back() {
    this.router.navigate(['/perfil']);
  }

  // Se dispara tan pronto el usuario haga click en el día
  onDateChange(event: DatetimeCustomEvent) {
    const val = event.detail.value;
    if (!val) { return; }
    const iso = Array.isArray(val) ? val[0] : val;
    this.selectedDateIso = iso.slice(0, 10);
    this.filterTasksByDate(this.selectedDateIso);
  }

  private filterTasksByDate(dateIso: string) {
    this.filteredTasks = tasksData.filter(t => t.date === dateIso);
  }
}
